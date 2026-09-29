import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ACCENT_THEMES } from '../utils/themeStyles';
import { soundFx } from '../utils/audioSynth';
import {
  Sparkles,
  Code,
  ShieldCheck,
  Zap,
  Terminal,
  Copy,
  Check,
  RefreshCw,
  Lightbulb,
  FileCode,
  Layers,
} from 'lucide-react';

export const AILabView: React.FC = () => {
  const { accent, t, language } = useApp();
  const currentTheme = ACCENT_THEMES[accent];

  const [activeTab, setActiveTab] = useState<'code' | 'prompt' | 'blueprint'>('code');

  // Tab 1: Code Reviewer
  const [codeSnippet, setCodeSnippet] = useState(`// أدخل الكود المراد فحصه هنا (JavaScript, Python, TypeScript...)
async function handleUserLogin(email, password) {
  const user = await db.query(\`SELECT * FROM users WHERE email = '\${email}'\`);
  if (user && user.password === password) {
    return { token: "secret_token_123", user };
  }
  return null;
}`);
  const [codeLanguage, setCodeLanguage] = useState('javascript');
  const [reviewMode, setReviewMode] = useState('security-audit');
  const [analyzingCode, setAnalyzingCode] = useState(false);
  const [codeAnalysisResult, setCodeAnalysisResult] = useState<string | null>(null);

  // Tab 2: Prompt Generator
  const [promptTopic, setPromptTopic] = useState('بوت دعم فني متكامل للمتاجر الإلكترونية مع الرد على أسعار المنتجات والشحن');
  const [promptRole, setPromptRole] = useState('Senior Bot Architect');
  const [generatingPrompt, setGeneratingPrompt] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);

  // Tab 3: Project Blueprint
  const [projectDomain, setProjectDomain] = useState('منصة أتمتة وإدارة محتوى بالذكاء الاصطناعي مع Webhooks لفيسبوك وتليجرام');
  const [techPreference, setTechPreference] = useState('Node.js, TypeScript, Gemini AI, Redis, React');
  const [generatingBlueprint, setGeneratingBlueprint] = useState(false);
  const [generatedBlueprint, setGeneratedBlueprint] = useState<string | null>(null);

  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    soundFx.playLaser();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAnalyzeCode = async () => {
    if (!codeSnippet.trim() || analyzingCode) return;
    setAnalyzingCode(true);
    soundFx.playClick();
    setCodeAnalysisResult(null);

    try {
      const res = await fetch('/api/gemini/analyze-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: codeSnippet,
          language: codeLanguage,
          mode: reviewMode,
        }),
      });
      const data = await res.json();
      setCodeAnalysisResult(data.analysis || 'تم الفحص بنجاح.');
      soundFx.playChime();
    } catch {
      setCodeAnalysisResult('حدث خطأ أثناء فحص الكود. يرجى التحقق من اتصال الشبكة.');
    } finally {
      setAnalyzingCode(false);
    }
  };

  const handleGeneratePrompt = async () => {
    if (!promptTopic.trim() || generatingPrompt) return;
    setGeneratingPrompt(true);
    soundFx.playClick();
    setGeneratedPrompt(null);

    try {
      const res = await fetch('/api/gemini/generate-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: promptTopic,
          role: promptRole,
        }),
      });
      const data = await res.json();
      setGeneratedPrompt(data.prompt || 'تم توليد البرومبت.');
      soundFx.playChime();
    } catch {
      setGeneratedPrompt('حدث خطأ أثناء توليد البرومبت.');
    } finally {
      setGeneratingPrompt(false);
    }
  };

  const handleGenerateBlueprint = async () => {
    if (!projectDomain.trim() || generatingBlueprint) return;
    setGeneratingBlueprint(true);
    soundFx.playClick();
    setGeneratedBlueprint(null);

    try {
      const res = await fetch('/api/gemini/project-idea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain: projectDomain,
          techStack: techPreference,
        }),
      });
      const data = await res.json();
      setGeneratedBlueprint(data.idea || 'تم إعداد المخطط.');
      soundFx.playChime();
    } catch {
      setGeneratedBlueprint('حدث خطأ أثناء إعداد المخطط.');
    } finally {
      setGeneratingBlueprint(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('مختبر الذكاء الاصطناعي التوليدي', 'Gemini AI Lab')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {t('مختبر الذكاء الاصطناعي والأتمتة الذكية', 'AI & Machine Learning Engineering Lab')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            {t(
              'أدوات مباشرة مدعومة بنموذج Gemini 3.8 لفحص الثغرات، وتحسين الأكواد، وهندسة البرومبت، وابتكار مخططات معمارية المشاريع.',
              'Live utilities powered by Gemini 3.8 for security auditing, automated code optimization, system prompt creation, and architectural blueprints.'
            )}
          </p>
        </div>

        <div className="px-4 py-2.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-cyan-400 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>Engine: Gemini-3.8-Flash</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-slate-900/80 border border-slate-800 max-w-2xl">
        <button
          onClick={() => setActiveTab('code')}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'code' ? `${currentTheme.btnPrimary}` : 'text-slate-400 hover:text-white'
          }`}
        >
          <Code className="w-4 h-4" />
          <span>{t('فحص وتحسين الكود', 'Code Auditor')}</span>
        </button>

        <button
          onClick={() => setActiveTab('prompt')}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'prompt' ? `${currentTheme.btnPrimary}` : 'text-slate-400 hover:text-white'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>{t('هندسة البرومبت', 'Prompt Architect')}</span>
        </button>

        <button
          onClick={() => setActiveTab('blueprint')}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'blueprint' ? `${currentTheme.btnPrimary}` : 'text-slate-400 hover:text-white'
          }`}
        >
          <Lightbulb className="w-4 h-4" />
          <span>{t('معمارية المشاريع', 'Project Blueprint')}</span>
        </button>
      </div>

      {/* Tab 1: AI Code Reviewer */}
      {activeTab === 'code' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4 rounded-3xl p-5 sm:p-6 bg-slate-900/80 border border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <FileCode className="w-4 h-4 text-cyan-400" />
                <span>{t('أدخل الكود البرمجي للفحص', 'Source Code Input')}</span>
              </h3>

              <div className="flex items-center gap-2">
                <select
                  value={codeLanguage}
                  onChange={(e) => setCodeLanguage(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="python">Python</option>
                  <option value="sql">SQL</option>
                  <option value="go">Golang</option>
                  <option value="php">PHP</option>
                </select>

                <select
                  value={reviewMode}
                  onChange={(e) => setReviewMode(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200"
                >
                  <option value="security-audit">{t('تدقيق أمني (OWASP)', 'Security Audit')}</option>
                  <option value="performance">{t('تحسين الأداء (Speed)', 'Performance')}</option>
                  <option value="full-review">{t('مراجعة شاملة وإعادة هيكلة', 'Full Architecture')}</option>
                </select>
              </div>
            </div>

            <textarea
              value={codeSnippet}
              onChange={(e) => setCodeSnippet(e.target.value)}
              rows={12}
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-2xl p-4 font-mono text-xs text-slate-200 placeholder-slate-400 focus:outline-none resize-none leading-relaxed"
              placeholder="// Paste code snippet here..."
            />

            <button
              onClick={handleAnalyzeCode}
              disabled={analyzingCode || !codeSnippet.trim()}
              className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${currentTheme.btnPrimary} disabled:opacity-50`}
            >
              {analyzingCode ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{t('جارٍ التحليل والفحص الذكي...', 'Auditing with Gemini 3.8...')}</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>{t('بدء الفحص واستخراج الكود المحسن', 'Run AI Code & Security Audit')}</span>
                </>
              )}
            </button>
          </div>

          {/* Results Output */}
          <div className="rounded-3xl p-5 sm:p-6 bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>{t('تقرير الفحص والتحسينات المقترحة', 'Audit Report & Refactored Code')}</span>
                </h3>
                {codeAnalysisResult && (
                  <button
                    onClick={() => handleCopy(codeAnalysisResult)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? t('تم النسخ', 'Copied') : t('نسخ', 'Copy')}</span>
                  </button>
                )}
              </div>

              {codeAnalysisResult ? (
                <div className="max-h-[420px] overflow-y-auto pr-2 space-y-3 font-sans text-xs sm:text-sm text-slate-300 whitespace-pre-wrap leading-relaxed scrollbar-thin scrollbar-thumb-slate-800">
                  {codeAnalysisResult}
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-center p-6 space-y-2 text-slate-400">
                  <Zap className="w-8 h-8 text-cyan-500/40" />
                  <p className="text-xs">
                    {t(
                      'اضغط على زر "بدء الفحص" لتحليل الكود وكشف الثغرات الأمنية (مثل SQL Injection و XSS) وتوليد النسخة الأمثل.',
                      'Click "Run AI Code Audit" to scan for OWASP vulnerabilities and get an optimized refactored version.'
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: AI Prompt Engineer */}
      {activeTab === 'prompt' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4 rounded-3xl p-5 sm:p-6 bg-slate-900/80 border border-slate-800">
            <h3 className="font-bold text-white text-sm">
              {t('مواصفات البرومبت المطلوب', 'Prompt Specifications')}
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">
                {t('دور الذكاء الاصطناعي (Persona)', 'Target Role / Persona')}
              </label>
              <select
                value={promptRole}
                onChange={(e) => setPromptRole(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs sm:text-sm text-slate-200"
              >
                <option value="Senior Bot Architect">Senior Bot Architect (معماري روبوتات وأتمتة)</option>
                <option value="Cybersecurity Pentester">Cybersecurity Pentester (مختص اختبار اختراق)</option>
                <option value="Full Stack CTO">Full Stack CTO (كبير مسؤولي التقنية للويب)</option>
                <option value="Customer Support AI">Customer Support AI (خدمة عملاء فائقة الدقة)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">
                {t('الموضوع والمهام المطلوبة من البرومبت', 'Topic & Expected Behavior')}
              </label>
              <textarea
                value={promptTopic}
                onChange={(e) => setPromptTopic(e.target.value)}
                rows={5}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl p-3 text-xs sm:text-sm text-slate-200"
                placeholder={t('اكتب وصف النظام أو البوت المطلوب...', 'Describe what this prompt should achieve...')}
              />
            </div>

            <button
              onClick={handleGeneratePrompt}
              disabled={generatingPrompt || !promptTopic.trim()}
              className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${currentTheme.btnPrimary} disabled:opacity-50`}
            >
              {generatingPrompt ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{t('جارٍ صياغة البرومبت...', 'Engineering Prompt...')}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{t('توليد برومبت احترافي متقدم', 'Generate Elite System Prompt')}</span>
                </>
              )}
            </button>
          </div>

          {/* Prompt Output */}
          <div className="rounded-3xl p-5 sm:p-6 bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>{t('البرومبت الناتج (System Instruction)', 'Generated System Instruction')}</span>
              </h3>
              {generatedPrompt && (
                <button
                  onClick={() => handleCopy(generatedPrompt)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? t('تم النسخ', 'Copied') : t('نسخ', 'Copy')}</span>
                </button>
              )}
            </div>

            {generatedPrompt ? (
              <div className="max-h-[380px] overflow-y-auto p-4 rounded-xl bg-slate-950 font-mono text-xs text-emerald-300 whitespace-pre-wrap leading-relaxed border border-slate-800">
                {generatedPrompt}
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 space-y-2 text-slate-400">
                <Terminal className="w-8 h-8 text-emerald-500/40" />
                <p className="text-xs">
                  {t(
                    'سيظهر هنا البرومبت الهندسي المكتمل مع الشروط والقيود وأمثلة Few-Shot جاهزاً للنسخ واستخدامه فوراً.',
                    'The production-grade prompt with persona, strict constraints, and output format will appear here.'
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Project Blueprint */}
      {activeTab === 'blueprint' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4 rounded-3xl p-5 sm:p-6 bg-slate-900/80 border border-slate-800">
            <h3 className="font-bold text-white text-sm">
              {t('محددات فكرة ومعمارية المشروع', 'Project Blueprint Parameters')}
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">
                {t('مجال المشروع وفكرته العامة', 'Project Domain or Idea Concept')}
              </label>
              <textarea
                value={projectDomain}
                onChange={(e) => setProjectDomain(e.target.value)}
                rows={4}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl p-3 text-xs sm:text-sm text-slate-200"
                placeholder={t('مثال: منصة حجوزات ذكية مع بوت تليجرام...', 'e.g. Smart Booking SaaS with Telegram bot...')}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">
                {t('حزمة التقنيات المفضلة', 'Preferred Tech Stack')}
              </label>
              <input
                type="text"
                value={techPreference}
                onChange={(e) => setTechPreference(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl p-2.5 text-xs sm:text-sm text-slate-200 font-mono"
              />
            </div>

            <button
              onClick={handleGenerateBlueprint}
              disabled={generatingBlueprint || !projectDomain.trim()}
              className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${currentTheme.btnPrimary} disabled:opacity-50`}
            >
              {generatingBlueprint ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{t('جارٍ بناء المعمارية وخطة التنفيذ...', 'Architecting Blueprint...')}</span>
                </>
              ) : (
                <>
                  <Layers className="w-4 h-4" />
                  <span>{t('توليد مخطط المعمارية وخارطة الطريق', 'Generate Full Architecture Blueprint')}</span>
                </>
              )}
            </button>
          </div>

          {/* Blueprint Output */}
          <div className="rounded-3xl p-5 sm:p-6 bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>{t('مخطط النظام وخارطة الطريق', 'System Blueprint & Roadmap')}</span>
              </h3>
              {generatedBlueprint && (
                <button
                  onClick={() => handleCopy(generatedBlueprint)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? t('تم النسخ', 'Copied') : t('نسخ', 'Copy')}</span>
                </button>
              )}
            </div>

            {generatedBlueprint ? (
              <div className="max-h-[380px] overflow-y-auto p-4 rounded-xl bg-slate-950 text-xs sm:text-sm text-slate-200 whitespace-pre-wrap leading-relaxed border border-slate-800 scrollbar-thin scrollbar-thumb-slate-800">
                {generatedBlueprint}
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 space-y-2 text-slate-400">
                <Lightbulb className="w-8 h-8 text-amber-500/40" />
                <p className="text-xs">
                  {t(
                    'سيتم إعداد خطة متكاملة تشمل تدفق البيانات (Data Flow)، هيكل الـ API، ونموذج العمل التجاري وخطة الإطلاق.',
                    'A complete architecture diagram description, data models, and a 4-week roadmap will be generated here.'
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
