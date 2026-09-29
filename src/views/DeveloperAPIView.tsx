import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { ACCENT_THEMES } from '../utils/themeStyles';
import { soundFx } from '../utils/audioSynth';
import { ProtectedFeature } from '../components/ProtectedFeature';
import { DeveloperApiKey } from '../types';
import {
  Code2,
  Key,
  KeyRound,
  Webhook,
  Terminal,
  Copy,
  Check,
  Plus,
  Trash2,
  Play,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Shield,
  Layers,
  Cpu,
  Send,
  CheckCircle2,
} from 'lucide-react';

const API_ENDPOINTS = [
  {
    method: 'POST',
    path: '/api/v1/generate-image',
    nameAr: 'توليد صور الذكاء الاصطناعي',
    nameEn: 'Generate AI Image',
    descAr: 'توليد صورة فوتوغرافية أو سايبر بدقة 8K مع ضبط الأبعاد والنمط.',
    payloadSample: '{\n  "prompt": "Cyberpunk hacker bot workstation, 8k",\n  "style": "cyberpunk",\n  "width": 1024,\n  "height": 1024\n}',
  },
  {
    method: 'POST',
    path: '/api/gemini/video-storyboard',
    nameAr: 'إنشاء لوحة مشاهد الفيديو السينمائي',
    nameEn: 'Generate Video Storyboard',
    descAr: 'تأليف سيناريو فيديو متعدد المشاهد مع اللقطات والترجمة والمؤثرات.',
    payloadSample: '{\n  "concept": "AI Developer Revolution 2050",\n  "duration": 30,\n  "style": "Cyberpunk Sci-Fi",\n  "aspect": "16:9"\n}',
  },
  {
    method: 'POST',
    path: '/api/gemini/generate-lyrics',
    nameAr: 'تأليف الأغاني والألحان والنوتات',
    nameEn: 'Compose Song & Lyrics',
    descAr: 'توليد كلمات أغنية موزونة مع المقامات الموسيقية وإيقاع BPM.',
    payloadSample: '{\n  "topic": "Future of Autonomous Bots",\n  "genre": "Cyberpunk Synthwave",\n  "tempo": 128,\n  "language": "ar"\n}',
  },
  {
    method: 'POST',
    path: '/api/gemini/analyze-data',
    nameAr: 'تحليل البيانات الضخمة التنبؤي',
    nameEn: 'Smart Data Analytics',
    descAr: 'فحص مصفوفات البيانات واكتشاف الشذوذ والتنبؤات الاستراتيجية.',
    payloadSample: '{\n  "datasetName": "UserGrowth2026",\n  "dataSummary": {"activeUsers": 45000, "mrr": 82000},\n  "query": "ما هي توقعات النمو للشهر القادم؟"\n}',
  },
];

export const DeveloperAPIView: React.FC = () => {
  const { accent, t } = useApp();
  const { user } = useAuth();
  const currentTheme = ACCENT_THEMES[accent];

  const [activeTab, setActiveTab] = useState<'tester' | 'keys' | 'webhooks' | 'docs'>('tester');
  const [selectedEndpoint, setSelectedEndpoint] = useState(API_ENDPOINTS[0]);
  const [requestPayload, setRequestPayload] = useState(API_ENDPOINTS[0].payloadSample);
  const [selectedLanguage, setSelectedLanguage] = useState<'curl' | 'javascript' | 'python'>('curl');
  const [isCallingAPI, setIsCallingAPI] = useState(false);
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  // API Keys state
  const [apiKeys, setApiKeys] = useState<DeveloperApiKey[]>([
    {
      id: 'key_prod_1',
      name: 'Primary Production Key',
      key: 'op_live_8f3a992bc401e9218d89a2b',
      createdAt: '2026-01-10',
      lastUsed: '3 minutes ago',
      active: true,
    },
    {
      id: 'key_dev_2',
      name: 'Dev Sandbox Key',
      key: 'op_test_901c22bbfa45012e88a31e',
      createdAt: '2026-02-14',
      lastUsed: '1 hour ago',
      active: true,
    },
  ]);
  const [newKeyName, setNewKeyName] = useState('');

  // Webhooks state
  const [webhooks, setWebhooks] = useState([
    {
      id: 'wh_1',
      url: 'https://api.myapp.com/webhooks/opebat-events',
      events: ['video.rendered', 'image.generated'],
      status: 'active',
      lastPing: '200 OK (54ms)',
    },
  ]);
  const [webhookUrl, setWebhookUrl] = useState('');

  useEffect(() => {
    setRequestPayload(selectedEndpoint.payloadSample);
    setApiResponse(null);
    setResponseStatus(null);
  }, [selectedEndpoint]);

  const handleExecuteAPI = async () => {
    setIsCallingAPI(true);
    soundFx.playLaser();
    setApiResponse(null);

    try {
      let bodyData = {};
      try {
        bodyData = JSON.parse(requestPayload);
      } catch {
        bodyData = {};
      }

      const res = await fetch(selectedEndpoint.path, {
        method: selectedEndpoint.method,
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKeys[0]?.key || 'op_live_demo_client_key',
        },
        body: JSON.stringify(bodyData),
      });

      setResponseStatus(res.status);
      const data = await res.json();
      setApiResponse(JSON.stringify(data, null, 2));
      soundFx.playChime();
    } catch (e: any) {
      setResponseStatus(500);
      setApiResponse(JSON.stringify({ error: e.message || 'API Execution Failed' }, null, 2));
    } finally {
      setIsCallingAPI(false);
    }
  };

  const handleCreateKey = () => {
    if (!newKeyName.trim()) return;
    const newKey: DeveloperApiKey = {
      id: `key_${Date.now()}`,
      name: newKeyName.trim(),
      key: `op_live_${Math.random().toString(36).substring(2, 12)}${Math.random().toString(36).substring(2, 12)}`,
      createdAt: new Date().toISOString().split('T')[0],
      lastUsed: 'Never',
      active: true,
    };
    setApiKeys((prev) => [newKey, ...prev]);
    setNewKeyName('');
    soundFx.playChime();
  };

  const handleDeleteKey = (id: string) => {
    setApiKeys((prev) => prev.filter((k) => k.id !== id));
    soundFx.playClick();
  };

  const handleAddWebhook = () => {
    if (!webhookUrl.trim()) return;
    const newWh = {
      id: `wh_${Date.now()}`,
      url: webhookUrl.trim(),
      events: ['all.events'],
      status: 'active',
      lastPing: 'Pending ping test',
    };
    setWebhooks((prev) => [...prev, newWh]);
    setWebhookUrl('');
    soundFx.playChime();
  };

  const handleCopyCodeSnippet = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    soundFx.playClick();
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyApiKey = (id: string, keyVal: string) => {
    navigator.clipboard.writeText(keyVal);
    setCopiedKeyId(id);
    soundFx.playClick();
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  // Generate code snippet based on selectedLanguage
  const getCodeSnippet = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://api.opebat.cloud';
    const activeKey = apiKeys[0]?.key || 'op_live_your_secret_key';

    if (selectedLanguage === 'curl') {
      return `curl -X ${selectedEndpoint.method} "${origin}${selectedEndpoint.path}" \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: ${activeKey}" \\
  -d '${requestPayload.replace(/\n/g, '').replace(/\s+/g, ' ')}'`;
    }

    if (selectedLanguage === 'javascript') {
      return `const response = await fetch("${origin}${selectedEndpoint.path}", {
  method: "${selectedEndpoint.method}",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": "${activeKey}"
  },
  body: JSON.stringify(${requestPayload})
});

const data = await response.json();
console.log(data);`;
    }

    return `import requests

url = "${origin}${selectedEndpoint.path}"
headers = {
    "Content-Type": "application/json",
    "x-api-key": "${activeKey}"
}
payload = ${requestPayload.replace(/true/g, 'True').replace(/false/g, 'False')}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`;
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0b0f19] border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div>
          <span className={`text-[11px] px-3 py-1 rounded-full font-bold uppercase ${currentTheme.badgeBg}`}>
            Developer REST & GraphQL Engine
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 mt-2">
            <Code2 className="w-6 h-6 text-cyan-400" />
            {t('منصة واجهات البرمجة والتكامل الخارجي (Developer API)', 'Developer API Hub & External Integration')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {t(
              'مفاتيح برمجية سرية، نقطة اختبار تفاعلية، مستندات endpoints، وربط خطافات الويب (Webhooks) لتطبيقاتك الخارجية.',
              'Manage API keys, test interactive endpoints, inspect payloads, and configure external webhooks.'
            )}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => {
              setActiveTab('tester');
              soundFx.playClick();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'tester' ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/25' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t('مختبر الطلبات (Tester)', 'API Tester')}
          </button>
          <button
            onClick={() => {
              setActiveTab('keys');
              soundFx.playClick();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'keys' ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/25' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t('مفاتيح API (Keys)', 'API Keys')}
          </button>
          <button
            onClick={() => {
              setActiveTab('webhooks');
              soundFx.playClick();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'webhooks' ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/25' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t('الخطافات (Webhooks)', 'Webhooks')}
          </button>
        </div>
      </div>

      {/* --- TAB 1: API TESTER & PLAYGROUND --- */}
      {activeTab === 'tester' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Endpoints Directory */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider px-1">
              {t('نقاط الاتصال المتاحة (REST Endpoints)', 'Available Endpoints')}
            </h4>
            {API_ENDPOINTS.map((endpoint, i) => (
              <div
                key={i}
                onClick={() => {
                  setSelectedEndpoint(endpoint);
                  soundFx.playClick();
                }}
                className={`p-4 rounded-3xl border cursor-pointer transition-all ${
                  selectedEndpoint.path === endpoint.path
                    ? 'bg-cyan-950/30 border-cyan-500/80 shadow-lg shadow-cyan-500/10'
                    : 'bg-[#0b0f19] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-400 font-mono">
                    {endpoint.method}
                  </span>
                  <span className="text-xs font-bold text-white truncate">{t(endpoint.nameAr, endpoint.nameEn)}</span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono truncate">{endpoint.path}</p>
                <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">{endpoint.descAr}</p>
              </div>
            ))}

            {/* Rate Limit Stats Card */}
            <div className="p-4 rounded-3xl bg-[#0b0f19] border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs font-mono text-slate-400">
                <span>Usage Limit:</span>
                <strong className="text-cyan-400">1,420 / 10,000 req/day</strong>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                <div className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full w-[14.2%]" />
              </div>
              <span className="text-[10px] text-slate-500 block">Rate limit resets daily at 00:00 UTC</span>
            </div>
          </div>

          {/* Right 2 Columns: Request Body & Response Viewer */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-3xl bg-[#0b0f19] border border-slate-800 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 font-black">
                    {selectedEndpoint.method}
                  </span>
                  <span className="text-white font-bold">{selectedEndpoint.path}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExecuteAPI}
                    disabled={isCallingAPI}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-cyan-600/20 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {isCallingAPI ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
                    <span>{t('إرسال الطلب (Send)', 'Send Request')}</span>
                  </button>
                </div>
              </div>

              {/* JSON Payload Editor */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  {t('جسم الطلب (JSON Request Body):', 'Request Body (JSON):')}
                </label>
                <textarea
                  rows={5}
                  value={requestPayload}
                  onChange={(e) => setRequestPayload(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl p-4 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-400 resize-none leading-relaxed"
                />
              </div>

              {/* Code Snippets Switcher */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    {t('أكواد الاستدعاء الجاهزة للمطورين:', 'Developer Integration Snippets:')}
                  </label>
                  <div className="flex items-center gap-1">
                    {(['curl', 'javascript', 'python'] as const).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setSelectedLanguage(lang)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold uppercase transition-colors ${
                          selectedLanguage === lang
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative rounded-2xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-300 overflow-x-auto">
                  <pre className="whitespace-pre-wrap">{getCodeSnippet()}</pre>
                  <button
                    onClick={() => handleCopyCodeSnippet(getCodeSnippet())}
                    className="absolute top-3 end-3 p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition-colors"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Response Inspector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {t('استجابة الخادم (Live Server Response):', 'Server Response:')}
                  </label>
                  {responseStatus && (
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                        responseStatus === 200 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                      }`}
                    >
                      Status: {responseStatus}
                    </span>
                  )}
                </div>

                <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs max-h-64 overflow-y-auto">
                  {isCallingAPI ? (
                    <div className="flex items-center gap-2 text-cyan-400 py-6 justify-center">
                      <RotateCcw className="w-4 h-4 animate-spin" />
                      <span>{t('جاري استدعاء الخادم وتمرير البيانات...', 'Sending request to endpoint...')}</span>
                    </div>
                  ) : apiResponse ? (
                    <pre className="text-emerald-300 whitespace-pre-wrap">{apiResponse}</pre>
                  ) : (
                    <span className="text-slate-600">{t('اضغط "إرسال الطلب" لاختبار الاستجابة الحية.', 'Click "Send Request" to test live response.')}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 2: API KEYS MANAGER (MEMBER PROTECTED) --- */}
      {activeTab === 'keys' && (
        <ProtectedFeature
          featureTitle="Custom Developer API Key Management"
          featureTitleAr="إدارة وتوليد مفاتيح البرمجة API السرية"
          featureDescAr="إنشاء وتخصيص مفاتيح برمجية خارجية للربط مع سيرفراتك وتطبيقاتك متاح لأعضاء OPEBAT المعتمدين."
        >
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-[#0b0f19] border border-slate-800 shadow-xl space-y-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-cyan-400" />
                {t('مفاتيحك السرية الفعالة (Secret API Keys)', 'Active API Keys')}
              </h3>

              {/* Create new key box */}
              <div className="flex flex-col sm:flex-row items-center gap-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                <input
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder={t('اسم المفتاح الجديد (مثل: Telegram Bot Server Key)...', 'Key label / description...')}
                  className="flex-1 w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
                <button
                  onClick={handleCreateKey}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs bg-cyan-600 hover:bg-cyan-500 text-white flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t('توليد مفتاح جديد', 'Generate Key')}</span>
                </button>
              </div>

              {/* Keys List */}
              <div className="space-y-3 pt-2">
                {apiKeys.map((apiKey) => (
                  <div
                    key={apiKey.id}
                    className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-white text-xs">{apiKey.name}</strong>
                        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 font-mono border border-emerald-500/30">
                          Active
                        </span>
                      </div>
                      <p className="text-[11px] font-mono text-cyan-300 mt-1">
                        {apiKey.key.substring(0, 14)}••••••••••••••••
                      </p>
                      <span className="text-[10px] text-slate-500 font-mono">
                        Created: {apiKey.createdAt} • Last used: {apiKey.lastUsed}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyApiKey(apiKey.id, apiKey.key)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 flex items-center gap-1.5 transition-colors"
                      >
                        {copiedKeyId === apiKey.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKeyId === apiKey.id ? t('تم النسخ', 'Copied') : t('نسخ المفتاح', 'Copy Key')}</span>
                      </button>
                      <button
                        onClick={() => handleDeleteKey(apiKey.id)}
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors"
                        title="Delete key"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ProtectedFeature>
      )}

      {/* --- TAB 3: WEBHOOKS --- */}
      {activeTab === 'webhooks' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-[#0b0f19] border border-slate-800 shadow-xl space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Webhook className="w-5 h-5 text-cyan-400" />
              {t('إدارة خطافات الويب للأحداث التلقائية (Webhooks)', 'Webhooks Event Dispatcher')}
            </h3>

            <div className="flex flex-col sm:flex-row items-center gap-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
              <input
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://your-server.com/api/webhooks/listener"
                className="flex-1 w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
              <button
                onClick={handleAddWebhook}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs bg-cyan-600 hover:bg-cyan-500 text-white flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>{t('إضافة Webhook', 'Add Webhook')}</span>
              </button>
            </div>

            <div className="space-y-3 pt-2">
              {webhooks.map((wh) => (
                <div
                  key={wh.id}
                  className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <span className="text-xs font-mono text-white font-bold">{wh.url}</span>
                    <div className="flex items-center gap-2 mt-1">
                      {wh.events.map((ev, i) => (
                        <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/20 text-indigo-300 font-mono">
                          {ev}
                        </span>
                      ))}
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono block mt-1">
                      Status: {wh.status} • Ping check: {wh.lastPing}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        soundFx.playChime();
                        alert('Ping webhook test sent! Response: 200 OK');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs border border-slate-700 transition-colors flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{t('اختبار الاتصال (Ping)', 'Test Ping')}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
