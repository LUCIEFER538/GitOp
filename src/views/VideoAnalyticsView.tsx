import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ACCENT_THEMES } from '../utils/themeStyles';
import { soundFx } from '../utils/audioSynth';
import { VideoReport } from '../types';
import {
  TrendingUp,
  BarChart3,
  Sparkles,
  Eye,
  Clock,
  Heart,
  Share2,
  Tv,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Zap,
  Target,
  Hash,
} from 'lucide-react';

const SAMPLE_REPORTS: VideoReport[] = [
  {
    id: 'vid-1',
    title: 'كيف تبني روبوت ذكاء اصطناعي ذاتي في 10 دقائق؟',
    platform: 'youtube',
    views: 128400,
    likes: 14200,
    shares: 3100,
    avgWatchTime: '4m 12s',
    completionRate: 64.8,
    performanceScore: 94,
    audienceRetentionVerdict: 'أداء فائق استثنائي يتفوق على 91% من مقاطع البرمجة في الشرق الأوسط.',
    hookAnalysis: 'خطاف البداية في أول 5 ثوانٍ احتفظ بـ 82% من المشاهدين بفضل الحركة السريعة للنص.',
    retentionCurve: [
      { second: 0, retentionPercent: 100 },
      { second: 5, retentionPercent: 82 },
      { second: 30, retentionPercent: 74 },
      { second: 60, retentionPercent: 68 },
      { second: 120, retentionPercent: 65 },
      { second: 240, retentionPercent: 58, dropReason: 'شرح نظري مطول، يُفضل وضع كود تطبيقي' },
    ],
    actionableRecommendations: [
      'قم بتثبيت رابط المستودع في أول تعليق لزيادة التحويل بنسبة +18%',
      'وقت النشر الأفضل للشريحة المستهدفة: أيام الأحد والثلاثاء الساعة 8 مساءً',
      'زيادة حجم خط الكود في شاشات الجوال لرفع نسبة الإكمال إلى 70%+',
    ],
    hashtags: ['#AI_Architecture', '#Python', '#Automation', '#Tech2026'],
  },
  {
    id: 'vid-2',
    title: 'أسرار اختراق واختبار شبكات الذكاء الاصطناعي CyberGuard',
    platform: 'tiktok',
    views: 456000,
    likes: 68300,
    shares: 18400,
    avgWatchTime: '42s',
    completionRate: 78.2,
    performanceScore: 98,
    audienceRetentionVerdict: 'محتوى رائج (Viral) بمعدل تفاعل قياسي ومشاركة مرتفعة جداً.',
    hookAnalysis: 'الانتقال البصري المفاجئ في الثانية الأولى خلق فضولاً كبيراً لدى المتابعين.',
    retentionCurve: [
      { second: 0, retentionPercent: 100 },
      { second: 3, retentionPercent: 91 },
      { second: 15, retentionPercent: 84 },
      { second: 30, retentionPercent: 76 },
      { second: 45, retentionPercent: 72 },
    ],
    actionableRecommendations: [
      'إنشاء جزء ثانٍ (Part 2) خلال 48 ساعة لركوب موجة الخوارزمية',
      'استخدام صوت التريند الخلفي الرائج في قطاع التكنولوجيا',
    ],
    hashtags: ['#CyberSecurity', '#HackerNews', '#OPEBAT', '#DevTok'],
  },
  {
    id: 'vid-3',
    title: 'دليل مهندس البرمجيات المستقبلي مع OPEBAT',
    platform: 'reels',
    views: 89000,
    likes: 9400,
    shares: 1950,
    avgWatchTime: '28s',
    completionRate: 59.4,
    performanceScore: 86,
    audienceRetentionVerdict: 'أداء مستقر فوق المتوسط، مع فرصة لتحسين خطاف البداية.',
    hookAnalysis: 'البداية كانت هادئة نسبياً وتسببت في تسرب 22% خلال أول 3 ثوانٍ.',
    retentionCurve: [
      { second: 0, retentionPercent: 100 },
      { second: 3, retentionPercent: 78, dropReason: 'تأخر ظهور الفكرة الأساسية' },
      { second: 15, retentionPercent: 68 },
      { second: 30, retentionPercent: 59 },
    ],
    actionableRecommendations: [
      'وضع سؤال صادم أو إحصائية مذهلة في أول ثانية',
      'إضافة ترجمة عربية بألوان متغيرة مع كل كلمة منطوقة',
    ],
    hashtags: ['#CodingLife', '#SoftwareEngineer', '#WebDev'],
  },
];

export const VideoAnalyticsView: React.FC = () => {
  const { accent, t } = useApp();
  const currentTheme = ACCENT_THEMES[accent];

  const [selectedReport, setSelectedReport] = useState<VideoReport>(SAMPLE_REPORTS[0]);
  const [platformFilter, setPlatformFilter] = useState<'all' | 'youtube' | 'tiktok' | 'reels'>('all');
  const [customVideoTitle, setCustomVideoTitle] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const filteredReports = SAMPLE_REPORTS.filter((r) =>
    platformFilter === 'all' ? true : r.platform === platformFilter
  );

  const handleRunAIAnalysis = async () => {
    if (!customVideoTitle.trim()) return;
    setIsAnalyzing(true);
    soundFx.playLaser();

    try {
      const res = await fetch('/api/gemini/video-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoTitle: customVideoTitle,
          platform: selectedReport.platform,
          metrics: {
            views: 95000,
            completionRate: '68%',
            avgWatchTime: '3m 10s',
          },
        }),
      });

      const data = await res.json();
      const updatedReport: VideoReport = {
        ...selectedReport,
        id: `custom_${Date.now()}`,
        title: customVideoTitle,
        performanceScore: data.performanceScore || 90,
        audienceRetentionVerdict: data.audienceRetentionVerdict || 'تحليل ذكي فوري للمقطع المقترح.',
        hookAnalysis: data.hookAnalysis || 'تحليل الخطاف البصري تم بنجاح.',
        actionableRecommendations: data.actionableRecommendations || [],
        hashtags: data.hashtags || ['#AI', '#Tech'],
      };
      setSelectedReport(updatedReport);
      soundFx.playChime();
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0b0f19] border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div>
          <span className={`text-[11px] px-3 py-1 rounded-full font-bold uppercase ${currentTheme.badgeBg}`}>
            Video Intelligence & Performance Engine
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 mt-2">
            <TrendingUp className="w-6 h-6 text-cyan-400" />
            {t('نظام تقارير أداء الفيديوهات ونقاط التحليل الذكية', 'Video Performance & AI Retention Reports')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {t(
              'متابعة منحنيات الاحتفاظ بالجماهير، تحليل كفاءة خطاف البداية (Hook)، وتوليد توصيات تحسين بنقرة واحدة.',
              'Audience retention curves, drop-off diagnostics, hook effectiveness, and AI optimization recommendations.'
            )}
          </p>
        </div>

        {/* Platform filter tabs */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
          {(['all', 'youtube', 'tiktok', 'reels'] as const).map((p) => (
            <button
              key={p}
              onClick={() => {
                setPlatformFilter(p);
                soundFx.playClick();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all uppercase ${
                platformFilter === p
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Quick AI Video Inspection Bar */}
      <div className="p-4 rounded-3xl bg-[#0b0f19] border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center gap-3">
        <div className="flex-1 w-full relative">
          <input
            type="text"
            value={customVideoTitle}
            onChange={(e) => setCustomVideoTitle(e.target.value)}
            placeholder={t('أدخل عنوان فيديو جديد لتحليله بالذكاء الاصطناعي وتقديم تقرير فوري...', 'Enter a video title to analyze retention and SEO...')}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>
        <button
          onClick={handleRunAIAnalysis}
          disabled={isAnalyzing || !customVideoTitle.trim()}
          className="w-full sm:w-auto px-5 py-2.5 rounded-2xl font-bold text-xs bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 text-white shadow-lg shadow-cyan-600/20 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
        >
          {isAnalyzing ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          <span>{t('تحليل الأداء بالذكاء الاصطناعي', 'Analyze with AI')}</span>
        </button>
      </div>

      {/* Main Grid: Video Selector List & Detailed Analytical Report */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Video List */}
        <div className="space-y-3">
          <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider px-1">
            {t('المقاطع المسجلة والمحللة', 'Monitored Videos')}
          </h4>
          {filteredReports.map((report) => (
            <div
              key={report.id}
              onClick={() => {
                setSelectedReport(report);
                soundFx.playClick();
              }}
              className={`p-4 rounded-3xl border cursor-pointer transition-all ${
                selectedReport.id === report.id
                  ? 'bg-cyan-950/30 border-cyan-500/80 shadow-lg shadow-cyan-500/10'
                  : 'bg-[#0b0f19] border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-slate-900 text-cyan-300 font-mono border border-slate-800">
                  {report.platform}
                </span>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" />
                  {report.performanceScore}/100
                </span>
              </div>
              <h5 className="font-bold text-xs text-white line-clamp-2 mb-2 leading-relaxed">
                {report.title}
              </h5>
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  {report.views.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-pink-400" />
                  {report.likes.toLocaleString()}
                </span>
                <span className="text-emerald-400 font-bold">{report.completionRate}%</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right 2 Columns: Detailed Performance Report */}
        <div className="lg:col-span-2 space-y-6">
          {/* Executive Score & KPI Cards */}
          <div className="p-6 rounded-3xl bg-[#0b0f19] border border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] uppercase font-mono text-cyan-400 font-bold">
                  Target Platform: {selectedReport.platform.toUpperCase()}
                </span>
                <h3 className="text-base sm:text-lg font-black text-white mt-1">
                  {selectedReport.title}
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-center px-4 py-2 rounded-2xl bg-cyan-950/40 border border-cyan-800/60">
                  <span className="block text-[10px] text-slate-400 font-mono">Performance Score</span>
                  <span className="text-xl font-black text-cyan-300">{selectedReport.performanceScore}%</span>
                </div>
              </div>
            </div>

            {/* KPI Stat Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-1">{t('إجمالي المشاهدات', 'Total Views')}</span>
                <strong className="text-lg font-black text-white font-mono">{selectedReport.views.toLocaleString()}</strong>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-1">{t('متوسط المشاهدة', 'Avg Watch Time')}</span>
                <strong className="text-lg font-black text-cyan-400 font-mono">{selectedReport.avgWatchTime}</strong>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-1">{t('نسبة الإكمال', 'Completion Rate')}</span>
                <strong className="text-lg font-black text-emerald-400 font-mono">{selectedReport.completionRate}%</strong>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-1">{t('المشاركات والتفاعل', 'Shares & Saves')}</span>
                <strong className="text-lg font-black text-pink-400 font-mono">{selectedReport.shares.toLocaleString()}</strong>
              </div>
            </div>

            {/* Audience Retention Curve (HTML Visual Bars) */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-cyan-400" />
                  {t('منحنى الاحتفاظ بالجماهير (Audience Retention Curve)', 'Audience Retention Curve')}
                </h4>
                <span className="text-[11px] text-slate-400 font-mono">First 100% to End Drop-off</span>
              </div>

              <div className="space-y-3 pt-2">
                {selectedReport.retentionCurve.map((point) => (
                  <div key={point.second} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400">{point.second}s milestone</span>
                      <strong className="text-cyan-400">{point.retentionPercent}%</strong>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
                      <div
                        className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${point.retentionPercent}%` }}
                      />
                    </div>
                    {point.dropReason && (
                      <p className="text-[11px] text-amber-400 flex items-center gap-1 pt-0.5">
                        <AlertTriangle className="w-3 h-3" />
                        <span>{point.dropReason}</span>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* AI Verdict & Hook Analysis */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-1.5">
                <h5 className="font-bold text-xs text-cyan-400 flex items-center gap-1.5">
                  <Target className="w-4 h-4" />
                  {t('تحليل كفاءة خطاف البداية (Hook Analysis):', 'Hook Analysis:')}
                </h5>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {selectedReport.hookAnalysis}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 space-y-1.5">
                <h5 className="font-bold text-xs text-indigo-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  {t('ملخص الذكاء الاصطناعي للأداء العام:', 'Executive AI Summary:')}
                </h5>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {selectedReport.audienceRetentionVerdict}
                </p>
              </div>
            </div>

            {/* Actionable Recommendations */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <h5 className="font-bold text-xs text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                {t('نقاط التحسين والتوصيات الذكية المقترحة:', 'Actionable AI Recommendations:')}
              </h5>
              <div className="space-y-2">
                {selectedReport.actionableRecommendations.map((rec, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 font-bold text-[10px]">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{rec}</span>
                  </div>
                ))}
              </div>

              {/* Recommended Hashtags */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2 flex-wrap">
                <span className="text-[11px] text-slate-500 font-bold flex items-center gap-1">
                  <Hash className="w-3.5 h-3.5" />
                  {t('الوسوم الموصى بها:', 'Recommended Hashtags:')}
                </span>
                {selectedReport.hashtags.map((h, i) => (
                  <span key={i} className="px-2.5 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-cyan-300">
                    {h}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
