import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { ACCENT_THEMES } from '../utils/themeStyles';
import { soundFx } from '../utils/audioSynth';
import { ProtectedFeature } from '../components/ProtectedFeature';
import { VideoScene, VideoStoryboard } from '../types';
import {
  Film,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  Scissors,
  Layers,
  Download,
  Copy,
  Check,
  Clapperboard,
  Tv,
  Smartphone,
  Square,
  Wand2,
  Clock,
  Volume2,
  Subtitles,
  Share2,
  CheckCircle2,
} from 'lucide-react';

const SAMPLE_STORYBOARD: VideoStoryboard = {
  title: 'صعود الذكاء السيبراني (Ascent of Cyber Intelligence)',
  aspect: '16:9',
  totalDuration: 30,
  scenes: [
    {
      id: 'scene-1',
      timestamp: '00:00 - 00:08',
      shot: 'Drone Wide Establishing Shot',
      description: 'لقطة جوية بانورامية لمدينة نيون مستقبلية في عام 2050، مع ناطحات سحاب ثلاثية الأبعاد وسيارات رقمية طائرة.',
      visualPrompt: 'panoramic aerial drone shot of futuristic cyberpunk mega city, neon holograms, glowing wet asphalt, volumetric fog, cinematic lighting, 8k',
      audioEffect: 'Heavy atmospheric synth drone with distant thunder and city hum',
      subtitleAr: 'في عام 2050... بدأت الثورة الرقمية العظمى',
      subtitleEn: 'In 2050, the grand digital revolution was born.',
      duration: 8,
    },
    {
      id: 'scene-2',
      timestamp: '00:08 - 00:16',
      shot: 'Macro Cybernetic Close-Up',
      description: 'مهندس برمجيات ذكاء اصطناعي يرتدي نظارة الواقع المعزز ويتفاعل مع واجهات برمجية ثلاثية الأبعاد عائمة في الهواء.',
      visualPrompt: 'close-up shot of cybernetic software engineer typing on floating holographic code interfaces, blue and amber optical lens flares',
      audioEffect: 'High-speed keyboard typing and quantum server hum',
      subtitleAr: 'عقولٌ تصنع الغد بأكواد برمجية خارقة',
      subtitleEn: 'Minds shaping tomorrow through transcendent code.',
      duration: 8,
    },
    {
      id: 'scene-3',
      timestamp: '00:16 - 00:24',
      shot: 'Dynamic Hyper-Motion Pan',
      description: 'روبوت أمني ذاتي ينطلق بسرعة فائقة عبر ممر رقمي لمنع اختراق سيبراني للشبكة المركزية.',
      visualPrompt: 'sleek humanoid cybernetic bot sprinting through glowing optical data tunnel, motion blur, ray tracing',
      audioEffect: 'Bass riser with sub-bass drop and glitch impact',
      subtitleAr: 'أنظمة دفاع ذاتية تحمي المعرفة الإنسانية',
      subtitleEn: 'Autonomous defense systems guarding human knowledge.',
      duration: 8,
    },
    {
      id: 'scene-4',
      timestamp: '00:24 - 00:30',
      shot: 'Hero Climax & Outro Shot',
      description: 'ظهور شعار منصة OPEBAT يضيء في سماء المدينة مع انبعاث جزيئات ضوئية متلألئة في الأفق.',
      visualPrompt: 'futuristic holographic emblem glowing brightly in the night sky, particle explosion, cinematic bokeh',
      audioEffect: 'Triumphant orchestral synth crescendo',
      subtitleAr: 'OPEBAT - المنصة الأولى لمطوري المستقبل',
      subtitleEn: 'OPEBAT: The ultimate workstation for future builders.',
      duration: 6,
    },
  ],
  editingTips: [
    'استخدم انتقال Glitch Transition السريع بين المشهدين الثاني والثالث.',
    'قم بتطبيق تصحيح ألوان سينمائي (Teal & Orange Grade) لإبراز تفاصيل النيون.',
    'أضف مؤثر صوتي Sub-drop عند ظهور الشعار النهائي.',
  ],
};

export const AIVideoStudioView: React.FC = () => {
  const { accent, t } = useApp();
  const { isAuthenticated } = useAuth();
  const currentTheme = ACCENT_THEMES[accent];

  const [concept, setConcept] = useState('إعلان سينمائي ترويجي لمنظومة OPEBAT البرمجية مع مشاهد روبوتات ذكية وشاشات نيون');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1'>('16:9');
  const [targetDuration, setTargetDuration] = useState(30);
  const [videoStyle, setVideoStyle] = useState('Cyberpunk Sci-Fi');
  const [isGenerating, setIsGenerating] = useState(false);
  const [storyboard, setStoryboard] = useState<VideoStoryboard>(SAMPLE_STORYBOARD);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isRenderingVideo, setIsRenderingVideo] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [renderedSuccess, setRenderedSuccess] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  const videoCanvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number | null>(null);

  // Playhead scrubber
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= storyboard.totalDuration) {
            setIsPlaying(false);
            return 0;
          }
          const next = prev + 0.5;
          // Determine active scene based on time
          let accumulated = 0;
          for (let i = 0; i < storyboard.scenes.length; i++) {
            accumulated += storyboard.scenes[i].duration;
            if (next <= accumulated) {
              setActiveSceneIndex(i);
              break;
            }
          }
          return next;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, storyboard]);

  // Video canvas preview simulation
  useEffect(() => {
    const canvas = videoCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;
    const render = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Base background
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      const scene = storyboard.scenes[activeSceneIndex] || storyboard.scenes[0];

      if (activeSceneIndex === 0) {
        grad.addColorStop(0, '#020617');
        grad.addColorStop(1, '#0f172a');
      } else if (activeSceneIndex === 1) {
        grad.addColorStop(0, '#0c1a2e');
        grad.addColorStop(1, '#1e1b4b');
      } else if (activeSceneIndex === 2) {
        grad.addColorStop(0, '#1a0528');
        grad.addColorStop(1, '#03253b');
      } else {
        grad.addColorStop(0, '#052e16');
        grad.addColorStop(1, '#022c22');
      }

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Cyber grid lines
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.15)';
      ctx.lineWidth = 1;
      const gridOffset = (frame * 1.5) % 40;
      for (let y = gridOffset; y < canvas.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Simulated glowing neon focus element
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2 - 20;
      const radius = 60 + Math.sin(frame * 0.05) * 8;

      ctx.save();
      ctx.shadowBlur = 25;
      ctx.shadowColor = activeSceneIndex % 2 === 0 ? '#06b6d4' : '#ec4899';
      ctx.strokeStyle = activeSceneIndex % 2 === 0 ? '#22d3ee' : '#f472b6';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Camera lens crosshairs
      ctx.beginPath();
      ctx.moveTo(centerX - radius - 15, centerY);
      ctx.lineTo(centerX - radius + 15, centerY);
      ctx.moveTo(centerX + radius - 15, centerY);
      ctx.lineTo(centerX + radius + 15, centerY);
      ctx.stroke();
      ctx.restore();

      // Shot watermark badge
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(20, 20, 260, 42);
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
      ctx.strokeRect(20, 20, 260, 42);

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(`REC [${Math.floor(currentTime)}s / ${storyboard.totalDuration}s]`, 32, 38);
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px sans-serif';
      ctx.fillText(scene?.shot || 'Wide Shot', 32, 52);

      // Subtitle Bar
      ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
      ctx.fillRect(0, canvas.height - 70, canvas.width, 70);

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 15px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(scene?.subtitleAr || '', canvas.width / 2, canvas.height - 42);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px sans-serif';
      ctx.fillText(scene?.subtitleEn || '', canvas.width / 2, canvas.height - 22);
      ctx.textAlign = 'start';

      animRef.current = requestAnimationFrame(render);
    };

    render();
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [activeSceneIndex, currentTime, storyboard]);

  const handleGenerateStoryboard = async () => {
    setIsGenerating(true);
    soundFx.playLaser();
    try {
      const res = await fetch('/api/gemini/video-storyboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          concept,
          duration: targetDuration,
          style: videoStyle,
          aspect: aspectRatio,
        }),
      });

      const data = await res.json();
      if (data && data.scenes && data.scenes.length > 0) {
        setStoryboard(data);
        setActiveSceneIndex(0);
        setCurrentTime(0);
      }
      soundFx.playChime();
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSimulateRender = () => {
    setIsRenderingVideo(true);
    setRenderProgress(0);
    setRenderedSuccess(false);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 12;
      setRenderProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsRenderingVideo(false);
        setRenderedSuccess(true);
        soundFx.playChime();
      }
    }, 400);
  };

  const handleCopyFullScript = () => {
    const fullScript = storyboard.scenes
      .map((s, idx) => `[مشهد ${idx + 1} - ${s.shot}]\nالمدة: ${s.duration} ثوانٍ\nالوصف البصري: ${s.description}\nنص المشهد (عربي): ${s.subtitleAr}\nالترجمة (إنجليزي): ${s.subtitleEn}\nالمؤثر الصوتي: ${s.audioEffect}\nأمر التوليد (Prompt): ${s.visualPrompt}`)
      .join('\n\n------------------------------\n\n');

    navigator.clipboard.writeText(fullScript);
    setCopiedScript(true);
    soundFx.playClick();
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0b0f19] border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div>
          <span className={`text-[11px] px-3 py-1 rounded-full font-bold uppercase ${currentTheme.badgeBg}`}>
            AI Video Generation & Storyboard Suite
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 mt-2">
            <Film className="w-6 h-6 text-cyan-400" />
            {t('استوديو مونتاج وتوليد الفيديو بالذكاء الاصطناعي', 'AI Video Studio & Storyboard Director')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {t(
              'توليد المشاهد واللقطات السينمائية، شريط المونتاج التفاعلي، كتابة السيناريو التلقائي وتصدير الفيديوهات بدقة 4K.',
              'Generate multi-shot cinematic storyboards, interactive timelines, AI captions, and simulate rendering.'
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAspectRatio('16:9')}
            className={`p-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all ${
              aspectRatio === '16:9' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50' : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
            title="16:9 Landscape (YouTube / Desktop)"
          >
            <Tv className="w-4 h-4" />
            <span>16:9</span>
          </button>
          <button
            onClick={() => setAspectRatio('9:16')}
            className={`p-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all ${
              aspectRatio === '9:16' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50' : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
            title="9:16 Vertical (TikTok / Reels / Shorts)"
          >
            <Smartphone className="w-4 h-4" />
            <span>9:16</span>
          </button>
          <button
            onClick={() => setAspectRatio('1:1')}
            className={`p-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all ${
              aspectRatio === '1:1' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50' : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
            title="1:1 Square (Instagram Post)"
          >
            <Square className="w-4 h-4" />
            <span>1:1</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Video Canvas Player & Timeline Sequencer */}
        <div className="lg:col-span-2 space-y-6">
          {/* Simulated Video Canvas Monitor */}
          <div className="p-5 rounded-3xl bg-[#0b0f19] border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Clapperboard className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-sm text-white">{storyboard.title}</h3>
              </div>
              <span className="text-xs font-mono text-cyan-400 px-2.5 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-800/60">
                {aspectRatio} • {videoStyle}
              </span>
            </div>

            {/* Video Canvas */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 bg-black flex items-center justify-center">
              <canvas
                ref={videoCanvasRef}
                width={aspectRatio === '16:9' ? 640 : aspectRatio === '9:16' ? 360 : 480}
                height={aspectRatio === '16:9' ? 360 : aspectRatio === '9:16' ? 640 : 480}
                className="max-h-[380px] w-auto mx-auto object-contain"
              />

              {/* Play Overlay */}
              <div className="absolute top-4 end-4">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:scale-105 transition-transform"
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                </button>
              </div>
            </div>

            {/* Scrubber & Time Bar */}
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>00:{String(Math.floor(currentTime)).padStart(2, '0')}</span>
                <span className="text-cyan-400 font-bold">
                  {t(`المشهد ${activeSceneIndex + 1} من ${storyboard.scenes.length}`, `Scene ${activeSceneIndex + 1} of ${storyboard.scenes.length}`)}
                </span>
                <span>00:{String(storyboard.totalDuration).padStart(2, '0')}</span>
              </div>
              <input
                type="range"
                min="0"
                max={storyboard.totalDuration}
                step="0.5"
                value={currentTime}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setCurrentTime(val);
                }}
                className="w-full accent-cyan-400"
              />
            </div>
          </div>

          {/* Interactive Multi-Clip Timeline Sequencer */}
          <div className="p-5 rounded-3xl bg-[#0b0f19] border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                {t('شريط مشاهد الفيديو والمونتاج (Storyboard Timeline)', 'Video Scene Sequencer')}
              </h4>
              <button
                onClick={handleCopyFullScript}
                className="px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs border border-slate-700/80 flex items-center gap-1.5 transition-colors"
              >
                {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedScript ? t('تم النسخ!', 'Copied!') : t('نسخ السيناريو كاملاً', 'Copy Script')}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {storyboard.scenes.map((scene, idx) => (
                <div
                  key={scene.id}
                  onClick={() => {
                    setActiveSceneIndex(idx);
                    soundFx.playClick();
                  }}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    activeSceneIndex === idx
                      ? 'bg-cyan-950/40 border-cyan-500/80 shadow-lg shadow-cyan-500/10 scale-102'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono">
                      #{idx + 1} • {scene.duration}s
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{scene.timestamp}</span>
                  </div>
                  <h5 className="font-bold text-xs text-white mb-1 truncate">{scene.shot}</h5>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-2">
                    {scene.description}
                  </p>
                  <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                    <Volume2 className="w-3 h-3 text-pink-400" />
                    <span className="truncate">{scene.audioEffect}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Editing Recommendations */}
            {storyboard.editingTips && storyboard.editingTips.length > 0 && (
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                <h5 className="font-bold text-xs text-cyan-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  {t('نصائح وتوصيات المونتاج الذكية:', 'AI Editing & Grading Tips:')}
                </h5>
                <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
                  {storyboard.editingTips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Generation Controls & Export */}
        <div className="space-y-6">
          <div className="p-5 rounded-3xl bg-[#0b0f19] border border-slate-800 shadow-xl space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-cyan-400" />
              {t('مُنشئ المشاهد والقصة', 'Prompt to Storyboard')}
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {t('فكرة وسيناريو الفيديو:', 'Video Concept Prompt:')}
              </label>
              <textarea
                rows={4}
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                placeholder={t('صف فكرة الفيديو، الأبطال، الرسالة والبيئة البصرية...', 'Describe video concept...')}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 leading-relaxed resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  {t('النمط السينمائي:', 'Cinematic Style:')}
                </label>
                <select
                  value={videoStyle}
                  onChange={(e) => setVideoStyle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="Cyberpunk Sci-Fi">Cyberpunk Sci-Fi</option>
                  <option value="Cinematic Documentary">Cinematic Documentary</option>
                  <option value="Anime Action 4K">Anime Action 4K</option>
                  <option value="Modern Tech Commercial">Modern Tech Commercial</option>
                  <option value="Dark Thriller Mystery">Dark Thriller Mystery</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  {t('المدة الإجمالية:', 'Duration:')}
                </label>
                <select
                  value={targetDuration}
                  onChange={(e) => setTargetDuration(parseInt(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="15">15 {t('ثانية (Shorts)', 'Seconds')}</option>
                  <option value="30">30 {t('ثانية (Promo)', 'Seconds')}</option>
                  <option value="60">60 {t('ثانية (Full)', 'Seconds')}</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerateStoryboard}
              disabled={isGenerating || !concept.trim()}
              className="w-full py-3.5 rounded-xl font-black text-xs text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 shadow-lg shadow-cyan-600/20 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  <span>{t('جاري إخراج وتأليف المشاهد...', 'Directing Scenes...')}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{t('إخراج وإنشاء لوحة المشاهد (Generate)', 'Generate AI Storyboard')}</span>
                </>
              )}
            </button>
          </div>

          {/* Member Protected Render Box */}
          <ProtectedFeature
            featureTitle="High-Resolution AI Video Render & Export"
            featureTitleAr="تصدير ورندرة الفيديو الفائقة بالذكاء الاصطناعي"
            featureDescAr="خاصية تصدير ومحاكاة إنتاج مقاطع الفيديو بدقة 4K متاحة لأعضاء OPEBAT المعتمدين."
          >
            <div className="p-5 rounded-3xl bg-[#0b0f19] border border-slate-800 shadow-xl space-y-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Download className="w-4 h-4 text-emerald-400" />
                {t('تصدير ورندرة الفيديو (Render Video)', 'Video Export & Render')}
              </h3>

              <div className="text-xs text-slate-400 space-y-1 font-mono">
                <div className="flex justify-between">
                  <span>Resolution:</span>
                  <strong className="text-white">3840 x 2160 (4K UHD)</strong>
                </div>
                <div className="flex justify-between">
                  <span>Frame Rate:</span>
                  <strong className="text-white">60 FPS</strong>
                </div>
                <div className="flex justify-between">
                  <span>Audio Codec:</span>
                  <strong className="text-white">AAC 320kbps</strong>
                </div>
              </div>

              {isRenderingVideo ? (
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-xs text-cyan-300 font-mono">
                    <span>Rendering Frames...</span>
                    <span>{renderProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-emerald-500 h-full transition-all duration-300"
                      style={{ width: `${renderProgress}%` }}
                    />
                  </div>
                </div>
              ) : renderedSuccess ? (
                <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{t('تم إعداد وتحميل الفيديو بنجاح!', 'Render ready!')}</span>
                  </div>
                  <button
                    onClick={handleSimulateRender}
                    className="underline text-[11px] hover:text-white"
                  >
                    {t('إعادة الرندرة', 'Re-render')}
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleSimulateRender}
                  className="w-full py-3 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>{t('بدء رندرة وتصدير الفيديو 4K', 'Start 4K Video Render')}</span>
                </button>
              )}
            </div>
          </ProtectedFeature>
        </div>
      </div>
    </div>
  );
};
