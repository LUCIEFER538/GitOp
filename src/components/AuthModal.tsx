import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { ACCENT_THEMES } from '../utils/themeStyles';
import {
  X,
  Mail,
  Lock,
  User,
  Shield,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  LogIn,
  UserPlus,
  KeyRound,
  RotateCcw,
  Film,
  Music,
  Code2,
  FolderGit2,
  Share2,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setAuthModalOpen,
    authMode,
    setAuthMode,
    login,
    register,
    socialLogin,
    verifyTwoFactor,
    requires2FA,
    setRequires2FA,
    pendingEmail,
    isLoading,
  } = useAuth();

  const { accent, t } = useApp();
  const currentTheme = ACCENT_THEMES[accent];

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('Senior Full Stack & AI Architect');
  const [twoFactorInput, setTwoFactorInput] = useState('');
  const [countdown, setCountdown] = useState(30);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // 30s timer for 2FA TOTP simulation
  useEffect(() => {
    if (!requires2FA) return;
    const interval = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? 30 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [requires2FA]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (requires2FA) {
      if (!twoFactorInput || twoFactorInput.length < 6) {
        setErrorMsg(t('يرجى إدخال رمز التحقق المكون من 6 أرقام', 'Please enter the 6-digit verification code'));
        return;
      }
      const res = await verifyTwoFactor(twoFactorInput);
      if (!res.success) {
        setErrorMsg(res.error || t('رمز التحقق غير صحيح، جرب 123456', 'Invalid code, try 123456'));
      }
      return;
    }

    if (!email || !password) {
      setErrorMsg(t('يرجى ملء جميع الحقول الإلزامية', 'Please fill in all required fields'));
      return;
    }

    if (authMode === 'login') {
      const result = await login(email, password);
      if (!result.success && !result.requires2FA) {
        setErrorMsg(result.error || t('فشل تسجيل الدخول، تحقق من البيانات', 'Login failed, check your credentials'));
      }
    } else {
      const result = await register(email, password, name, role);
      if (!result.success) {
        setErrorMsg(result.error || t('فشل إنشاء الحساب، يرجى المحاولة لاحقاً', 'Registration failed, please try again'));
      }
    }
  };

  const handleSocialAuth = async (provider: 'github' | 'google' | 'discord' | 'twitter') => {
    setErrorMsg(null);
    const res = await socialLogin(provider);
    if (!res.success) {
      setErrorMsg(res.error || t('فشل تسجيل الدخول عبر المزود', 'Social login failed'));
    }
  };

  const handleQuickDemoFill = () => {
    setEmail('rluciefe@gmail.com');
    setPassword('dev_secure_pass_123');
    setAuthMode('login');
    setRequires2FA(false);
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl bg-[#0b0f19] border border-slate-700/80 shadow-2xl overflow-hidden relative max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${currentTheme.badgeBg} flex items-center justify-center shadow-lg shadow-cyan-500/10`}>
              <Shield className={`w-5 h-5 ${currentTheme.textAccent}`} />
            </div>
            <div>
              <h3 className="font-black text-base text-white">
                {requires2FA
                  ? t('التحقق بخطوتين (2FA Security)', 'Two-Factor Authentication (2FA)')
                  : authMode === 'login'
                  ? t('تسجيل الدخول الموثق', 'Verified Developer Sign In')
                  : t('إنشاء حساب مطور احترافي', 'Create Pro Developer Account')}
              </h3>
              <p className="text-xs text-slate-400">
                {t('منصة OPEBAT لهندسة ومستودعات الذكاء الاصطناعي', 'OPEBAT AI Engineering & Code Workstation')}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setRequires2FA(false);
              setAuthModalOpen(false);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Benefits Strip */}
        <div className="bg-slate-950/70 border-b border-slate-800/80 px-6 py-2.5 flex items-center justify-between overflow-x-auto text-[11px] text-slate-300 gap-3 shrink-0">
          <span className="font-bold text-cyan-400 flex items-center gap-1 shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
            {t('مزايا العضوية المعتمدة:', 'Verified Member Perks:')}
          </span>
          <div className="flex items-center gap-2 text-slate-400 whitespace-nowrap">
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 flex items-center gap-1">
              <Film className="w-3 h-3 text-cyan-400" />
              {t('استوديو الفيديو', 'Video AI')}
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 flex items-center gap-1">
              <Music className="w-3 h-3 text-violet-400" />
              {t('تحميل أغانٍ WAV', 'WAV Music')}
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 flex items-center gap-1">
              <Code2 className="w-3 h-3 text-emerald-400" />
              {t('مفاتيح API', 'API Keys')}
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 flex items-center gap-1">
              <FolderGit2 className="w-3 h-3 text-amber-400" />
              {t('إنشاء ملفات Git', 'Git Commits')}
            </span>
          </div>
        </div>

        <div className="p-6 overflow-y-auto space-y-4">
          {/* Quick Demo Fill Box */}
          {!requires2FA && (
            <div className="p-3 rounded-2xl bg-cyan-950/30 border border-cyan-800/40 flex items-center justify-between">
              <div className="text-xs text-cyan-200">
                <span className="font-bold block text-white">{t('حساب المعمار المعتمد:', 'Authorized Architect Account:')}</span>
                <span className="text-cyan-300 font-mono text-[11px]">rluciefe@gmail.com</span>
              </div>
              <button
                type="button"
                onClick={handleQuickDemoFill}
                className="text-xs px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold border border-cyan-500/40 transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {t('تعبئة سريعة', 'Auto Fill Demo')}
              </button>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Social Logins */}
          {!requires2FA && (
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wider">
                {t('تسجيل الدخول السريع عبر الحسابات الرسمية', 'Fast 1-Click Social Sign In')}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => handleSocialAuth('github')}
                  className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <span className="w-4 h-4 rounded-full bg-white text-slate-900 flex items-center justify-center text-[10px] font-black">
                    GH
                  </span>
                  <span>GitHub</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialAuth('google')}
                  className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <span className="w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] font-black">
                    G
                  </span>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialAuth('discord')}
                  className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <span className="w-4 h-4 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px] font-black">
                    D
                  </span>
                  <span>Discord</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialAuth('twitter')}
                  className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <span className="w-4 h-4 rounded-full bg-slate-800 border border-slate-600 text-white flex items-center justify-center text-[10px] font-black">
                    X
                  </span>
                  <span>X / Twitter</span>
                </button>
              </div>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-[#0b0f19] text-slate-500 font-semibold">
                    {t('أو عبر البريد الإلكتروني المشفر', 'or via secure email')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {requires2FA ? (
              /* Two-Factor Authentication Screen */
              <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                    <KeyRound className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">
                      {t('أدخل رمز المصادقة الثنائية (TOTP)', 'Enter 6-Digit TOTP Code')}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {t(`تم إرسال الرمز أو جلبه من تطبيق المصادقة لحساب ${pendingEmail}`, `Code sent or generated for ${pendingEmail}`)}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                    <span>{t('رمز التحقق المكون من 6 أرقام', '6-Digit Security Code')}</span>
                    <span className="text-[11px] text-cyan-400 font-mono">
                      {t(`يتجدد خلال ${countdown} ثانية`, `Refreshes in ${countdown}s`)}
                    </span>
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={twoFactorInput}
                    onChange={(e) => setTwoFactorInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-center text-2xl font-mono tracking-[0.5em] text-white focus:outline-none focus:border-cyan-400 transition-colors"
                    autoFocus
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => setTwoFactorInput('123456')}
                    className="text-xs text-cyan-400 hover:text-cyan-300 underline font-mono"
                  >
                    {t('استخدم رمز الاختبار (123456)', 'Use demo code (123456)')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setRequires2FA(false)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    {t('العودة للوراء', 'Back to login')}
                  </button>
                </div>
              </div>
            ) : (
              /* Regular Login / Register Fields */
              <>
                {authMode === 'register' && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        {t('اسم المطور / العرض', 'Developer Display Name')}
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 absolute top-3.5 start-3 text-slate-500" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Luciefe"
                          className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-9 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        {t('التخصص الهندسي', 'Engineering Role / Title')}
                      </label>
                      <input
                        type="text"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        placeholder="e.g. Senior Bot & AI Architect"
                        className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {t('البريد الإلكتروني المعتمد', 'Authorized Developer Email')}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute top-3.5 start-3 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="developer@opebat.cloud"
                      className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-9 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors font-mono"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-300">
                      {t('كلمة المرور', 'Password')}
                    </label>
                    {authMode === 'login' && (
                      <span className="text-[11px] text-cyan-400 cursor-pointer hover:underline">
                        {t('نسيت كلمة المرور؟', 'Forgot password?')}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute top-3.5 start-3 text-slate-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-9 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-3 end-3 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all ${currentTheme.btnPrimary} disabled:opacity-50`}
            >
              {isLoading ? (
                <RotateCcw className="w-4 h-4 animate-spin" />
              ) : requires2FA ? (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>{t('تأكيد الدخول عبر التحقق بخطوتين', 'Verify & Complete Sign In')}</span>
                </>
              ) : authMode === 'login' ? (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>{t('تسجيل الدخول وتفعيل الصلاحيات', 'Sign In & Unlock Features')}</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>{t('إنشاء الحساب وتفعيل 2FA', 'Create Account & Enable 2FA')}</span>
                </>
              )}
            </button>
          </form>

          {/* Switch Mode Footer */}
          {!requires2FA && (
            <div className="text-center pt-2 border-t border-slate-800/80">
              {authMode === 'login' ? (
                <p className="text-xs text-slate-400">
                  {t('ليس لديك حساب مطور بعد؟', "Don't have a developer account yet?")}{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('register');
                      setErrorMsg(null);
                    }}
                    className="font-bold text-cyan-400 hover:underline ms-1"
                  >
                    {t('إنشاء حساب جديد مجاناً', 'Create one for free')}
                  </button>
                </p>
              ) : (
                <p className="text-xs text-slate-400">
                  {t('لديك حساب بالفعل؟', 'Already have an account?')}{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      setErrorMsg(null);
                    }}
                    className="font-bold text-cyan-400 hover:underline ms-1"
                  >
                    {t('تسجيل الدخول الآن', 'Sign in now')}
                  </button>
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
