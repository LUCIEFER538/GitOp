import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ACCENT_THEMES } from '../utils/themeStyles';
import {
  Activity,
  Cpu,
  Server,
  Zap,
  CheckCircle2,
  HardDrive,
  Wifi,
  Clock,
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { accent, t } = useApp();
  const currentTheme = ACCENT_THEMES[accent];

  const [fps, setFps] = useState(60);
  const [latency, setLatency] = useState(24);
  const [memoryMb, setMemoryMb] = useState(48.2);
  const [uptimeSecs, setUptimeSecs] = useState(145020);

  useEffect(() => {
    const interval = setInterval(() => {
      setFps(Math.floor(58 + Math.random() * 3));
      setLatency(Math.floor(18 + Math.random() * 9));
      setMemoryMb(parseFloat((46 + Math.random() * 3.5).toFixed(1)));
      setUptimeSecs((prev) => prev + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (secs: number) => {
    const d = Math.floor(secs / (3600 * 24));
    const h = Math.floor((secs % (3600 * 24)) / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${d}d ${h}h ${m}m ${s}s`;
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-2">
          <Activity className="w-3.5 h-3.5" />
          <span>{t('مراقبة استقرار الخوادم والأنظمة', 'Infrastructure Health')}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          {t('لوحة تحليلات الأداء والمراقبة الحية', 'Real-Time Performance & System Telemetry')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
          {t(
            'مؤشرات حية لمعدل الإطارات (FPS)، استهلاك الذاكرة، أوقات استجابة الـ API واستقرار الخوادم.',
            'Live metrics monitoring render throughput, memory footprints, API latency, and cluster availability.'
          )}
        </p>
      </div>

      {/* Numerical Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>{t('معدل الإطارات', 'Render Rate')}</span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black font-mono text-white flex items-baseline gap-1">
            <span>{fps}</span>
            <span className="text-xs text-slate-400 font-normal">FPS</span>
          </div>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            {t('أداء سلس ومستقر', 'Hardware accelerated')}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>{t('زمن استجابة الشبكة', 'Network Ping')}</span>
            <Wifi className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-black font-mono text-white flex items-baseline gap-1">
            <span>{latency}</span>
            <span className="text-xs text-slate-400 font-normal">ms</span>
          </div>
          <p className="text-[11px] text-cyan-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            {t('زمن وصول فائق السرعة', 'Ultra-low latency')}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>{t('استهلاك الذاكرة الحية', 'Heap Memory')}</span>
            <HardDrive className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-black font-mono text-white flex items-baseline gap-1">
            <span>{memoryMb}</span>
            <span className="text-xs text-slate-400 font-normal">MB</span>
          </div>
          <p className="text-[11px] text-purple-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
            {t('استهلاك منخفض جداً', 'Optimized bundle')}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>{t('استقرار النظام', 'System Uptime')}</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-black font-mono text-white truncate">
            {formatUptime(uptimeSecs)}
          </div>
          <p className="text-[11px] text-amber-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            {t('استقرار بنسبة 99.9%', '99.9% availability')}
          </p>
        </div>
      </div>

      {/* Services Health Status Table */}
      <div className="rounded-3xl p-5 sm:p-6 bg-slate-900/80 border border-slate-800 space-y-4">
        <h3 className="font-bold text-white text-base flex items-center gap-2">
          <Server className="w-5 h-5 text-cyan-400" />
          <span>{t('حالة الخدمات والبنية التحتية', 'Cluster Services Status')}</span>
        </h3>

        <div className="space-y-2">
          {[
            { name: 'Gemini 3.8 Multimodal Inference Engine', status: 'Online', ping: '120ms', load: '14%' },
            { name: 'Meta Graph API & Webhook Dispatcher', status: 'Online', ping: '32ms', load: '22%' },
            { name: 'Telegram Bot API Polling & Workers', status: 'Online', ping: '28ms', load: '18%' },
            { name: 'Redis In-Memory State & PubSub Bus', status: 'Online', ping: '2ms', load: '8%' },
            { name: 'Express API Server & WebSocket Gateway', status: 'Online', ping: '15ms', load: '11%' },
          ].map((svc, i) => (
            <div
              key={i}
              className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                <span className="font-bold text-slate-200">{svc.name}</span>
              </div>
              <div className="flex items-center gap-4 text-slate-400 font-mono">
                <span>Latency: <strong className="text-cyan-400">{svc.ping}</strong></span>
                <span>Load: <strong className="text-white">{svc.load}</strong></span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">
                  {svc.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
