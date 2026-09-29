import { SkillCategory } from '../types';

export const SKILLS_DATA: SkillCategory[] = [
  {
    title: 'Bots & Automation',
    titleAr: 'الروبوتات والأتمتة الذكية',
    icon: 'Bot',
    skills: [
      { name: 'Meta Graph API & Webhooks', level: 98, tag: 'Facebook/IG' },
      { name: 'Telegram Bot API & MTProto', level: 96, tag: 'Bots' },
      { name: 'Discord.js & Voice Bots', level: 92, tag: 'Discord' },
      { name: 'Headless Browser Automation (Playwright)', level: 94, tag: 'Scraping' },
      { name: 'Task Scheduling & Queues (BullMQ/Redis)', level: 90, tag: 'DevOps' },
    ],
  },
  {
    title: 'AI & Machine Learning',
    titleAr: 'الذكاء الاصطناعي وهندسة الأوامر',
    icon: 'Cpu',
    skills: [
      { name: 'Gemini 3 API & Multimodal Workflows', level: 96, tag: 'LLM' },
      { name: 'Prompt Engineering & System Personas', level: 95, tag: 'GenAI' },
      { name: 'Vector Embeddings & Semantic Search', level: 88, tag: 'RAG' },
      { name: 'NLP & Intent Extraction', level: 91, tag: 'NLP' },
      { name: 'AI Image Synthesis & Canvas Integration', level: 89, tag: 'Creative AI' },
    ],
  },
  {
    title: 'Backend & Cloud Systems',
    titleAr: 'الخوادم والأنظمة السحابية',
    icon: 'Server',
    skills: [
      { name: 'Node.js & Express / Fastify', level: 97, tag: 'Runtime' },
      { name: 'TypeScript & Modern ESNext', level: 95, tag: 'Language' },
      { name: 'Python (Asyncio, Flask, FastAPI)', level: 92, tag: 'Language' },
      { name: 'RESTful APIs & WebSockets Architecture', level: 96, tag: 'Networking' },
      { name: 'Docker Containers & Microservices', level: 88, tag: 'Infra' },
    ],
  },
  {
    title: 'Databases & In-Memory',
    titleAr: 'قواعد البيانات والتخزين المؤقت',
    icon: 'Database',
    skills: [
      { name: 'Redis (Caching & Pub/Sub)', level: 94, tag: 'Cache' },
      { name: 'PostgreSQL & SQL Performance', level: 90, tag: 'Relational' },
      { name: 'MongoDB & Document Modeling', level: 92, tag: 'NoSQL' },
      { name: 'IndexedDB & Offline Storage', level: 89, tag: 'Client DB' },
    ],
  },
  {
    title: 'Frontend & UI Engineering',
    titleAr: 'الواجهات الأمامية وتجربة المستخدم',
    icon: 'Layout',
    skills: [
      { name: 'React 19 & Hooks Architecture', level: 96, tag: 'Library' },
      { name: 'Tailwind CSS & Modern Utility Styling', level: 98, tag: 'Styling' },
      { name: 'Motion & Hardware-Accelerated Animation', level: 91, tag: 'UX' },
      { name: 'Responsive & RTL/LTR Bi-directional UI', level: 99, tag: 'Localization' },
      { name: 'Canvas API & Web Audio Synthesis', level: 88, tag: 'Browser APIs' },
    ],
  },
  {
    title: 'Cybersecurity & Auditing',
    titleAr: 'الأمن السيبراني وحماية التطبيقات',
    icon: 'ShieldCheck',
    skills: [
      { name: 'Web Application Security (OWASP Top 10)', level: 92, tag: 'Security' },
      { name: 'AES-GCM / RSA Encryption & Crypto APIs', level: 90, tag: 'Cryptography' },
      { name: 'Network Port Reconnaissance & Auditing', level: 88, tag: 'Networking' },
      { name: 'Anti-Bot Evasion & Stealth Scraping', level: 95, tag: 'Defense/Offense' },
    ],
  },
];
