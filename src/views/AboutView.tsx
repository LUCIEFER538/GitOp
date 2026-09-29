import React from 'react';
import { useApp } from '../context/AppContext';
import { DEVELOPER_PROFILE, EXPERIENCE_DATA } from '../data/developerProfile';
import { SKILLS_DATA } from '../data/skillsData';
import { ACCENT_THEMES } from '../utils/themeStyles';
import {
  User,
  Award,
  CheckCircle,
  Briefcase,
  Terminal,
  Cpu,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';

export const AboutView: React.FC = () => {
  const { accent, t, setActivePage } = useApp();
  const currentTheme = ACCENT_THEMES[accent];

  return (
    <div className="space-y-8 pb-16">
      {/* Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-2">
            <User className="w-3.5 h-3.5" />
            <span>{t('الملف الشخصي والخبرات', 'Developer Biography')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {t('عن المطور GRY KJ وفلسفة العمل', 'About GRY KJ & Engineering Philosophy')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            {t(
              'أكثر من 4 سنوات في هندسة الحلول البرمجية عالية الأداء، وبوتات الأتمتة المتقدمة، وحماية الأنظمة.',
              '4+ years architecting autonomous bot systems, enterprise SaaS platforms, and secure cryptographic tools.'
            )}
          </p>
        </div>

        <button
          onClick={() => setActivePage('contact')}
          className={`px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${currentTheme.btnPrimary}`}
        >
          {t('بدء محادثة للعمل معاً', 'Start Collaboration')}
        </button>
      </div>

      {/* Main Bio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl p-6 bg-slate-900/80 border border-slate-800 space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Terminal className="w-5 h-5 text-cyan-400" />
              <span>{t('فلسفة التطوير والريادة البرمجية', 'Development Philosophy & Craft')}</span>
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {t(
                'أؤمن بأن البرمجة ليست مجرد كتابة أسطر كود، بل هي فن حل المشكلات المعقدة بأبسط الطرق الممكنة وأكثرها ثباتاً. التخصص في الروبوتات والذكاء الاصطناعي يتطلب فهماً عميقاً للأنظمة غير المتزامنة (Asynchronous architectures)، ومعالجة اللغات الطبيعية، والتأكد من أن الأنظمة تعمل 24/7 دون أي توقف.',
                'I believe software engineering is not merely about writing syntax, but about building resilient, low-latency architectures that solve mission-critical challenges. Specializing in autonomous bots and AI requires a master-level grasp of event-driven asynchronous queues, real-time protocols, and rock-solid 99.9% uptime.'
              )}
            </p>
            <p className="text-sm text-slate-300 leading-relaxed">
              {t(
                'سواء كان المطلوب بناء بوت خدمة عملاء ذكي يخدم آلاف المستخدمين لصفحات الفيسبوك وتليجرام، أو بناء منصة SaaS متكاملة، أو اختبار أمان وتشفير البيانات، أحرص على تسليم عمل يفوق توقعات العميل.',
                'Whether designing an enterprise customer engagement bot that handles 50,000+ weekly inquiries or constructing end-to-end encrypted zero-knowledge vaults, every deliverable is crafted with production rigor.'
              )}
            </p>
          </div>

          {/* Detailed Timeline */}
          <div className="rounded-3xl p-6 bg-slate-900/80 border border-slate-800 space-y-6">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-emerald-400" />
              <span>{t('المسار الوظيفي والمشاريع الكبرى', 'Career Milestones & Roles')}</span>
            </h3>

            <div className="space-y-6">
              {EXPERIENCE_DATA.map((exp) => (
                <div key={exp.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="font-bold text-white text-sm">
                      {t(exp.roleAr, exp.role)}
                    </h4>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-900 font-mono text-cyan-400 border border-slate-800">
                      {t(exp.periodAr, exp.period)}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-400">
                    {t(exp.companyAr, exp.company)}
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {t(exp.descriptionAr, exp.description)}
                  </p>
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {exp.achievements.map((ach, ai) => (
                      <div
                        key={ai}
                        className="w-full text-xs text-slate-300 flex items-start gap-2 bg-slate-900/60 p-2 rounded-lg"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0"></span>
                        <span>{t(exp.achievementsAr[ai], ach)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Cards */}
        <div className="space-y-6">
          {/* Avatar Card */}
          <div className="rounded-3xl p-6 bg-slate-900/80 border border-slate-800 text-center space-y-4">
            <div className="w-32 h-32 rounded-3xl overflow-hidden mx-auto border-2 border-slate-700 p-1 bg-slate-950 shadow-xl">
              <img
                src={DEVELOPER_PROFILE.avatar}
                alt={DEVELOPER_PROFILE.name}
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
            <div>
              <h3 className="font-black text-xl text-white">{DEVELOPER_PROFILE.name}</h3>
              <p className="text-xs text-cyan-400 font-medium mt-0.5">
                {t('مهندس ذكاء اصطناعي وأتمتة روبوتات', 'Bot & AI Architect')}
              </p>
            </div>
            <div className="text-xs text-slate-400 space-y-1">
              <p>📍 {t(DEVELOPER_PROFILE.locationAr, DEVELOPER_PROFILE.location)}</p>
              <p>⚡ {t('متاح للتعاقد الفوري', 'Available for immediate contracts')}</p>
            </div>
          </div>

          {/* Core Strengths */}
          <div className="rounded-3xl p-6 bg-slate-900/80 border border-slate-800 space-y-3">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>{t('المعايير المعتمدة في العمل', 'Engineering Standards')}</span>
            </h4>
            {[
              { ar: 'كود نظيف موثق (Clean Code & TypeScript)', en: 'Clean Code & Strict TypeScript' },
              { ar: 'معمارية مقاومة للأخطاء (Fault Tolerance)', en: 'High Fault Tolerance' },
              { ar: 'أمان وتشفير من البداية (Security by Design)', en: 'Security & Encryption by Design' },
              { ar: 'دعم كامل للهجات العربية والإنجليزية', en: 'Bilingual NLP & Arabic Dialects' },
              { ar: 'التزام بالمواعيد وسرعة التسليم', en: 'Prompt Delivery & Transparent Comm' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{t(item.ar, item.en)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
