import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Lock, 
  KeyRound, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Compass, 
  ArrowLeft,
  Terminal,
  Cpu,
  UserCheck
} from 'lucide-react';
import { api } from '../api/client';

export function Login() {
  const navigate = useNavigate();

  // Mode: 'elite' (Standard Elite Access) or 'clearance' (Hidden Privileged Access)
  const [accessMode, setAccessMode] = useState('elite'); // 'elite' | 'clearance'
  const [clearanceRole, setClearanceRole] = useState('superadmin'); // 'superadmin' | 'mentor'

  // Elite Flow Steps: 1 = Identity, 2 = Password, 3 = OTP
  // Clearance Flow Steps: 1 = Clearance Credentials (Secret Key + Passkey), 2 = OTP
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Credentials
  const [identifier, setIdentifier] = useState(''); // Email or TS-ID
  const [validatedUser, setValidatedUser] = useState(null); // { fullName, maskedEmail, role, eliteId }
  const [password, setPassword] = useState('');

  // Clearance Credentials
  const [secretKey, setSecretKey] = useState('');
  const [passkey, setPasskey] = useState('');

  // OTP Challenge State
  const [challengeId, setChallengeId] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpLength, setOtpLength] = useState(8);
  const [devOtpHint, setDevOtpHint] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [expirySeconds, setExpirySeconds] = useState(300); // 5 minutes

  // Auto-check active session
  useEffect(() => {
    let isMounted = true;
    async function checkSession() {
      try {
        const res = await api.getSession();
        if (res?.data?.authenticated && res.data.user && isMounted) {
          navigate('/dashboard');
        }
      } catch (err) {
        // Not authenticated
      }
    }
    checkSession();
    return () => { isMounted = false; };
  }, [navigate]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // OTP Expiration countdown timer
  useEffect(() => {
    if (step === (accessMode === 'elite' ? 3 : 2) && expirySeconds > 0) {
      const timer = setTimeout(() => setExpirySeconds(expirySeconds - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [step, expirySeconds, accessMode]);

  // Format countdown
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  // Step 1: Validate Identity for Elite flow
  const handleValidateIdentity = async (e) => {
    e.preventDefault();
    if (!identifier.trim()) return;

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await api.validateIdentity(identifier.trim());
      if (res?.data?.exists) {
        setValidatedUser(res.data);
        setStep(2);
      } else {
        setErrorMessage(res?.message || 'Identity not recognized in authoritative directory');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Identity not recognized in authoritative directory');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Submit Password for Elite flow
  const handleElitePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!password) return;

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const result = await api.eliteLogin(identifier.trim(), password);
      if (result?.data?.challengeId) {
        setChallengeId(result.data.challengeId);
        setOtpLength(result.data.otpLength || 8);
        setDevOtpHint(result.data._devOtpHint || '');
        setStep(3);
        setResendCooldown(45);
        setExpirySeconds(300);
        setSuccessMessage('Single-use 8-character verification code sent to your registered email.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Authentication failed. Please verify your password.');
    } finally {
      setIsLoading(false);
    }
  };

  // Privileged Clearance Credentials Submit
  const handleClearanceSubmit = async (e) => {
    e.preventDefault();
    if (!secretKey || !passkey) return;

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      let result;
      if (clearanceRole === 'superadmin') {
        result = await api.superAdminClearanceLogin(secretKey.trim(), passkey);
      } else {
        result = await api.mentorClearanceLogin(secretKey.trim(), passkey);
      }

      if (result?.data?.challengeId) {
        setChallengeId(result.data.challengeId);
        setOtpLength(result.data.otpLength || 6);
        setDevOtpHint(result.data._devOtpHint || '');
        setStep(2);
        setResendCooldown(45);
        setExpirySeconds(300);
        setSuccessMessage('Privileged clearance challenge generated. Enter your verification code.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Clearance authorization rejected. Invalid security credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Submit OTP Verification (Both flows)
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otpCode.trim()) return;

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const result = await api.verifyOtp(challengeId, otpCode.trim().toUpperCase());
      if (result?.data?.sessionToken || result?.data?.user) {
        setSuccessMessage('Authentication verified successfully. Redirecting to command center...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 800);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Invalid or expired verification code.');
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setIsLoading(true);
    setErrorMessage('');

    try {
      const result = await api.resendOtp(challengeId);
      setResendCooldown(45);
      setExpirySeconds(300);
      if (result?.data?._devOtpHint) {
        setDevOtpHint(result.data._devOtpHint);
      }
      setSuccessMessage(result?.message || 'New verification code has been dispatched.');
    } catch (err) {
      setErrorMessage(err.message || 'Could not resend verification code.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="w-full min-h-screen bg-[#08070C] text-white pt-28 pb-24 flex flex-col items-center justify-center relative overflow-hidden select-none">
      {/* Background Architectural Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-20 border-x border-[#292132] max-w-7xl mx-auto" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#8000FF]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-md w-full px-4 relative z-10">
        {/* Brand Shield & Discreet Clearance Trigger */}
        <div className="text-center mb-8 flex flex-col items-center">
          <button
            type="button"
            onClick={() => {
              setErrorMessage('');
              setSuccessMessage('');
              setStep(1);
              setAccessMode(accessMode === 'elite' ? 'clearance' : 'elite');
            }}
            title={accessMode === 'elite' ? 'Privileged Clearance Access' : 'Return to Standard Elite Access'}
            className="group relative p-3 rounded-2xl bg-[#100D17] border border-[#292132] hover:border-[#8000FF] transition-all mb-4 focus:outline-none"
          >
            <Shield 
              size={28} 
              className={`transition-colors ${
                accessMode === 'clearance' ? 'text-[#8000FF]' : 'text-[#8CCF42] group-hover:text-white'
              }`} 
            />
            {/* Subtle glow dot */}
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#8CCF42] rounded-full ring-4 ring-[#08070C] animate-pulse" />
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#15111F] border border-[#292132] mb-3">
            <span className="font-mono text-[11px] font-bold text-[#8CCF42] tracking-widest uppercase">
              {accessMode === 'clearance' ? 'PRIVILEGED CLEARANCE PORTAL' : 'AUTHORITATIVE ELITE ACCESS'}
            </span>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            THREAD <span className="text-[#8000FF]">ELITE</span>
          </h1>
          <p className="text-xs text-[#898293] mt-1 font-sans">
            {accessMode === 'clearance' 
              ? 'Multi-factor privileged verification gateway'
              : 'Student Leadership Program · Learn · Execute · Lead · Grow'}
          </p>
        </div>

        {/* Global Notifications */}
        {errorMessage && (
          <div className="mb-6 p-3.5 rounded-xl bg-[#FF647B]/10 border border-[#FF647B]/50 flex items-start gap-3 text-xs text-[#FF647B]">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-3.5 rounded-xl bg-[#8CCF42]/10 border border-[#8CCF42]/50 flex items-start gap-3 text-xs text-[#8CCF42]">
            <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
            <span className="leading-relaxed">{successMessage}</span>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW A: STANDARD ELITE ACCESS FLOW                            */}
        {/* ============================================================== */}
        {accessMode === 'elite' && (
          <div className="bg-[#100D17] border border-[#292132] rounded-2xl p-6 sm:p-8 shadow-2xl relative">
            
            {/* STEP 1: IDENTITY INPUT */}
            {step === 1 && (
              <form onSubmit={handleValidateIdentity} className="space-y-5">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block font-mono text-[11px] font-bold text-[#C5BED0] uppercase tracking-wider">
                      EMAIL ADDRESS OR TS-ID
                    </label>
                    <span className="text-[10px] font-mono text-[#898293]">STEP 1 OF 3</span>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      autoFocus
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="Enter TS-ID or registered email"
                      className="w-full h-12 px-4 rounded-xl bg-[#15111F] border border-[#38264F] text-white text-sm focus:outline-none focus:border-[#8CCF42] focus:ring-1 focus:ring-[#8CCF42] shadow-sm transition-all"
                    />
                  </div>
                  <p className="text-[11px] text-[#898293] mt-2 font-sans">
                    Enter your official Thread Security identifier or registered academic email.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !identifier.trim()}
                  className="w-full h-12 rounded-xl bg-[#8000FF] hover:bg-[#7000E0] disabled:opacity-50 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {isLoading ? (
                    <RefreshCw size={16} className="animate-spin" />
                  ) : (
                    <>
                      <span>CONTINUE</span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>

                {/* Subtle Privileged Entry Switcher */}
                <div className="pt-4 border-t border-[#292132]/60 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setAccessMode('clearance');
                      setStep(1);
                      setErrorMessage('');
                    }}
                    className="text-[11px] font-mono text-[#898293] hover:text-[#BD7AFF] transition-colors"
                  >
                    Privileged Command & Operations Clearance &rarr;
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: PASSWORD INPUT */}
            {step === 2 && (
              <form onSubmit={handleElitePasswordSubmit} className="space-y-5">
                {/* Identified Cadet Banner */}
                <div className="p-3.5 rounded-xl bg-[#15111F] border border-[#292132] flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white">{validatedUser?.fullName || 'Elite Candidate'}</div>
                    <div className="text-[11px] font-mono text-[#898293]">{validatedUser?.maskedEmail}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setStep(1); setPassword(''); }}
                    className="p-1.5 rounded-lg text-[#898293] hover:text-white hover:bg-[#292132] transition-colors"
                    title="Change identity"
                  >
                    <ArrowLeft size={16} />
                  </button>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block font-mono text-[11px] font-bold text-[#C5BED0] uppercase tracking-wider">
                      ACCESS PASSWORD
                    </label>
                    <span className="text-[10px] font-mono text-[#898293]">STEP 2 OF 3</span>
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      autoFocus
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full h-12 px-4 rounded-xl bg-[#15111F] border border-[#38264F] text-white text-sm focus:outline-none focus:border-[#8CCF42] focus:ring-1 focus:ring-[#8CCF42] shadow-sm transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !password}
                  className="w-full h-12 rounded-xl bg-[#8000FF] hover:bg-[#7000E0] disabled:opacity-50 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {isLoading ? (
                    <RefreshCw size={16} className="animate-spin" />
                  ) : (
                    <>
                      <span>AUTHENTICATE</span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* STEP 3: 8-CHARACTER ALPHANUMERIC OTP */}
            {step === 3 && (
              <form onSubmit={handleOtpSubmit} className="space-y-5">
                <div className="text-center">
                  <div className="inline-flex p-3 rounded-full bg-[#8000FF]/10 border border-[#8000FF]/30 text-[#8000FF] mb-3">
                    <KeyRound size={22} />
                  </div>
                  <h3 className="text-base font-bold text-white mb-1">Verify Security Token</h3>
                  <p className="text-xs text-[#898293]">
                    Enter the 8-character code sent to <span className="text-[#C5BED0] font-mono">{validatedUser?.maskedEmail}</span>
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block font-mono text-[11px] font-bold text-[#C5BED0] uppercase tracking-wider">
                      8-CHARACTER OTP
                    </label>
                    <span className="text-[11px] font-mono text-[#8CCF42] font-bold">
                      Expires in {formatTime(expirySeconds)}
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    autoFocus
                    maxLength={8}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.toUpperCase())}
                    placeholder="e.g. K9F4T2W8"
                    className="w-full h-14 px-4 rounded-xl bg-[#15111F] border border-[#38264F] text-center font-mono text-xl tracking-[0.35em] uppercase text-[#8CCF42] focus:outline-none focus:border-[#8CCF42] focus:ring-1 focus:ring-[#8CCF42] shadow-sm transition-all"
                  />
                  <div className="flex items-center justify-between mt-2 text-[11px] text-[#898293] font-mono">
                    <span>MAX 5 ATTEMPTS</span>
                    <button
                      type="button"
                      disabled={resendCooldown > 0 || isLoading}
                      onClick={handleResendOtp}
                      className="text-[#BD7AFF] hover:underline disabled:opacity-50 cursor-pointer"
                    >
                      {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || otpCode.length < 8}
                  className="w-full h-12 rounded-xl bg-[#8000FF] hover:bg-[#7000E0] disabled:opacity-50 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {isLoading ? (
                    <RefreshCw size={16} className="animate-spin" />
                  ) : (
                    <>
                      <span>VERIFY & ENTER COMMAND CENTER</span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW B: PRIVILEGED CLEARANCE VERIFICATION FLOW                 */}
        {/* ============================================================== */}
        {accessMode === 'clearance' && (
          <div className="bg-[#100D17] border border-[#8000FF]/50 rounded-2xl p-6 sm:p-8 shadow-2xl relative">
            
            {/* Header with Clearance Role Toggle */}
            <div className="mb-6">
              <div className="grid grid-cols-2 gap-2 p-1 bg-[#15111F] rounded-xl border border-[#292132] mb-4">
                <button
                  type="button"
                  onClick={() => { setClearanceRole('superadmin'); setErrorMessage(''); }}
                  className={`py-2 text-[11px] font-mono font-bold uppercase rounded-lg transition-all text-center ${
                    clearanceRole === 'superadmin'
                      ? 'bg-[#8000FF] text-white shadow'
                      : 'text-[#898293] hover:text-white'
                  }`}
                >
                  Super Admin
                </button>
                <button
                  type="button"
                  onClick={() => { setClearanceRole('mentor'); setErrorMessage(''); }}
                  className={`py-2 text-[11px] font-mono font-bold uppercase rounded-lg transition-all text-center ${
                    clearanceRole === 'mentor'
                      ? 'bg-[#8000FF] text-white shadow'
                      : 'text-[#898293] hover:text-white'
                  }`}
                >
                  Task Mentor
                </button>
              </div>

              <div className="text-center">
                <h3 className="font-display text-lg font-bold text-white">
                  {clearanceRole === 'superadmin' 
                    ? 'Admin Clearance Verification' 
                    : 'Task Mentor Clearance Verification'}
                </h3>
                <p className="text-xs text-[#898293] font-mono mt-0.5">
                  {clearanceRole === 'superadmin'
                    ? 'Security & Master Platform Operations'
                    : 'Task Operations & Elite Development'}
                </p>
              </div>
            </div>

            {/* STEP 1: CLEARANCE CREDENTIALS */}
            {step === 1 && (
              <form onSubmit={handleClearanceSubmit} className="space-y-4">
                <div>
                  <label className="block font-mono text-[11px] font-bold text-[#C5BED0] uppercase tracking-wider mb-2">
                    SECRET KEY / IDENTITY *
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    placeholder="Enter clearance secret key"
                    className="w-full h-12 px-4 rounded-xl bg-[#15111F] border border-[#38264F] text-white text-sm focus:outline-none focus:border-[#8CCF42] focus:ring-1 focus:ring-[#8CCF42] shadow-sm transition-all"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[11px] font-bold text-[#C5BED0] uppercase tracking-wider mb-2">
                    MASTER PASSKEY / PASSWORD *
                  </label>
                  <input
                    type="password"
                    required
                    value={passkey}
                    onChange={(e) => setPasskey(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full h-12 px-4 rounded-xl bg-[#15111F] border border-[#38264F] text-white text-sm focus:outline-none focus:border-[#8CCF42] focus:ring-1 focus:ring-[#8CCF42] shadow-sm transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !secretKey || !passkey}
                  className="w-full h-12 rounded-xl bg-[#8000FF] hover:bg-[#7000E0] disabled:opacity-50 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer mt-2"
                >
                  {isLoading ? (
                    <RefreshCw size={16} className="animate-spin" />
                  ) : (
                    <>
                      <span>VERIFY CLEARANCE CREDENTIALS</span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>

                <div className="pt-4 border-t border-[#292132]/60 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setAccessMode('elite');
                      setStep(1);
                      setErrorMessage('');
                    }}
                    className="text-[11px] font-mono text-[#898293] hover:text-[#BD7AFF] transition-colors"
                  >
                    &larr; Return to Standard Elite Access
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: CLEARANCE OTP VERIFICATION */}
            {step === 2 && (
              <form onSubmit={handleOtpSubmit} className="space-y-5">
                <div className="text-center">
                  <div className="inline-flex p-3 rounded-full bg-[#8000FF]/10 border border-[#8000FF]/30 text-[#8000FF] mb-3">
                    <Shield size={22} />
                  </div>
                  <h3 className="text-base font-bold text-white mb-1">Enter Privileged Challenge OTP</h3>
                  <p className="text-xs text-[#898293]">
                    6-digit verification code sent to registered administrator mailbox.
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block font-mono text-[11px] font-bold text-[#C5BED0] uppercase tracking-wider">
                      6-DIGIT VERIFICATION CODE
                    </label>
                    <span className="text-[11px] font-mono text-[#8CCF42] font-bold">
                      {formatTime(expirySeconds)}
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    autoFocus
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.trim())}
                    placeholder="123456"
                    className="w-full h-14 px-4 rounded-xl bg-[#15111F] border border-[#38264F] text-center font-mono text-2xl tracking-[0.4em] text-[#8CCF42] focus:outline-none focus:border-[#8CCF42] focus:ring-1 focus:ring-[#8CCF42] shadow-sm transition-all"
                  />
                  <div className="flex items-center justify-between mt-2 text-[11px] text-[#898293] font-mono">
                    <span>MAX 5 ATTEMPTS</span>
                    <button
                      type="button"
                      disabled={resendCooldown > 0 || isLoading}
                      onClick={handleResendOtp}
                      className="text-[#BD7AFF] hover:underline disabled:opacity-50 cursor-pointer"
                    >
                      {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || otpCode.length < 6}
                  className="w-full h-12 rounded-xl bg-[#8000FF] hover:bg-[#7000E0] disabled:opacity-50 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {isLoading ? (
                    <RefreshCw size={16} className="animate-spin" />
                  ) : (
                    <>
                      <span>AUTHORIZE CLEARANCE ACCESS</span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}

      </div>
    </main>
  );
}

export default Login;
