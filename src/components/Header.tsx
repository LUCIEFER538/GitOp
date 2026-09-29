import React from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { ACCENT_THEMES } from '../utils/themeStyles';
import {
  Menu,
  Sparkles,
  Bot,
  Search,
  Volume2,
  VolumeX,
  Languages,
  Terminal,
  User,
  Shield,
  FolderGit2,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    language,
    setLanguage,
    accent,
    setAccent,
    setMobileMenuOpen,
    soundEnabled,
    toggleSound,
    setActivePage,
    t,
  } = useApp();

  const { user, setAuthModalOpen } = useAuth();
  const currentTheme = ACCENT_THEMES[accent];

  return (
    <header className="sticky top-0 z-30 bg-[#07090f]/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left / Start: Mobile Menu Toggle & Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            title="Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            onClick={() => setActivePage('dashboard')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-black text-xs group-hover:scale-105 transition-transform shadow-md shadow-cyan-500/20">
              OP
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm tracking-wider text-white">
                  OPEBAT
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
                  v5.2-hyper
                </span>
              </div>
              <p className="text-[10px] text-slate-400 -mt-0.5 truncate font-mono">
                {t('محطة هندسة الذكاء ومستكشف جيثب', 'AI Suite & GitHub Workstation')}
              </p>
            </div>
          </div>
        </div>

        {/* Center: Live Futuristic Marquee Ticker */}
        <div className="hidden md:flex flex-1 max-w-xl mx-4 overflow-hidden rounded-full bg-slate-900/80 border border-slate-800/90 py-1.5 px-4 text-xs text-slate-300 items-center gap-2">
          <span className="flex h-2 w-2 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <div className="overflow-hidden whitespace-nowrap w-full">
            <div className="inline-block animate-marquee text-[11px] font-mono text-slate-400">
              <span>🚀 OPEBAT v5.2 Active • 100+ AI Tools • Multi-LLM Chat (GPT-4o, Claude, DeepSeek) • Smart Data Analytics • Generative Music Synth • GitHub Code Explorer • Real Email Auth: rluciefe@gmail.com</span>
            </div>
          </div>
        </div>

        {/* Right / End: Quick Actions & User Badge */}
        <div className="flex items-center gap-2">
          {/* Theme Palette Quick Selector */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            {(
              [
                { id: 'cyan', color: '#22d3ee', name: 'Cyber' },
                { id: 'emerald', color: '#34d399', name: 'Emerald' },
                { id: 'matrix', color: '#22c55e', name: 'Matrix' },
                { id: 'violet', color: '#a78bfa', name: 'Violet' },
                { id: 'rose', color: '#fb7185', name: 'Rose' },
                { id: 'amber', color: '#fbbf24', name: 'Amber' },
                { id: 'solar', color: '#ef4444', name: 'Solar' },
                { id: 'obsidian', color: '#e2e8f0', name: 'Obsidian' },
              ] as const
            ).map((th) => (
              <button
                key={th.id}
                onClick={() => setAccent(th.id as any)}
                className={`w-5 h-5 rounded-full transition-transform ${
                  accent === th.id ? 'scale-125 ring-2 ring-white/60 shadow-lg' : 'opacity-60 hover:opacity-100 hover:scale-110'
                }`}
                style={{ backgroundColor: th.color }}
                title={`${th.name} Theme`}
              />
            ))}
          </div>

          {/* Audio Sound FX Toggle */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-xl border transition-all ${
              soundEnabled
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800'
            }`}
            title={soundEnabled ? t('كتم المؤثرات الصوتية', 'Mute Sound FX') : t('تشغيل المؤثرات الصوتية', 'Enable Sound FX')}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Quick AI Chat Launcher */}
          <button
            onClick={() => setActivePage('ai-chat')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 transition-all shadow-md shadow-cyan-500/10 active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{t('شات الذكاء', 'AI Chat')}</span>
          </button>

          {/* User Profile / Email Button */}
          {user ? (
            <button
              onClick={() => setActivePage('settings')}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 transition-colors"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-5 h-5 rounded-md object-cover border border-cyan-500/40"
              />
              <span className="hidden sm:inline font-mono text-[11px] text-cyan-300 truncate max-w-[120px]">
                {user.email}
              </span>
            </button>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-md shadow-cyan-600/20"
            >
              <User className="w-3.5 h-3.5" />
              <span>{t('تسجيل الدخول', 'Sign In')}</span>
            </button>
          )}

          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono font-bold text-slate-300 hover:text-white transition-colors"
            title={t('تبديل لغة الواجهة', 'Toggle Language')}
          >
            {language === 'ar' ? 'EN' : 'عر'}
          </button>
        </div>
      </div>
    </header>
  );
};
