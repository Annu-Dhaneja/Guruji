import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Key,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Save,
  Lock,
  Eye,
  EyeOff,
  ExternalLink,
  Zap,
  HelpCircle,
  Check,
  Building,
  Palette,
  Layers,
} from 'lucide-react';
import { PaymentGatewaySettings } from '../../types';

interface PaymentGatewayCMSProps {
  adminFetch?: (url: string, options?: RequestInit) => Promise<Response>;
}

export const PaymentGatewayCMS: React.FC<PaymentGatewayCMSProps> = ({ adminFetch }) => {
  const [settings, setSettings] = useState<{
    enabled: boolean;
    mode: 'test' | 'live';
    keyId: string;
    keySecretMasked: string;
    hasKeySecret: boolean;
    webhookSecretMasked: string;
    hasWebhookSecret: boolean;
    companyName: string;
    themeColor: string;
    source: 'env' | 'database' | 'none';
    isConfigured: boolean;
    lastTestedAt?: string;
    lastTestStatus?: 'success' | 'failed' | 'untested';
    lastTestMessage?: string;
  }>({
    enabled: true,
    mode: 'test',
    keyId: '',
    keySecretMasked: 'Not Configured',
    hasKeySecret: false,
    webhookSecretMasked: 'Not Configured',
    hasWebhookSecret: false,
    companyName: 'GurucraftPro Studio',
    themeColor: '#7c3aed',
    source: 'none',
    isConfigured: false,
    lastTestStatus: 'untested',
  });

  const [inputKeyId, setInputKeyId] = useState('');
  const [inputKeySecret, setInputKeySecret] = useState('');
  const [inputWebhookSecret, setInputWebhookSecret] = useState('');
  const [inputMode, setInputMode] = useState<'test' | 'live'>('test');
  const [inputEnabled, setInputEnabled] = useState(true);
  const [inputCompanyName, setInputCompanyName] = useState('GurucraftPro Studio');
  const [inputThemeColor, setInputThemeColor] = useState('#7c3aed');

  const [showSecretInput, setShowSecretInput] = useState(false);
  const [showWebhookInput, setShowWebhookInput] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Connection Test State
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    mode?: string;
    message?: string;
    error?: string;
  } | null>(null);

  const fetchHandler = adminFetch || fetch;

  const loadPaymentSettings = async () => {
    setLoading(true);
    setSaveError(null);
    try {
      const res = await fetchHandler('/api/admin/payment-settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
        setInputKeyId(data.keyId || '');
        setInputMode(data.mode || 'test');
        setInputEnabled(data.enabled !== false);
        setInputCompanyName(data.companyName || 'GurucraftPro Studio');
        setInputThemeColor(data.themeColor || '#7c3aed');
        if (data.lastTestStatus && data.lastTestStatus !== 'untested') {
          setTestResult({
            success: data.lastTestStatus === 'success',
            mode: data.mode,
            message: data.lastTestMessage,
            error: data.lastTestStatus === 'failed' ? data.lastTestMessage : undefined,
          });
        }
      }
    } catch (err: any) {
      console.error('Failed to load payment settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPaymentSettings();
  }, []);

  const handleSaveSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const payload: any = {
        enabled: inputEnabled,
        mode: inputMode,
        keyId: inputKeyId.trim(),
        companyName: inputCompanyName.trim(),
        themeColor: inputThemeColor.trim(),
      };

      if (inputKeySecret.trim()) {
        payload.keySecret = inputKeySecret.trim();
      }

      if (inputWebhookSecret.trim()) {
        payload.webhookSecret = inputWebhookSecret.trim();
      }

      const res = await fetchHandler('/api/admin/payment-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSettings(data.settings);
        setSaveSuccess(true);
        setInputKeySecret('');
        setInputWebhookSecret('');
        setShowSecretInput(false);
        setShowWebhookInput(false);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setSaveError(data.error || 'Failed to save payment settings.');
      }
    } catch (err: any) {
      setSaveError(err.message || 'Error saving payment settings.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      const payload: any = {};
      if (inputKeyId.trim()) payload.keyId = inputKeyId.trim();
      if (inputKeySecret.trim()) payload.keySecret = inputKeySecret.trim();

      const res = await fetchHandler('/api/admin/payment-settings/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setTestResult(data);
      if (data.success) {
        loadPaymentSettings();
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        error: err.message || 'Connection test failed to reach backend.',
      });
    } finally {
      setIsTesting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-purple-400 animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Loading Razorpay Gateway Configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2.5">
            <CreditCard className="w-6 h-6 text-purple-400" />
            Razorpay Payment Gateway Manager
            <span
              className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase border ${
                settings.isConfigured
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
              }`}
            >
              {settings.isConfigured ? 'Connected' : 'Action Required'}
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure official Razorpay API keys, test payments, and manage server-side security.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={isTesting || (!inputKeyId && !settings.keyId)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/30 text-xs font-bold flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {isTesting ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-400" />
                <span>Testing API...</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 text-teal-400" />
                <span>Test Razorpay Connection</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleSaveSettings()}
            disabled={isSaving}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-teal-400 text-white font-bold text-xs shadow-lg hover:opacity-90 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : saveSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>Saved & Active</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Gateway Config</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Status Alerts */}
      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-3 text-xs">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          <div>
            <p className="font-bold">Settings Saved Successfully</p>
            <p className="text-[11px] text-emerald-400/80">
              Razorpay configuration has been updated and securely persisted to disk.
            </p>
          </div>
        </div>
      )}

      {saveError && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-3 text-xs">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
          <div>
            <p className="font-bold">Failed to Save Configuration</p>
            <p className="text-[11px] text-rose-400/80">{saveError}</p>
          </div>
        </div>
      )}

      {testResult && (
        <div
          className={`p-4 rounded-2xl border flex items-start gap-3 text-xs ${
            testResult.success
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          {testResult.success ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
          )}
          <div className="space-y-1 flex-1">
            <p className="font-bold">
              {testResult.success ? 'Razorpay Handshake Passed' : 'Razorpay Connection Failed'}
            </p>
            <p className="text-[11px] leading-relaxed">
              {testResult.message || testResult.error}
            </p>
            {testResult.mode && (
              <p className="text-[10px] text-slate-400">
                Operating Mode: <span className="font-mono text-purple-300 uppercase font-bold">{testResult.mode}</span>
              </p>
            )}
          </div>
        </div>
      )}

      {/* Gateway Overview Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Gateway Mode</span>
            <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
              <Zap className="w-4 h-4" />
            </span>
          </div>
          <div className="text-xl font-bold text-white capitalize flex items-center gap-2">
            {settings.mode} Mode
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full ${
                settings.mode === 'live'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}
            >
              {settings.mode === 'live' ? 'Real INR Payments' : 'Test Sandbox'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            {settings.mode === 'live'
              ? 'Accepts real customer cards, UPI, net banking.'
              : 'Accepts test cards and simulated Razorpay payments.'}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Key Secret Status</span>
            <span className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400">
              <Lock className="w-4 h-4" />
            </span>
          </div>
          <div className="text-xl font-bold text-white font-mono flex items-center gap-2">
            {settings.hasKeySecret ? (
              <span className="text-emerald-400 font-sans text-base flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Stored Securely (Server Only)
              </span>
            ) : (
              <span className="text-amber-400 font-sans text-base">Key Secret Missing</span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 font-mono">
            {settings.keySecretMasked}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Credential Source</span>
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Layers className="w-4 h-4" />
            </span>
          </div>
          <div className="text-base font-bold text-white uppercase font-mono">
            {settings.source === 'env'
              ? 'Environment Variable'
              : settings.source === 'database'
              ? 'Admin Dashboard DB'
              : 'Not Configured'}
          </div>
          <p className="text-[11px] text-slate-500">
            {settings.lastTestedAt
              ? `Last tested: ${new Date(settings.lastTestedAt).toLocaleString()}`
              : 'Connection untested.'}
          </p>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Section 1: API Keys */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-purple-400" />
              1. Razorpay API Credentials
            </h3>
            <a
              href="https://dashboard.razorpay.com/app/keys"
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1 font-semibold"
            >
              Get Keys from Razorpay Dashboard <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            {/* Key ID */}
            <div>
              <label className="font-bold text-slate-300 block mb-1.5">
                Razorpay Key ID (Public) *
              </label>
              <input
                type="text"
                required
                value={inputKeyId}
                onChange={(e) => {
                  const val = e.target.value.trim();
                  setInputKeyId(val);
                  if (val.startsWith('rzp_live')) {
                    setInputMode('live');
                  } else if (val.startsWith('rzp_test')) {
                    setInputMode('test');
                  }
                }}
                placeholder="rzp_test_... or rzp_live_..."
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-teal-300 font-mono text-xs outline-none focus:border-purple-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Prefix <code className="text-purple-300">rzp_test_</code> for Test Mode or{' '}
                <code className="text-emerald-300">rzp_live_</code> for Live Production.
              </p>
            </div>

            {/* Key Secret */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="font-bold text-slate-300">
                  Razorpay Key Secret (Server-Side Only) *
                </label>
                {settings.hasKeySecret && !showSecretInput && (
                  <button
                    type="button"
                    onClick={() => setShowSecretInput(true)}
                    className="text-[11px] text-purple-400 hover:text-purple-300 font-bold"
                  >
                    Change Secret Key
                  </button>
                )}
              </div>

              {settings.hasKeySecret && !showSecretInput ? (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 font-mono flex items-center justify-between">
                  <span>{settings.keySecretMasked}</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-sans">
                    Configured
                  </span>
                </div>
              ) : (
                <div className="relative">
                  <input
                    type="text"
                    value={inputKeySecret}
                    onChange={(e) => setInputKeySecret(e.target.value.trim())}
                    placeholder="Paste new Razorpay Secret Key..."
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs outline-none focus:border-purple-500 pr-10"
                  />
                  {showSecretInput && settings.hasKeySecret && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowSecretInput(false);
                        setInputKeySecret('');
                      }}
                      className="absolute right-3 top-3 text-[10px] text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              )}
              <p className="text-[11px] text-slate-500 mt-1">
                Never shared with browser/client. Used exclusively for cryptographic HMAC SHA-256 signatures.
              </p>
            </div>
          </div>

          {/* Webhook Secret */}
          <div className="pt-2 text-xs">
            <div className="flex justify-between items-center mb-1.5">
              <label className="font-bold text-slate-300">
                Webhook Secret (Optional for Payment Webhooks)
              </label>
              {settings.hasWebhookSecret && !showWebhookInput && (
                <button
                  type="button"
                  onClick={() => setShowWebhookInput(true)}
                  className="text-[11px] text-purple-400 hover:text-purple-300 font-bold"
                >
                  Change Webhook Secret
                </button>
              )}
            </div>

            {settings.hasWebhookSecret && !showWebhookInput ? (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 font-mono flex items-center justify-between">
                <span>{settings.webhookSecretMasked}</span>
                <span className="text-[10px] text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20 font-sans">
                  Active
                </span>
              </div>
            ) : (
              <div className="relative">
                <input
                  type="text"
                  value={inputWebhookSecret}
                  onChange={(e) => setInputWebhookSecret(e.target.value.trim())}
                  placeholder="Enter Razorpay Webhook Secret..."
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs outline-none focus:border-purple-500 pr-10"
                />
                {showWebhookInput && settings.hasWebhookSecret && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowWebhookInput(false);
                      setInputWebhookSecret('');
                    }}
                    className="absolute right-3 top-3 text-[10px] text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                )}
              </div>
            )}
            <p className="text-[11px] text-slate-500 mt-1">
              Webhook Endpoint URL:{' '}
              <code className="text-purple-300 font-mono">
                {window.location.origin}/api/payments/webhook
              </code>
            </p>
          </div>
        </div>

        {/* Section 2: Mode & Business Branding */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
          <h3 className="text-sm font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Building className="w-4 h-4 text-purple-400" />
            2. Gateway Mode & Checkout Branding
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
            {/* Mode Selector */}
            <div>
              <label className="font-bold text-slate-300 block mb-1.5">
                Operating Mode
              </label>
              <select
                value={inputMode}
                onChange={(e) => setInputMode(e.target.value as any)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-purple-500"
              >
                <option value="test">Test / Sandbox Mode</option>
                <option value="live">Live Production Mode</option>
              </select>
            </div>

            {/* Company Name */}
            <div>
              <label className="font-bold text-slate-300 block mb-1.5">
                Checkout Company Name
              </label>
              <input
                type="text"
                value={inputCompanyName}
                onChange={(e) => setInputCompanyName(e.target.value)}
                placeholder="GurucraftPro Studio"
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-purple-500"
              />
            </div>

            {/* Theme Color */}
            <div>
              <label className="font-bold text-slate-300 block mb-1.5">
                Checkout Theme Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={inputThemeColor}
                  onChange={(e) => setInputThemeColor(e.target.value)}
                  className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
                />
                <input
                  type="text"
                  value={inputThemeColor}
                  onChange={(e) => setInputThemeColor(e.target.value)}
                  className="flex-1 p-3 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs outline-none focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Enable / Disable Gateway Toggle */}
          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <div>
              <span className="font-bold text-white block text-xs">Enable Razorpay Checkout</span>
              <span className="text-[11px] text-slate-400">
                When enabled, customers can check out using the online gateway.
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={inputEnabled}
                onChange={(e) => setInputEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-teal-400 text-white font-black text-xs shadow-xl hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Saving Configuration...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Payment Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
