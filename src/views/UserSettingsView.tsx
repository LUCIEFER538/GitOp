import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { ACCENT_THEMES } from '../utils/themeStyles';
import {
  User,
  Mail,
  Shield,
  Github,
  Key,
  LogOut,
  Check,
  Save,
  Sparkles,
  Award,
  Layers,
  Activity,
  Terminal,
} from 'lucide-react';

export const UserSettingsView: React.FC = () => {
  const { accent, t } = useApp();
  const { user, updateProfile, logout, setAuthModalOpen } = useAuth();
  const currentTheme = ACCENT_THEMES[accent];

  const [name, setName] = useState(user?.name || '');
  const [role, setRole] = useState(user?.role || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [githubUsername, setGithubUsername] = useState(user?.githubUsername || 'GRYKJ249');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await updateProfile({
      name,
      role,
      bio,
      githubUsername,
      avatar,
    });
    setSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase ${currentTheme.badgeBg}`}>
            Account & Security
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 mt-1">
            <User className="w-6 h-6 text-cyan-400" />
            {t('إعدادات الحساب والملف الشخصي', 'User Profile & Security Settings')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {t('إدارة بيانات المطور، الجلسات النشطة، والربط مع مستودعات GitHub.', 'Manage developer credentials, API tokens, and linked GitHub account.')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <button
              onClick={logout}
              className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold border border-rose-500/30 flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>{t('تسجيل الخروج', 'Sign Out')}</span>
            </button>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <User className="w-4 h-4" />
              <span>{t('تسجيل الدخول بالبريد', 'Email Login')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Settings Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Badges */}
        <div className="p-6 rounded-2xl bg-[#0b0f19] border border-slate-800 shadow-xl flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <img
              src={avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={name || 'Avatar'}
              className="w-24 h-24 rounded-2xl object-cover border-2 border-cyan-500/50 shadow-xl shadow-cyan-500/10"
            />
            <span className="absolute -bottom-1 -end-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#0b0f19] flex items-center justify-center">
              <Check className="w-3 h-3 text-white" />
            </span>
          </div>

          <div>
            <h3 className="font-bold text-base text-white">{name || 'Developer'}</h3>
            <p className="text-xs text-slate-400">{role || 'Full Stack Architect'}</p>
            <span className="inline-block mt-2 font-mono text-[11px] bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-cyan-300">
              {user?.email || 'rluciefe@gmail.com'}
            </span>
          </div>

          <div className="w-full pt-4 border-t border-slate-800 space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between text-slate-400">
              <span>{t('الشارة البرمجية:', 'Badge:')}</span>
              <span className="text-emerald-400 font-bold">{user?.badge || 'OPEBAT Lead Pro'}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>{t('تاريخ الانضمام:', 'Joined:')}</span>
              <span className="text-slate-300">{user?.joinedDate || '2024-01-15'}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>{t('رصيد الذكاء الاصطناعي:', 'Credits:')}</span>
              <span className="text-cyan-400 font-bold">{(user?.credits || 50000).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Editable Profile Fields */}
        <div className="md:col-span-2 p-6 rounded-2xl bg-[#0b0f19] border border-slate-800 shadow-xl">
          <form onSubmit={handleSave} className="space-y-4">
            {saveSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>{t('تم تحديث الملف الشخصي بنجاح!', 'Profile updated successfully!')}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {t('اسم المطور / العرض (Display Name):', 'Display Name:')}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {t('التخصص والمسمى الوظيفي (Title & Role):', 'Title & Specialization:')}
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {t('اسم مستخدم GitHub:', 'GitHub Username:')}
              </label>
              <div className="relative">
                <Github className="w-4 h-4 absolute top-2.5 start-3 text-slate-500" />
                <input
                  type="text"
                  value={githubUsername}
                  onChange={(e) => setGithubUsername(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2 ps-9 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {t('رابط الصورة الرمزية (Avatar URL):', 'Avatar URL:')}
              </label>
              <input
                type="text"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {t('النبذة الشخصية (Bio):', 'Bio / Summary:')}
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-xs text-slate-100 leading-relaxed focus:outline-none focus:border-cyan-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="py-2.5 px-6 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? t('جاري الحفظ...', 'Saving...') : t('حفظ التعديلات', 'Save Changes')}</span>
            </button>
          </form>
        </div>
      </div>

      {/* Two-Factor Authentication & Social Security Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 2FA Card */}
        <div className="p-6 rounded-3xl bg-[#0b0f19] border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-sm text-white">
                {t('التحقق بخطوتين (2FA Security)', 'Two-Factor Authentication (2FA)')}
              </h3>
            </div>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
              user?.twoFactorEnabled ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
            }`}>
              {user?.twoFactorEnabled ? t('مفعل ومحمي', 'Enabled & Protected') : t('غير مفعل', 'Disabled')}
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            {t(
              'حماية حسابك البرمجي ومفاتيح API برمز تحقق سري يتجدد كل 30 ثانية لمنع الوصول غير المصرح به.',
              'Require a 6-digit TOTP security code upon sign in to safeguard your repositories and API keys.'
            )}
          </p>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-slate-400">TOTP Secret Key:</span>
              <strong className="text-cyan-300">OPB2FA-9921-XRT4</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Algorithm:</span>
              <span className="text-white">HMAC-SHA1 (RFC 6238)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Emergency Backup Code:</span>
              <strong className="text-emerald-400">842-195-301</strong>
            </div>
          </div>

          <button
            onClick={() => {
              if (user) {
                updateProfile({ twoFactorEnabled: !user.twoFactorEnabled });
              }
            }}
            className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              user?.twoFactorEnabled
                ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20'
            }`}
          >
            <span>{user?.twoFactorEnabled ? t('تعطيل التحقق بخطوتين', 'Disable 2FA') : t('تفعيل التحقق بخطوتين الآن', 'Enable 2FA Now')}</span>
          </button>
        </div>

        {/* Linked Social Accounts */}
        <div className="p-6 rounded-3xl bg-[#0b0f19] border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-sm text-white">
              {t('حسابات السوشيال ميديا المربوطة', 'Connected Social Accounts')}
            </h3>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            {t(
              'تسجيل الدخول ومزامنة بيانات المطور مع حسابات الشبكات الاجتماعية المعتمدة.',
              'Sign in instantly and synchronize your profile with verified social accounts.'
            )}
          </p>

          <div className="space-y-2.5">
            {[
              { provider: 'GitHub', username: user?.githubUsername || 'GRYKJ249', linked: true, color: 'text-white' },
              { provider: 'Google Cloud', username: user?.email || 'rluciefe@gmail.com', linked: true, color: 'text-red-400' },
              { provider: 'Discord', username: 'luciefe_architect#249', linked: Boolean(user?.socialProvider === 'discord'), color: 'text-indigo-400' },
              { provider: 'X / Twitter', username: '@luciefe_dev', linked: Boolean(user?.socialProvider === 'twitter'), color: 'text-sky-400' },
            ].map((soc) => (
              <div
                key={soc.provider}
                className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className={`font-bold ${soc.color}`}>{soc.provider}</span>
                  <span className="text-slate-400 font-mono text-[11px] truncate max-w-[150px]">{soc.username}</span>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                  soc.linked ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-500'
                }`}>
                  {soc.linked ? t('مرتبط وموثق', 'Connected') : t('غير مرتبط', 'Link')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
