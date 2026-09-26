import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { BUSINESS_CONFIG } from '@/constants/business';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowLeft,
  AlertCircle,
  KeyRound,
  CheckCircle2,
  RefreshCw,
  X
} from 'lucide-react';
import { requestPasswordReset, verifyAndResetPassword } from '@/services/api/auth';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, logout, isAuthenticated } = useAdminAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState<1 | 2 | 3>(1); // 1: Email, 2: OTP + New Pass, 3: Success
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetOtp, setResetOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [devOtpCode, setDevOtpCode] = useState<string | null>(null);
  const [forgotSuccessMsg, setForgotSuccessMsg] = useState<string | null>(null);

  const from = (location.state as any)?.from?.pathname || '/admin/dashboard';

  // If already logged in, redirect unless ?logout=true is passed
  useEffect(() => {
    if (location.search.includes('logout=true')) {
      logout();
      return;
    }
    if (isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate, location.search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    const res = await login(email, password);

    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setErrorMsg(res.error || 'Authentication failed. Please check credentials.');
    }
    setIsLoading(false);
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    setForgotLoading(true);
    setDevOtpCode(null);

    const res = await requestPasswordReset(forgotEmail);
    setForgotLoading(false);

    if (res.success) {
      if (res.devOtp) {
        setDevOtpCode(res.devOtp);
        setResetOtp(res.devOtp); // prefill for easy testing
      }
      setForgotSuccessMsg(res.message || 'Verification code dispatched.');
      setForgotStep(2);
    } else {
      setForgotError(res.error || 'Could not send verification code.');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);

    if (newPassword.length < 8) {
      setForgotError('Password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setForgotError('Passwords do not match. Please re-check.');
      return;
    }

    setForgotLoading(true);
    const res = await verifyAndResetPassword(forgotEmail, resetOtp, newPassword);
    setForgotLoading(false);

    if (res.success) {
      setForgotStep(3);
      // Auto-redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/admin/dashboard', { replace: true });
      }, 2000);
    } else {
      setForgotError(res.error || 'Failed to reset password. Please check your reset code.');
    }
  };

  const closeForgotModal = () => {
    setShowForgotModal(false);
    setForgotStep(1);
    setForgotError(null);
    setDevOtpCode(null);
    setResetOtp('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen bg-[#0C1015] text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden select-none">
      
      {/* Background Golden Radial Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C5A059]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#0D3B2E]/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Back Link */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-gray-400 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-full border border-white/10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Website</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        
        {/* Brand Emblem */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative mb-4">
            <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-[#DFD1BA] via-[#C5A059] to-[#997530] opacity-40 blur-md animate-pulse" />
            <div className="relative w-20 h-20 rounded-full bg-[#0D3B2E] border-2 border-[#C5A059] p-1.5 shadow-2xl flex items-center justify-center overflow-hidden">
              <img
                src={BUSINESS_CONFIG.logo}
                alt="Attri Nexus Logo"
                className="w-full h-full object-contain rounded-full bg-white"
              />
            </div>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-[0.2em] text-white">
            ATTRI NEXUS
          </h2>
          <p className="text-[11px] font-sans uppercase tracking-[0.3em] text-[#C5A059] font-medium mt-1">
            Executive Admin Portal
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-[#141B24]/95 backdrop-blur-xl py-8 px-6 sm:px-10 rounded-3xl border border-[#C5A059]/30 shadow-2xl relative">

          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start space-x-3 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Admin Email / Username
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="admin@attrinexus.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#0C1015] border border-white/15 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Password / Master Key
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-3 bg-[#0C1015] border border-white/15 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#DFD1BA] via-[#C5A059] to-[#997530] text-white font-bold text-xs uppercase tracking-widest shadow-lg hover:shadow-[#C5A059]/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? 'Verifying...' : 'Access Dashboard'}
              </button>
            </div>

            {/* Forgot Password Link right-aligned below button */}
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => {
                  setForgotEmail(email || '');
                  setForgotStep(1);
                  setForgotError(null);
                  setShowForgotModal(true);
                }}
                className="text-xs text-[#C5A059] hover:text-[#DFD1BA] transition-colors font-medium hover:underline cursor-pointer py-1"
              >
                Forgot Password?
              </button>
            </div>
          </form>

        </div>

        {/* Footer info */}
        <p className="text-center text-[10px] text-gray-500 tracking-wider mt-6">
          ATTRI NEXUS COMMERCIAL SUITE
        </p>

      </div>

      {/* FORGOT PASSWORD MODAL */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-[#141B24] border border-[#C5A059]/40 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
            
            {/* Top Close Button */}
            <button
              onClick={closeForgotModal}
              className="absolute top-5 right-5 text-gray-400 hover:text-white p-1 rounded-full bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059]">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-wide font-display">
                  Reset Admin Credentials
                </h3>
                <p className="text-xs text-gray-400">
                  Secure Administrative Account Recovery
                </p>
              </div>
            </div>

            {/* Error Message */}
            {forgotError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start space-x-2 text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{forgotError}</span>
              </div>
            )}

            {/* STEP 1: Enter Email */}
            {forgotStep === 1 && (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <p className="text-xs text-gray-300 leading-relaxed">
                  Enter your registered admin email address. A 6-digit verification code will be generated to authenticate your reset request.
                </p>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                    Admin Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      placeholder="admin@attrinexus.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-[#0C1015] border border-white/15 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#C5A059] transition-all"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#DFD1BA] via-[#C5A059] to-[#997530] text-white font-bold text-xs uppercase tracking-widest shadow-md hover:shadow-[#C5A059]/30 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer flex items-center justify-center space-x-2"
                  >
                    {forgotLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Sending Code...</span>
                      </>
                    ) : (
                      <span>Send Verification Code</span>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: Enter OTP & New Password */}
            {forgotStep === 2 && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                {forgotSuccessMsg && (
                  <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>{forgotSuccessMsg}</span>
                  </div>
                )}

                {/* Dev/Local OTP Banner */}
                {devOtpCode && (
                  <div className="p-3 rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/40 text-xs">
                    <div className="flex items-center justify-between text-[#DFD1BA] font-semibold mb-1">
                      <span>🔑 Verification Code:</span>
                      <span className="font-mono text-base tracking-widest text-[#C5A059] bg-[#0C1015] px-2 py-0.5 rounded border border-[#C5A059]/40">
                        {devOtpCode}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400">
                      Code is auto-filled for instant testing.
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    6-Digit Verification Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="123456"
                    value={resetOtp}
                    onChange={(e) => setResetOtp(e.target.value)}
                    className="w-full text-center tracking-[0.4em] font-mono text-lg py-2.5 bg-[#0C1015] border border-white/15 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#C5A059] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    New Master Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      placeholder="Minimum 8 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 bg-[#0C1015] border border-white/15 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#C5A059] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-3 text-gray-500 hover:text-gray-300"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      placeholder="Re-enter new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-[#0C1015] border border-white/15 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#C5A059] transition-all"
                    />
                  </div>
                </div>

                <div className="pt-2 flex flex-col space-y-2">
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#DFD1BA] via-[#C5A059] to-[#997530] text-white font-bold text-xs uppercase tracking-widest shadow-md hover:shadow-[#C5A059]/30 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer flex items-center justify-center space-x-2"
                  >
                    {forgotLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Updating Password...</span>
                      </>
                    ) : (
                      <span>Update Password & Enter</span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setForgotStep(1)}
                    className="text-center text-xs text-gray-400 hover:text-white transition-colors cursor-pointer py-1"
                  >
                    ← Change Email / Request New Code
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: Success State */}
            {forgotStep === 3 && (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 mx-auto flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20 animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-white font-display">
                  Password Updated Successfully!
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed max-w-xs mx-auto">
                  Your new master credentials are now active and you are automatically signed in. Redirecting to your Executive Dashboard...
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => navigate('/admin/dashboard', { replace: true })}
                    className="px-6 py-2.5 rounded-xl bg-[#C5A059] text-[#0C1015] font-bold text-xs uppercase tracking-wider hover:bg-[#DFD1BA] transition-all cursor-pointer"
                  >
                    Proceed Now →
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
