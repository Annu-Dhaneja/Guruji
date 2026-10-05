// Reference server for owner-only admin access.
// npm i express express-session bcrypt express-rate-limit nodemailer
// .env (server only, never in Vite/React):
//   OWNER_EMAIL=owner@yourdomain.com
//   OWNER_PASSWORD_HASH=<bcrypt hash, generate offline: node -e "console.log(require('bcrypt').hashSync('YOUR_PASSWORD',12))">
//   SESSION_SECRET=<long random string>
//   SMTP_URL=smtps://user:pass@smtp.example.com
'use strict';
const crypto = require('crypto');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');

const OWNER_EMAIL = String(process.env.OWNER_EMAIL || '').trim().toLowerCase();
const OWNER_HASH = process.env.OWNER_PASSWORD_HASH || '';
if (!OWNER_EMAIL || !OWNER_HASH || !process.env.SESSION_SECRET) throw new Error('Owner config missing');

const DENIED = 'Access denied. This account is not authorized as the GuruCraftPro Owner.';
const DUMMY_HASH = bcrypt.hashSync('dummy-password-for-timing', 12);
const mailer = nodemailer.createTransport(process.env.SMTP_URL);
const challenges = new Map(); // use Redis/DB in production: id -> { hash, exp, tries }

const app = express();
app.set('trust proxy', 1);
app.use(express.json({ limit: '2kb' }));
app.use(session({
  name: 'gcp.sid',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 30 * 60 * 1000 },
}));

// Basic CSRF defence: require custom header on state-changing admin calls
const csrf = (req, res, next) =>
  req.get('X-Requested-With') === 'gcp-admin' ? next() : res.status(403).json({ error: 'Forbidden' });

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, standardHeaders: true });

const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
const safeEq = (a, b) => {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && crypto.timingSafeEqual(x, y);
};
const makeOtp = () => Array.from({ length: 16 }, () => crypto.randomInt(0, 10)).join('');

// STEP 1: email + password. Same response for wrong email or wrong password.
app.post('/api/admin/auth/login', authLimiter, csrf, async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');
  const isOwnerEmail = safeEq(sha(email), sha(OWNER_EMAIL));
  const passOk = await bcrypt.compare(password, isOwnerEmail ? OWNER_HASH : DUMMY_HASH); // constant work either way
  if (!isOwnerEmail || !passOk) return res.status(401).json({ error: 'Invalid credentials' });

  const id = crypto.randomUUID();
  const code = makeOtp();
  challenges.set(id, { hash: sha(code), exp: Date.now() + 5 * 60 * 1000, tries: 0 });
  await mailer.sendMail({
    to: OWNER_EMAIL, // always the allowlisted address, never a client-supplied one
    subject: 'GuruCraftPro owner sign-in code',
    text: `Your 16-digit code: ${code}\nExpires in 5 minutes. If this was not you, change your password.`,
  });
  req.session.pendingChallenge = id;
  res.json({ challengeId: id });
});

// STEP 2: 16-digit OTP. Single use, 5 minutes, 5 tries.
app.post('/api/admin/auth/verify-otp', authLimiter, csrf, (req, res) => {
  const { challengeId, code } = req.body || {};
  const ch = challenges.get(String(challengeId));
  if (!ch || req.session.pendingChallenge !== challengeId) return res.status(401).json({ error: 'Invalid or expired code' });
  if (Date.now() > ch.exp || ++ch.tries > 5) { challenges.delete(challengeId); return res.status(429).json({ error: 'Too many attempts' }); }
  if (!/^\d{16}$/.test(String(code)) || !safeEq(sha(String(code)), ch.hash)) return res.status(401).json({ error: 'Invalid or expired code' });

  challenges.delete(challengeId);
  req.session.regenerate((err) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    // Role is set ONLY here, on the server, after password + OTP for the allowlisted owner.
    req.session.owner = { email: OWNER_EMAIL, otpVerified: true, at: Date.now() };
    res.json({ ok: true });
  });
});

// Owner check used by every /admin route and /api/admin/* endpoint.
// Re-checks the server session against the allowlist each time; no browser-supplied role is read.
function requireOwner(req, res, next) {
  const o = req.session && req.session.owner;
  if (o && o.otpVerified === true && safeEq(sha(o.email), sha(OWNER_EMAIL))) return next();
  const signedIn = Boolean(req.session && (req.session.userId || req.session.ssoUser)); // normal users / Google / GitHub / SSO
  if (req.path.startsWith('/api/')) return res.status(signedIn ? 403 : 401).json({ error: signedIn ? DENIED : 'Sign in required' });
  return signedIn ? res.redirect('/?denied=1') : res.redirect('/admin-login.html');
}

app.get('/api/admin/auth/session', (req, res) => {
  const o = req.session && req.session.owner;
  if (o && o.otpVerified === true && o.email === OWNER_EMAIL) return res.json({ owner: true });
  const signedIn = Boolean(req.session && (req.session.userId || req.session.ssoUser));
  return signedIn ? res.status(403).json({ owner: false, error: DENIED }) : res.status(401).json({ owner: false });
});

app.post('/api/admin/auth/logout', csrf, (req, res) => req.session.destroy(() => res.clearCookie('gcp.sid').json({ ok: true })));

// Protect every admin page and API
for (const p of ['/admin', '/admin/dashboard', '/admin/products', '/admin/orders', '/admin/users', '/admin/settings', '/admin/cms', '/admin/security']) {
  app.use(p, requireOwner);
}
app.use('/api/admin/data', requireOwner);

// IMPORTANT for the rest of your app:
//  - Registration and SSO (Google/GitHub/etc.) must NEVER write session.owner or accept a role from the request.
//  - Never promote any user to admin because their email matches; only /verify-otp above can create session.owner.
module.exports = app;
