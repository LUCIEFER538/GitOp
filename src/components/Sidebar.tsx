import React from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { ActivePage, ThemeAccent } from '../types';
import { ACCENT_THEMES } from '../utils/themeStyles';
import {
  LayoutDashboard,
  Home,
  FolderGit2,
  Sparkles,
  BarChart3,
  Music,
  Cpu,
  Layers,
  Shield,
  Calculator,
  User,
  Settings,
  Languages,
  ChevronLeft,
  ChevronRight,
  Github,
  Volume2,
  VolumeX,
  Palette,
  LogOut,
  LogIn,
  Film,
  TrendingUp,
  Code2,
  FolderKanban,
} from 'lucide-react';

interface NavItem {
  id: ActivePage;
  labelAr: string;
  labelEn: string;
  icon: React.ElementType;
  badge?: string;
  badgeType?: 'ai' | 'count' | 'pro';
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', labelAr: 'لوحة التحكم المخصصة', labelEn: 'User Dashboard', icon: LayoutDashboard, badge: 'User', badgeType: 'pro' },
  { id: 'video-studio', labelAr: 'استوديو الفيديو والمونتاج', labelEn: 'AI Video Studio', icon: Film, badge: 'New', badgeType: 'ai' },
  { id: 'media-studio', labelAr: 'استوديو الصور والأغاني WAV', labelEn: 'AI Music & 8K Images', icon: Music, badge: 'WAV', badgeType: 'ai' },
  { id: 'projects', labelAr: 'مستودعات جيثب والأكواد', labelEn: 'GitHub Repos & Code', icon: FolderGit2, badge: 'Code', badgeType: 'count' },
  { id: 'developer-api', labelAr: 'واجهات البرمجة ومفاتيح API', labelEn: 'Developer APIs & Keys', icon: Code2, badge: 'API', badgeType: 'pro' },
  { id: 'video-analytics', labelAr: 'تقارير أداء الفيديو الذكية', labelEn: 'Video Analytics & Reports', icon: TrendingUp, badge: 'BI', badgeType: 'pro' },
  { id: 'smart-cms', labelAr: 'إدارة المحتوى المخصص Smart CMS', labelEn: 'Personalized Smart CMS', icon: FolderKanban, badge: 'Vault', badgeType: 'count' },
  { id: 'ai-chat', labelAr: 'شات الذكاء المتعدد (GPT-4o)', labelEn: 'Multi-AI LLM Chat', icon: Sparkles, badge: 'AI', badgeType: 'ai' },
  { id: 'features-500', labelAr: 'مصفوفة الـ 500 ميزة', labelEn: '500+ Features Matrix', icon: Layers, badge: '500+', badgeType: 'count' },
  { id: 'ai-arsenal', labelAr: 'ترسانة الـ 100 أداة AI', labelEn: '100+ AI Tools Suite', icon: Cpu, badge: '100+', badgeType: 'ai' },
  { id: 'data-analytics', labelAr: 'تحليل البيانات الضخمة', labelEn: 'Smart Data Analytics', icon: BarChart3, badge: 'BI', badgeType: 'pro' },
  { id: 'cyber', labelAr: 'أدوات الأمن السيبراني', labelEn: 'Cyber Security Lab', icon: Shield },
  { id: 'productivity', labelAr: 'أدوات الإنتاجية والحاسبة', labelEn: 'Productivity & Tools', icon: Calculator },
  { id: 'settings', labelAr: 'إعدادات الحساب و 2FA', labelEn: 'Account & 2FA Security', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const {
    language,
    setLanguage,
    accent,
    setAccent,
    activePage,
    setActivePage,
    sidebarCollapsed,
    setSidebarCollapsed,
    mobileMenuOpen,
    setMobileMenuOpen,
    soundEnabled,
    toggleSound,
    t,
  } = useApp();

  const { user, setAuthModalOpen } = useAuth();
  const currentTheme = ACCENT_THEMES[accent];

  const handleNavClick = (id: ActivePage) => {
    setActivePage(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden animate-in fade-in"
        />
      )}

      {/* Main Sidebar Aside */}
      <aside
        className={`fixed top-0 bottom-0 z-40 bg-[#07090f]/95 border-slate-800/80 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between shadow-2xl ${
          language === 'ar'
            ? 'right-0 border-l'
            : 'left-0 border-r'
        } ${
          sidebarCollapsed ? 'w-20' : 'w-72'
        } ${
          mobileMenuOpen
            ? 'translate-x-0'
            : language === 'ar'
            ? 'translate-x-full lg:translate-x-0'
            : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header / Branding */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <div
            onClick={() => handleNavClick('dashboard')}
            className={`flex items-center gap-3 cursor-pointer group ${sidebarCollapsed ? 'mx-auto' : ''}`}
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-black text-white text-base shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform`}>
              OP
            </div>
            {!sidebarCollapsed && (
              <div>
                <h1 className="font-black text-sm tracking-wider text-white flex items-center gap-1.5">
                  <span>OPEBAT</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${currentTheme.badgeBg}`}>
                    v5.2
                  </span>
                </h1>
                <p className="text-[11px] text-slate-400 font-mono">
                  {t('محطة هندسة الذكاء الاصطناعي', 'AI Developer Suite')}
                </p>
              </div>
            )}
          </div>

          {!sidebarCollapsed && (
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors hidden lg:block"
            >
              {language === 'ar' ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Navigation Items List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin scrollbar-thumb-slate-800">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                title={t(item.labelAr, item.labelEn)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all relative ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-600/30 to-blue-600/10 text-cyan-300 border border-cyan-500/30 shadow-lg shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                } ${sidebarCollapsed ? 'justify-center px-0' : ''}`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                {!sidebarCollapsed && (
                  <span className="truncate flex-1 text-start">{t(item.labelAr, item.labelEn)}</span>
                )}
                {!sidebarCollapsed && item.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono uppercase ${
                      item.badgeType === 'ai'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : item.badgeType === 'pro'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom User Profile & Preferences */}
        <div className="p-3 border-t border-slate-800/80 space-y-3 bg-[#06080d]">
          {/* User Profile Card */}
          <div
            onClick={() => (user ? handleNavClick('settings') : setAuthModalOpen(true))}
            className={`p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all flex items-center gap-3 ${
              sidebarCollapsed ? 'justify-center p-2' : ''
            }`}
          >
            <div className="relative shrink-0">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={user?.name || 'Developer'}
                className="w-8 h-8 rounded-lg object-cover border border-cyan-500/40"
              />
              <span className="absolute -bottom-0.5 -end-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-[#06080d]" />
            </div>

            {!sidebarCollapsed && (
              <div className="truncate flex-1 text-start">
                <p className="text-xs font-bold text-white truncate">{user?.name || 'rluciefe@gmail.com'}</p>
                <p className="text-[10px] text-cyan-400 font-mono truncate">{user?.email || 'Logged In'}</p>
              </div>
            )}
          </div>

          {/* Controls: Language, Sound, Collapse */}
          <div className={`flex items-center justify-between gap-1 text-slate-400 ${sidebarCollapsed ? 'flex-col gap-2' : ''}`}>
            <button
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              title={t('تبديل اللغة', 'Toggle Language')}
              className="p-1.5 rounded-lg hover:text-white hover:bg-slate-800 text-xs font-mono font-bold"
            >
              {language === 'ar' ? 'EN' : 'عر'}
            </button>

            <button
              onClick={toggleSound}
              title={t('تشغيل/كتم المؤثرات', 'Toggle Audio')}
              className="p-1.5 rounded-lg hover:text-white hover:bg-slate-800"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

            <a
              href="https://github.com/GRYKJ249/OPEBAT-.git"
              target="_blank"
              rel="noreferrer"
              title="GitHub Repository"
              className="p-1.5 rounded-lg hover:text-white hover:bg-slate-800"
            >
              <Github className="w-4 h-4" />
            </a>

            {sidebarCollapsed && (
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 hidden lg:block"
              >
                {language === 'ar' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
