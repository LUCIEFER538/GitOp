import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { ACCENT_THEMES } from '../utils/themeStyles';
import { AIModelEngine, ChatMessage } from '../types';
import {
  Sparkles,
  Send,
  Trash2,
  Download,
  Copy,
  Check,
  Volume2,
  VolumeX,
  Bot,
  User,
  Sliders,
  ChevronDown,
  ChevronUp,
  Code2,
  Zap,
  Terminal,
  Cpu,
} from 'lucide-react';

const AI_ENGINES: AIModelEngine[] = [
  {
    id: 'gpt-4o',
    name: 'ChatGPT (GPT-4o)',
    provider: 'OpenAI',
    tagline: 'Versatile Multimodal Flagship',
    taglineAr: 'المساعد الذكي المتكامل والأكثر شمولاً',
    icon: 'Bot',
    color: 'from-emerald-500 to-teal-600',
    badge: 'GPT-4o Mode',
    systemPrompt: 'You are ChatGPT GPT-4o. Provide crisp, structured, professional answers with deep code examples and reasoning.',
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    tagline: 'Deep Architectural Reasoning & Writing',
    taglineAr: 'المنطق البرمجي والتحليلي فائق الدقة',
    icon: 'Cpu',
    color: 'from-amber-500 to-orange-600',
    badge: 'Sonnet 3.5 Mode',
    systemPrompt: 'You are Claude 3.5 Sonnet. Emphasize nuance, architectural elegance, and clean idiomatic code.',
  },
  {
    id: 'gemini-3-8-flash',
    name: 'Google Gemini 3.8 Flash',
    provider: 'Google AI',
    tagline: 'Ultra-Fast Real-Time Intelligence',
    taglineAr: 'فائق السرعة مع أحدث تقنيات جوجل',
    icon: 'Sparkles',
    color: 'from-cyan-500 to-blue-600',
    badge: 'Gemini 3.8 Flash',
    systemPrompt: 'You are Gemini 3.8 Flash. Provide blazing fast, concise, modern developer answers.',
  },
  {
    id: 'deepseek-r1',
    name: 'DeepSeek-R1 (Reasoning)',
    provider: 'DeepSeek AI',
    tagline: 'Open Chain-of-Thought Mathematical Logic',
    taglineAr: 'نمط التفكير المتسلسل والاستنتاج الرياضي',
    icon: 'Terminal',
    color: 'from-blue-600 to-indigo-600',
    badge: 'R1 Chain of Thought',
    systemPrompt: 'You are DeepSeek-R1. Include a thorough <think> reasoning process before the final conclusion.',
  },
  {
    id: 'copilot',
    name: 'GitHub Copilot Architect',
    provider: 'GitHub',
    tagline: 'Pure Code & Test Pair Programmer',
    taglineAr: 'المبرمج المساعد لكتابة واختبار الأكواد',
    icon: 'Code2',
    color: 'from-purple-500 to-violet-600',
    badge: 'Copilot Code Mode',
    systemPrompt: 'You are GitHub Copilot. Focus almost purely on production-ready code, performance, and unit tests.',
  },
];

export const MultiAIChatView: React.FC = () => {
  const { accent, t } = useApp();
  const { user } = useAuth();
  const currentTheme = ACCENT_THEMES[accent];

  const [selectedEngine, setSelectedEngine] = useState<AIModelEngine>(AI_ENGINES[0]);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'msg-welcome',
        role: 'assistant',
        content: `مرحباً بك! أنا أعمل حالياً بنمط **${AI_ENGINES[0].name}**.\n\nيمكنك التبديل بين النماذج الرائدة (ChatGPT, Claude, Gemini, DeepSeek R1, Copilot) في أي وقت عبر القائمة العلوية.\nاطرح أي سؤال برمجي، اطلب تحليل كود، أو بناء معمارية تطبيق متكاملة!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: AI_ENGINES[0].name,
      },
    ];
  });
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [temperature, setTemperature] = useState(0.7);
  const [showSettings, setShowSettings] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputMessage;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInputMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/gemini/multi-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modelId: selectedEngine.id,
          userMessage: userMsg.content,
          messages: messages.slice(-6).map((m) => ({ role: m.role, content: m.content })),
          temperature,
        }),
      });

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        role: 'assistant',
        content: data.reply || t('عذراً، لم أتمكن من استلام الرد.', 'Sorry, failed to get response.'),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: selectedEngine.name,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: `bot_err_${Date.now()}`,
        role: 'assistant',
        content: t('حدث خطأ في الاتصال بالنموذج. يرجى المحاولة لاحقاً.', 'Failed to communicate with AI model.'),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: selectedEngine.name,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (id: string, text: string) => {
    if ('speechSynthesis' in window) {
      if (speakingId === id) {
        window.speechSynthesis.cancel();
        setSpeakingId(null);
        return;
      }

      window.speechSynthesis.cancel();
      // Remove think tags and markdown
      const cleanText = text.replace(/<think>[\s\S]*?<\/think>/g, '').replace(/[#*`_]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.onend = () => setSpeakingId(null);
      utterance.onerror = () => setSpeakingId(null);
      setSpeakingId(id);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleExportChat = (format: 'markdown' | 'json') => {
    if (format === 'json') {
      const blob = new Blob([JSON.stringify(messages, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `opebat-ai-chat-${Date.now()}.json`;
      a.click();
    } else {
      const mdContent = messages
        .map((m) => `### ${m.role === 'user' ? 'User' : m.model || 'AI'}\n*${m.timestamp}*\n\n${m.content}\n\n---\n`)
        .join('\n');
      const blob = new Blob([mdContent], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `opebat-ai-chat-${Date.now()}.md`;
      a.click();
    }
  };

  const renderMessageContent = (content: string) => {
    // Check for DeepSeek <think> reasoning tags
    const thinkMatch = content.match(/<think>([\s\S]*?)<\/think>/);
    const thinkContent = thinkMatch ? thinkMatch[1].trim() : null;
    const mainContent = content.replace(/<think>[\s\S]*?<\/think>/, '').trim();

    return (
      <div className="space-y-3">
        {thinkContent && (
          <details className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 font-mono">
            <summary className="cursor-pointer text-cyan-400 font-semibold flex items-center gap-1.5 select-none hover:text-cyan-300">
              <Terminal className="w-3.5 h-3.5" />
              <span>{t('سلسلة التفكير والاستنتاج (Chain of Thought)', 'Reasoning Process (Chain of Thought)')}</span>
            </summary>
            <div className="mt-2.5 pt-2.5 border-t border-slate-800/80 text-slate-400 whitespace-pre-wrap leading-relaxed">
              {thinkContent}
            </div>
          </details>
        )}

        <div className="whitespace-pre-wrap leading-relaxed text-sm">
          {mainContent || content}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto h-[84vh] flex flex-col animate-in fade-in duration-300">
      {/* Top Model Switcher & Settings Bar */}
      <div className="bg-[#0b0f19] border border-slate-800/90 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Model Switcher Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none pb-1 sm:pb-0">
          {AI_ENGINES.map((engine) => {
            const isSelected = selectedEngine.id === engine.id;
            return (
              <button
                key={engine.id}
                onClick={() => setSelectedEngine(engine)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
                  isSelected
                    ? `bg-gradient-to-r ${engine.color} text-white shadow-lg shadow-black/40 scale-105`
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>{engine.name}</span>
                <span className="text-[10px] opacity-75 hidden md:inline">({engine.provider})</span>
              </button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-xl text-xs border transition-colors flex items-center gap-1.5 ${
              showSettings ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span className="hidden sm:inline">{t('الإعدادات', 'Settings')}</span>
          </button>

          <button
            onClick={() => handleExportChat('markdown')}
            title={t('تصدير المحادثة', 'Export Chat')}
            className="p-2 rounded-xl text-xs bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={() => setMessages([])}
            title={t('مسح المحادثة', 'Clear Chat')}
            className="p-2 rounded-xl text-xs bg-slate-900 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expandable Model Settings Box */}
      {showSettings && (
        <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-wrap items-center justify-between gap-4 text-xs animate-in slide-in-from-top-2">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-slate-300">{t('درجة الإبداع (Temperature):', 'Temperature:')}</span>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="accent-cyan-500 w-32"
            />
            <span className="font-mono text-cyan-400 font-bold">{temperature}</span>
          </div>

          <div className="text-slate-400 font-mono text-[11px]">
            {t('النموذج النشط:', 'Active Persona:')} <span className="text-slate-200">{selectedEngine.taglineAr}</span>
          </div>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 bg-[#07090e] border border-slate-800/90 rounded-2xl p-4 sm:p-6 overflow-y-auto space-y-4 shadow-inner scrollbar-thin scrollbar-thumb-slate-800">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
                  isUser
                    ? 'bg-gradient-to-tr from-cyan-600 to-blue-600 text-white'
                    : `bg-gradient-to-tr ${selectedEngine.color} text-white`
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-[85%] sm:max-w-[75%] space-y-1 ${isUser ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-2 px-1 text-[11px] text-slate-400 font-mono">
                  <span>{isUser ? user?.name || 'You' : msg.model || selectedEngine.name}</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div
                  className={`p-4 rounded-2xl relative group ${
                    isUser
                      ? 'bg-cyan-600 text-white rounded-te-none shadow-lg shadow-cyan-600/10'
                      : 'bg-[#0f1422] text-slate-100 border border-slate-800/80 rounded-ts-none shadow-lg'
                  }`}
                >
                  {renderMessageContent(msg.content)}

                  {!isUser && (
                    <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-end gap-2 text-slate-400">
                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="p-1 hover:text-white rounded"
                        title={t('نسخ النص', 'Copy')}
                      >
                        {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => handleSpeak(msg.id, msg.content)}
                        className="p-1 hover:text-white rounded"
                        title={t('قراءة صوتية', 'Read Aloud')}
                      >
                        {speakingId === msg.id ? <VolumeX className="w-3.5 h-3.5 text-cyan-400 animate-pulse" /> : <Volume2 className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${selectedEngine.color} flex items-center justify-center text-white shrink-0`}>
              <Bot className="w-4 h-4 animate-pulse" />
            </div>
            <div className="bg-[#0f1422] border border-slate-800 p-4 rounded-2xl rounded-ts-none text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]" />
              <span className="ms-2 font-mono">{selectedEngine.name} {t('يفكر ويكتب الإجابة...', 'is thinking...')}</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
        {[
          { labelAr: 'إعادة هيكلة كود React', labelEn: 'Refactor React Component', prompt: 'Refactor this React component to modern clean code with TypeScript, useMemo, and custom hooks:' },
          { labelAr: 'فحص ثغرات SQLi و XSS', labelEn: 'OWASP Security Audit', prompt: 'Audit this code snippet for OWASP security vulnerabilities like SQL Injection and XSS:' },
          { labelAr: 'كتابة اختبارات Unit Tests', labelEn: 'Generate Unit Tests', prompt: 'Write comprehensive unit tests with Vitest/Jest covering edge cases for:' },
          { labelAr: 'تصميم معمارية سحابية Microservices', labelEn: 'Microservices Architecture', prompt: 'Architect a distributed microservices system handling 100k RPS with Redis caching and Docker:' },
        ].map((item, i) => (
          <button
            key={i}
            onClick={() => handleSend(item.prompt)}
            className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 text-xs border border-slate-800/80 whitespace-nowrap transition-colors flex items-center gap-1.5"
          >
            <Zap className="w-3 h-3 text-cyan-400" />
            <span>{t(item.labelAr, item.labelEn)}</span>
          </button>
        ))}
      </div>

      {/* Input Form Bar */}
      <div className="bg-[#0b0f19] border border-slate-800/90 rounded-2xl p-2.5 shadow-xl flex items-center gap-2">
        <textarea
          rows={1}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder={t(`اطرح سؤالك على ${selectedEngine.name}... (اضغط Enter للإرسال)`, `Ask ${selectedEngine.name}... (Press Enter to send)`)}
          className="flex-1 bg-transparent border-0 text-sm text-slate-100 placeholder-slate-500 focus:outline-none px-3 py-2 resize-none"
        />

        <button
          onClick={() => handleSend()}
          disabled={!inputMessage.trim() || loading}
          className={`p-3 rounded-xl text-white font-bold transition-all ${
            !inputMessage.trim() || loading
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : `bg-gradient-to-r ${selectedEngine.color} shadow-lg active:scale-95`
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
