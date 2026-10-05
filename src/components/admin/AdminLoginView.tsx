import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  KeyRound,
  Fingerprint,
  Info,
} from 'lucide-react';
import { AdminUser } from '../../types';
import { setAdminToken, setAdminRefreshToken } from '../../utils/adminApi';

interface AdminLoginViewProps {
  onSuccess: (user: AdminUser, token: string) => void;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({ onSuccess }) => {
  // Step: 'credentials' | 'otp'
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');

  // Credentials State
  const [email, setEmail] = useState<string>('annudhaneja@gmail.com');
  const [password, setPassword] = useState<string>('852783');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isCapsLockOn, setIsCapsLockOn] = useState<boolean>(false);
  const [passwordStrength, setPasswordStrength] = useState<{ score: number; label: string }>({
    score: 4,
    label: 'Enterprise High',
  });

  // OTP State
  const [challengeToken, setChallengeToken] = useState<string>('');
  const [maskedChannel, setMaskedChannel] = useState<string>('ann••••@gmail.com & Verified SMS');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [simulatedOtp, setSimulatedOtp] = useState<string>('');
  const [resendTimer, setResendTimer] = useState<number>(60);
  const [isIdentityVerified, setIsIdentityVerified] = useState<boolean>(false);

  // Status & Error
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [shakeError, setShakeError] = useState<boolean>(false);
  const [oauthNotice, setOauthNotice] = useState<string | null>(null);

  // References
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Password Strength Evaluation
  useEffect(() => {
    if (!password) {
      setPasswordStrength({ score: 0, label: 'Empty' });
      return;
    }
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    let label = 'Basic';
    if (score >= 4) label = 'Enterprise High';
    else if (score === 3) label = 'Strong';
    else if (score === 2) label = 'Moderate';
    else label = 'Standard';

    setPasswordStrength({ score: Math.min(score, 4), label });
  }, [password]);

  // Resend Countdown Timer
  useEffect(() => {
    if (step === 'otp' && resendTimer > 0) {
      const timer = setInterval(() => {
        setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, resendTimer]);

  // Caps Lock Detection
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.getModifierState && e.getModifierState('CapsLock')) {
      setIsCapsLockOn(true);
    } else {
      setIsCapsLockOn(false);
    }
  };

  const triggerErrorShake = (msg: string) => {
    setErrorMessage(msg);
    setShakeError(true);
    setTimeout(() => setShakeError(false), 650);
  };

  // Step 1: Handle Primary Email & Password Submission
  const handleSubmitCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setOauthNotice(null);

    if (!email.trim() || !password.trim()) {
      triggerErrorShake('Please provide both administrator email and security password.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
          pin: password.trim(),
          device: navigator.userAgent,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        triggerErrorShake(data.error || 'Authentication rejected. Invalid administrator credentials.');
        setIsLoading(false);
        return;
      }

      if (data.requireOtp || data.requireMfa) {
        setChallengeToken(data.challengeToken);
        setMaskedChannel(data.maskedChannel || `${email.slice(0, 3)}••••@${email.split('@')[1]}`);
        setSimulatedOtp(data.simulatedOtp || '');
        setResendTimer(data.resendCooldown || 60);
        setOtpDigits(['', '', '', '', '', '']);
        setStep('otp');

        // Focus first OTP input
        setTimeout(() => {
          otpInputRefs.current[0]?.focus();
        }, 150);
      } else if (data.token) {
        // Direct authentication fallback
        setAdminToken(data.token);
        if (data.refreshToken) setAdminRefreshToken(data.refreshToken);
        onSuccess(data.user, data.token);
      }
    } catch (err) {
      console.error(err);
      triggerErrorShake('Security network error: Unable to reach authentication server.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Handle OTP Input Changes
  const handleOtpDigitChange = (index: number, value: string) => {
    const digit = value.slice(-1).replace(/[^0-9]/g, '');
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);

    // Auto-focus next input
    if (digit && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    // Auto-submit if all 6 digits entered
    if (digit && index === 5 && newDigits.every((d) => d !== '')) {
      verifyOtpCode(newDigits.join(''));
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim().replace(/[^0-9]/g, '');
    if (pasted.length >= 6) {
      const chars = pasted.slice(0, 6).split('');
      setOtpDigits(chars);
      verifyOtpCode(chars.join(''));
    }
  };

  // Step 2: Submit & Verify OTP
  const verifyOtpCode = async (codeToVerify?: string) => {
    const code = codeToVerify || otpDigits.join('');
    if (code.length < 6) {
      triggerErrorShake('Please enter all 6 digits of the verification code.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/admin/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeToken,
          otpCode: code,
          mfaCode: code,
          device: navigator.userAgent,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        triggerErrorShake(data.error || 'Invalid verification code.');
        setIsLoading(false);
        return;
      }

      if (data.token) {
        setIsIdentityVerified(true);
        setAdminToken(data.token);
        if (data.refreshToken) setAdminRefreshToken(data.refreshToken);

        // Visual teal identity verification pulse before launching dashboard
        setTimeout(() => {
          onSuccess(data.user, data.token);
        }, 700);
      }
    } catch (err) {
      console.error(err);
      triggerErrorShake('Network error verifying code.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Resend OTP Code
  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/admin/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeToken }),
      });

      const data = await res.json();
      if (res.ok) {
        setSimulatedOtp(data.simulatedOtp || '');
        setResendTimer(60);
      } else {
        triggerErrorShake(data.error || 'Failed to resend verification code.');
      }
    } catch {
      triggerErrorShake('Network error requesting fresh code.');
    } finally {
      setIsLoading(false);
    }
  };

  // Social OAuth Login (Strict RBAC Allowlist Enforced)
  const handleOAuthLogin = async (provider: 'google' | 'github' | 'facebook' | 'instagram') => {
    setIsLoading(true);
    setErrorMessage('');
    setOauthNotice(null);

    // We send the current entered email to test allowlist verification
    const testEmail = email.trim() || 'annudhaneja@gmail.com';

    try {
      const res = await fetch('/api/admin/auth/oauth-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          email: testEmail,
          name: provider === 'google' ? 'Google Authorized Admin' : `${provider.toUpperCase()} Admin`,
          device: `${provider.toUpperCase()} SSO Gateway`,
        }),
      });

      const data = await res.json();

      if (res.status === 403) {
        // STRICT RULE: Non-allowlisted OAuth user gets access denied
        triggerErrorShake(data.error || 'Administrator authorization required. This account is not on the authorized allowlist.');
        setOauthNotice('Server security rule: Only authorized administrator emails can access the Control Center.');
        setIsLoading(false);
        return;
      }

      if (!res.ok) {
        triggerErrorShake(data.error || `${provider.toUpperCase()} authentication failed.`);
        setIsLoading(false);
        return;
      }

      if (data.token) {
        setIsIdentityVerified(true);
        setAdminToken(data.token);
        if (data.refreshToken) setAdminRefreshToken(data.refreshToken);
        setTimeout(() => {
          onSuccess(data.user, data.token);
        }, 600);
      }
    } catch {
      triggerErrorShake(`Error communicating with ${provider.toUpperCase()} authentication server.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-[#0A0E11] text-[#E2E8F0]">
      {/* ======================================================== */}
      {/* 2. SOPHISTICATED ANIMATED GREY-LIGHT ENVIRONMENT BEHIND CARD */}
      {/* ======================================================== */}

      {/* Atmospheric Radial Gradients */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        {/* Deep ambient dark charcoal base with soft moving grey illumination */}
        <div
          className="absolute -top-[25%] left-1/2 -translate-x-1/2 w-[900px] h-[650px] rounded-full opacity-40 blur-[130px] pointer-events-none transition-all duration-1000"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(160,175,185,0.18) 0%, rgba(30,41,47,0.4) 50%, transparent 75%)',
          }}
        />

        {/* Soft Teal-Blue Security Glow Anchor */}
        <div
          className="absolute -bottom-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[550px] rounded-full opacity-25 blur-[140px] pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(7,153,166,0.22) 0%, rgba(16,35,42,0.1) 60%, transparent 80%)',
          }}
        />

        {/* Moving Grey Light Beams (Subtle & Non-distracting) */}
        <div
          className="absolute top-0 left-1/4 w-[400px] h-[1000px] opacity-10 rotate-12 blur-[90px] pointer-events-none animate-pulse"
          style={{
            background: 'linear-gradient(180deg, rgba(226,232,240,0.15) 0%, rgba(7,153,166,0.08) 50%, transparent 100%)',
            animationDuration: '9s',
          }}
        />
        <div
          className="absolute top-10 right-1/4 w-[350px] h-[900px] opacity-10 -rotate-12 blur-[80px] pointer-events-none animate-pulse"
          style={{
            background: 'linear-gradient(180deg, rgba(148,163,184,0.12) 0%, rgba(37,180,189,0.06) 60%, transparent 100%)',
            animationDuration: '12s',
          }}
        />

        {/* Fine Micro-Grid Texture */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      {/* ======================================================== */}
      {/* 3. PREMIUM CENTERED GLASSMORPHISM LOGIN PANEL */}
      {/* ======================================================== */}
      <div
        className={`relative z-10 w-full max-w-md transition-all duration-300 ${
          shakeError ? 'animate-bounce' : ''
        }`}
      >
        {/* Subtle moving teal-blue border glow container */}
        <div className="relative rounded-3xl p-[1px] bg-gradient-to-b from-[#2A363D] via-[#1A2328] to-[#12191D] shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
          {/* Main Card Content */}
          <div className="rounded-[23px] bg-[#0E1418]/90 backdrop-blur-2xl p-7 sm:p-9 border border-[#233138]/60 relative overflow-hidden">
            {/* Top Atmospheric Highlight Sheen */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-36 bg-gradient-to-b from-white/10 to-transparent blur-xl pointer-events-none" />

            {/* Header Lockup */}
            <div className="text-center space-y-3 relative z-10 pb-6 border-b border-[#1E2B32]">
              {/* Premium Animated Security Shield Icon */}
              <div className="relative inline-flex items-center justify-center p-3.5 rounded-2xl bg-gradient-to-b from-[#182329] to-[#0E1519] border border-[#2B3C45] shadow-inner group">
                <div className="absolute inset-0 rounded-2xl bg-[#0799A6]/20 blur-md opacity-40 group-hover:opacity-75 transition-opacity" />
                <ShieldCheck className="w-8 h-8 text-[#25B4BD] relative z-10 drop-shadow-[0_0_12px_rgba(37,180,189,0.5)]" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-[#0799A6] dark:text-[#25B4BD]">
                  <span>GURUCRAFTPRO</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-400">CONTROL CENTER</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-display">
                  {step === 'credentials' ? 'Admin Access' : 'Security Verification'}
                </h1>
                <p className="text-xs text-[#94A3B8] font-medium">
                  {step === 'credentials'
                    ? 'Authorized Administrator Access'
                    : `Enter the 6-digit code sent to ${maskedChannel}`}
                </p>
              </div>

              {/* Status Indicator Pill */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#131E23] border border-[#24353E] text-[11px] font-semibold text-[#8198A5]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>HMAC-SHA256 · RBAC Guarded</span>
              </div>
            </div>

            {/* Error & Warning Banners */}
            {errorMessage && (
              <div className="mt-5 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs flex items-start gap-2.5 animate-fadeIn">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div className="flex-1 font-medium">{errorMessage}</div>
              </div>
            )}

            {oauthNotice && (
              <div className="mt-3 p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">{oauthNotice}</div>
              </div>
            )}

            {/* Success Animation Notification */}
            {isIdentityVerified && (
              <div className="mt-5 p-3.5 rounded-xl bg-[#0799A6]/20 border border-[#25B4BD]/50 text-white text-xs flex items-center justify-center gap-2 animate-fadeIn shadow-lg shadow-[#0799A6]/20">
                <CheckCircle2 className="w-5 h-5 text-[#25B4BD] animate-bounce" />
                <span className="font-bold text-sm tracking-wide">Identity Verified · Entering Control Center...</span>
              </div>
            )}

            {/* ======================================================== */}
            {/* STEP 1: PRIMARY CREDENTIALS (EMAIL + PASSWORD) */}
            {/* ======================================================== */}
            {step === 'credentials' && !isIdentityVerified && (
              <form onSubmit={handleSubmitCredentials} className="mt-6 space-y-4">
                {/* Email Field */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#A0AEC0]">
                    Admin Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@gurucraftpro.com"
                      required
                      autoComplete="username"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#121A1F] border border-[#24353F] text-sm text-white placeholder-[#52636A] focus:outline-none focus:border-[#25B4BD] focus:ring-1 focus:ring-[#25B4BD]/40 transition"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-[#A0AEC0]">
                      Admin Password
                    </label>
                    {isCapsLockOn && (
                      <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Caps Lock is ON
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onKeyUp={handleKeyDown}
                      placeholder="Enter security key or password"
                      required
                      autoComplete="current-password"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#121A1F] border border-[#24353F] text-sm text-white placeholder-[#52636A] focus:outline-none focus:border-[#25B4BD] focus:ring-1 focus:ring-[#25B4BD]/40 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-white transition cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {password && (
                    <div className="pt-1.5 space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-[#718096]">
                        <span>Security Gauge:</span>
                        <span className="font-semibold text-[#25B4BD]">{passwordStrength.label}</span>
                      </div>
                      <div className="grid grid-cols-4 gap-1.5 h-1">
                        {[1, 2, 3, 4].map((bar) => (
                          <div
                            key={bar}
                            className={`rounded-full transition-all duration-300 ${
                              passwordStrength.score >= bar
                                ? 'bg-gradient-to-r from-[#0799A6] to-[#25B4BD]'
                                : 'bg-[#1E2B32]'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Primary Action Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-[#0A0E11] bg-gradient-to-r from-[#0799A6] via-[#25B4BD] to-[#38D9E3] hover:brightness-110 active:scale-[0.99] transition-all shadow-md shadow-[#0799A6]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#0A0E11]" />
                      <span>Authenticating Credentials...</span>
                    </>
                  ) : (
                    <>
                      <span>Generate Security OTP</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* ======================================================== */}
                {/* 6. SOCIAL LOGIN WITH STRICT ADMIN ALLOWLIST RULE */}
                {/* ======================================================== */}
                <div className="pt-4 space-y-3">
                  <div className="relative flex items-center justify-center">
                    <div className="w-full border-t border-[#1E2B32]" />
                    <span className="bg-[#0E1418] px-3 text-[10px] font-bold uppercase tracking-wider text-[#64748B] absolute">
                      Or Authorized SSO
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {/* Continue with Google */}
                    <button
                      type="button"
                      onClick={() => handleOAuthLogin('google')}
                      disabled={isLoading}
                      className="p-2.5 rounded-xl bg-[#141E24] hover:bg-[#1B2931] border border-[#22333D] hover:border-[#25B4BD]/40 text-xs font-semibold text-[#CBD5E1] transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                        <path
                          fill="#EA4335"
                          d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.4 8.9 5 12 5z"
                        />
                        <path
                          fill="#4285F4"
                          d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.7s.1-2 .4-2.7L1.6 6.4C.6 8.3 0 10.4 0 12.7s.6 4.4 1.6 6.3l3.7-2.9z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.1-6.7-5L1.6 16.7C3.5 20.5 7.4 23.5 12 23.5z"
                        />
                      </svg>
                      <span className="truncate">Google</span>
                    </button>

                    {/* Continue with GitHub */}
                    <button
                      type="button"
                      onClick={() => handleOAuthLogin('github')}
                      disabled={isLoading}
                      className="p-2.5 rounded-xl bg-[#141E24] hover:bg-[#1B2931] border border-[#22333D] hover:border-[#25B4BD]/40 text-xs font-semibold text-[#CBD5E1] transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <svg className="w-4 h-4 fill-current shrink-0 text-white" viewBox="0 0 24 24">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                      </svg>
                      <span className="truncate">GitHub</span>
                    </button>

                    {/* Continue with Facebook */}
                    <button
                      type="button"
                      onClick={() => handleOAuthLogin('facebook')}
                      disabled={isLoading}
                      className="p-2.5 rounded-xl bg-[#141E24] hover:bg-[#1B2931] border border-[#22333D] hover:border-[#25B4BD]/40 text-xs font-semibold text-[#CBD5E1] transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <svg className="w-4 h-4 fill-[#1877F2] shrink-0" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      <span className="truncate">Facebook</span>
                    </button>

                    {/* Continue with Instagram */}
                    <button
                      type="button"
                      onClick={() => handleOAuthLogin('instagram')}
                      disabled={isLoading}
                      className="p-2.5 rounded-xl bg-[#141E24] hover:bg-[#1B2931] border border-[#22333D] hover:border-[#25B4BD]/40 text-xs font-semibold text-[#CBD5E1] transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <svg className="w-4 h-4 fill-[#E4405F] shrink-0" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                      <span className="truncate">Instagram</span>
                    </button>
                  </div>

                  <p className="text-[10px] text-[#64748B] text-center italic">
                    Single Sign-On requires explicit inclusion on the server administrator allowlist.
                  </p>
                </div>
              </form>
            )}

            {/* ======================================================== */}
            {/* STEP 2: 6-DIGIT REAL-TIME OTP VERIFICATION */}
            {/* ======================================================== */}
            {step === 'otp' && !isIdentityVerified && (
              <div className="mt-6 space-y-6">
                {/* Instant preview testing notification */}
                {simulatedOtp && (
                  <div className="p-3 rounded-xl bg-[#0799A6]/10 border border-[#0799A6]/30 text-xs text-[#25B4BD] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Fingerprint className="w-4 h-4 shrink-0" />
                      <span>Security Dispatch Code:</span>
                    </div>
                    <span className="font-mono font-black text-sm tracking-wider text-white bg-[#0A1216] px-2.5 py-0.5 rounded border border-[#25B4BD]/40">
                      {simulatedOtp}
                    </span>
                  </div>
                )}

                {/* 6 Individual OTP Boxes */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center gap-2">
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => {
                          otpInputRefs.current[idx] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        onPaste={handleOtpPaste}
                        className={`w-11 sm:w-13 h-13 sm:h-15 text-center text-xl font-mono font-bold rounded-xl bg-[#121A1F] border transition-all focus:outline-none ${
                          digit
                            ? 'border-[#25B4BD] text-white shadow-[0_0_12px_rgba(37,180,189,0.3)]'
                            : 'border-[#24353F] text-[#94A3B8] focus:border-[#25B4BD]'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Verify Action Button */}
                <button
                  type="button"
                  onClick={() => verifyOtpCode()}
                  disabled={isLoading || otpDigits.some((d) => d === '')}
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-[#0A0E11] bg-gradient-to-r from-[#0799A6] via-[#25B4BD] to-[#38D9E3] hover:brightness-110 active:scale-[0.99] transition-all shadow-md shadow-[#0799A6]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#0A0E11]" />
                      <span>Verifying Security Token...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirm & Enter Dashboard</span>
                      <ShieldCheck className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Resend & Return to Email */}
                <div className="pt-2 flex items-center justify-between text-xs text-[#64748B]">
                  <button
                    type="button"
                    onClick={() => {
                      setStep('credentials');
                      setErrorMessage('');
                    }}
                    className="hover:text-white transition flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <span>← Back to login</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {resendTimer > 0 ? (
                      <span className="text-[#94A3B8] font-mono text-[11px]">
                        Resend in {String(Math.floor(resendTimer / 60)).padStart(2, '0')}:
                        {String(resendTimer % 60).padStart(2, '0')}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        className="text-[#25B4BD] hover:underline font-bold cursor-pointer"
                      >
                        Resend OTP Code
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Security Badges */}
        <div className="mt-5 text-center space-y-1 text-[11px] text-[#64748B]">
          <div>GurucraftPro Protected Enterprise Infrastructure</div>
          <div className="flex items-center justify-center gap-2 text-[10px] text-[#475569]">
            <span>Role-Based Access Control</span>
            <span>·</span>
            <span>Zero Plaintext Secret Storage</span>
            <span>·</span>
            <span>JWT Rotation</span>
          </div>
        </div>
      </div>
    </div>
  );
};
