import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ACCENT_THEMES } from '../utils/themeStyles';
import { soundFx } from '../utils/audioSynth';
import {
  X,
  Send,
  Bot,
  User,
  Sparkles,
  Trash2,
  Minimize2,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const AIChatModal: React.FC = () => {
  const { aiModalOpen, setAiModalOpen, accent, t, language } = useApp();
  const currentTheme = ACCENT_THEMES[accent];

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        language === 'ar'
          ? 'مرحباً بك! أنا المساعد الذكي لمطور الأنظمة والروبوتات GRY KJ. يمكنك سؤالي عن مشاريعه البرمجية، تقنيات الأتمتة والذكاء الاصطناعي، أو طلب استشارة تقنية لبناء مشروعك الخاص!'
          : 'Welcome! I am the official AI Assistant for GRY KJ. Ask me about his production bots, AI systems, full-stack projects, or get a technical consultation for your software idea!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (aiModalOpen) {
      scrollToBottom();
    }
  }, [messages, aiModalOpen]);

  const quickPrompts = [
    {
      ar: 'أخبرني عن مشروع SONA AI Bot',
      en: 'Tell me about the SONA AI Bot project',
    },
    {
      ar: 'ما هي خبراتك في الأتمتة و Webhooks؟',
      en: 'What are your strengths in Automation & Webhooks?',
    },
    {
      ar: 'كيف أصمم معمارية بوت ذكي للشركات؟',
      en: 'How to architect an enterprise AI bot?',
    },
    {
      ar: 'هل يمكن حجز استشارة أو بدء مشروع؟',
      en: 'How can I hire you or request a quote?',
    },
  ];

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    soundFx.playClick();
    const userMsg: Message = {
      id: 'user-' + Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: text,
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();
      const replyContent = data.reply || data.error || 'عذراً، حدث خطأ في الاتصال بالنموذج.';

      const assistantMsg: Message = {
        id: 'assistant-' + Date.now(),
        role: 'assistant',
        content: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      soundFx.playChime();
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: 'error-' + Date.now(),
          role: 'assistant',
          content:
            language === 'ar'
              ? 'حدث خطأ أثناء معالجة المحادثة. يمكنك أيضاً مراسلة GRY KJ مباشرة عبر تليجرام أو البريد الإلكتروني.'
              : 'Error connecting to the AI model. You can reach GRY KJ directly via Telegram or Email.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content:
          language === 'ar'
            ? 'تم بدء جلسة جديدة! كيف يمكنني مساعدتك بخصوص مشاريع وخبرات GRY KJ اليوم؟'
            : 'New session started! How can I assist you regarding GRY KJ projects and expertise today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    soundFx.playClick();
  };

  if (!aiModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl h-[85vh] max-h-[700px] flex flex-col rounded-2xl bg-[#0b0f19] border border-slate-700/80 shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="px-4 py-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-cyan-500/10 ${currentTheme.textAccent}`}>
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-sm">
                  {t('المساعد الذكي لـ GRY KJ', 'GRY KJ AI Assistant')}
                </h3>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/15 text-emerald-400 font-mono flex items-center gap-1 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Gemini 3.8
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {t('جاهز للإجابة عن المشاريع والأتمتة والتقنيات', 'Trained on portfolio projects, bots & architecture')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleClear}
              className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800/80 transition-colors"
              title={t('مسح المحادثة', 'Clear Chat')}
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setAiModalOpen(false)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
              title={t('إغلاق', 'Close')}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-slate-950/60 border-b border-slate-800/60 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[10px] text-slate-400 shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            {t('اقتراحات:', 'Try asking:')}
          </span>
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(t(q.ar, q.en))}
              disabled={loading}
              className="text-[11px] px-2.5 py-1 rounded-full bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700/80 border border-slate-700/60 whitespace-nowrap transition-colors"
            >
              {t(q.ar, q.en)}
            </button>
          ))}
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? (language === 'ar' ? 'flex-row' : 'flex-row-reverse') : (language === 'ar' ? 'flex-row-reverse' : 'flex-row')}`}
              >
                <div
                  className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold ${
                    isUser
                      ? 'bg-slate-800 text-slate-300 border border-slate-700'
                      : `bg-slate-900 ${currentTheme.textAccent} border border-cyan-500/30 shadow-md`
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className={`max-w-[82%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words ${
                      isUser
                        ? `${currentTheme.btnPrimary} text-slate-950 font-medium`
                        : 'bg-slate-900/90 text-slate-200 border border-slate-800 shadow-md'
                    }`}
                  >
                    {msg.content}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className={`flex gap-3 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center bg-slate-900 ${currentTheme.textAccent} border border-cyan-500/30`}>
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                <span>{t('جارٍ التفكير وتجهيز الرد بالذكاء الاصطناعي...', 'AI is reasoning and drafting response...')}</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-slate-900/90 border-t border-slate-800 flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t(
              'اكتب رسالتك أو استفسارك هنا (مثال: اشرح لي ميزات بوت سونا)...',
              'Ask a question or request technical details...'
            )}
            className="flex-1 bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className={`p-2.5 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${currentTheme.btnPrimary}`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
