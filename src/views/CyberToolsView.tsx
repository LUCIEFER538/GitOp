import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ACCENT_THEMES } from '../utils/themeStyles';
import { soundFx } from '../utils/audioSynth';
import {
  Shield,
  Radio,
  Lock,
  Unlock,
  Terminal,
  Activity,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Search,
} from 'lucide-react';

export const CyberToolsView: React.FC = () => {
  const { accent, t } = useApp();
  const currentTheme = ACCENT_THEMES[accent];

  // Tool 1: Port Scanner Simulator
  const [targetHost, setTargetHost] = useState('192.168.1.1');
  const [scanning, setScanning] = useState(false);
  const [scanLogs, setScanLogs] = useState<string[]>([
    'CyberGuard Port Reconnaissance Engine v2.1 ready.',
    'Enter target IP or hostname and click Run Recon Scanner.',
  ]);

  // Tool 2: Caesar Cipher
  const [caesarInput, setCaesarInput] = useState('Hello Cybersecurity World!');
  const [caesarShift, setCaesarShift] = useState(3);
  const [caesarOutput, setCaesarOutput] = useState('');

  // Tool 3: Security Header Evaluator
  const [testDomain, setTestDomain] = useState('example.com');
  const [headerAuditResult, setHeaderAuditResult] = useState<{
    hsts: boolean;
    csp: boolean;
    xframe: boolean;
    xss: boolean;
    score: string;
  } | null>(null);

  const runPortScan = () => {
    if (!targetHost.trim() || scanning) return;
    setScanning(true);
    soundFx.playClick();
    setScanLogs([`[+] Initializing SYN Stealth Scan against: ${targetHost}...`]);

    const steps = [
      `[>] Resolving DNS & host route verification for ${targetHost}...`,
      `[+] Port 22 (SSH/OpenSSH 8.9p1) - OPEN [Latency: 14ms]`,
      `[+] Port 80 (HTTP/Nginx 1.24) - OPEN (Redirecting to HTTPS)`,
      `[+] Port 443 (HTTPS/TLS 1.3) - OPEN [Valid Cert, TLSv1.3 Strong Cipher]`,
      `[-] Port 3306 (MySQL) - FILTERED / PROTECTED`,
      `[-] Port 6379 (Redis) - CLOSED / FIREWALLED`,
      `[+] Port 8080 (HTTP-Alt / Dev-Proxy) - OPEN`,
      `[✓] Scan completed in 1.42s. 4 ports open, 2 protected. Recon completed safely.`,
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setScanLogs((prev) => [...prev, step]);
        if (idx === steps.length - 1) {
          setScanning(false);
          soundFx.playChime();
        }
      }, (idx + 1) * 350);
    });
  };

  const handleCaesarEncrypt = () => {
    soundFx.playClick();
    let res = '';
    for (let i = 0; i < caesarInput.length; i++) {
      let code = caesarInput.charCodeAt(i);
      if (code >= 65 && code <= 90) {
        res += String.fromCharCode(((code - 65 + caesarShift) % 26) + 65);
      } else if (code >= 97 && code <= 122) {
        res += String.fromCharCode(((code - 97 + caesarShift) % 26) + 97);
      } else {
        res += caesarInput[i];
      }
    }
    setCaesarOutput(res);
  };

  const handleCaesarDecrypt = () => {
    soundFx.playClick();
    let res = '';
    const shift = (26 - (caesarShift % 26)) % 26;
    for (let i = 0; i < caesarInput.length; i++) {
      let code = caesarInput.charCodeAt(i);
      if (code >= 65 && code <= 90) {
        res += String.fromCharCode(((code - 65 + shift) % 26) + 65);
      } else if (code >= 97 && code <= 122) {
        res += String.fromCharCode(((code - 97 + shift) % 26) + 97);
      } else {
        res += caesarInput[i];
      }
    }
    setCaesarOutput(res);
  };

  const runHeaderAudit = () => {
    soundFx.playClick();
    setHeaderAuditResult({
      hsts: true,
      csp: testDomain.includes('secure') || testDomain.includes('com'),
      xframe: true,
      xss: true,
      score: 'A+ (95/100)',
    });
    soundFx.playChime();
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-semibold mb-2">
          <Shield className="w-3.5 h-3.5" />
          <span>{t('مختبر الأمن السيبراني واختبار الاختراق', 'Cybersecurity & Pentest Suite')}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          {t('أدوات الاستطلاع وفحص الشبكات والتشفير', 'Network Recon, Port Discovery & Cryptanalysis')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
          {t(
            'محاكاة عملية لفحص منافذ الخوادم، تدقيق ترويسات الحماية، وتشفير النصوص بخوارزميات كلاسيكية وحديثة.',
            'Simulated TCP port scanning, OWASP security header posture auditor, and classical cryptographic solvers.'
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tool 1: Port Scanner Simulator */}
        <div className="rounded-3xl p-5 sm:p-6 bg-slate-900/80 border border-slate-800 space-y-4 shadow-lg flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Radio className="w-4 h-4 text-cyan-400" />
              <span>{t('محاكي فحص المنافذ واكتشاف الخدمات (Port Scanner)', 'Network Port Scanner Simulator')}</span>
            </h3>

            <div className="flex gap-2">
              <input
                type="text"
                value={targetHost}
                onChange={(e) => setTargetHost(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs font-mono text-slate-200"
                placeholder="Target Host (e.g. 192.168.1.1 or api.domain.com)"
              />
              <button
                onClick={runPortScan}
                disabled={scanning}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${currentTheme.btnPrimary} disabled:opacity-50`}
              >
                {scanning ? <RefreshCw className="w-4 h-4 animate-spin" /> : t('فحص', 'Scan')}
              </button>
            </div>

            {/* Terminal Window */}
            <div className="h-60 rounded-xl bg-slate-950 p-3.5 font-mono text-xs overflow-y-auto space-y-1 text-slate-300 border border-slate-800 scrollbar-thin scrollbar-thumb-slate-800">
              {scanLogs.map((log, i) => (
                <div
                  key={i}
                  className={`${
                    log.includes('OPEN')
                      ? 'text-emerald-400 font-semibold'
                      : log.includes('CLOSED') || log.includes('FILTERED')
                      ? 'text-amber-400'
                      : 'text-slate-400'
                  }`}
                >
                  {log}
                </div>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800 pt-3">
            <span>{t('حالة الفاحص: نشط ومحمي', 'Scanner Status: Isolated')}</span>
            <span className="font-mono text-cyan-400">Stealth TCP SYN</span>
          </div>
        </div>

        {/* Tool 2: Caesar & Vigenere Cryptography */}
        <div className="rounded-3xl p-5 sm:p-6 bg-slate-900/80 border border-slate-800 space-y-4 shadow-lg flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>{t('مشفر ومفكك شفرة قيصر (Caesar Cipher)', 'Caesar Cipher Cryptography')}</span>
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-semibold">
                {t('النص المطلوب تشفيره أو فكه:', 'Text Input:')}
              </label>
              <input
                type="text"
                value={caesarInput}
                onChange={(e) => setCaesarInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl p-2.5 text-xs text-slate-200"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>{t('مقدار الإزاحة (Shift):', 'Shift Key:')} <strong className="text-amber-400 font-mono">{caesarShift}</strong></span>
              <input
                type="range"
                min="1"
                max="25"
                value={caesarShift}
                onChange={(e) => setCaesarShift(parseInt(e.target.value, 10))}
                className="w-40 accent-amber-400"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCaesarEncrypt}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${currentTheme.btnPrimary}`}
              >
                {t('تشفير النص', 'Encrypt')}
              </button>
              <button
                onClick={handleCaesarDecrypt}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              >
                {t('فك التشفير', 'Decrypt')}
              </button>
            </div>

            {caesarOutput && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-amber-400 break-all select-all">
                {caesarOutput}
              </div>
            )}
          </div>

          <p className="text-[11px] text-slate-400 border-t border-slate-800 pt-3">
            {t(
              'شفرة قيصر هي أقدم خوارزميات التشفير بالإزاحة وتستخدم في التدريب واختبارات فك الرموز.',
              'Caesar substitution cipher shifts letters along the alphabet based on key integer.'
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
