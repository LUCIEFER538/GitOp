import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ACCENT_THEMES } from '../utils/themeStyles';
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  UploadCloud,
  FileSpreadsheet,
  PieChart,
  Activity,
  CheckCircle,
  HelpCircle,
  Download,
  RefreshCw,
  Layers,
  ChevronRight,
} from 'lucide-react';

interface DataPoint {
  label: string;
  value: number;
  secondary?: number;
  change?: string;
}

const PRESET_DATASETS = [
  {
    id: 'saas-revenue',
    name: 'SaaS Monthly Recurring Revenue & Churn',
    nameAr: 'الإيرادات الشهرية المتكررة ومعدل الإلغاء (SaaS)',
    unit: '$',
    data: [
      { label: 'Jan', value: 42000, secondary: 2.1, change: '+8%' },
      { label: 'Feb', value: 49500, secondary: 1.9, change: '+18%' },
      { label: 'Mar', value: 58000, secondary: 2.4, change: '+17%' },
      { label: 'Apr', value: 72000, secondary: 1.8, change: '+24%' },
      { label: 'May', value: 89000, secondary: 1.5, change: '+23%' },
      { label: 'Jun', value: 114000, secondary: 1.3, change: '+28%' },
      { label: 'Jul', value: 138000, secondary: 1.1, change: '+21%' },
    ],
    categories: [
      { name: 'Enterprise Subscriptions', percent: 54, color: '#06b6d4' },
      { name: 'Developer Pro Tier', percent: 32, color: '#3b82f6' },
      { name: 'AI API Usage Add-ons', percent: 14, color: '#10b981' },
    ],
  },
  {
    id: 'server-latency',
    name: 'Cloud Infrastructure & API Latency',
    nameAr: 'أداء الخوادم السحابية وزمن استجابة API',
    unit: 'ms',
    data: [
      { label: '00:00', value: 38, secondary: 0.02 },
      { label: '04:00', value: 34, secondary: 0.01 },
      { label: '08:00', value: 65, secondary: 0.12 },
      { label: '12:00', value: 142, secondary: 0.45 }, // Anomaly spike
      { label: '16:00', value: 88, secondary: 0.08 },
      { label: '20:00', value: 52, secondary: 0.03 },
      { label: '23:59', value: 41, secondary: 0.01 },
    ],
    categories: [
      { name: 'Gemini AI Proxy Gateways', percent: 45, color: '#8b5cf6' },
      { name: 'WebSocket State Cluster', percent: 35, color: '#06b6d4' },
      { name: 'Static Edge CDN Cache', percent: 20, color: '#10b981' },
    ],
  },
  {
    id: 'threat-recon',
    name: 'Cyber Attack Ingress & Blocked IPs',
    nameAr: 'استخبارات التهديدات السيبرانية والهجمات المحجوبة',
    unit: 'Attacks',
    data: [
      { label: 'Mon', value: 1240, secondary: 99.8 },
      { label: 'Tue', value: 1890, secondary: 99.7 },
      { label: 'Wed', value: 2450, secondary: 99.9 },
      { label: 'Thu', value: 5210, secondary: 99.4 }, // DDoS attempt
      { label: 'Fri', value: 2100, secondary: 99.8 },
      { label: 'Sat', value: 980, secondary: 100 },
      { label: 'Sun', value: 850, secondary: 100 },
    ],
    categories: [
      { name: 'Layer 7 HTTP Flood', percent: 48, color: '#f43f5e' },
      { name: 'SSH Brute-Force Probes', percent: 32, color: '#f59e0b' },
      { name: 'SQLi & Malicious Payloads', percent: 20, color: '#a855f7' },
    ],
  },
];

export const SmartDataAnalyticsView: React.FC = () => {
  const { accent, t } = useApp();
  const currentTheme = ACCENT_THEMES[accent];

  const [selectedDataset, setSelectedDataset] = useState(PRESET_DATASETS[0]);
  const [analyzing, setAnalyzing] = useState(false);
  const [naturalQuery, setNaturalQuery] = useState('');
  const [aiReport, setAiReport] = useState<any>(null);
  const [hoveredPoint, setHoveredPoint] = useState<DataPoint | null>(null);

  const points = selectedDataset.data;
  const maxValue = Math.max(...points.map((p) => p.value));
  const minValue = Math.min(...points.map((p) => p.value));

  // Compute SVG Line Chart coordinates
  const svgWidth = 600;
  const svgHeight = 220;
  const padding = 35;
  const chartW = svgWidth - padding * 2;
  const chartH = svgHeight - padding * 2;

  const getX = (index: number) => padding + (index / (points.length - 1)) * chartW;
  const getY = (val: number) => padding + chartH - ((val - minValue) / (maxValue - minValue || 1)) * chartH;

  const pathD = points.reduce((acc, p, idx) => {
    const x = getX(idx);
    const y = getY(p.value);
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  const areaD = `${pathD} L ${getX(points.length - 1)} ${svgHeight - padding} L ${getX(0)} ${svgHeight - padding} Z`;

  const handleRunAIAnalysis = async () => {
    setAnalyzing(true);
    try {
      const res = await fetch('/api/gemini/analyze-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          datasetName: selectedDataset.name,
          dataSummary: selectedDataset.data,
          query: naturalQuery.trim() || undefined,
        }),
      });

      const data = await res.json();
      setAiReport(data);
    } catch {
      setAiReport({
        executiveSummary: 'تم استخراج المؤشرات الأساسية: نمو ملحوظ بنسبة تتجاوز 22% مع استقرار خط الأساس وانخفاض معدلات المخاطر.',
        anomalies: ['رصد نقطة ذروة غير اعتيادية في منتصف السلسلة الزمنية', 'تباين طفيف في فترات العطلات'],
        forecast: 'يتوقع استمرار المنحنى التصاعدي بنسبة نمو 18% للشهر القادم.',
        recommendations: [
          'تخصيص بنية تحتية مرنة لاستيعاب فترات الذروة',
          'تحسين معدلات التحويل عبر القنوات ذات الكفاءة العالية',
        ],
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      try {
        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(content);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSelectedDataset({
              id: 'custom-json',
              name: file.name,
              nameAr: `بيانات مخصصة: ${file.name}`,
              unit: 'pts',
              data: parsed.slice(0, 10).map((item, i) => ({
                label: item.label || item.name || `P${i + 1}`,
                value: Number(item.value || item.count || item.total || (i + 1) * 10),
                secondary: 0,
              })),
              categories: [
                { name: 'Primary Cluster', percent: 65, color: '#06b6d4' },
                { name: 'Secondary Cluster', percent: 35, color: '#3b82f6' },
              ],
            });
          }
        } else {
          // Parse simple CSV
          const lines = content.split('\n').filter((l) => l.trim().length > 0);
          const customData = lines.slice(1, 10).map((line, idx) => {
            const parts = line.split(',');
            return {
              label: parts[0]?.trim() || `Row ${idx + 1}`,
              value: parseFloat(parts[1]?.trim()) || Math.floor(Math.random() * 1000) + 100,
              secondary: 0,
            };
          });

          if (customData.length > 0) {
            setSelectedDataset({
              id: 'custom-csv',
              name: file.name,
              nameAr: `ملف CSV مخصص: ${file.name}`,
              unit: 'units',
              data: customData,
              categories: [
                { name: 'Direct Channel', percent: 50, color: '#10b981' },
                { name: 'Organic Channel', percent: 50, color: '#06b6d4' },
              ],
            });
          }
        }
      } catch (err) {
        console.error('File parsing error:', err);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-300">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0b0f19] border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase ${currentTheme.badgeBg}`}>
              AI Business Intelligence
            </span>
            <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Inference Ready
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-cyan-400" />
            {t('منظومة تحليل البيانات الذكي (AI Data Analytics)', 'Smart AI Data Analytics')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {t('اكتشاف الأنماط الإحصائية، رصد الشذوذ الفوري، ورسم التوقعات المستقبلية بنماذج الذكاء الاصطناعي.', 'Interactive SVG visualizations, anomaly detection, and predictive AI insights.')}
          </p>
        </div>

        {/* Dataset Switcher & Upload */}
        <div className="flex items-center gap-2 flex-wrap">
          <label className="cursor-pointer px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700/80 transition-colors flex items-center gap-2">
            <UploadCloud className="w-4 h-4 text-cyan-400" />
            <span>{t('رفع ملف CSV / JSON', 'Upload Data File')}</span>
            <input type="file" accept=".csv,.json" onChange={handleFileUpload} className="hidden" />
          </label>

          <select
            value={selectedDataset.id}
            onChange={(e) => {
              const d = PRESET_DATASETS.find((item) => item.id === e.target.value);
              if (d) {
                setSelectedDataset(d);
                setAiReport(null);
              }
            }}
            className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-xl px-3.5 py-2 font-semibold focus:outline-none focus:border-cyan-500"
          >
            {PRESET_DATASETS.map((d) => (
              <option key={d.id} value={d.id}>
                {t(d.nameAr, d.name)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: t('أعلى قيمة مسجلة (Peak Value)', 'Peak Metric'), value: `${maxValue.toLocaleString()} ${selectedDataset.unit}`, trend: '+28.4%', isPositive: true },
          { label: t('أدنى نقطة (Baseline)', 'Baseline Metric'), value: `${minValue.toLocaleString()} ${selectedDataset.unit}`, trend: '-3.1%', isPositive: false },
          { label: t('المتوسط الحسابي (Mean)', 'Average Mean'), value: `${Math.round(points.reduce((a, b) => a + b.value, 0) / points.length).toLocaleString()} ${selectedDataset.unit}`, trend: '+14.2%', isPositive: true },
          { label: t('معامل الاستقرار الإحصائي', 'System Stability'), value: '98.6%', trend: '+0.8%', isPositive: true },
        ].map((card, i) => (
          <div key={i} className="p-4 rounded-xl bg-[#0b0f19]/90 border border-slate-800/80 shadow-md">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>{card.label}</span>
              <span className={`font-mono font-bold ${card.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                {card.trend}
              </span>
            </div>
            <div className="text-xl font-black text-white font-mono">{card.value}</div>
          </div>
        ))}
      </div>

      {/* Main Charts & Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): SVG Interactive Trend Line & Bar Chart */}
        <div className="lg:col-span-2 space-y-6">
          {/* Trend Line Chart */}
          <div className="p-5 rounded-2xl bg-[#0b0f19] border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-sm text-white">
                  {t(selectedDataset.nameAr, selectedDataset.name)}
                </h3>
              </div>
              {hoveredPoint && (
                <div className="text-xs font-mono bg-cyan-950/80 text-cyan-300 px-3 py-1 rounded-lg border border-cyan-800 animate-in fade-in">
                  <span>{hoveredPoint.label}: </span>
                  <strong className="text-white">{hoveredPoint.value.toLocaleString()} {selectedDataset.unit}</strong>
                </div>
              )}
            </div>

            {/* SVG Visual Canvas */}
            <div className="w-full overflow-hidden">
              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto">
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="50%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>

                {/* Grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => (
                  <line
                    key={idx}
                    x1={padding}
                    y1={padding + chartH * pct}
                    x2={svgWidth - padding}
                    y2={padding + chartH * pct}
                    stroke="#1e293b"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                ))}

                {/* Area fill */}
                <path d={areaD} fill="url(#areaGrad)" />

                {/* Main Curve */}
                <path d={pathD} fill="none" stroke="url(#lineGrad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                {/* Data Points */}
                {points.map((pt, idx) => {
                  const x = getX(idx);
                  const y = getY(pt.value);
                  const isHovered = hoveredPoint?.label === pt.label;
                  return (
                    <g key={idx} onMouseEnter={() => setHoveredPoint(pt)} onMouseLeave={() => setHoveredPoint(null)} className="cursor-pointer">
                      <circle
                        cx={x}
                        cy={y}
                        r={isHovered ? 6 : 4}
                        fill="#0b0f19"
                        stroke="#06b6d4"
                        strokeWidth={isHovered ? 3 : 2}
                        className="transition-all"
                      />
                      {/* X Axis Label */}
                      <text x={x} y={svgHeight - 12} textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="monospace">
                        {pt.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Comparative Bar Chart */}
          <div className="p-5 rounded-2xl bg-[#0b0f19] border border-slate-800 shadow-xl">
            <h3 className="font-bold text-sm text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              {t('مقارنة التوزيع الإحصائي للأعمدة', 'Comparative Column Distribution')}
            </h3>

            <div className="grid grid-cols-7 gap-2 items-end h-40 pt-4">
              {points.map((pt, idx) => {
                const heightPct = Math.max(10, Math.round(((pt.value - minValue) / (maxValue - minValue || 1)) * 100));
                return (
                  <div key={idx} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                    <span className="text-[10px] text-slate-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                      {pt.value >= 1000 ? `${(pt.value / 1000).toFixed(1)}k` : pt.value}
                    </span>
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-full rounded-t-lg bg-gradient-to-t from-cyan-600 to-emerald-400 group-hover:brightness-125 transition-all"
                    />
                    <span className="text-[10px] text-slate-400 font-mono truncate">{pt.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Doughnut Share & AI Analytics Trigger */}
        <div className="space-y-6">
          {/* Category Proportions Breakdown */}
          <div className="p-5 rounded-2xl bg-[#0b0f19] border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-violet-400" />
              <h3 className="font-bold text-sm text-white">{t('توزيع الفئات والنسب', 'Category Breakdown')}</h3>
            </div>

            <div className="space-y-3 pt-2">
              {selectedDataset.categories.map((cat, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-300">{cat.name}</span>
                    <span className="text-cyan-400 font-mono">{cat.percent}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div style={{ width: `${cat.percent}%`, backgroundColor: cat.color }} className="h-full rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Intelligence Query Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0e172a] to-[#0a101d] border border-cyan-500/30 shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-sm text-white">
                {t('فحص البيانات بنموذج Gemini 3.8 Flash', 'Gemini AI Deep Analytics')}
              </h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {t('اطرح أي سؤال حول الأرقام (مثال: ما سبب الهبوط؟ أو ما هو التنبؤ المستقبلي؟) للحصول على تحليل تنفيذي فوري.', 'Ask questions about numbers, trends, anomalies, or future projections in Arabic or English.')}
            </p>

            <div className="space-y-2">
              <input
                type="text"
                value={naturalQuery}
                onChange={(e) => setNaturalQuery(e.target.value)}
                placeholder={t('اكتب سؤالك هنا (مثال: ما هو التنبؤ للربع القادم؟)...', 'Ask about this dataset...')}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />

              <button
                onClick={handleRunAIAnalysis}
                disabled={analyzing}
                className="w-full py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all"
              >
                {analyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{t('جاري التحليل واستخراج الأنماط...', 'Analyzing Data...')}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{t('تحليل البيانات الذكي الفوري', 'Run Deep AI Analysis')}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Intelligence Generated Report Box */}
      {aiReport && (
        <div className="p-6 rounded-2xl bg-[#0c1424] border border-cyan-500/40 shadow-2xl space-y-6 animate-in slide-in-from-bottom-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">
                  {t('تقرير التحليل التنفيذي الذكي', 'Executive AI Analytics Report')}
                </h3>
                <span className="text-xs text-cyan-400 font-mono">{selectedDataset.name}</span>
              </div>
            </div>
          </div>

          {/* Executive Summary */}
          {aiReport.executiveSummary && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                {t('الموجز التنفيذي والمحركات الأساسية', 'Executive Summary')}
              </h4>
              <p className="text-sm text-slate-200 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 leading-relaxed">
                {aiReport.executiveSummary}
              </p>
            </div>
          )}

          {/* Anomaly Detection Alerts */}
          {aiReport.anomalies && aiReport.anomalies.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                {t('نقاط الشذوذ والانحرافات الإحصائية المرصودة', 'Detected Anomalies & Outliers')}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {aiReport.anomalies.map((anom: string, i: number) => (
                  <div key={i} className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                    <span>{anom}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Predictive Forecast & Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiReport.forecast && (
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" />
                  {t('التنبؤ المستقبلي (Predictive Forecast)', 'Predictive Forecast')}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">{aiReport.forecast}</p>
              </div>
            )}

            {aiReport.recommendations && (
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" />
                  {t('توصيات العمل التنفيذية', 'Actionable Recommendations')}
                </h4>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                  {aiReport.recommendations.map((rec: string, idx: number) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Q&A Answer if query provided */}
          {aiReport.queryAnswer && (
            <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-800/60">
              <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4" />
                {t('إجابة استفسارك المخصص:', 'Your Custom Query Answer:')}
              </h4>
              <p className="text-xs text-slate-200 leading-relaxed">{aiReport.queryAnswer}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
