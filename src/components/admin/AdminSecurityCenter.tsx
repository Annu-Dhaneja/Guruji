import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Key,
  Smartphone,
  Laptop,
  Globe,
  Clock,
  RotateCcw,
  Trash2,
  UserPlus,
  CheckCircle2,
  AlertTriangle,
  History,
  Activity,
  LogOut,
  RefreshCw,
  Eye,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { AdminUser } from '../../types';
import { adminFetch } from '../../utils/adminApi';

interface AdminSecurityCenterProps {
  currentUser: AdminUser | null;
  onLogoutSession: () => void;
}

interface ActiveSessionItem {
  id: string;
  token?: string;
  adminId: string;
  adminEmail: string;
  adminName: string;
  adminRole: string;
  device: string;
  ip: string;
  loginTime: string;
  lastActive: string;
  expiresAt: string;
  isCurrent?: boolean;
}

interface SecurityEventItem {
  id: string;
  type: string;
  title: string;
  details: string;
  adminEmail?: string;
  adminName?: string;
  ip: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'critical';
}

export const AdminSecurityCenter: React.FC<AdminSecurityCenterProps> = ({
  currentUser,
  onLogoutSession,
}) => {
  const [sessions, setSessions] = useState<ActiveSessionItem[]>([]);
  const [securityEvents, setSecurityEvents] = useState<SecurityEventItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [securityStats, setSecurityStats] = useState<any>({
    securityScore: 98,
    activeSessionsCount: 1,
    totalAdminsCount: 2,
    recentFailedAttempts: 0,
    mfaEnforced: true,
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Change Password State
  const [currentPasswordInput, setCurrentPasswordInput] = useState<string>('');
  const [newPasswordInput, setNewPasswordInput] = useState<string>('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState<string>('');
  const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false);

  // New Admin Allowlist Form State
  const [showAddAdminModal, setShowAddAdminModal] = useState<boolean>(false);
  const [newAdminForm, setNewAdminForm] = useState({
    name: '',
    email: '',
    role: 'ADMIN',
    passwordPin: '852783',
    twoFactorEnabled: true,
  });

  const loadSecurityData = async () => {
    setIsLoading(true);
    try {
      const [sessRes, eventsRes, statsRes, logsRes, usersRes] = await Promise.all([
        adminFetch('/api/admin/auth/sessions'),
        adminFetch('/api/admin/security/events'),
        adminFetch('/api/admin/security/stats'),
        adminFetch('/api/admin/audit-logs'),
        adminFetch('/api/admin/users'),
      ]);

      if (sessRes.ok) setSessions(await sessRes.json());
      if (eventsRes.ok) setSecurityEvents(await eventsRes.json());
      if (statsRes.ok) setSecurityStats(await statsRes.json());
      if (logsRes.ok) setAuditLogs(await logsRes.json());
      if (usersRes.ok) setAdminUsers(await usersRes.json());
    } catch (e) {
      console.error('Failed to load security center data', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSecurityData();
  }, []);

  const showFeedback = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 3500);
  };

  // Revoke Specific Session
  const handleRevokeSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to terminate this session?')) return;
    try {
      const res = await adminFetch('/api/admin/auth/revoke-session', {
        method: 'POST',
        body: JSON.stringify({ sessionId }),
      });
      if (res.ok) {
        showFeedback('Session terminated successfully.');
        loadSecurityData();
      }
    } catch {
      alert('Error revoking session');
    }
  };

  // Revoke All Other Sessions
  const handleRevokeOtherSessions = async () => {
    if (!confirm('Terminate all active sessions on other devices?')) return;
    try {
      const res = await adminFetch('/api/admin/auth/revoke-other-sessions', {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        showFeedback(data.message || 'All other sessions revoked.');
        loadSecurityData();
      }
    } catch {
      alert('Error revoking sessions');
    }
  };

  // Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPasswordInput !== confirmPasswordInput) {
      alert('New password and confirmation do not match.');
      return;
    }
    if (newPasswordInput.length < 6) {
      alert('Password must be at least 6 characters.');
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await adminFetch('/api/admin/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({
          currentPassword: currentPasswordInput,
          newPassword: newPasswordInput,
        }),
      });

      if (res.ok) {
        showFeedback('Security password successfully updated.');
        setCurrentPasswordInput('');
        setNewPasswordInput('');
        setConfirmPasswordInput('');
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to change password');
      }
    } catch {
      alert('Network error updating password.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Toggle 2FA Setting
  const handleToggle2FA = async (currentStatus: boolean) => {
    try {
      const res = await adminFetch('/api/admin/auth/toggle-2fa', {
        method: 'POST',
        body: JSON.stringify({ enabled: !currentStatus }),
      });
      if (res.ok) {
        showFeedback(`2FA / OTP requirement ${!currentStatus ? 'ENABLED' : 'DISABLED'}.`);
        loadSecurityData();
      }
    } catch {
      alert('Error updating 2FA');
    }
  };

  // Add Authorized Admin
  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await adminFetch('/api/admin/users', {
        method: 'POST',
        body: JSON.stringify(newAdminForm),
      });
      if (res.ok) {
        showFeedback(`Admin account created for ${newAdminForm.email}.`);
        setShowAddAdminModal(false);
        setNewAdminForm({
          name: '',
          email: '',
          role: 'ADMIN',
          passwordPin: '852783',
          twoFactorEnabled: true,
        });
        loadSecurityData();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to create admin user');
      }
    } catch {
      alert('Error creating admin user');
    }
  };

  // Delete Admin
  const handleDeleteAdmin = async (userId: string, email: string) => {
    if (!confirm(`Are you sure you want to remove administrator '${email}' from the allowlist?`)) return;
    try {
      const res = await adminFetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        showFeedback(`Administrator ${email} removed.`);
        loadSecurityData();
      } else {
        const err = await res.json();
        alert(err.error || 'Cannot delete admin account');
      }
    } catch {
      alert('Error deleting admin');
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn text-[#CBD5E1]">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1E2B32]">
        <div>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#0799A6] dark:text-[#25B4BD]">
            <ShieldCheck className="w-4 h-4" />
            <span>Cyber-Security Command</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1 font-display">
            Admin Security &amp; Access Center
          </h1>
          <p className="text-xs text-[#94A3B8]">
            JWT Session Rotation · Server-Side Allowlist · Real-Time Audit Telemetry · RBAC Enforcement
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadSecurityData}
            className="px-3.5 py-2 rounded-xl bg-[#141E24] hover:bg-[#1B2931] border border-[#22333D] text-xs font-semibold text-white flex items-center gap-2 transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Telemetry</span>
          </button>

          <button
            onClick={handleRevokeOtherSessions}
            className="px-3.5 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/50 border border-red-500/30 text-xs font-bold text-red-200 flex items-center gap-1.5 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout Other Sessions</span>
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="p-3.5 rounded-xl bg-[#0799A6]/20 border border-[#25B4BD]/50 text-white text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-[#25B4BD]" />
          <span className="font-semibold">{actionMessage}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. TOP SECURITY HEALTH METRICS GRID */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Security Score */}
        <div className="p-5 rounded-2xl bg-[#0F171B] border border-[#1E2B32] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#94A3B8] font-semibold">
            <span>Security Health</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-mono font-bold text-white">{securityStats.securityScore}%</span>
            <span className="text-[11px] font-bold text-emerald-400">Enterprise High</span>
          </div>
          <div className="text-[11px] text-[#64748B]">HMAC-SHA256 &amp; OTP Guard active</div>
        </div>

        {/* Metric 2: Active Sessions */}
        <div className="p-5 rounded-2xl bg-[#0F171B] border border-[#1E2B32] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#94A3B8] font-semibold">
            <span>Active Sessions</span>
            <Laptop className="w-4 h-4 text-[#25B4BD]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-mono font-bold text-white">{sessions.length}</span>
            <span className="text-[11px] font-bold text-[#25B4BD]">Verified Devices</span>
          </div>
          <div className="text-[11px] text-[#64748B]">Sliding 30m Access Token Window</div>
        </div>

        {/* Metric 3: Authorized Admins */}
        <div className="p-5 rounded-2xl bg-[#0F171B] border border-[#1E2B32] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#94A3B8] font-semibold">
            <span>Authorized Accounts</span>
            <Lock className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-mono font-bold text-white">{adminUsers.length}</span>
            <span className="text-[11px] font-bold text-purple-400">Allowlist Active</span>
          </div>
          <div className="text-[11px] text-[#64748B]">Non-allowlist OAuth blocked</div>
        </div>

        {/* Metric 4: 2FA Enforcement */}
        <div className="p-5 rounded-2xl bg-[#0F171B] border border-[#1E2B32] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#94A3B8] font-semibold">
            <span>2FA / OTP Enforcement</span>
            <Smartphone className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-white">Cryptographic OTP</span>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-emerald-400 font-bold">Enabled for Super Admin</span>
            <button
              onClick={() => handleToggle2FA(currentUser?.twoFactorEnabled ?? true)}
              className="text-[10px] text-[#25B4BD] underline cursor-pointer"
            >
              Toggle
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. ACTIVE SESSIONS & DEVICE CONTROL */}
      {/* ======================================================== */}
      <div className="rounded-2xl bg-[#0F171B] border border-[#1E2B32] overflow-hidden">
        <div className="p-5 border-b border-[#1E2B32] flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Laptop className="w-4 h-4 text-[#25B4BD]" />
              <span>Active Authenticated Sessions &amp; Devices</span>
            </h2>
            <p className="text-xs text-[#64748B]">
              Every device authenticated with JWT token. Revoking immediately kills dashboard access.
            </p>
          </div>
          <span className="text-xs font-mono text-[#94A3B8]">{sessions.length} Session(s)</span>
        </div>

        <div className="divide-y divide-[#1A252B] overflow-x-auto">
          {sessions.map((sess) => (
            <div key={sess.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#121B20] transition">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-[#162228] border border-[#23333C] text-[#25B4BD] shrink-0 mt-0.5">
                  {sess.device.toLowerCase().includes('mobile') ? (
                    <Smartphone className="w-5 h-5" />
                  ) : (
                    <Laptop className="w-5 h-5" />
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{sess.device}</span>
                    {sess.isCurrent && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0799A6]/20 text-[#25B4BD] border border-[#0799A6]/40">
                        Current Active Session
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-[#94A3B8] flex flex-wrap items-center gap-2">
                    <span className="flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-[#64748B]" />
                      <span>{sess.ip}</span>
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#64748B]" />
                      <span>Logged in: {new Date(sess.loginTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </span>
                    <span>·</span>
                    <span className="text-emerald-400 font-semibold">{sess.adminRole}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {sess.isCurrent ? (
                  <button
                    onClick={onLogoutSession}
                    className="px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-xs font-semibold text-red-200 transition cursor-pointer"
                  >
                    Logout Current
                  </button>
                ) : (
                  <button
                    onClick={() => handleRevokeSession(sess.id)}
                    className="px-3 py-1.5 rounded-lg bg-[#182329] hover:bg-red-950/40 border border-[#263740] hover:border-red-500/40 text-xs font-semibold text-[#94A3B8] hover:text-red-200 transition flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Revoke Device</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. REAL-TIME SECURITY ALERTS & AUDIT EVENTS */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Real-Time Security Notifications */}
        <div className="rounded-2xl bg-[#0F171B] border border-[#1E2B32] p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E2B32]">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Real-Time Security Events Stream</span>
            </h3>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {securityEvents.slice(0, 10).map((ev) => (
              <div
                key={ev.id}
                className={`p-3 rounded-xl border text-xs space-y-1 transition ${
                  ev.severity === 'critical'
                    ? 'bg-red-950/30 border-red-500/30 text-red-200'
                    : ev.severity === 'warning'
                    ? 'bg-amber-950/30 border-amber-500/30 text-amber-200'
                    : 'bg-[#131C21] border-[#1F2C33] text-[#CBD5E1]'
                }`}
              >
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-white font-bold">{ev.title}</span>
                  <span className="text-[10px] text-[#64748B] font-mono">
                    {new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-[#94A3B8]">{ev.details}</p>
                <div className="text-[10px] text-[#64748B] flex items-center gap-2 pt-0.5">
                  <span>Source: {ev.ip}</span>
                  {ev.adminEmail && <span>· User: {ev.adminEmail}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Change Password & Security Settings */}
        <div className="rounded-2xl bg-[#0F171B] border border-[#1E2B32] p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E2B32]">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-[#25B4BD]" />
              <span>Update Security Password</span>
            </h3>
            <span className="text-[11px] text-[#64748B]">Immediate Revocation</span>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#94A3B8]">Current Password</label>
              <input
                type="password"
                value={currentPasswordInput}
                onChange={(e) => setCurrentPasswordInput(e.target.value)}
                placeholder="Current administrator password"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#131C21] border border-[#233139] text-xs text-white placeholder-[#52636A] focus:outline-none focus:border-[#25B4BD]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#94A3B8]">New Password (Min 6 chars)</label>
              <input
                type="password"
                value={newPasswordInput}
                onChange={(e) => setNewPasswordInput(e.target.value)}
                placeholder="Enter strong new password"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#131C21] border border-[#233139] text-xs text-white placeholder-[#52636A] focus:outline-none focus:border-[#25B4BD]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#94A3B8]">Confirm New Password</label>
              <input
                type="password"
                value={confirmPasswordInput}
                onChange={(e) => setConfirmPasswordInput(e.target.value)}
                placeholder="Re-type new password"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#131C21] border border-[#233139] text-xs text-white placeholder-[#52636A] focus:outline-none focus:border-[#25B4BD]"
              />
            </div>

            <button
              type="submit"
              disabled={isChangingPassword}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-[#0A0E11] bg-gradient-to-r from-[#0799A6] via-[#25B4BD] to-[#38D9E3] hover:brightness-110 transition cursor-pointer disabled:opacity-50 mt-1"
            >
              {isChangingPassword ? 'Updating Password...' : 'Save New Security Password'}
            </button>
          </form>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. ADMIN USER ALLOWLIST & ROLE-BASED ACCESS CONTROL (RBAC) */}
      {/* ======================================================== */}
      <div className="rounded-2xl bg-[#0F171B] border border-[#1E2B32] overflow-hidden">
        <div className="p-5 border-b border-[#1E2B32] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-purple-400" />
              <span>Admin Allowlist &amp; RBAC Roles</span>
            </h2>
            <p className="text-xs text-[#64748B]">
              Only accounts on this allowlist can log in via Password or OAuth (Google, GitHub, Facebook, Instagram).
            </p>
          </div>

          <button
            onClick={() => setShowAddAdminModal(true)}
            className="px-3.5 py-2 rounded-xl bg-[#0799A6] hover:bg-[#08828D] text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer self-start sm:self-auto"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Authorized Administrator</span>
          </button>
        </div>

        <div className="divide-y divide-[#1A252B] overflow-x-auto">
          {adminUsers.map((user) => (
            <div key={user.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#121B20] transition">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">{user.name}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-950/60 text-purple-300 border border-purple-500/30">
                    {user.role}
                  </span>
                  {user.isOwner && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      Primary Owner
                    </span>
                  )}
                </div>
                <div className="text-xs text-[#94A3B8]">
                  <span>{user.email}</span>
                  <span className="mx-2">·</span>
                  <span>2FA: {user.twoFactorEnabled ? 'Enabled' : 'Disabled'}</span>
                  <span className="mx-2">·</span>
                  <span>Last Login: {new Date(user.lastLogin || Date.now()).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {!user.isOwner && user.email !== 'annudhaneja@gmail.com' ? (
                  <button
                    onClick={() => handleDeleteAdmin(user.id, user.email)}
                    className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/30 text-xs transition cursor-pointer"
                    title="Remove from Allowlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                ) : (
                  <span className="text-[11px] text-[#64748B] italic">Protected Owner</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Admin Modal */}
      {showAddAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl bg-[#0F171B] border border-[#233139] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E2B32]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-[#25B4BD]" />
                <span>Add Authorized Admin Account</span>
              </h3>
              <button
                onClick={() => setShowAddAdminModal(false)}
                className="text-[#64748B] hover:text-white transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddAdmin} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#94A3B8]">Full Name</label>
                <input
                  type="text"
                  value={newAdminForm.name}
                  onChange={(e) => setNewAdminForm({ ...newAdminForm, name: e.target.value })}
                  placeholder="e.g. Senior Designer"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#131C21] border border-[#233139] text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#94A3B8]">Email Address (Allowlist ID)</label>
                <input
                  type="email"
                  value={newAdminForm.email}
                  onChange={(e) => setNewAdminForm({ ...newAdminForm, email: e.target.value })}
                  placeholder="admin@domain.com"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#131C21] border border-[#233139] text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#94A3B8]">RBAC Role</label>
                <select
                  value={newAdminForm.role}
                  onChange={(e) => setNewAdminForm({ ...newAdminForm, role: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#131C21] border border-[#233139] text-xs text-white"
                >
                  <option value="SUPER_ADMIN">SUPER_ADMIN (Full Access)</option>
                  <option value="ADMIN">ADMIN (Administrative Management)</option>
                  <option value="STAFF">STAFF (Orders &amp; Operations)</option>
                  <option value="DESIGNER">DESIGNER (Design &amp; Products)</option>
                  <option value="EDITOR">EDITOR (Content &amp; Pages)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#94A3B8]">Initial Security Password / PIN</label>
                <input
                  type="password"
                  value={newAdminForm.passwordPin}
                  onChange={(e) => setNewAdminForm({ ...newAdminForm, passwordPin: e.target.value })}
                  placeholder="Initial Password"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#131C21] border border-[#233139] text-xs text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="enable2fa"
                  checked={newAdminForm.twoFactorEnabled}
                  onChange={(e) => setNewAdminForm({ ...newAdminForm, twoFactorEnabled: e.target.checked })}
                  className="rounded border-[#233139]"
                />
                <label htmlFor="enable2fa" className="text-xs text-[#CBD5E1]">
                  Require Real-time OTP / 2FA Verification
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddAdminModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#141E24] hover:bg-[#1B2931] text-xs font-semibold text-[#94A3B8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0799A6] hover:bg-[#08828D] text-white font-bold text-xs"
                >
                  Create &amp; Authorize Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
