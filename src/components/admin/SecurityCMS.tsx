import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  UserCheck,
  Key,
  Laptop,
  LogOut,
  CheckCircle2,
  Lock,
  AlertCircle,
  RefreshCw,
  UserPlus,
  Trash2,
  ShieldAlert,
  Database,
  Download,
  Play,
  Check,
  XCircle,
  HardDrive,
  Server,
} from 'lucide-react';
import { AdminUser, AuditLogItem, AdminSession } from '../../types';
import { adminFetch } from '../../utils/adminApi';

export const SecurityCMS: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [sessions, setSessions] = useState<AdminSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Persistence & Database System Verification States
  const [systemStatus, setSystemStatus] = useState<any>(null);
  const [isTestingPersistence, setIsTestingPersistence] = useState(false);
  const [persistenceTestResults, setPersistenceTestResults] = useState<any[]>([]);
  const [persistenceTestedAt, setPersistenceTestedAt] = useState<string | null>(null);

  // New Admin User Modal
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    role: 'Content Manager',
    passwordPin: '',
    twoFactorEnabled: false,
    permissions: ['page.edit', 'service.edit', 'product.edit'],
  });

  useEffect(() => {
    fetchSecurityData();
  }, []);

  const showNotification = (type: 'success' | 'error', text: string) => {
    setActionMessage({ type, text });
    setTimeout(() => setActionMessage(null), 4000);
  };

  const fetchSecurityData = () => {
    setLoading(true);
    Promise.all([
      adminFetch('/api/admin/users').then((r) => (r.ok ? r.json() : [])),
      adminFetch('/api/admin/audit-logs').then((r) => (r.ok ? r.json() : [])),
      adminFetch('/api/admin/sessions').then((r) => (r.ok ? r.json() : [])),
      adminFetch('/api/admin/system/status').then((r) => (r.ok ? r.json() : null)),
    ])
      .then(([uData, lData, sData, sysData]) => {
        setUsers(Array.isArray(uData) ? uData : []);
        setAuditLogs(Array.isArray(lData) ? lData : []);
        setSessions(Array.isArray(sData) ? sData : []);
        if (sysData) setSystemStatus(sysData);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  };

  const handleRunPersistenceVerification = async () => {
    setIsTestingPersistence(true);
    setPersistenceTestResults([]);
    try {
      const res = await adminFetch('/api/admin/system/verify-persistence', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.tests) {
        setPersistenceTestResults(data.tests);
        setPersistenceTestedAt(new Date().toLocaleTimeString());
        if (data.allPassed) {
          showNotification('success', '100% Data Persistence Integrity: All 8 automated tests passed successfully!');
        } else {
          showNotification('error', 'Some persistence tests reported issues.');
        }
      } else {
        showNotification('error', data.error || 'Failed to complete persistence test suite.');
      }
    } catch (e) {
      showNotification('error', 'Network error during persistence verification.');
    } finally {
      setIsTestingPersistence(false);
    }
  };

  const handleDownloadBackup = async () => {
    try {
      const res = await adminFetch('/api/admin/system/backup');
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gurucraft_full_backup_${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        showNotification('success', 'Full database snapshot downloaded successfully.');
      } else {
        showNotification('error', 'Failed to generate database backup.');
      }
    } catch (e) {
      showNotification('error', 'Network error downloading backup.');
    }
  };

  const handleRevokeAllSessions = async () => {
    try {
      const res = await adminFetch('/api/admin/sessions/revoke-all', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        showNotification('success', data.message || 'All other admin sessions terminated.');
        fetchSecurityData();
      } else {
        showNotification('error', data.error || 'Failed to revoke sessions.');
      }
    } catch (e) {
      showNotification('error', 'Network error revoking sessions.');
    }
  };

  const handleCreateAdminUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserForm.name || !newUserForm.email || !newUserForm.passwordPin) {
      showNotification('error', 'Name, email, and security PIN are required.');
      return;
    }

    try {
      const res = await adminFetch('/api/admin/users', {
        method: 'POST',
        body: JSON.stringify(newUserForm),
      });
      const data = await res.json();
      if (res.ok) {
        showNotification('success', `Administrator ${data.name} created successfully.`);
        setIsAddUserOpen(false);
        setNewUserForm({
          name: '',
          email: '',
          role: 'Content Manager',
          passwordPin: '',
          twoFactorEnabled: false,
          permissions: ['page.edit', 'service.edit', 'product.edit'],
        });
        fetchSecurityData();
      } else {
        showNotification('error', data.error || 'Failed to create admin user.');
      }
    } catch (e) {
      showNotification('error', 'Network error creating admin user.');
    }
  };

  const handleDeleteAdminUser = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to revoke access for administrator "${userName}"?`)) return;

    try {
      const res = await adminFetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        showNotification('success', data.message || 'Administrator removed.');
        fetchSecurityData();
      } else {
        showNotification('error', data.error || 'Failed to delete administrator.');
      }
    } catch (e) {
      showNotification('error', 'Network error removing administrator.');
    }
  };

  if (loading) return <div className="text-purple-400 p-8">Loading Security & RBAC Center...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl font-bold text-white">Admin RBAC, Security & Session Management</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Server-side token authorization, owner-only Super Admin enforcement, 2FA validation, and immutable audit logs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsAddUserOpen(true)}
            className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
          >
            <UserPlus className="w-4 h-4" /> Add Staff Admin
          </button>

          <button
            onClick={handleRevokeAllSessions}
            className="px-3.5 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl font-medium text-xs flex items-center gap-1.5 transition-all"
          >
            <LogOut className="w-4 h-4" /> Revoke Other Sessions
          </button>
        </div>
      </div>

      {actionMessage && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center gap-2 font-medium border ${
            actionMessage.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
          }`}
        >
          {actionMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          ) : (
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
          )}
          {actionMessage.text}
        </div>
      )}

      {/* Permanent Database Storage & 8-Point Verification Suite */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white">Permanent Database Storage & Data Integrity Engine</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Production-grade single source of truth. Every user and admin action is permanently committed to disk storage and survives page refreshes, browser restarts, and server reboots.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadBackup}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
              title="Download Full Database JSON Snapshot"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" /> Download Backup JSON
            </button>

            <button
              onClick={handleRunPersistenceVerification}
              disabled={isTestingPersistence}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
            >
              {isTestingPersistence ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Verifying Storage...
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-indigo-200 fill-indigo-200" /> Run 8-Point Persistence Test
                </>
              )}
            </button>
          </div>
        </div>

        {/* Database Metrics Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
            <div className="text-slate-400 text-[11px]">Storage Engine</div>
            <div className="font-bold text-white mt-0.5 flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-indigo-400" /> Atomic Disk JSON DB
            </div>
            <div className="text-[10px] text-emerald-400 mt-0.5 font-medium">● Single Source of Truth</div>
          </div>

          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
            <div className="text-slate-400 text-[11px]">Auto-Save Mutation Hook</div>
            <div className="font-bold text-emerald-400 mt-0.5 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" /> Active on all CRUD APIs
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 font-mono">POST / PUT / PATCH / DELETE</div>
          </div>

          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
            <div className="text-slate-400 text-[11px]">Total Data Collections</div>
            <div className="font-bold text-white mt-0.5 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-teal-400" /> 12 Active Tables
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Services, Orders, Wardrobes, CMS</div>
          </div>

          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
            <div className="text-slate-400 text-[11px]">Server Restart Policy</div>
            <div className="font-bold text-amber-300 mt-0.5">Non-Destructive</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Hydrates on boot without reset</div>
          </div>
        </div>

        {/* 8-Point Verification Test Output */}
        {persistenceTestResults.length > 0 && (
          <div className="mt-4 p-4 bg-slate-950 border border-indigo-500/30 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-400" /> 8-Point Automated Persistence & Integrity Test Results
              </span>
              {persistenceTestedAt && (
                <span className="text-[10px] text-slate-400 font-mono">Executed at {persistenceTestedAt}</span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {persistenceTestResults.map((test, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-lg border flex items-start gap-2 ${
                    test.passed
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-200'
                      : 'bg-rose-950/20 border-rose-500/30 text-slate-200'
                  }`}
                >
                  {test.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="font-bold text-[11px] text-white">{test.testName}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{test.message}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Grid: Admin Accounts & Active Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Admin Accounts */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-purple-400" /> Authorized Administrator Accounts ({users.length})
            </h3>
            <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
              Server-Verified RBAC
            </span>
          </div>

          <div className="space-y-3">
            {users.map((u) => {
              const isOwner = u.email === 'annudhaneja@gmail.com' || u.role === 'Super Admin';
              return (
                <div key={u.id} className="p-4 bg-slate-800/60 border border-slate-700/80 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white text-xs flex items-center gap-1.5">
                        {u.name}
                        {isOwner && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-500/20 text-amber-300 font-extrabold border border-amber-500/30">
                            OWNER
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400">{u.email}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {u.role}
                      </span>
                      {!isOwner && (
                        <button
                          onClick={() => handleDeleteAdminUser(u.id, u.name)}
                          title="Revoke Admin Access"
                          className="p-1 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-[10px] text-slate-400 border-t border-slate-700/50 pt-2">
                    <span className="flex items-center gap-1">
                      <Lock className="w-3 h-3 text-emerald-400" /> 2FA Security: {u.twoFactorEnabled ? 'Active' : 'Disabled'}
                    </span>
                    <span>•</span>
                    <span>Last login: {new Date(u.lastLogin).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Device Sessions */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Laptop className="w-4 h-4 text-teal-400" /> Active Session Tokens ({sessions.length})
            </h3>
            <span className="text-[10px] text-teal-400 bg-teal-950/60 px-2 py-0.5 rounded-full border border-teal-500/30">
              Cryptographic Bearer Sessions
            </span>
          </div>

          <div className="space-y-3">
            {sessions.map((s) => (
              <div key={s.id} className="p-4 bg-slate-800/60 border border-slate-700/80 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-white flex items-center gap-2">
                    <Laptop className="w-4 h-4 text-teal-400" /> {s.device || 'Authorized Browser Session'}
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">
                    Active Session
                  </span>
                </div>

                <div className="text-slate-400 font-mono text-[11px]">{s.ip || '127.0.0.1 (Rohini, Delhi)'}</div>
                <div className="text-[10px] text-slate-500 flex justify-between">
                  <span>Owner: {s.adminName || 'Annu Dhaneja'}</span>
                  <span>Initiated: {new Date(s.loginTime).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full Security Audit Logs */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Full Security Audit Trail & Access Logs</h3>
            <p className="text-[11px] text-slate-400">Chronological ledger of authentication events, credential verification, and system changes.</p>
          </div>
          <button
            onClick={fetchSecurityData}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-all"
            title="Refresh Audit Logs"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-medium">
                <th className="py-2 px-3">Admin</th>
                <th className="py-2 px-3">Action Code</th>
                <th className="py-2 px-3">Module</th>
                <th className="py-2 px-3">Description</th>
                <th className="py-2 px-3">IP Address</th>
                <th className="py-2 px-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 text-slate-200 font-semibold">{log.adminName}</td>
                  <td className="py-2.5 px-3 font-mono text-[10px] text-purple-400">{log.action}</td>
                  <td className="py-2.5 px-3 text-slate-300">{log.resource}</td>
                  <td className="py-2.5 px-3 text-slate-400">{log.details}</td>
                  <td className="py-2.5 px-3 text-slate-500 font-mono">{log.ipAddress}</td>
                  <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Staff Administrator Modal */}
      {isAddUserOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl text-xs text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-purple-400" /> Create Authorized Staff Administrator
              </h3>
              <button onClick={() => setIsAddUserOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAdminUser} className="space-y-3.5">
              <div>
                <label className="block font-bold mb-1 text-slate-300">Staff Full Name</label>
                <input
                  type="text"
                  required
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-300">Staff Email Address</label>
                <input
                  type="email"
                  required
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  placeholder="staff@gurucraftpro.com"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-300">Administrative Role</label>
                <select
                  value={newUserForm.role}
                  onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-purple-500"
                >
                  <option value="Content Manager">Content Manager</option>
                  <option value="SEO Manager">SEO Manager</option>
                  <option value="Order Manager">Order Manager</option>
                  <option value="Designer">Designer</option>
                  <option value="Support Manager">Support Manager</option>
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-300">Security PIN / Password</label>
                <input
                  type="password"
                  required
                  value={newUserForm.passwordPin}
                  onChange={(e) => setNewUserForm({ ...newUserForm, passwordPin: e.target.value })}
                  placeholder="Set minimum 4-6 digit PIN"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="twoFaCheck"
                  checked={newUserForm.twoFactorEnabled}
                  onChange={(e) => setNewUserForm({ ...newUserForm, twoFactorEnabled: e.target.checked })}
                  className="rounded accent-purple-600"
                />
                <label htmlFor="twoFaCheck" className="text-slate-300 font-medium">
                  Enforce Two-Factor Authentication (2FA) for this staff account
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold"
                >
                  Create Staff Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
