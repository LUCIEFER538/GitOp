import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ACCENT_THEMES } from '../utils/themeStyles';
import { soundFx } from '../utils/audioSynth';
import {
  Calculator,
  Timer,
  Bookmark,
  Check,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ArrowRight,
  DollarSign,
  Clock,
} from 'lucide-react';

export const ProductivityView: React.FC = () => {
  const { accent, t, setActivePage } = useApp();
  const currentTheme = ACCENT_THEMES[accent];

  // 1. Cost Calculator
  const [projectType, setProjectType] = useState<'bot' | 'fullstack' | 'ai' | 'scraper' | 'security'>('bot');
  const [tier, setTier] = useState<'starter' | 'pro' | 'enterprise'>('pro');
  const [fastDelivery, setFastDelivery] = useState(false);
  const [extendedSupport, setExtendedSupport] = useState(true);
  const [cloudDeploy, setCloudDeploy] = useState(true);

  const basePrices = {
    bot: { starter: 250, pro: 550, enterprise: 1200, days: 5 },
    fullstack: { starter: 450, pro: 950, enterprise: 2200, days: 12 },
    ai: { starter: 350, pro: 750, enterprise: 1600, days: 7 },
    scraper: { starter: 200, pro: 480, enterprise: 950, days: 4 },
    security: { starter: 300, pro: 650, enterprise: 1400, days: 6 },
  };

  const currentBase = basePrices[projectType][tier];
  let calculatedTotal = currentBase;
  let estimatedDays = basePrices[projectType].days * (tier === 'enterprise' ? 2 : tier === 'starter' ? 0.7 : 1);

  if (fastDelivery) {
    calculatedTotal += 150;
    estimatedDays = Math.max(2, Math.round(estimatedDays * 0.5));
  }
  if (extendedSupport) {
    calculatedTotal += 120;
  }
  if (cloudDeploy) {
    calculatedTotal += 80;
  }

  // 2. Pomodoro Timer
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState<'work' | 'break'>('work');

  useEffect(() => {
    let timer: any;
    if (timerRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      soundFx.playChime();
      if (timerMode === 'work') {
        setTimerMode('break');
        setTimeLeft(5 * 60);
      } else {
        setTimerMode('work');
        setTimeLeft(25 * 60);
      }
      setTimerRunning(false);
    }
    return () => clearInterval(timer);
  }, [timerRunning, timeLeft, timerMode]);

  const toggleTimer = () => {
    setTimerRunning((prev) => !prev);
    soundFx.playClick();
  };

  const resetTimer = () => {
    setTimerRunning(false);
    setTimeLeft(timerMode === 'work' ? 25 * 60 : 5 * 60);
    soundFx.playClick();
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-2">
          <Calculator className="w-3.5 h-3.5" />
          <span>{t('حاسبة التكلفة والإنتاجية', 'Cost Calculator & Productivity')}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          {t('تقدير تكلفة المشاريع ومؤقت التركيز', 'Project Quote Estimator & Focus Timer')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
          {t(
            'احسب التكلفة التقديرية لمشروعك البرمجي، أو استخدم مؤقت البومودورو لزيادة تركيزك أثناء البرمجة.',
            'Estimate real-world freelance pricing and timelines for bots, web platforms, and AI setups.'
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Cost Calculator Card */}
        <div className="rounded-3xl p-5 sm:p-6 bg-slate-900/80 border border-slate-800 space-y-5 shadow-lg">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <span>{t('حاسبة تكلفة ومدة المشروع', 'Project Cost & Delivery Estimator')}</span>
          </h3>

          {/* Project Type */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400">
              {t('نوع المشروع المطلوب:', 'Select Project Scope:')}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'bot', ar: 'بوت ذكي (تليجرام/فيسبوك)', en: 'AI Chat Bot' },
                { id: 'fullstack', ar: 'تطبيق ويب Full-Stack', en: 'Full-Stack App' },
                { id: 'ai', ar: 'تكامل Gemini AI', en: 'AI Integration' },
                { id: 'scraper', ar: 'محرك سحب بيانات', en: 'Web Scraper' },
                { id: 'security', ar: 'تدقيق واختبار أمني', en: 'Security Audit' },
              ].map((pt) => (
                <button
                  key={pt.id}
                  onClick={() => {
                    setProjectType(pt.id as any);
                    soundFx.playClick();
                  }}
                  className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                    projectType === pt.id
                      ? `${currentTheme.btnPrimary}`
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {t(pt.ar, pt.en)}
                </button>
              ))}
            </div>
          </div>

          {/* Tier */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400">
              {t('مستوى التعقيد والميزات:', 'Tier & Complexity:')}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'starter', ar: 'أساسي (MVP)', en: 'Starter / MVP' },
                { id: 'pro', ar: 'احترافي (Pro)', en: 'Professional' },
                { id: 'enterprise', ar: 'مؤسسي ضخم', en: 'Enterprise' },
              ].map((tr) => (
                <button
                  key={tr.id}
                  onClick={() => {
                    setTier(tr.id as any);
                    soundFx.playClick();
                  }}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    tier === tr.id
                      ? `${currentTheme.btnPrimary}`
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {t(tr.ar, tr.en)}
                </button>
              ))}
            </div>
          </div>

          {/* Addons */}
          <div className="space-y-2 pt-1 border-t border-slate-800/80">
            <label className="text-xs font-semibold text-slate-400">
              {t('إضافات وترقيات خاصة:', 'Add-ons & Upgrades:')}
            </label>
            <div className="space-y-2 text-xs text-slate-300">
              <label className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                <span>{t('تسليم فائق السرعة (Express Delivery)', 'Express Fast Delivery')}</span>
                <input
                  type="checkbox"
                  checked={fastDelivery}
                  onChange={(e) => {
                    setFastDelivery(e.target.checked);
                    soundFx.playClick();
                  }}
                  className="rounded accent-cyan-400"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                <span>{t('دعم وصيانة مستمرة لمدة 3 أشهر', '3 Months Dedicated Support')}</span>
                <input
                  type="checkbox"
                  checked={extendedSupport}
                  onChange={(e) => {
                    setExtendedSupport(e.target.checked);
                    soundFx.playClick();
                  }}
                  className="rounded accent-cyan-400"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                <span>{t('إعداد السيرفرات السحابية والنشر (Cloud Setup)', 'Cloud Deploy & Domain Setup')}</span>
                <input
                  type="checkbox"
                  checked={cloudDeploy}
                  onChange={(e) => {
                    setCloudDeploy(e.target.checked);
                    soundFx.playClick();
                  }}
                  className="rounded accent-cyan-400"
                />
              </label>
            </div>
          </div>

          {/* Price Output */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 to-slate-900 border border-slate-700/80 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-slate-400">{t('التكلفة التقديرية', 'Estimated Investment')}</p>
              <div className="text-2xl font-black text-emerald-400">
                ${calculatedTotal} <span className="text-xs text-slate-400 font-normal">USD</span>
              </div>
            </div>

            <div className="text-end">
              <p className="text-[11px] text-slate-400 flex items-center gap-1 justify-end">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>{t('مدة التنفيذ المتوقعة', 'Estimated Timeline')}</span>
              </p>
              <div className="text-sm font-bold text-white">
                ~ {Math.round(estimatedDays)} {t('أيام عمل', 'Business Days')}
              </div>
            </div>
          </div>

          <button
            onClick={() => setActivePage('contact')}
            className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${currentTheme.btnPrimary}`}
          >
            <span>{t('احجز هذا المشروع وتواصل الآن', 'Request this Project & Book Consultation')}</span>
          </button>
        </div>

        {/* Pomodoro Focus Timer Card */}
        <div className="rounded-3xl p-5 sm:p-6 bg-slate-900/80 border border-slate-800 space-y-6 shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-2 mb-2">
              <Timer className="w-5 h-5 text-cyan-400" />
              <span>{t('مؤقت التركيز والإنتاجية (Pomodoro Timer)', 'Developer Focus Timer')}</span>
            </h3>
            <p className="text-xs text-slate-400">
              {t(
                'جلسات تركيز برمجية مدتها 25 دقيقة متبوعة بفترة استراحة قصيرة لتحفيز الدماغ وتفادي الإرهاق.',
                'Boost coding flow with 25-minute deep work intervals followed by a 5-minute break.'
              )}
            </p>
          </div>

          {/* Giant Timer Display */}
          <div className="py-8 text-center rounded-2xl bg-slate-950 border border-slate-800 relative overflow-hidden">
            <span
              className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider mb-2 inline-block ${
                timerMode === 'work' ? currentTheme.badgeBg : 'bg-emerald-500/20 text-emerald-300'
              }`}
            >
              {timerMode === 'work' ? t('جلسة عمل وتركيز', 'Deep Work Mode') : t('استراحة قصيرة', 'Break Time')}
            </span>
            <div className="text-5xl sm:text-6xl font-black font-mono text-white tracking-widest my-2">
              {formatTime(timeLeft)}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={toggleTimer}
              className={`flex-1 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${currentTheme.btnPrimary}`}
            >
              {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{timerRunning ? t('إيقاف مؤقت', 'Pause') : t('بدء الجلسة', 'Start Focus')}</span>
            </button>
            <button
              onClick={resetTimer}
              className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
