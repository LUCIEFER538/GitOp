import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { ACCENT_THEMES } from '../utils/themeStyles';
import { Lock, Shield, Sparkles, LogIn, ArrowRight } from 'lucide-react';

interface ProtectedFeatureProps {
  children: React.ReactNode;
  featureTitle: string;
  featureTitleAr: string;
  featureDescAr?: string;
  featureDescEn?: string;
  requiredRole?: string;
}

export const ProtectedFeature: React.FC<ProtectedFeatureProps> = ({
  children,
  featureTitle,
  featureTitleAr,
  featureDescAr,
  featureDescEn,
}) => {
  const { isAuthenticated, setAuthModalOpen, setAuthMode } = useAuth();
  const { accent, t } = useApp();
  const currentTheme = ACCENT_THEMES[accent];

  if (isAuthenticated) {
    return <>{children}</>;
  }

  const handleOpenLogin = () => {
    setAuthMode('login');
    setAuthModalOpen(true);
  };

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#090d16] p-6 shadow-2xl">
      {/* Blurred teaser background of child content */}
      <div className="filter blur-md opacity-25 pointer-events-none select-none max-h-72 overflow-hidden">
        {children}
      </div>

      {/* Lock overlay banner */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-t from-[#090d16] via-[#090d16]/90 to-transparent">
        <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-3 shadow-lg shadow-cyan-500/10 animate-bounce">
          <Lock className="w-7 h-7 text-cyan-400" />
        </div>

        <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 mb-2">
          {t('ميزة مقفلة للأعضاء المسجلين', 'Member-Exclusive Feature')}
        </span>

        <h3 className="text-lg sm:text-xl font-black text-white mb-2 max-w-md">
          {t(featureTitleAr, featureTitle)}
        </h3>

        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mb-5">
          {featureDescAr
            ? t(featureDescAr, featureDescEn || 'Sign in to your verified developer account to unlock full access.')
            : t(
                'للوصول إلى هذه الأداة الفائقة وحفظ إعداداتك ومشاريعك واستخدام نماذج الذكاء الاصطناعي بدقة عالية، يرجى تسجيل الدخول أو إنشاء حساب مطور مجاني.',
                'Sign in to your verified developer account to unlock full generative capabilities, custom API keys, and workspace persistence.'
              )}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleOpenLogin}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${currentTheme.btnPrimary}`}
          >
            <LogIn className="w-4 h-4" />
            <span>{t('تسجيل الدخول الآن لفتح الميزة', 'Sign In to Unlock')}</span>
          </button>
          <button
            onClick={() => {
              setAuthMode('register');
              setAuthModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl font-semibold text-xs text-slate-300 hover:text-white bg-slate-900 border border-slate-700/80 hover:bg-slate-800 transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t('إنشاء حساب مطور مجاناً', 'Create Free Account')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
