import { ExperienceItem } from '../types';

export const DEVELOPER_PROFILE = {
  name: 'GRY KJ',
  tagline: 'Senior Bot & AI Architect | Full-Stack & Cyber Specialist',
  taglineAr: 'مهندس روبوتات وأنظمة ذكاء اصطناعي | مطور Full-Stack ومختص أمن سيبراني',
  bio: 'Specialized in architecting high-throughput automation bots, integrating multi-agent AI ecosystems, and crafting production-grade web applications. Combining cutting-edge AI technologies with bulletproof backend architectures.',
  bioAr: 'خبير متخصص في هندسة بوتات الأتمتة المتقدمة، ودمج أنظمة الذكاء الاصطناعي متعددة الوكلاء، وبناء تطبيقات الويب الحديثة بأعلى معايير السرعة والأمان.',
  avatar: '/avatar.png',
  location: 'Global / Remote',
  locationAr: 'عالمياً / العمل عن بعد',
  email: 'grykj249@gmail.com',
  github: 'https://github.com/GRYKJ249',
  telegram: 'https://t.me/GRYKJ249',
  availability: 'Available for freelance projects, bot architecture & AI consulting',
  availabilityAr: 'متاح للمشاريع الحرة، واستشارات الذكاء الاصطناعي وهندسة البوتات المخصصة',
  stats: [
    { label: 'Completed Projects', labelAr: 'مشروع منجز', value: '65+', suffix: '+' },
    { label: 'System Uptime', labelAr: 'استقرار الخوادم', value: '99.9%', suffix: '%' },
    { label: 'Client Satisfaction', labelAr: 'تقييم العملاء', value: '4.9/5', suffix: '/5' },
    { label: 'Years Experience', labelAr: 'سنوات الخبرة', value: '4+', suffix: '+' },
  ],
  socials: [
    { name: 'GitHub', url: 'https://github.com/GRYKJ249', icon: 'Github' },
    { name: 'Email', url: 'mailto:grykj249@gmail.com', icon: 'Mail' },
    { name: 'Telegram', url: 'https://t.me/GRYKJ249', icon: 'Send' },
  ],
};

export const EXPERIENCE_DATA: ExperienceItem[] = [
  {
    id: 'exp-1',
    role: 'Lead Bot & AI Systems Architect',
    roleAr: 'كبير معماريي الروبوتات والذكاء الاصطناعي',
    company: 'Independent & High-Growth Clients',
    companyAr: 'مشاريع مستقلة وعملاء عالميون',
    period: '2023 - Present',
    periodAr: '2023 - الآن',
    description: 'Spearheading the engineering of multi-platform automated bots for Meta Graph API, Telegram, and Discord with integrated LLM reasoning and real-time data synchronization.',
    descriptionAr: 'قيادة تصميم وتطوير بوتات أتمتة فائقة الأداء لمنصات فيسبوك وتليجرام وديسكورد مع ربط نماذج الذكاء الاصطناعي لتحليل البيانات والرد التلقائي اللحظي.',
    achievements: [
      'Built SONA AI Bot serving 50,000+ interactions weekly with sub-50ms latency',
      'Engineered automated web scraping fleets with 99.8% anti-bot bypass success rate',
      'Implemented custom vector knowledge bases for business customer support',
    ],
    achievementsAr: [
      'تطوير بوت SONA AI الذي يخدم أكثر من 50,000 محادثة أسبوعياً بسرعة فائقة',
      'هندسة أساطيل زحف واستخراج بيانات سحابية بمعدل نجاح 99.8% في تفادي الحظر',
      'بناء قواعد معرفية دلالية مدعومة بالذكاء الاصطناعي لخدمة العملاء الذاتية',
    ],
    tech: ['Node.js', 'TypeScript', 'Gemini AI', 'Meta Graph API', 'Redis', 'Docker'],
  },
  {
    id: 'exp-2',
    role: 'Senior Full Stack & Cybersecurity Engineer',
    roleAr: 'مطور Full Stack أول ومختص حماية وتطبيقات',
    company: 'Creative Tech Lab',
    companyAr: 'مختبر التقنيات الإبداعية',
    period: '2021 - 2023',
    periodAr: '2021 - 2023',
    description: 'Delivered tailored web applications, real-time WebSocket platforms, client-side cryptographic vaults, and secure payment integrations.',
    descriptionAr: 'تطوير تطبيقات ويب مخصصة، منصات دردشة لحظية عبر WebSockets، خزائن تشفير سحابية من طرف العميل وتأمين الثغرات البرمجية.',
    achievements: [
      'Developed 20+ responsive web platforms and SaaS dashboard interfaces',
      'Constructed zero-knowledge encrypted notes system using Web Crypto API',
      'Audited web infrastructure and secured client servers against OWASP vulnerabilities',
    ],
    achievementsAr: [
      'إنجاز أكثر من 20 منصة ويب وتطبيق SaaS بلوحات تحكم تفاعلية',
      'بناء نظام خزنة ملاحظات مشفرة بدون معرفة مسبقة (Zero-Knowledge)',
      'إجراء اختبارات اختراق وتأمين خوادم العملاء ضد هجمات الويب الشائعة',
    ],
    tech: ['React', 'Express', 'Python', 'Web Crypto API', 'PostgreSQL', 'Tailwind'],
  },
  {
    id: 'exp-3',
    role: 'Automation & Scripting Specialist',
    roleAr: 'أخصائي أتمتة ونظم وبرمجة اسكربتات',
    company: 'Freelance & Open Source Ecosystem',
    companyAr: 'العمل الحر ومجتمع المصادر المفتوحة',
    period: '2020 - 2021',
    periodAr: '2020 - 2021',
    description: 'Automated administrative workflows, created CLI tools, reverse-engineered public APIs, and published utility suites for developers.',
    descriptionAr: 'أتمتة الأعمال الإدارية والمهام المتكررة، وتصميم أدوات سطر أوامر (CLI)، وهندسة عكسية للواجهات البرمجية وتوفير أدوات مجانية للمطورين.',
    achievements: [
      'Published 30+ open-source utilities and scripts on GitHub',
      'Automated daily backup and monitoring systems for remote VPS servers',
    ],
    achievementsAr: [
      'نشر أكثر من 30 أداة مفتوحة المصدر واسكريبت أتمتة على GitHub',
      'أتمتة النسخ الاحتياطي والمراقبة الذاتية للخوادم والشبكات',
    ],
    tech: ['Python', 'Bash', 'JavaScript', 'Linux', 'Git'],
  },
];

export const TESTIMONIALS = [
  {
    name: 'Ahmed Al-Mansoor',
    role: 'E-commerce Business Director',
    roleAr: 'مدير تنفيذي لمتجر تجارة إلكترونية',
    content: 'GRY KJ built a custom Facebook & Telegram bot that handled over 80% of our customer inquiries automatically. Sales surged by 45% in 2 months. Truly exceptional engineering.',
    contentAr: 'قام GRY KJ بتطوير بوت ذكي لفيسبوك وتليجرام عالج أكثر من 80% من استفسارات عملائنا تلقائياً وبسرعة مذهلة. زادت المبيعات بنسبة 45% خلال شهرين فقط.',
    stars: 5,
  },
  {
    name: 'Sarah Jenkins',
    role: 'FinTech Tech Lead',
    roleAr: 'قائدة فريق تقني في التكنولوجيا المالية',
    content: 'The real-time WebSocket dashboard and zero-knowledge encryption module delivered by GRY KJ met our strict security audit standards on the very first review.',
    contentAr: 'لوحة التحكم اللحظية ونظام التشفير الذي قام GRY KJ بتنفيذه اجتاز اختبارات الأمان والتدقيق الصارمة لدى شركتنا من المراجعة الأولى وبدون أي ملاحظات.',
    stars: 5,
  },
  {
    name: 'Khaled Ben Salah',
    role: 'SaaS Founder & Creator',
    roleAr: 'مؤسس منصة SaaS',
    content: 'Lightning fast delivery, clean TypeScript codebase, and deep understanding of modern AI LLM integrations. One of the top engineers I have ever hired.',
    contentAr: 'سرعة استثنائية في التسليم، كود TypeScript نظيف جداً وفهم عميق لدمج الذكاء الاصطناعي في المنصات الحقيقية. من أفضل المطورين الذين عملت معهم.',
    stars: 5,
  },
];
