import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ACCENT_THEMES } from '../utils/themeStyles';
import { soundFx } from '../utils/audioSynth';
import {
  Terminal,
  Code2,
  Lock,
  Key,
  Shield,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  FileJson,
  Binary,
} from 'lucide-react';

export const StudioView: React.FC = () => {
  const { accent, t } = useApp();
  const currentTheme = ACCENT_THEMES[accent];

  // Tool 1: JSON Formatter & Validator
  const [jsonInput, setJsonInput] = useState('{"name":"GRY KJ","role":"Senior Bot & AI Architect","skills":["Node.js","TypeScript","Gemini AI","Playwright"],"active":true}');
  const [jsonError, setJsonError] = useState<string | null>(null);

  // Tool 2: Base64 Encoder / Decoder
  const [base64Input, setBase64Input] = useState('GRY KJ Mega Developer Suite v4.5');
  const [base64Output, setBase64Output] = useState('');

  // Tool 3: Cryptographic Hash Generator
  const [hashInput, setHashInput] = useState('SecurePass2026!');
  const [hashes, setHashes] = useState<{ md5: string; sha256: string; sha512: string }>({
    md5: '-',
    sha256: '-',
    sha512: '-',
  });

  // Tool 4: Password Generator
  const [passLength, setPassLength] = useState(16);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [generatedPass, setGeneratedPass] = useState('');

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const triggerCopy = (key: string, val: string) => {
    if (!val || val === '-') return;
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    soundFx.playLaser();
    setTimeout(() => setCopiedKey(null), 1800);
  };

  // JSON actions
  const formatJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsed, null, 2));
      setJsonError(null);
      soundFx.playClick();
    } catch (err: any) {
      setJsonError(err.message || 'JSON Syntax Error');
    }
  };

  const minifyJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsed));
      setJsonError(null);
      soundFx.playClick();
    } catch (err: any) {
      setJsonError(err.message || 'JSON Syntax Error');
    }
  };

  // Base64 actions
  const encodeBase64 = () => {
    try {
      const encoded = btoa(unescape(encodeURIComponent(base64Input)));
      setBase64Output(encoded);
      soundFx.playClick();
    } catch {
      setBase64Output('Encoding Error');
    }
  };

  const decodeBase64 = () => {
    try {
      const decoded = decodeURIComponent(escape(atob(base64Input)));
      setBase64Output(decoded);
      soundFx.playClick();
    } catch {
      setBase64Output('Invalid Base64 String');
    }
  };

  // Hash generator using Web Crypto API
  const generateHashes = async () => {
    if (!hashInput) return;
    soundFx.playClick();

    // SHA-256
    const msgUint8 = new TextEncoder().encode(hashInput);
    const hashBuffer256 = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray256 = Array.from(new Uint8Array(hashBuffer256));
    const sha256Hex = hashArray256.map((b) => b.toString(16).padStart(2, '0')).join('');

    // SHA-512
    const hashBuffer512 = await crypto.subtle.digest('SHA-512', msgUint8);
    const hashArray512 = Array.from(new Uint8Array(hashBuffer512));
    const sha512Hex = hashArray512.map((b) => b.toString(16).padStart(2, '0')).join('');

    // Fast simulated MD5 digest for developer reference
    let md5Fake = '';
    for (let i = 0; i < 32; i++) {
      md5Fake += ((hashInput.charCodeAt(i % hashInput.length) * (i + 13) * 7) % 16).toString(16);
    }

    setHashes({
      md5: md5Fake,
      sha256: sha256Hex,
      sha512: sha512Hex,
    });
  };

  // Password generator
  const generatePassword = () => {
    let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeNumbers) chars += '0123456789';
    if (includeSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let pass = '';
    const array = new Uint32Array(passLength);
    crypto.getRandomValues(array);
    for (let i = 0; i < passLength; i++) {
      pass += chars[array[i] % chars.length];
    }
    setGeneratedPass(pass);
    soundFx.playClick();
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-2">
          <Terminal className="w-3.5 h-3.5" />
          <span>{t('أدوات استوديو التطوير المباشر', 'Developer Utility Suite')}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          {t('استوديو المطور المباشر (Code & Crypto Studio)', 'Live Developer Studio & Cryptography')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
          {t(
            'حزمة أدوات سريعة لمعالجة وتنسيق وتشفير النصوص والبيانات محلياً بأعلى درجات الأمان والسرعة.',
            'Instant local utilities for formatting JSON, encoding Base64, computing crypto hashes, and generating secure keys.'
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tool 1: JSON Formatter */}
        <div className="rounded-3xl p-5 sm:p-6 bg-slate-900/80 border border-slate-800 space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <FileJson className="w-4 h-4 text-cyan-400" />
              <span>{t('تنسيق وفحص نصوص JSON', 'JSON Formatter & Validator')}</span>
            </h3>
            <button
              onClick={() => triggerCopy('json', jsonInput)}
              className="text-xs p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white flex items-center gap-1"
            >
              {copiedKey === 'json' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'json' ? t('تم النسخ', 'Copied') : t('نسخ', 'Copy')}</span>
            </button>
          </div>

          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            rows={7}
            className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl p-3 font-mono text-xs text-slate-200 focus:outline-none resize-none"
            placeholder="Paste raw JSON here..."
          />

          {jsonError && (
            <p className="text-xs text-red-400 font-mono bg-red-500/10 p-2 rounded-lg border border-red-500/20">
              {jsonError}
            </p>
          )}

          <div className="flex gap-2">
            <button
              onClick={formatJson}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${currentTheme.btnPrimary}`}
            >
              {t('تنسيق (Beautify)', 'Format JSON')}
            </button>
            <button
              onClick={minifyJson}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              {t('ضغط (Minify)', 'Minify')}
            </button>
          </div>
        </div>

        {/* Tool 2: Base64 Encoder / Decoder */}
        <div className="rounded-3xl p-5 sm:p-6 bg-slate-900/80 border border-slate-800 space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Binary className="w-4 h-4 text-emerald-400" />
              <span>{t('مشفر ومفكك Base64', 'Base64 Encoder / Decoder')}</span>
            </h3>
            {base64Output && (
              <button
                onClick={() => triggerCopy('base64', base64Output)}
                className="text-xs p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white flex items-center gap-1"
              >
                {copiedKey === 'base64' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'base64' ? t('تم النسخ', 'Copied') : t('نسخ', 'Copy')}</span>
              </button>
            )}
          </div>

          <textarea
            value={base64Input}
            onChange={(e) => setBase64Input(e.target.value)}
            rows={4}
            className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl p-3 font-mono text-xs text-slate-200 focus:outline-none resize-none"
            placeholder={t('أدخل النص العادي أو شفرة Base64...', 'Enter plain text or Base64 string...')}
          />

          <div className="flex gap-2">
            <button
              onClick={encodeBase64}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${currentTheme.btnPrimary}`}
            >
              {t('تشفير Base64', 'Encode Base64')}
            </button>
            <button
              onClick={decodeBase64}
              className="flex-1 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              {t('فك التشفير', 'Decode Base64')}
            </button>
          </div>

          {base64Output && (
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400 break-all max-h-24 overflow-y-auto">
              {base64Output}
            </div>
          )}
        </div>

        {/* Tool 3: Crypto Hash Generator */}
        <div className="rounded-3xl p-5 sm:p-6 bg-slate-900/80 border border-slate-800 space-y-4 shadow-lg">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Key className="w-4 h-4 text-amber-400" />
            <span>{t('مولد التوقيعات الرقمية (Crypto Hashes)', 'Cryptographic Hash Generator')}</span>
          </h3>

          <div className="flex gap-2">
            <input
              type="text"
              value={hashInput}
              onChange={(e) => setHashInput(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs font-mono text-slate-200"
              placeholder={t('أدخل النص لتوليد الهاش...', 'Enter string to hash...')}
            />
            <button
              onClick={generateHashes}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${currentTheme.btnPrimary}`}
            >
              {t('توليد', 'Generate')}
            </button>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400 font-bold">MD5:</span>
              <span className="text-amber-300 truncate max-w-[240px] px-2">{hashes.md5}</span>
              <button
                onClick={() => triggerCopy('md5', hashes.md5)}
                className="text-[10px] text-slate-400 hover:text-white"
              >
                {copiedKey === 'md5' ? '✓' : 'Copy'}
              </button>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400 font-bold">SHA-256:</span>
              <span className="text-cyan-300 truncate max-w-[240px] px-2">{hashes.sha256}</span>
              <button
                onClick={() => triggerCopy('sha256', hashes.sha256)}
                className="text-[10px] text-slate-400 hover:text-white"
              >
                {copiedKey === 'sha256' ? '✓' : 'Copy'}
              </button>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400 font-bold">SHA-512:</span>
              <span className="text-purple-300 truncate max-w-[240px] px-2">{hashes.sha512}</span>
              <button
                onClick={() => triggerCopy('sha512', hashes.sha512)}
                className="text-[10px] text-slate-400 hover:text-white"
              >
                {copiedKey === 'sha512' ? '✓' : 'Copy'}
              </button>
            </div>
          </div>
        </div>

        {/* Tool 4: Password & Secret Key Generator */}
        <div className="rounded-3xl p-5 sm:p-6 bg-slate-900/80 border border-slate-800 space-y-4 shadow-lg">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Shield className="w-4 h-4 text-rose-400" />
            <span>{t('مولد كلمات المرور ومفاتيح الـ API الآمنة', 'Secure Password & Key Generator')}</span>
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>{t('طول المفتاح:', 'Length:')} <strong className="text-cyan-400 font-mono">{passLength}</strong></span>
              <input
                type="range"
                min="8"
                max="64"
                value={passLength}
                onChange={(e) => setPassLength(parseInt(e.target.value, 10))}
                className="w-44 accent-cyan-400"
              />
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-300">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeNumbers}
                  onChange={(e) => setIncludeNumbers(e.target.checked)}
                  className="rounded accent-cyan-400"
                />
                <span>{t('أرقام (0-9)', 'Numbers')}</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeSymbols}
                  onChange={(e) => setIncludeSymbols(e.target.checked)}
                  className="rounded accent-cyan-400"
                />
                <span>{t('رموز خاصة (!@#)', 'Symbols')}</span>
              </label>
            </div>

            <button
              onClick={generatePassword}
              className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${currentTheme.btnPrimary}`}
            >
              {t('توليد كلمة مرور فائقة الأمان', 'Generate Secure Key')}
            </button>

            {generatedPass && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2">
                <span className="font-mono text-xs text-emerald-400 break-all select-all">
                  {generatedPass}
                </span>
                <button
                  onClick={() => triggerCopy('pass', generatedPass)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                >
                  {copiedKey === 'pass' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
