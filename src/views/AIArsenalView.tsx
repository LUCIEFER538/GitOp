import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ACCENT_THEMES } from '../utils/themeStyles';
import { AI_TOOLS_LIST } from '../data/aiToolsData';
import { AIToolItem } from '../types';
import {
  Sparkles,
  Search,
  Code2,
  Shield,
  BarChart3,
  PenTool,
  Clock,
  Cpu,
  Play,
  Copy,
  Check,
  X,
  RefreshCw,
  Terminal,
} from 'lucide-react';

const CATEGORIES = [
  { id: 'all', nameAr: 'كافة الأدوات (100+)', nameEn: 'All Tools (100+)' },
  { id: 'code', nameAr: 'الأكواد والبرمجة', nameEn: 'Code & Dev' },
  { id: 'cyber', nameAr: 'الأمن السيبراني', nameEn: 'Cybersecurity' },
  { id: 'data', nameAr: 'تحليل البيانات', nameEn: 'Data Analytics' },
  { id: 'content', nameAr: 'المحتوى والإبداع', nameEn: 'Content & Media' },
  { id: 'productivity', nameAr: 'الإنتاجية وسير العمل', nameEn: 'Productivity' },
  { id: 'architecture', nameAr: 'المعمارية والسحابة', nameEn: 'Cloud & Architecture' },
];

export const AIArsenalView: React.FC = () => {
  const { accent, t } = useApp();
  const currentTheme = ACCENT_THEMES[accent];

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalTool, setActiveModalTool] = useState<AIToolItem | null>(null);
  const [toolInput, setToolInput] = useState('');
  const [toolOutput, setToolOutput] = useState<string | null>(null);
  const [executing, setExecuting] = useState(false);
  const [copiedOutput, setCopiedOutput] = useState(false);

  const filteredTools = AI_TOOLS_LIST.filter((tool) => {
    const matchesCat = selectedCategory === 'all' || tool.category === selectedCategory;
    const matchesSearch =
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.titleAr.includes(searchQuery) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.descriptionAr.includes(searchQuery);
    return matchesCat && matchesSearch;
  });

  const handleOpenTool = (tool: AIToolItem) => {
    setActiveModalTool(tool);
    setToolInput(tool.defaultInput);
    setToolOutput(null);
  };

  const handleRunTool = async () => {
    if (!activeModalTool || !toolInput.trim() || executing) return;
    setExecuting(true);
    try {
      const res = await fetch('/api/gemini/run-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolId: activeModalTool.id,
          toolTitle: activeModalTool.title,
          category: activeModalTool.category,
          input: toolInput.trim(),
        }),
      });

      const data = await res.json();
      setToolOutput(data.output || 'تمت العملية بنجاح.');
    } catch {
      setToolOutput('عذراً، فشل تنفيذ الأداة. يرجى المحاولة لاحقاً.');
    } finally {
      setExecuting(false);
    }
  };

  const handleCopyOutput = () => {
    if (!toolOutput) return;
    navigator.clipboard.writeText(toolOutput);
    setCopiedOutput(true);
    setTimeout(() => setCopiedOutput(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-300">
      {/* View Header */}
      <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase ${currentTheme.badgeBg}`}>
            100+ Specialized AI Micro-Tools
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 mt-1">
            <Sparkles className="w-6 h-6 text-cyan-400" />
            {t('ترسانة الـ 100 أداة ذكاء اصطناعي التخصصية', '100+ AI Developer & Engineer Tools Arsenal')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {t('مجموعة فائقة القوة من الأدوات الدقيقة الموجهة للمطورين ومهندسي الأنظمة والأمن السيبراني.', 'Production-grade AI micro-utilities for automated refactoring, audits, and analytics.')}
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute top-3 start-3 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('ابحث بين أكثر من 100 أداة...', 'Search 100+ AI tools...')}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2 ps-9 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === cat.id
                ? 'bg-cyan-600 text-white font-bold shadow-md shadow-cyan-600/20'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {t(cat.nameAr, cat.nameEn)}
          </button>
        ))}
      </div>

      {/* Tools Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTools.map((tool) => (
          <div
            key={tool.id}
            onClick={() => handleOpenTool(tool)}
            className="p-5 rounded-2xl bg-[#0b0f19] border border-slate-800/80 hover:border-cyan-500/50 cursor-pointer transition-all duration-200 group flex flex-col justify-between shadow-lg hover:shadow-cyan-500/5"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                  {tool.badge}
                </span>
              </div>

              <h3 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                {t(tool.titleAr, tool.title)}
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed line-clamp-3">
                {t(tool.descriptionAr, tool.description)}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold text-cyan-400">
              <span className="text-[11px] text-slate-500">{t(tool.categoryAr, tool.category)}</span>
              <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                {t('تشغيل الأداة', 'Run Tool')}
                <Play className="w-3 h-3 fill-cyan-400" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Tool Runner Execution Modal */}
      {activeModalTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl bg-[#0b0f19] border border-slate-700 shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-5 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">
                    {t(activeModalTool.titleAr, activeModalTool.title)}
                  </h3>
                  <span className="text-xs text-slate-400">{t(activeModalTool.categoryAr, activeModalTool.category)}</span>
                </div>
              </div>
              <button
                onClick={() => setActiveModalTool(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-slate-800 text-xs">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t('المدخلات أو الكود المطلوب معالجته:', 'Input Data or Code to Process:')}
                </label>
                <textarea
                  rows={6}
                  value={toolInput}
                  onChange={(e) => setToolInput(e.target.value)}
                  placeholder={t(activeModalTool.placeholderAr, activeModalTool.placeholderEn)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 font-mono leading-relaxed focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <button
                onClick={handleRunTool}
                disabled={executing || !toolInput.trim()}
                className="w-full py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                {executing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{t('جاري التنفيذ والمعالجة بنموذج الذكاء الاصطناعي...', 'Processing with Gemini AI...')}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>{t('تشغيل الأداة واستخراج النتيجة', 'Execute AI Tool Now')}</span>
                  </>
                )}
              </button>

              {/* Output Result */}
              {toolOutput && (
                <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 animate-in slide-in-from-bottom-2">
                  <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800">
                    <span className="font-bold text-cyan-400 font-mono">{t('مخرجات الأداة الذكية:', 'AI Tool Output Result:')}</span>
                    <button
                      onClick={handleCopyOutput}
                      className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                    >
                      {copiedOutput ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedOutput ? t('تم النسخ!', 'Copied!') : t('نسخ النتيجة', 'Copy Result')}</span>
                    </button>
                  </div>

                  <pre className="whitespace-pre-wrap font-mono text-xs text-slate-200 leading-relaxed overflow-x-auto">
                    {toolOutput}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
