import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { ACCENT_THEMES } from '../utils/themeStyles';
import { PROJECTS_DATA } from '../data/projectsData';
import {
  Sparkles,
  Cpu,
  BarChart3,
  Music,
  Image,
  Shield,
  Clock,
  Terminal,
  FileCode,
  Zap,
  Bookmark,
  Activity,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  FolderGit2,
  Calendar,
  Layers,
  Flame,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { accent, t, setActivePage, setSelectedProject } = useApp();
  const { user, setAuthModalOpen } = useAuth();
  const currentTheme = ACCENT_THEMES[accent];

  const [currentTime, setCurrentTime] = useState(new Date());
  const [scratchpadNote, setScratchpadNote] = useState(() => {
    return localStorage.getItem('opebat_scratchpad') || 'OPEBAT Dev Notes:\n- Train multi-agent pipeline\n- Benchmark DeepSeek R1 token latency\n- Test Web Audio synth audio frequency filters';
  });
  const [isSavedNote, setIsSavedNote] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSaveNote = (text: string) => {
    setScratchpadNote(text);
    localStorage.setItem('opebat_scratchpad', text);
    setIsSavedNote(true);
    setTimeout(() => setIsSavedNote(false), 1500);
  };

  // Activity heatmap data (365 days / 52 weeks simulation)
  const activityWeeks = Array.from({ length: 24 }).map((_, wIdx) => {
    return Array.from({ length: 7 }).map((_, dIdx) => {
      const level = Math.floor(Math.random() * 5); // 0 to 4
      return { day: dIdx, level };
    });
  });

  const getHeatmapColor = (lvl: number) => {
    switch (lvl) {
      case 1:
        return 'bg-emerald-950 border-emerald-900';
      case 2:
        return 'bg-emerald-800 border-emerald-700';
      case 3:
        return 'bg-emerald-600 border-emerald-500';
      case 4:
        return 'bg-emerald-400 border-emerald-300';
      default:
        return 'bg-slate-900 border-slate-800/80';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Personalized Welcome Banner */}
      <div className="relative rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-[#0d1424] via-[#0b101c] to-[#080d17] border border-slate-800/90 shadow-xl overflow-hidden">
        <div className="absolute -top-24 -end-24 w-72 h-72 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="relative">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={user?.name || 'Developer'}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-500/40 shadow-lg shadow-cyan-500/10"
              />
              <span className="absolute -bottom-1 -end-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#0b101c]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  {t('مرحباً بك مجدداً،', 'Welcome back,')} {user?.name || 'Developer'} 👋
                </h1>
                <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase ${currentTheme.badgeBg}`}>
                  {user?.badge || 'OPEBAT Lead Pro'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                {user?.role || 'Senior Bot & AI Architect'} • {user?.email || 'rluciefe@gmail.com'}
              </p>
              <p className="text-[11px] text-cyan-400/80 font-mono mt-0.5">
                {currentTime.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })} • {currentTime.toLocaleTimeString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-900/90 px-4 py-2.5 rounded-xl border border-slate-800 text-end">
              <span className="text-[10px] text-slate-400 block uppercase font-mono tracking-wider">
                {t('رصيد استدعاءات الذكاء الاصطناعي', 'AI Tokens Quota')}
              </span>
              <span className="text-lg font-black text-cyan-400 font-mono">
                {(user?.credits || 50000).toLocaleString()} <span className="text-xs text-slate-400 font-normal">TOKENS</span>
              </span>
            </div>
            <button
              onClick={() => setActivePage('ai-chat')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs text-white shadow-lg transition-all flex items-center gap-2 ${currentTheme.btnPrimary}`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{t('فتح محادثة AI', 'Launch AI Chat')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {[
          { label: t('المستودعات والمشاريع', 'Total Repos'), value: '18+', icon: FolderGit2, change: '+4 new', color: 'text-cyan-400' },
          { label: t('أدوات AI النشطة', 'Active AI Tools'), value: '100+', icon: Cpu, change: '100% Ready', color: 'text-emerald-400' },
          { label: t('استفسارات النماذج', 'AI Inferences'), value: '14.2K', icon: Sparkles, change: '+18% wk', color: 'text-violet-400' },
          { label: t('صور مولدة', 'AI Images'), value: '1,420', icon: Image, change: 'Flux / SD', color: 'text-amber-400' },
          { label: t('ألحان وأغاني', 'Songs Composed'), value: '380', icon: Music, change: 'Web Audio', color: 'text-rose-400' },
          { label: t('فحوصات أمنية', 'Security Scans'), value: '99.9%', icon: Shield, change: 'Zero Vulns', color: 'text-blue-400' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="p-4 rounded-xl bg-[#0b0f19]/90 border border-slate-800/80 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium text-slate-400">{stat.label}</span>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div className="text-lg font-black text-white font-mono">{stat.value}</div>
              <div className="text-[10px] text-emerald-400 font-mono mt-1">{stat.change}</div>
            </div>
          );
        })}
      </div>

      {/* 2-Column Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Developer Activity Heatmap & Quick Action Launchers */}
        <div className="lg:col-span-2 space-y-6">
          {/* GitHub-style Contribution Activity Heatmap */}
          <div className="p-5 rounded-2xl bg-[#0b0f19]/90 border border-slate-800/90 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm text-white">
                  {t('خريطة النشاط البرمجي وتدريب النماذج (Activity Heatmap)', 'Developer Contribution & AI Activity')}
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">1,248 {t('مساهمة هذا العام', 'contributions in 2026')}</span>
            </div>

            {/* Heatmap Grid */}
            <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800">
              <div className="inline-flex gap-1">
                {activityWeeks.map((week, wIdx) => (
                  <div key={wIdx} className="flex flex-col gap-1">
                    {week.map((cell, dIdx) => (
                      <div
                        key={dIdx}
                        title={`Activity level: ${cell.level}`}
                        className={`w-3 h-3 rounded-[3px] border ${getHeatmapColor(cell.level)} transition-colors hover:scale-125`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-3 pt-3 border-t border-slate-800/60 font-mono">
              <span>{t('أقل نشاطاً', 'Less')}</span>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-[2px] bg-slate-900 border border-slate-800" />
                <span className="w-2.5 h-2.5 rounded-[2px] bg-emerald-950 border border-emerald-900" />
                <span className="w-2.5 h-2.5 rounded-[2px] bg-emerald-800 border border-emerald-700" />
                <span className="w-2.5 h-2.5 rounded-[2px] bg-emerald-600 border border-emerald-500" />
                <span className="w-2.5 h-2.5 rounded-[2px] bg-emerald-400 border border-emerald-300" />
              </div>
              <span>{t('أكثر نشاطاً', 'More')}</span>
            </div>
          </div>

          {/* Quick Pinned Workstations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => setActivePage('ai-chat')}
              className="p-5 rounded-2xl bg-gradient-to-br from-[#0c1322] to-[#090d16] border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
                  GPT-4o • Claude • DeepSeek
                </span>
              </div>
              <h4 className="font-bold text-white text-sm group-hover:text-cyan-300 transition-colors">
                {t('شات الذكاء الاصطناعي المتعدد', 'Multi-AI LLM Chat')}
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {t('التبديل بين 5 محركات ذكاء اصطناعي رائدة مع التفكير المتسلسل وقراءة الصوت البرمجية.', 'Seamlessly toggle between 5 flagship LLM models with reasoning blocks and voice TTS.')}
              </p>
            </div>

            <div
              onClick={() => setActivePage('data-analytics')}
              className="p-5 rounded-2xl bg-gradient-to-br from-[#0c1322] to-[#090d16] border border-slate-800 hover:border-emerald-500/40 cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-5 h-5 text-emerald-400" />
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                  Smart AI BI
                </span>
              </div>
              <h4 className="font-bold text-white text-sm group-hover:text-emerald-300 transition-colors">
                {t('تحليل البيانات الذكي ومخططات SVG', 'Smart Data Analytics')}
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {t('رفع ملفات CSV وتحليل فوري ورصد الشذوذ الإحصائي ورسم التوقعات المستقبلية.', 'Upload CSV/JSON for automatic trend charts, anomaly discovery, and predictive forecasts.')}
              </p>
            </div>

            <div
              onClick={() => setActivePage('media-studio')}
              className="p-5 rounded-2xl bg-gradient-to-br from-[#0c1322] to-[#090d16] border border-slate-800 hover:border-violet-500/40 cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Music className="w-5 h-5 text-violet-400" />
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-950 text-violet-300 border border-violet-800 font-mono">
                  Web Audio Synth
                </span>
              </div>
              <h4 className="font-bold text-white text-sm group-hover:text-violet-300 transition-colors">
                {t('استوديو الصور وتأليف الأغاني', 'AI Media & Music Studio')}
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {t('توليد صور بجودة فائقة ومحرك تأليف أغاني حقيقي مع عزف مباشر داخل المتصفح.', 'Generate cinematic images and compose full songs with live synthesizer playback in browser.')}
              </p>
            </div>

            <div
              onClick={() => setActivePage('projects')}
              className="p-5 rounded-2xl bg-gradient-to-br from-[#0c1322] to-[#090d16] border border-slate-800 hover:border-blue-500/40 cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FolderGit2 className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800 font-mono">
                  GitHub Explorer
                </span>
              </div>
              <h4 className="font-bold text-white text-sm group-hover:text-blue-300 transition-colors">
                {t('مستكشف المستودعات والأكواد', 'GitHub Repository Workstation')}
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {t('شجرة ملفات حقيقية وعارض أكواد برمجية مع نسب اللغات المستخدمة والتاريخ الزمني.', 'Explore repo directory trees, syntax code viewer, language byte bars, and live GitHub fetching.')}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Scratchpad & System Health */}
        <div className="space-y-6">
          {/* Quick AI Scratchpad */}
          <div className="p-5 rounded-2xl bg-[#0b0f19]/90 border border-slate-800/90 shadow-lg flex flex-col h-80">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-sm text-white">
                  {t('مسودة الملاحظات السريعة (Scratchpad)', 'Developer Scratchpad')}
                </h3>
              </div>
              {isSavedNote && (
                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 animate-in fade-in">
                  <CheckCircle className="w-3 h-3" />
                  {t('تم الحفظ', 'Saved')}
                </span>
              )}
            </div>
            <textarea
              value={scratchpadNote}
              onChange={(e) => handleSaveNote(e.target.value)}
              placeholder={t('اكتب أفكار الكود أو ملاحظاتك هنا (يتم الحفظ تلقائياً)...', 'Write quick ideas, code snippets, or notes here...')}
              className="flex-1 w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-mono resize-none focus:outline-none focus:border-cyan-500/60 leading-relaxed scrollbar-thin scrollbar-thumb-slate-800"
            />
          </div>

          {/* System Latency & Core Services Monitor */}
          <div className="p-5 rounded-2xl bg-[#0b0f19]/90 border border-slate-800/90 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm text-white">
                  {t('حالة الأنظمة والخوادم', 'System Health Monitor')}
                </h3>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {t('تشغيل مثالي', '100% Operational')}
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono pt-1">
              {[
                { name: 'Gemini 3.8 Flash Engine', latency: '42ms', status: 'Online' },
                { name: 'Web Audio Synth Cluster', latency: '1.2ms', status: 'Active' },
                { name: 'GitHub REST Proxy API', latency: '65ms', status: 'Healthy' },
                { name: 'Email Auth & Session Vault', latency: '8ms', status: 'Secure' },
              ].map((service, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800/60 text-slate-300"
                >
                  <span className="truncate">{service.name}</span>
                  <div className="flex items-center gap-2 text-slate-400">
                    <span>{service.latency}</span>
                    <span className="text-emerald-400 font-semibold">•</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
