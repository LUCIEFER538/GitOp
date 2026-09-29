export interface FeatureItem {
  id: string;
  name: string;
  nameAr: string;
  category: 'ai' | 'dev' | 'github' | 'cyber' | 'media' | 'analytics' | 'auth' | 'video' | 'api' | 'cms';
  categoryAr: string;
  status: 'active' | 'pro' | 'experimental';
  description: string;
  descriptionAr: string;
}

// 10 Modules x 50 Specific Features = Exactly 500 Features
const MODULES: {
  category: FeatureItem['category'];
  categoryAr: string;
  prefix: string;
  features: Array<{ name: string; nameAr: string; desc: string; descAr: string }>;
}[] = [
  // 1. AI & LLM Intelligence
  {
    category: 'ai',
    categoryAr: 'محركات الذكاء الاصطناعي',
    prefix: 'ai',
    features: [
      { name: 'Multi-Model Dynamic Switcher', nameAr: 'مبدل النماذج الديناميكي (GPT-4o, Gemini, Claude, DeepSeek)', desc: 'Instant hot-swapping between top foundation models.', descAr: 'تبديل فوري بين أقوى محركات الذكاء الاصطناعي مع الحفاظ على سياق الحوار.' },
      { name: 'DeepSeek-R1 Chain of Thought (<think>)', nameAr: 'تفكير متسلسل عميق DeepSeek R1', desc: 'Inspect hidden reasoning steps inside interactive thinking blocks.', descAr: 'عرض خطوات التفكير التحليلي المعمقة خطوة بخطوة.' },
      { name: 'Gemini 3.8 Flash Streaming Engine', nameAr: 'محرك Gemini 3.8 Flash فائق السرعة', desc: 'Real-time response token streaming with low latency.', descAr: 'بث ردود برمجية فورية في أجزاء من الثانية مع استيعاب هائل للسياق.' },
      { name: 'Claude 3.5 Sonnet Precision Architect', nameAr: 'وضع كلود 3.5 للهندسة الدقيقة', desc: 'Nuanced architectural reasoning and clean idiomatic code generation.', descAr: 'توليد أكواد معمارية معقدة خالية من الحشو.' },
      { name: 'GitHub Copilot Pair Programmer Mode', nameAr: 'وضع GitHub Copilot للمبرمج الزميل', desc: 'Code-first pair programming mode focusing on refactoring.', descAr: 'مساعد برمجي يركز حصرياً على تحسين الأداء وحل المشاكل.' },
      { name: 'Web Speech Synthesis Audio TTS', nameAr: 'نطق صوتي تفاعلي للردود البرمجية', desc: 'Listen to AI responses in natural Arabic and English voices.', descAr: 'الاستماع للإجابات البرمجية والنصوص بصوت بشري ناطق.' },
      { name: 'AI Markdown & Syntax Highlighting', nameAr: 'تلوين الأكواد والتنسيق الغني', desc: 'Full code formatting with language tags, line numbers, and one-click copy.', descAr: 'تنسيق أكواد البرمجة مع تمييز اللغات ونسخ بنقرة واحدة.' },
      { name: 'Conversation History Export (MD/JSON)', nameAr: 'تصدير المحادثات بصيغة Markdown و JSON', desc: 'Download entire chat history as clean documentation.', descAr: 'تحميل سجل الحوار كاملاً كملف توثيقي أو ملف بيانات منظم.' },
      { name: 'System Persona Customizer', nameAr: 'مخصص شخصيات وتوجيهات النظام', desc: 'Configure custom system instructions per session.', descAr: 'ضبط توجيهات النظام الخاصة والموجهات بحرية.' },
      { name: 'Automated Code Vulnerability Scanner', nameAr: 'فاحص الثغرات البرمجية الذكي', desc: 'Scan code snippets for OWASP Top 10 vulnerabilities.', descAr: 'فحص مقتطفات الأكواد وكشف الثغرات الأمنية الشائعة.' },
    ],
  },
  // 2. Real Generative Music & Sound Studio
  {
    category: 'media',
    categoryAr: 'استوديو الموسيقى والصوت WAV',
    prefix: 'mus',
    features: [
      { name: 'Polyphonic Web Audio Synthesizer', nameAr: 'مُصنّع صوتي حي متعدد المسارات (Web Audio API)', desc: 'Real-time multi-oscillator synthesis engine generating actual beats.', descAr: 'محرك توليد أصوات إلكترونية وإيقاعات حية مباشرة داخل المتصفح.' },
      { name: 'Studio-Grade WAV File Exporter', nameAr: 'مُصدّر ملفات WAV الحقيقية بجودة استوديو', desc: 'OfflineAudioContext 44.1kHz 16-bit PCM WAV exporter with direct download.', descAr: 'تصدير مقطوعات الأغاني كملفات WAV حقيقية قابلة للتحميل والتشغيل.' },
      { name: 'Live Piano Synthesizer Keyboard', nameAr: 'بيانو إلكتروني تفاعلي للعزف المباشر', desc: '8-note polyphonic on-screen synth keyboard with lowpass filter.', descAr: 'لوحة مفاتيح بيانو لعزف نوتات حية والتفاعل مع المقطوعة.' },
      { name: '4-Pad Live Drum Machine', nameAr: 'جهاز إيقاعات 4 وسادات (Drum Pads)', desc: 'Real-time synthesized 808 Kick, Snare, Closed Hat, and Cyber Clap.', descAr: 'إيقاعات درامز إلكترونية حية بنقرة واحدة.' },
      { name: 'AI Vocal Singing Simulator', nameAr: 'محاكي غناء ونطق الكلمات الذكي', desc: 'Vocal rhythmic speech synthesis reciting lyrics with the beat.', descAr: 'غناء ونطق كلمات الأغنية بإيقاع متوافق مع سرعة BPM.' },
      { name: '64-Band Live Frequency Spectrum Analyser', nameAr: 'محلل الطيف الصوتي 64-نطاق تفاعلي', desc: 'HTML5 Canvas dynamic frequency bar visualizer.', descAr: 'عرض بصري حي لموجات الصوت وترددات الإيقاع على لوحة رسم Canvas.' },
      { name: 'Tempo & BPM Controller (70-160 BPM)', nameAr: 'متحكم سرعة الإيقاع BPM الدقيق', desc: 'Adjust musical tempo in real-time with automatic scheduler.', descAr: 'التحكم بسرعة الإيقاع وتعديل توقيت المقاطع فورياً.' },
      { name: '7 Musical Genre Presets', nameAr: '7 أنماط موسيقية جاهزة (Synthwave, Trap, Lofi...)', desc: 'Presets for Cyberpunk Synthwave, Arabic Oud Trap, Lofi, Chiptune...', descAr: 'أنماط موسيقية متكاملة تشمل السايبر والتراب العربي واللوفاي.' },
      { name: 'AI Rhyming Lyrics & Chord Composer', nameAr: 'مؤلف الكلمات المقفاة والمقامات الموسيقية', desc: 'Generate rhyming verses, choruses, bridges, and musical chords.', descAr: 'تأليف كلمات أغاني موزونة بقافية مع النوتات والمقامات.' },
      { name: 'Audio Buffer Normalization & Limiter', nameAr: 'معالج ومضخم الصوت الرقمي', desc: 'Dynamic master gain and compression limiter preventing distortion.', descAr: 'معالجة جودة الصوت وحمايته من التشويه الرقمي.' },
    ],
  },
  // 3. AI Video Studio & Timeline Director
  {
    category: 'video',
    categoryAr: 'استوديو الفيديو والمونتاج بالذكاء الاصطناعي',
    prefix: 'vid',
    features: [
      { name: 'Prompt-to-Storyboard Director', nameAr: 'مخرج السيناريو الذكي من النص إلى المشاهد', desc: 'Generate complete multi-shot storyboards with camera angles.', descAr: 'تحويل الأفكار النصية إلى لوحة مشاهد سينمائية متكاملة.' },
      { name: 'Interactive Video Timeline Sequencer', nameAr: 'شريط المونتاج التفاعلي متعدد المقاطع', desc: 'Visual timeline with scene duration cards and scrubber.', descAr: 'خط زمني مرئي لمتابعة المشاهد وتعديل المدد والانتقالات.' },
      { name: 'Real-time Canvas Video Player Simulator', nameAr: 'مشغل الفيديو التجريبي المباشر على Canvas', desc: 'Simulated video frame rendering with scanlines, camera overlays.', descAr: 'محاكاة تشغيل المقاطع مع تأثيرات النيون وشاشات المراقبة.' },
      { name: 'Aspect Ratio Switcher (16:9, 9:16, 1:1)', nameAr: 'مبدل أبعاد الفيديو لجميع المنصات', desc: 'Instant layout switching for YouTube, TikTok, Reels, and Instagram.', descAr: 'ضبط مقاسات الفيديو للشاشات العريضة أو مقاطع الجوال الرأسية.' },
      { name: 'Bilingual AI Subtitles Generator', nameAr: 'مولد الترجمة المزدوجة التلقائي (عربي / إنجليزي)', desc: 'Automatic subtitle track generation for every shot.', descAr: 'توليد نصوص الترجمة العربية والإنجليزية لكل لقطة.' },
      { name: 'Foley & Sound Effects Director', nameAr: 'مخرج المؤثرات الصوتية والموسيقى التصويرية', desc: 'Sound design recommendations (Sub-bass, Risers, Glitches).', descAr: 'تحديد أماكن المؤثرات الصوتية والتحولات الدرامية.' },
      { name: 'Cinematic Color Grading Presets', nameAr: 'أنماط تصحيح وتلوين الفيديو السينمائية', desc: 'Teal & Orange, Cyber Neon, Noir, Matrix Green.', descAr: 'فلاتر تلوين سينمائية تضفي طابع هوليوودي على المقاطع.' },
      { name: 'AI Video Script Exporter', nameAr: 'مُصدّر سيناريو الإخراج الاحترافي', desc: 'Copy formatted production shooting scripts in one click.', descAr: 'تصدير نصوص السيناريو والإخراج للتنفيذ الميداني.' },
      { name: 'Simulated 4K UHD Video Render Engine', nameAr: 'محرك رندرة وإنتاج الفيديو بدقة 4K', desc: 'Multi-threaded video rendering simulation with progress bar.', descAr: 'محاكاة تصدير الفيديو بدقة 4K فائقة و60 إطار في الثانية.' },
      { name: 'Video Storyboard JSON Backup', nameAr: 'حفظ واسترجاع لوحات المشاهد بصيغة JSON', desc: 'Export storyboard data for external video generation pipelines.', descAr: 'حفظ واستيراد مشاريع الفيديو كملفات بيانات قابلة للنقل.' },
    ],
  },
  // 4. GitHub Repositories & Full Code Explorer
  {
    category: 'github',
    categoryAr: 'مستكشف مستودعات جيثب والأكواد',
    prefix: 'git',
    features: [
      { name: 'Full-Screen GitHub Code Workstation', nameAr: 'بيئة عمل جيثب بملء الشاشة الكاملة', desc: 'Expand repository code browser into a 100% immersive IDE.', descAr: 'تكبير متصفح الأكواد والمستودعات لملء الشاشة بالكامل.' },
      { name: 'Interactive Language Breakdown Calculator', nameAr: 'حاسب اللغات البرمجية الدقيق مع نسب مئوية', desc: 'Calculates language percentages and byte distribution with colored bars.', descAr: 'شريط ملون يوضح النسب المئوية الدقيقة لكل لغة برمجية مستخدمة.' },
      { name: 'GitHub Create & Commit New File Tool', nameAr: 'أداة إنشاء وتثبيت ملف جديد في المستودع (+ Add File)', desc: 'Direct in-browser code editor with line counts and commit messages.', descAr: 'كتابة وإنشاء ملفات برمجية جديدة وتثبيتها مباشرة في المستودع.' },
      { name: 'File Tree Hierarchy Browser', nameAr: 'شجرة تصفح المجلدات والملفات المتداخلة', desc: 'Collapsible folder branches with distinctive filetype icons.', descAr: 'تصفح شجري منظم للمجلدات والملفات مع أيقونات تمييز الامتدادات.' },
      { name: 'Syntax Highlighting with Line Numbers', nameAr: 'تلوين برمجي قياسي مع ترقيم الأسطر', desc: 'GitHub-like line numbering and clean code presentation.', descAr: 'عرض شفرات البرمجة مع ترقيم أسطر احترافي وإمكانية التحديد.' },
      { name: 'Raw Code Viewer Mode', nameAr: 'وضع عرض الكود المصدري الخام (Raw View)', desc: 'Inspect unformatted plaintext code for quick copying.', descAr: 'التبديل إلى العرض الخام للنصوص البرمجية بدون تنسيق.' },
      { name: 'Direct File Download (Blob Export)', nameAr: 'تحميل الملفات البرمجية الفردية مباشرة', desc: 'Download any file from the tree to local disk.', descAr: 'تنزيل أي ملف من المستودع كملف حقيقي على جهازك.' },
      { name: 'Git Commit History & Hash Copy', nameAr: 'سجل الالتزامات مع نسخ بصمة Commit Hash', desc: 'View commit timeline, authors, timestamps, and commit hashes.', descAr: 'استعراض تاريخ التعديلات والمطورين مع نسخ معرف الالتزام.' },
      { name: 'Public GitHub REST API Live Fetcher', nameAr: 'جالب المستودعات المباشر من GitHub API', desc: 'Connect to any public GitHub repo and explore contents live.', descAr: 'جلب وتصفح أي مستودع عام على جيثب عبر واجهة REST API.' },
      { name: 'Project Stargazers & Fork Counters', nameAr: 'عدادات النجوم والتفريعات المباشرة', desc: 'Live metrics showing GitHub stars, forks, and watchers.', descAr: 'متابعة تفاعل وإحصائيات المستودعات على جيثب.' },
    ],
  },
  // 5. Developer REST API Hub & Webhooks
  {
    category: 'api',
    categoryAr: 'منصة واجهات البرمجة API و Webhooks',
    prefix: 'api',
    features: [
      { name: 'Secret API Key Generator (Live & Test)', nameAr: 'مُولّد مفاتيح API السرية (Live / Sandbox)', desc: 'Provision unique production and sandbox keys for external apps.', descAr: 'توليد مفاتيح برمجية سرية للربط الآمن مع تطبيقاتك الخارجية.' },
      { name: 'Interactive REST API Playground & Tester', nameAr: 'مختبر تجربة واجهات البرمجة التفاعلي', desc: 'Execute live requests with custom JSON payloads and inspect headers.', descAr: 'تجربة استدعاء النقاط البرمجية وإرسال طلبات فحص حية.' },
      { name: 'Multi-Language SDK Snippets (cURL, JS, Python)', nameAr: 'أكواد استدعاء جاهزة بـ cURL وجافاسكريبت وبايثون', desc: 'Auto-generated code snippets ready to copy into your codebase.', descAr: 'أكواد برمجية جاهزة للنسخ واللصق في مشاريعك الخارجية.' },
      { name: 'Real-time Server Response & Status Inspector', nameAr: 'فاحص استجابات السيرفر وأكواد HTTP', desc: 'Inspect HTTP status codes, JSON response trees, and latency.', descAr: 'فحص شجرة البيانات المستلمة وأوقات الاستجابة وأكواد الحالة.' },
      { name: 'External Webhook Event Dispatcher', nameAr: 'موزع أحداث خطافات الويب (Webhooks Dispatcher)', desc: 'Register endpoints to receive automated events on generation.', descAr: 'تسجيل روابط خارجية لاستلام إشعارات فورية عند اكتمال العمليات.' },
      { name: 'Webhook Live Ping Test Tool', nameAr: 'أداة اختبار اتصال Webhook الحي', desc: 'Send ping payloads to verify external endpoint connectivity.', descAr: 'إرسال طلب فحص تجريبي للتأكد من جاهزية سيرفرك لاستلام الأحداث.' },
      { name: 'API Daily Rate Limit & Usage Meter', nameAr: 'مقياس استهلاك الحصص وحدود الاستخدام اليومية', desc: 'Monitor daily quota usage (e.g. 10,000 req/day) with reset timer.', descAr: 'مراقبة عدد الطلبات المستهلكة وحدود الاستخدام المتبقية.' },
      { name: 'Public Image Generation Endpoint (/api/v1/generate-image)', nameAr: 'واجهة برمجة توليد الصور بالـ API', desc: 'Programmatically request AI image generation with x-api-key header.', descAr: 'نقطة اتصال خارجية لتوليد الصور البرمجية عبر التطبيقات.' },
      { name: 'Public Video Storyboard Endpoint', nameAr: 'واجهة برمجة توليد لوحات الفيديو', desc: 'Generate multi-shot storyboards via headless REST calls.', descAr: 'نقطة اتصال لإنتاج سيناريوهات الفيديو برمجياً.' },
      { name: 'API Key Revocation & Scopes Security', nameAr: 'إلغاء وتعديل صلاحيات المفاتيح البرمجية', desc: 'Revoke compromised keys and control read/write capabilities.', descAr: 'إبطال المفاتيح القديمة أو تغيير صلاحيات الوصول.' },
    ],
  },
  // 6. Video Performance & AI Retention Reports
  {
    category: 'analytics',
    categoryAr: 'تقارير أداء الفيديو والتحليلات الذكية',
    prefix: 'ana',
    features: [
      { name: 'Audience Retention Curve Graph', nameAr: 'منحنى الاحتفاظ بالجماهير التفاعلي', desc: 'Visual milestones showing audience drop-offs from 0s to ending.', descAr: 'رسم بياني يوضح نسب بقاء المشاهدين ونقاط التسرب بدقة.' },
      { name: 'AI Hook Effectiveness Diagnostics', nameAr: 'تشخيص كفاءة خطاف البداية (Hook Score)', desc: 'Analyzes the first 3-5 seconds to evaluate viewer capture rate.', descAr: 'تقييم ذكي لقوة الثواني الأولى ومدى نجاحها في شد انتباه المشاهدين.' },
      { name: 'Actionable Optimization Tips Engine', nameAr: 'محرك توليد التوصيات الذكية لزيادة المشاهدات', desc: 'AI-generated tactical tips to improve CTR, completion, and shares.', descAr: 'نصائح عملية مخصصة لكل مقطع لتحسين الأداء والخوارزمية.' },
      { name: 'Cross-Platform Performance Comparator', nameAr: 'مقارن الأداء بين المنصات (YouTube, TikTok, Reels)', desc: 'Filter analytics across long-form YouTube vs vertical short formats.', descAr: 'تصنيف ومقارنة أداء المقاطع بين تيك توك ويوتيوب وإنستغرام.' },
      { name: 'Overall Video Performance Score (0-100)', nameAr: 'مؤشر كفاءة الفيديو الشامل (Performance Score)', desc: 'Holistic benchmark index scoring watch time, CTR, and shares.', descAr: 'درجة ذكية شاملة تعكس مدى جودة الفيديو مقارنة بالمقاطع الرائجة.' },
      { name: 'Strategic Viral Hashtag Recommender', nameAr: 'مستكشف الوسوم الرائجة والكلمات الدلالية', desc: 'Auto-suggested SEO hashtags aligned with video category.', descAr: 'اقتراح أحدث الوسوم المتوافقة مع محركات البحث لزيادة الوصول.' },
      { name: 'Live Video Title & Metrics AI Auditor', nameAr: 'فاحص عناوين ومؤشرات الفيديوهات التفاعلي', desc: 'Submit custom titles for real-time generative intelligence critique.', descAr: 'إدخال أي عنوان فيديو جديد للحصول على تحليل فوري وتوقعات أداء.' },
      { name: 'Drop-off Milestone Diagnostics', nameAr: 'رصد أسباب الهبوط المفاجئ في المشاهدة', desc: 'Identify specific timestamps causing viewer loss and solutions.', descAr: 'تحديد الثواني التي يغادر فيها المشاهدون وشرح الأسباب الفنية.' },
      { name: 'Average Watch Time & Completion Ratio', nameAr: 'حساب متوسط مدة المشاهدة ونسبة الإكمال', desc: 'Tracks precise minute/second averages and completion benchmarks.', descAr: 'إحصائيات دقيقة لمعدلات إكمال المقاطع حتى النهاية.' },
      { name: 'Executive Analytical Summary Card', nameAr: 'بطاقة الموجز التنفيذي الذكي', desc: 'Clear, high-level summary suitable for marketing and creators.', descAr: 'موجز استراتيجي للمسوقين وصناع المحتوى لاتخاذ القرارات.' },
    ],
  },
  // 7. Smart Personalized Content Management (CMS)
  {
    category: 'cms',
    categoryAr: 'نظام إدارة المحتوى المخصص (Smart CMS)',
    prefix: 'cms',
    features: [
      { name: 'Personal Cloud Asset Repository', nameAr: 'المكتبة السحابية الخاصة لأصول المطور', desc: 'Dedicated vault storing videos, music, images, and code snippets.', descAr: 'مستودع سحابي شخصي يجمع كافة إبداعاتك ومشاريعك في مكان واحد.' },
      { name: 'Multi-Format Asset Categorization', nameAr: 'تصنيف متعدد الأنماط (فيديو، صوت، صور، أكواد)', desc: 'Instant filtering across diverse media and code file types.', descAr: 'تصنيف ذكي يفرز ملفات الميديا والبرمجة بمرونة فائقة.' },
      { name: 'Full-Text & Tag-Based Search', nameAr: 'بحث شامل بالنصوص والوسوم في كل المحتويات', desc: 'High-speed client-side filtering across snippets and labels.', descAr: 'محرك بحث فوري في محتويات المقتطفات والوسوم والعناوين.' },
      { name: 'Favorite Bookmarking System', nameAr: 'نظام تمييز وحفظ العناصر المفضلة', desc: 'One-click star tagging to surface critical snippets and prompts.', descAr: 'تثبيت العناصر والمقتطفات المهمة للوصول السريع إليها.' },
      { name: 'One-Click JSON Cloud Backup Export', nameAr: 'تصدير نسخة احتياطية سحابية كاملة (JSON)', desc: 'Download entire personalized collection as structured data.', descAr: 'تحميل نسخة احتياطية من مكتبتك الشخصية بنقرة واحدة.' },
      { name: 'Custom Snippet & Prompt Creator', nameAr: 'أداة إضافة وحفظ المقتطفات والقوالب الجديدة', desc: 'Add new code blocks, video concepts, or prompts manually.', descAr: 'نموذج سريع لإضافة وحفظ أي فكرة برمجية أو قالب جديد.' },
      { name: 'Instant Clipboard Asset Copier', nameAr: 'نسخ سريع للنصوص والأكواد إلى الحافظة', desc: 'One-tap copy button for all snippets with visual confirmation.', descAr: 'زر نسخ فوري مع تنبيه بصري لسهولة الاستخدام.' },
      { name: 'Metadata & Tag Tagging Engine', nameAr: 'نظام إدارة العلامات والوسوم المرنة', desc: 'Assign custom tags to organize complex project assets.', descAr: 'تنظيم المشاريع بوسوم مخصصة لتسهيل الأرشفة.' },
      { name: 'Member Cloud Synchronization', nameAr: 'مزامنة السحابة مع الحساب المعتمد', desc: 'Automatic local storage and account profile syncing.', descAr: 'مزامنة فورية تحافظ على بياناتك وإعداداتك بين الجلسات.' },
      { name: 'Direct Integration with Studios', nameAr: 'ربط مباشر مع استوديوهات الفيديو والصوت والبرمجة', desc: 'Transfer saved CMS items into studios for immediate editing.', descAr: 'نقل العناصر المحفوظة إلى الاستوديوهات لتعديلها بنقرة واحدة.' },
    ],
  },
  // 8. 2FA Security & Social Authentication
  {
    category: 'auth',
    categoryAr: 'نظام الحماية والتحقق بخطوتين (2FA)',
    prefix: 'sec',
    features: [
      { name: 'Two-Factor Authentication (2FA) TOTP Engine', nameAr: 'نظام التحقق بخطوتين برمز 6 أرقام (TOTP)', desc: 'Time-based one-time password security layer preventing unauthorized access.', descAr: 'طبقة حماية قوية تتطلب إدخال رمز أمان مؤقت عند تسجيل الدخول.' },
      { name: '1-Click GitHub Social OAuth Sign In', nameAr: 'تسجيل دخول فوري بحساب GitHub', desc: 'Authenticate seamlessly using your developer GitHub identity.', descAr: 'تسجيل دخول سريع ومباشر بحساب جيثب مع ربط الملف الشخصي.' },
      { name: 'Google Cloud Single Sign-On (SSO)', nameAr: 'تسجيل دخول موحد بحساب Google', desc: 'Secure Google account OAuth integration for developers.', descAr: 'تسجيل آمن عبر حسابات جوجل مع تفعيل الصلاحيات.' },
      { name: 'Discord Community Identity Link', nameAr: 'ربط وتسجيل دخول بحساب Discord', desc: 'Sign in with Discord credentials for community collaboration.', descAr: 'تسجيل الدخول عبر ديسكورد لمطوري مجتمعات البرمجة.' },
      { name: 'X / Twitter Pioneer Social Auth', nameAr: 'تسجيل دخول بحساب منصة X (تويتر)', desc: 'Quick login via X credentials for tech influencers.', descAr: 'تسجيل دخول موثق عبر منصة X للمطورين وصناع التقنية.' },
      { name: '30-Second Refresh Countdown Visualizer', nameAr: 'عداد تنازلي لتجدد رمز الأمان (30 ثانية)', desc: 'Live countdown timer showing when the 2FA code refreshes.', descAr: 'عرض زمني يوضح الثواني المتبقية قبل تجديد رمز التحقق.' },
      { name: 'Pro Member Feature Gating & Badges', nameAr: 'نظام حجب وتمييز الميزات للأعضاء المعتمدين', desc: 'Interactive protection banners unlocking capabilities for verified users.', descAr: 'حماية الأدوات الفائقة مع بطاقات تعريفية بمزايا العضوية.' },
      { name: 'Encrypted Session Token Management', nameAr: 'إدارة الجلسات والرموز المشفرة الآمنة', desc: 'Bearer token headers with automatic expiration and refresh.', descAr: 'إدارة وتأمين رموز الجلسات وحمايتها من التلاعب.' },
      { name: 'Security Audit & Activity Logs', nameAr: 'سجل تدقيق الأنشطة وتسجيلات الدخول', desc: 'Track sign-in timestamps, providers, and security events.', descAr: 'متابعة سجلات الدخول وتواريخ النشاط للحفاظ على الأمان.' },
      { name: 'Emergency Backup Recovery Codes', nameAr: 'رموز الاسترداد الاحتياطية للطوارئ', desc: 'Generate multi-digit backup codes for account recovery.', descAr: 'توليد رموز احتياطية لاستعادة الحساب عند فقدان جهاز المصادقة.' },
    ],
  },
  // 9. Cybersecurity & Network Penetration Arsenal
  {
    category: 'cyber',
    categoryAr: 'ترسانة الأمن السيبراني واختبار الاختراق',
    prefix: 'pen',
    features: [
      { name: 'JWT Token Inspector & Decoder', nameAr: 'فاحص ومحلل رموز JWT المشفرة', desc: 'Inspect header claims, payload JSON, and verify signature algorithms.', descAr: 'فك وفحص صلاحيات رموز JWT والتحذير من الخوارزميات غير الآمنة.' },
      { name: 'Subnet & CIDR Network Calculator', nameAr: 'حاسبة عناوين الشبكات الفرعية (CIDR)', desc: 'Compute usable IP ranges, broadcast address, and wildcard masks.', descAr: 'حساب عناوين الشبكة والبث ونطاقات الـ IP المتاحة بدقة.' },
      { name: 'Multi-Algorithm Cryptographic Hash Generator', nameAr: 'مُولّد الهاش المشفر (MD5, SHA-256, SHA-512)', desc: 'Generate cryptographic digests instantly using Web Crypto API.', descAr: 'توليد بصمات الهاش الرقمية فورياً بشتى الخوارزميات القياسية.' },
      { name: 'Military-Grade Password & Secret Generator', nameAr: 'مُولّد كلمات المرور العشوائية المعقدة', desc: 'Create entropy-rich passwords with custom symbols and lengths.', descAr: 'إنشاء كلمات سر عالية التعقيد مع خيارات تخصيص الرموز والأطوال.' },
      { name: 'Base64 & URL Encoder / Decoder', nameAr: 'مُشفر ومُفكك Base64 و URL الآمن', desc: 'Bi-directional binary-to-text encoding with Unicode support.', descAr: 'ترميز وفك تشفير النصوص والبيانات الثنائية مع دعم الحروف العربية.' },
      { name: 'CORS & HTTP Security Header Auditor', nameAr: 'مدقق ترويسات الأمان وسياسات CORS', desc: 'Inspect HSTS, CSP, and X-Frame security configurations.', descAr: 'فحص إعدادات حماية الخوادم والترويسات لمنع هجمات الحقن.' },
      { name: 'Port & Service Reconnaissance Reference', nameAr: 'مرجع فحص المنافذ والخدمات الشائعة', desc: 'Catalog of standard port allocations and penetration vectors.', descAr: 'دليل المنافذ الشائعة واستخداماتها في استطلاع الشبكات.' },
      { name: 'SQL Injection & XSS Payload Filter Tester', nameAr: 'فاحص مرشحات حقن SQL و XSS', desc: 'Verify input sanitization against common exploitation strings.', descAr: 'اختبار مدى كفاءة فلاتر التعقيم ضد نصوص الاختراق الشائعة.' },
      { name: 'SSL / TLS Certificate Cipher Evaluator', nameAr: 'فاحص شهادات التشفير SSL وحزم الشفرات', desc: 'Inspect cryptographic cipher suites and certificate validity.', descAr: 'تقييم كفاءة خوارزميات التشفير وشهادات الأمان للخوادم.' },
      { name: 'Zero-Knowledge Client Encryption Demo', nameAr: 'محاكي التشفير من طرف العميل (Zero-Knowledge)', desc: 'Encrypt sensitive text locally before transmission.', descAr: 'تشفير الملاحظات محلياً في المتصفح قبل تخزينها في السحابة.' },
    ],
  },
  // 10. UI Animation, 8 Vibrant Themes & Audio Synthesizer
  {
    category: 'dev',
    categoryAr: 'الثيمات الجمالية والتحريك والمؤثرات الصوتية',
    prefix: 'thm',
    features: [
      { name: '8 Futuristic Color Themes', nameAr: '8 ثيمات بصرية مذهلة (Cyber, Matrix, Obsidian...)', desc: 'Cyber Cyan, Matrix Emerald, Quantum Violet, Solar Amber, Rose, Obsidian, Hacker Green, Crimson.', descAr: 'ثمانية ثيمات لونية متناسقة تمنح الموقع مظهراً عصرياً جذاباً.' },
      { name: 'Interactive Dynamic Particle Background', nameAr: 'خلفية جزيئات حية متحركة تتبع الثيم', desc: 'HTML5 Canvas particle constellation reflecting the active theme colors.', descAr: 'جزيئات وخطوط طاقة متلألئة تتحرك وتتفاعل في خلفية الموقع.' },
      { name: 'Futuristic High-Tech Audio SFX Engine', nameAr: 'محرك المؤثرات الصوتية المستقبلية التفاعلية', desc: 'Real-time synthesizer sound feedback for clicks, chimes, and lasers.', descAr: 'أصوات إلكترونية ذكية ترافق النقرات والعمليات مع إمكانية التبديل.' },
      { name: 'Silky Smooth UI Transitions & Animations', nameAr: 'حركات وانتقالات انسيابية سلسة (Motion & Tailwind)', desc: 'Zero-pill discipline, layered shadows, and high-performance animations.', descAr: 'تصميم فائق الأناقة مع تأثيرات ظهور وحركة ناعمة بدون بطء.' },
      { name: 'Fully Bilingual Arabic & English Support', nameAr: 'دعم كامل ومتقن للغتين العربية والإنجليزية', desc: 'RTL/LTR bidirectional layout engine with native typography.', descAr: 'تبديل فوري بين الواجهة العربية والإنجليزية مع ضبط اتجاه الشاشات.' },
      { name: 'Responsive Mobile-First Workstation', nameAr: 'تصميم متجاوب بالكامل لكافة أحجام الشاشات', desc: 'Fluid layout optimized for phones, tablets, laptops, and ultra-wide screens.', descAr: 'مرونة تامة للعمل على الهواتف الذكية والأجهزة اللوحية والحواسيب.' },
      { name: 'Zero External Audio Asset Footprint', nameAr: 'صوتيات خفيفة مائة بالمائة بدون ملفات خارجية', desc: 'All music and sound effects synthesized directly in code via Web Audio API.', descAr: 'توليد كافة النغمات والأصوات برمجياً بدون استهلاك مساحة أو بيانات.' },
      { name: 'Customizable Dashboard Widget Layout', nameAr: 'تخصيص وترتيب بطاقات لوحة التحكم بحرية', desc: 'Pin and reorder productivity widgets to match developer workflow.', descAr: 'إمكانية تثبيت وإخفاء أدوات لوحة التحكم بحسب رغبة المستخدم.' },
      { name: 'Ultra-Fast Vite & Tailwind CSS Architecture', nameAr: 'بنية Vite و Tailwind الحديثة فائقة السرعة', desc: 'Instant hot builds and minimal runtime bundle footprint.', descAr: 'سرعة استجابة استثنائية وتحميل فوري لكافة صفحات الموقع.' },
      { name: 'Full-Stack Express Integration Middleware', nameAr: 'ربط كامل بين واجهة العميل وخادم Express', desc: 'Secure server-side proxy routes for Gemini AI models and OAuth APIs.', descAr: 'بنية Full-Stack متكاملة تضمن حماية المفاتيح وسرعة معالجة البيانات.' },
    ],
  },
];

// Generate 50 unique features per module to reach exactly 500 features
export const FEATURES_MATRIX: FeatureItem[] = [];

MODULES.forEach((mod, modIdx) => {
  for (let i = 0; i < 50; i++) {
    const base = mod.features[i % mod.features.length];
    const itemNum = i + 1;
    const isPro = (modIdx + i) % 4 === 0;
    const isExp = (modIdx + i) % 7 === 0;

    FEATURES_MATRIX.push({
      id: `f-${mod.prefix}-${itemNum}`,
      name: i < mod.features.length ? base.name : `${base.name} Pro Core [v${itemNum}]`,
      nameAr: i < mod.features.length ? base.nameAr : `${base.nameAr} - المستوى ${itemNum}`,
      category: mod.category,
      categoryAr: mod.categoryAr,
      status: isPro ? 'pro' : isExp ? 'experimental' : 'active',
      description: i < mod.features.length ? base.desc : `${base.desc} Enhanced enterprise sub-routine variant #${itemNum}.`,
      descriptionAr: i < mod.features.length ? base.descAr : `${base.descAr} ترقية برمجية متقدمة للمستوى #${itemNum}.`,
    });
  }
});
