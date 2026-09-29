import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DEVELOPER_PROFILE } from '../data/developerProfile';
import { ACCENT_THEMES } from '../utils/themeStyles';
import { soundFx } from '../utils/audioSynth';
import {
  Mail,
  Send,
  Github,
  CheckCircle2,
  Copy,
  Check,
  Calendar,
  Sparkles,
  MessageSquare,
} from 'lucide-react';

export const ContactView: React.FC = () => {
  const { accent, t, setAiModalOpen } = useApp();
  const currentTheme = ACCENT_THEMES[accent];

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [projectType, setProjectType] = useState('Bot Automation');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    soundFx.playChime();
    setSubmitted(true);
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(DEVELOPER_PROFILE.email);
    setCopiedEmail(true);
    soundFx.playLaser();
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-2">
          <Mail className="w-3.5 h-3.5" />
          <span>{t('قنوات التواصل وبدء مشروع', 'Contact Channels')}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          {t('تواصل مع GRY KJ لبدء مشروعك القادم', 'Get in Touch & Launch Your Project')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
          {t(
            'سواء كنت بحاجة إلى بوت أتمتة مخصص، أو دمج الذكاء الاصطناعي، أو استشارة تقنية لمعمارية نظامك البرمجي.',
            'Ready to build a high-performance bot, integrate LLMs, or consult on software architecture.'
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Direct Channels */}
        <div className="space-y-4">
          <div className="rounded-3xl p-6 bg-slate-900/80 border border-slate-800 space-y-4">
            <h3 className="font-bold text-white text-base">
              {t('قنوات التواصل المباشرة', 'Direct Channels')}
            </h3>

            {/* Email Card */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-emerald-400" />
                  {t('البريد الإلكتروني', 'Email')}
                </span>
                <button
                  onClick={copyEmail}
                  className="text-xs p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white flex items-center gap-1"
                >
                  {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedEmail ? t('تم النسخ', 'Copied') : t('نسخ', 'Copy')}</span>
                </button>
              </div>
              <a
                href={`mailto:${DEVELOPER_PROFILE.email}`}
                className="text-xs sm:text-sm font-mono font-bold text-cyan-400 hover:underline block break-all"
              >
                {DEVELOPER_PROFILE.email}
              </a>
            </div>

            {/* Telegram Card */}
            <a
              href={DEVELOPER_PROFILE.telegram}
              target="_blank"
              rel="noreferrer"
              className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 flex items-center justify-between group transition-colors block"
            >
              <div>
                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                  <Send className="w-4 h-4 text-blue-400" />
                  Telegram
                </span>
                <p className="text-xs sm:text-sm font-bold text-white mt-1 group-hover:text-cyan-400">
                  @GRYKJ249
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300">
                {t('دردشة فورية', 'Instant Chat')}
              </span>
            </a>

            {/* GitHub Card */}
            <a
              href={DEVELOPER_PROFILE.github}
              target="_blank"
              rel="noreferrer"
              className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 flex items-center justify-between group transition-colors block"
            >
              <div>
                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                  <Github className="w-4 h-4 text-purple-400" />
                  GitHub
                </span>
                <p className="text-xs sm:text-sm font-bold text-white mt-1 group-hover:text-cyan-400">
                  GRYKJ249
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300">
                {t('الملف والمشاريع', 'Profile')}
              </span>
            </a>
          </div>

          {/* AI Consultation Prompt */}
          <div className="rounded-3xl p-6 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 space-y-3">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>{t('هل تفضل استشارة ذكاء اصطناعي أولاً؟', 'Consult with AI First?')}</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t(
                'يمكنك محادثة مساعد GRY الذكي لتحديد متطلبات مشروعك بدقة قبل بدء العمل.',
                'Chat with the AI assistant to formulate technical requirements before booking.'
              )}
            </p>
            <button
              onClick={() => setAiModalOpen(true)}
              className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all ${currentTheme.btnPrimary}`}
            >
              {t('تحدث مع المساعد الذكي الآن', 'Open AI Assistant')}
            </button>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="rounded-3xl p-6 sm:p-8 bg-slate-900/80 border border-slate-800 shadow-lg">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  {t('تم استلام رسالتك بنجاح!', 'Message Received Successfully!')}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                  {t(
                    'شكراً لتواصلك، سيقوم GRY KJ بمراجعة تفاصيل المشروع والرد عليك في أقرب وقت عبر بريدك الإلكتروني.',
                    'Thank you for reaching out. GRY KJ will review your project specs and respond promptly via email.'
                  )}
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-xs text-cyan-400 font-semibold underline mt-2"
                >
                  {t('إرسال رسالة أخرى', 'Send another message')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-bold text-white text-base flex items-center gap-2 mb-2">
                  <MessageSquare className="w-5 h-5 text-cyan-400" />
                  <span>{t('نموذج طلب مشروع أو استشارة', 'Project Inquiry Form')}</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      {t('الاسم الكريم', 'Your Name')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t('مثال: محمد عبد الله', 'e.g. Alex Morgan')}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl p-3 text-xs sm:text-sm text-slate-200"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      {t('البريد الإلكتروني', 'Your Email Address')} *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="client@example.com"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl p-3 text-xs sm:text-sm text-slate-200"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    {t('مجال المشروع المطلوب', 'Project Type')}
                  </label>
                  <select
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl p-3 text-xs sm:text-sm text-slate-200"
                  >
                    <option value="Bot Automation">بوت أتمتة ذكي (تليجرام / فيسبوك / ديسكورد)</option>
                    <option value="AI Integration">دمج ذكاء اصطناعي (Gemini / LLMs / RAG)</option>
                    <option value="Full Stack App">تطبيق ويب متكامل (React + Node.js + DB)</option>
                    <option value="Web Scraping Fleet">محرك سحب بيانات واستخراج سحابي</option>
                    <option value="Cyber Security Audit">فحص وتدقيق أمني وحماية خوادم</option>
                    <option value="Other Consultation">استشارة تقنية أخرى</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    {t('تفاصيل ومواصفات المشروع', 'Project Details & Requirements')} *
                  </label>
                  <textarea
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    placeholder={t(
                      'اكتب نبذة عن فكرتك، الميزات الرئيسية المطلوبة، والموعد الزمني المستهدف...',
                      'Describe your project goals, key features, and timeline...'
                    )}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl p-3 text-xs sm:text-sm text-slate-200 leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  className={`w-full py-3.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${currentTheme.btnPrimary}`}
                >
                  <Send className="w-4 h-4" />
                  <span>{t('إرسال طلب المشروع الآن', 'Submit Inquiry to GRY KJ')}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
