import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { adminUsersData, auditLogsData, adminSessionsData } from './db';

// JWT Configuration
const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'gcp_enterprise_admin_super_secret_jwt_key_2026_x89f_secure_auth';
const ACCESS_TOKEN_EXPIRY_MS = 30 * 60 * 1000; // 30 minutes
const REFRESH_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface JWTPayload {
  sub: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'STAFF' | 'DESIGNER' | 'EDITOR' | string;
  sessionId: string;
  iat: number;
  exp: number;
}

export interface StoredRefreshToken {
  token: string;
  adminId: string;
  sessionId: string;
  expiresAt: number;
  createdAt: number;
}

export interface OTPChallenge {
  challengeToken: string;
  adminId: string;
  email: string;
  code: string;
  attempts: number;
  maxAttempts: number;
  expiresAt: number;
  createdAt: number;
  resendCooldownUntil: number;
  device: string;
}

export interface SecurityEvent {
  id: string;
  type: 'LOGIN_SUCCESS' | 'OTP_VERIFIED' | 'LOGIN_FAILED' | 'DEVICE_AUTHENTICATED' | 'SESSION_REVOKED' | 'OAUTH_SUCCESS' | 'OAUTH_BLOCKED' | 'PASSWORD_CHANGED' | '2FA_TOGGLED';
  title: string;
  details: string;
  adminEmail?: string;
  adminName?: string;
  ip: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'critical';
}

// In-memory active security state
export const refreshTokensStore = new Map<string, StoredRefreshToken>();
export const otpChallengesStore = new Map<string, OTPChallenge>();
export const securityEventsLog: SecurityEvent[] = [
  {
    id: 'sec-init-1',
    type: 'LOGIN_SUCCESS',
    title: 'Enterprise Security Guard Initialized',
    details: 'GurucraftPro Admin Security Subsystem online with HMAC-SHA256 JWT, Rate Limiting & RBAC.',
    adminEmail: 'annudhaneja@gmail.com',
    adminName: 'Annu Dhaneja',
    ip: '127.0.0.1 (Rohini, Delhi)',
    timestamp: new Date().toISOString(),
    severity: 'info',
  },
];

// Helper: base64url encoding
function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return Buffer.from(base64, 'base64').toString('utf8');
}

// Sign JWT
export function signJWT(payload: Omit<JWTPayload, 'iat' | 'exp'>, expiresInMs = ACCESS_TOKEN_EXPIRY_MS): string {
  const now = Date.now();
  const fullPayload: JWTPayload = {
    ...payload,
    iat: Math.floor(now / 1000),
    exp: Math.floor((now + expiresInMs) / 1000),
  };

  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));

  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

// Verify JWT with constant-time signature comparison
export function verifyJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [encodedHeader, encodedPayload, signature] = parts;
    const expectedSig = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expectedSig);
    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return null;
    }

    const payloadJson = base64UrlDecode(encodedPayload);
    const payload: JWTPayload = JSON.parse(payloadJson);

    // Check expiration
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

// Generate Secure Cryptographic OTP
export function generateSecureOTP(): string {
  return crypto.randomInt(100000, 999999).toString();
}

// Add a real-time security event
export function logSecurityEvent(
  type: SecurityEvent['type'],
  title: string,
  details: string,
  admin?: { email?: string; name?: string },
  ip = '127.0.0.1',
  severity: SecurityEvent['severity'] = 'info'
) {
  const event: SecurityEvent = {
    id: 'ev-' + Date.now() + '-' + Math.floor(Math.random() * 10000),
    type,
    title,
    details,
    adminEmail: admin?.email,
    adminName: admin?.name,
    ip,
    timestamp: new Date().toISOString(),
    severity,
  };
  securityEventsLog.unshift(event);
  if (securityEventsLog.length > 200) {
    securityEventsLog.pop();
  }
}

// RBAC Role Definition
export const ROLE_PERMISSIONS: Record<string, string[]> = {
  SUPER_ADMIN: ['*'], // Full unrestricted control
  'Super Admin': ['*'],
  ADMIN: [
    'overview.view',
    'products.*',
    'services.*',
    'orders.*',
    'customers.*',
    'inquiries.*',
    'designs.*',
    'payments.view',
    'content.*',
    'media.*',
    'analytics.view',
    'users.view',
    'security.view',
  ],
  STAFF: [
    'overview.view',
    'orders.view',
    'orders.update',
    'customers.view',
    'inquiries.view',
    'inquiries.update',
  ],
  DESIGNER: [
    'overview.view',
    'designs.*',
    'products.*',
    'prompts.*',
    'media.*',
  ],
  EDITOR: [
    'overview.view',
    'content.*',
    'pages.*',
    'seo.*',
    'media.*',
  ],
};

// Check if role has a specific permission
export function roleHasPermission(role: string, permission: string): boolean {
  const perms = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS['ADMIN'] || [];
  if (perms.includes('*')) return true;
  if (perms.includes(permission)) return true;

  const [group] = permission.split('.');
  if (perms.includes(`${group}.*`)) return true;

  return false;
}

// Sanitize Admin User record
export function sanitizeAdminRecord(user: any) {
  if (!user) return null;
  const { passwordPin, passwordHash, ...safe } = user;
  return safe;
}
