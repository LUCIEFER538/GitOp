import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DEVELOPER_PROFILE, EXPERIENCE_DATA, TESTIMONIALS } from '../data/developerProfile';
import { PROJECTS_DATA } from '../data/projectsData';
import { SKILLS_DATA } from '../data/skillsData';
import { ACCENT_THEMES } from '../utils/themeStyles';
import {
  Sparkles,
  Bot,
  Code,
  ArrowRight,
  ArrowLeft,
  Github,
  Mail,
  Send,
  Star,
  CheckCircle2,
  Heart,
  ExternalLink,
  ShieldCheck,
  Cpu,
  Layers,
  Terminal,
  Activity,
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const {
    accent,
    t,
    language,
    setActivePage,
    setAiModalOpen,
    setSelectedProject,
    likesMap,
    toggleLikeProject,
    hasLikedProject,
  } = useApp();

  const currentTheme = ACCENT_THEMES[accent];
  const [activeTab, setActiveTab] = useState<'accounts' | 'skills' | 'experience'>('accounts');

  const featuredProjects = PROJECTS_DATA.slice(0, 4);

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Banner Section */}
      <section className="relative rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-slate-900/90 via-[#0b0f19] to-slate-950 border border-slate-800/80 shadow-2xl overflow-hidden">
        {/* Glow background accent */}
        <div className={`absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gradient-to-br ${currentTheme.bgGlow} blur-3xl pointer-events-none`} />

        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 justify-between">
          <div className="flex-1 text-center lg:text-start space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-xs text-slate-300">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>{t(DEVELOPER_PROFILE.availabilityAr, DEVELOPER_PROFILE.availability)}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              {t('مرحباً، أنا ', 'Hello, I am ')}
              <span className={`bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-${currentTheme.primary}`}>
                {DEVELOPER_PROFILE.name}
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-medium">
              {t(DEVELOPER_PROFILE.taglineAr, DEVELOPER_PROFILE.tagline)}
            </p>

            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              {t(DEVELOPER_PROFILE.bioAr, DEVELOPER_PROFILE.bio)}
            </p>

            {/* Hero Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <button
                onClick={() => setAiModalOpen(true)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-lg ${currentTheme.btnPrimary}`}
              >
                <Sparkles className="w-4 h-4 animate-spin-slow" />
                <span>{t('تحدث مع الذكاء الاصطناعي', 'Chat with AI Assistant')}</span>
              </button>

              <button
                onClick={() => setActivePage('projects')}
                className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold bg-slate-800 hover:bg-slate-700/80 text-slate-200 border border-slate-700/80 transition-all hover:scale-[1.02]"
              >
                <Code className="w-4 h-4 text-cyan-400" />
                <span>{t('معرض المشاريع البرمجية', 'Explore Projects')}</span>
              </button>

              <button
                onClick={() => setActivePage('productivity')}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all"
              >
                <span>{t('حساب تكلفة مشروعك', 'Estimate Cost')}</span>
              </button>
            </div>
          </div>

          {/* Hero Avatar Card */}
          <div className="relative group shrink-0">
            <div className="relative w-44 h-44 sm:w-56 sm:h-56 rounded-3xl overflow-hidden border-2 border-slate-700/70 p-1 bg-gradient-to-b from-slate-800 to-slate-950 shadow-2xl shadow-cyan-950/40">
              <img
                src={DEVELOPER_PROFILE.avatar}
                alt={DEVELOPER_PROFILE.name}
                className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80';
                }}
              />
            </div>
            {/* Floating Terminal Badge */}
            <div className="absolute -bottom-3 -right-3 px-3 py-1.5 rounded-xl bg-slate-900/95 border border-slate-700 shadow-xl text-xs font-mono text-cyan-400 flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5" />
              <span>Full-Stack & Bots</span>
            </div>
          </div>
        </div>
      </section>

      {/* Numerical Stats Counters */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {DEVELOPER_PROFILE.stats.map((stat, i) => (
          <div
            key={i}
            className="p-4 sm:p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-lg text-center relative group hover:border-slate-700 transition-colors"
          >
            <div className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-1 group-hover:scale-105 transition-transform">
              {stat.value}
            </div>
            <div className="text-xs sm:text-sm font-medium text-slate-400">
              {t(stat.labelAr, stat.label)}
            </div>
          </div>
        ))}
      </section>

      {/* Interactive Profile Tabs Section */}
      <section className="rounded-3xl bg-slate-900/60 border border-slate-800/80 p-5 sm:p-8 shadow-xl">
        {/* Tab Headers */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 max-w-xl mx-auto mb-8">
          <button
            onClick={() => setActiveTab('accounts')}
            className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all text-center ${
              activeTab === 'accounts'
                ? `${currentTheme.btnPrimary}`
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t('حساباتي وروابطي', 'Accounts & Links')}
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all text-center ${
              activeTab === 'skills'
                ? `${currentTheme.btnPrimary}`
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t('المهارات والتقنيات', 'Skills Matrix')}
          </button>
          <button
            onClick={() => setActiveTab('experience')}
            className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all text-center ${
              activeTab === 'experience'
                ? `${currentTheme.btnPrimary}`
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t('المسار المهني', 'Career & Experience')}
          </button>
        </div>

        {/* Tab 1: Accounts & Socials */}
        {activeTab === 'accounts' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <a
              href={DEVELOPER_PROFILE.github}
              target="_blank"
              rel="noreferrer"
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 flex flex-col justify-between gap-4 group transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-white">
                  <Github className="w-5 h-5" />
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-white" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base">GitHub Profile</h4>
                <p className="text-xs text-slate-400 mt-1">@GRYKJ249</p>
                <p className="text-xs text-cyan-400 mt-2">
                  {t('استكشف المستودعات البرمجية المفتوحة', 'Explore public repositories')}
                </p>
              </div>
            </a>

            <a
              href={DEVELOPER_PROFILE.telegram}
              target="_blank"
              rel="noreferrer"
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 flex flex-col justify-between gap-4 group transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Send className="w-5 h-5" />
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-white" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base">Telegram Direct</h4>
                <p className="text-xs text-slate-400 mt-1">@GRYKJ249</p>
                <p className="text-xs text-cyan-400 mt-2">
                  {t('تواصل مباشر وسريع للمشاريع والاستفسارات', 'Direct instant chat & inquiries')}
                </p>
              </div>
            </a>

            <a
              href={`mailto:${DEVELOPER_PROFILE.email}`}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 flex flex-col justify-between gap-4 group transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-white" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base">Email Consultation</h4>
                <p className="text-xs text-slate-400 mt-1">{DEVELOPER_PROFILE.email}</p>
                <p className="text-xs text-cyan-400 mt-2">
                  {t('عقود المشاريع والاستشارات الرسمية', 'Formal contract & consultation inquiries')}
                </p>
              </div>
            </a>
          </div>
        )}

        {/* Tab 2: Skills Matrix */}
        {activeTab === 'skills' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SKILLS_DATA.map((cat, i) => (
              <div key={i} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${currentTheme.badgeBg}`}></span>
                  <span>{t(cat.titleAr, cat.title)}</span>
                </h4>
                <div className="space-y-3">
                  {cat.skills.map((skill, si) => (
                    <div key={si} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-300">{skill.name}</span>
                        <span className="font-mono text-cyan-400 font-bold">{skill.level}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Experience Timeline */}
        {activeTab === 'experience' && (
          <div className="relative border-r-2 md:border-r-0 md:border-l-2 border-slate-800 space-y-8 pr-6 md:pr-0 md:pl-6 max-w-3xl mx-auto">
            {EXPERIENCE_DATA.map((exp) => (
              <div key={exp.id} className="relative group">
                <span className="absolute -right-[31px] md:-right-0 md:-left-[31px] top-1.5 w-4 h-4 rounded-full bg-cyan-400 border-4 border-slate-950 shadow-md"></span>
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="font-bold text-white text-base">
                      {t(exp.roleAr, exp.role)}
                    </h4>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 font-mono text-cyan-300 border border-slate-700">
                      {t(exp.periodAr, exp.period)}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-400">
                    {t(exp.companyAr, exp.company)}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {t(exp.descriptionAr, exp.description)}
                  </p>
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {exp.tech.map((tItem, ti) => (
                      <span
                        key={ti}
                        className="text-[11px] px-2 py-0.5 rounded bg-slate-950 text-slate-400 font-mono"
                      >
                        {tItem}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Featured Projects Showcase Preview */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <Code className="w-5 h-5 text-cyan-400" />
              <span>{t('أبرز المشاريع الريادية', 'Featured Showcase Projects')}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {t('مجموعة من أهم تطبيقات الروبوتات والذكاء الاصطناعي المكتملة', 'Production bots, full-stack applications & cyber toolkits')}
            </p>
          </div>

          <button
            onClick={() => setActivePage('projects')}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <span>{t('عرض كافة المشاريع (10+)', 'View All Projects (10+)')}</span>
            {language === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {featuredProjects.map((p) => {
            const isLiked = hasLikedProject(p.id);
            const count = likesMap[p.id] || p.likes;

            return (
              <div
                key={p.id}
                className="rounded-2xl p-5 bg-slate-900/80 border border-slate-800/90 hover:border-slate-700 flex flex-col justify-between gap-4 group transition-all shadow-lg"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${currentTheme.badgeBg}`}>
                      {t(p.badgeAr, p.badge)}
                    </span>
                    <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{p.stars}</span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {t(p.titleAr, p.title)}
                  </h3>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {t(p.descriptionAr, p.description)}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {p.tech.slice(0, 4).map((tech, ti) => (
                      <span
                        key={ti}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-950 font-mono text-slate-400 border border-slate-800"
                      >
                        {tech}
                      </span>
                    ))}
                    {p.tech.length > 4 && (
                      <span className="text-[10px] px-1.5 py-0.5 text-slate-400 font-mono">
                        +{p.tech.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <button
                    onClick={() => toggleLikeProject(p.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                      isLiked
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                    <span>{count}</span>
                  </button>

                  <button
                    onClick={() => setSelectedProject(p)}
                    className="text-xs px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors flex items-center gap-1"
                  >
                    <span>{t('التفاصيل والمعمارية', 'Details & Specs')}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section className="rounded-3xl p-6 sm:p-8 bg-slate-900/60 border border-slate-800/80 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {t('آراء العملاء والشركاء', 'Client Endorsements')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {t('شهادات حقيقية من مشاريع أتمتة وحلول برمجية تم تسليمها بنجاح', 'Real feedback from delivered bots, web apps & AI integrations')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TESTIMONIALS.map((test, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between gap-4"
            >
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(test.stars)].map((_, si) => (
                  <Star key={si} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
                "{t(test.contentAr, test.content)}"
              </p>
              <div className="pt-2 border-t border-slate-800/80">
                <h5 className="font-bold text-white text-xs">{test.name}</h5>
                <p className="text-[11px] text-slate-400 mt-0.5">{t(test.roleAr, test.role)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
