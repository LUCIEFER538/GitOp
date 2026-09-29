import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { PROJECTS_DATA } from '../data/projectsData';
import { ACCENT_THEMES } from '../utils/themeStyles';
import { Project } from '../types';
import {
  Search,
  Filter,
  Heart,
  Star,
  ExternalLink,
  Github,
  Layers,
  Sparkles,
  GitBranch,
  GitFork,
  FileCode,
  Copy,
  Check,
  FolderGit2,
  Code2,
} from 'lucide-react';

export const ProjectsView: React.FC = () => {
  const {
    accent,
    t,
    setSelectedProject,
    likesMap,
    toggleLikeProject,
    hasLikedProject,
  } = useApp();

  const currentTheme = ACCENT_THEMES[accent];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [clonedId, setClonedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', labelAr: 'كافة المستودعات', labelEn: 'All Repositories' },
    { id: 'fullstack', labelAr: 'Full Stack & AI Suites', labelEn: 'Full Stack & AI' },
    { id: 'bots', labelAr: 'روبوتات وأتمتة', labelEn: 'Bots & Webhooks' },
    { id: 'ai', labelAr: 'ذكاء اصطناعي وتوليد', labelEn: 'AI & Generative' },
    { id: 'cyber', labelAr: 'أمن سيبراني واختراق', labelEn: 'Cybersecurity' },
    { id: 'tools', labelAr: 'أدوات وسكربتات', labelEn: 'Tools & Crawlers' },
  ];

  const filteredProjects = useMemo(() => {
    return PROJECTS_DATA.filter((p) => {
      const matchesCategory =
        selectedCategory === 'all' || p.category === selectedCategory;

      const query = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !query ||
        p.title.toLowerCase().includes(query) ||
        p.titleAr.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.descriptionAr.toLowerCase().includes(query) ||
        p.tech.some((tech) => tech.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  const handleCopyClone = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    const cmd = `git clone ${project.githubUrl || `https://github.com/GRYKJ249/${project.id}.git`}`;
    navigator.clipboard.writeText(cmd);
    setClonedId(project.id);
    setTimeout(() => setClonedId(null), 2000);
  };

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 end-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase ${currentTheme.badgeBg}`}>
              GitHub Workstation & Code Viewer
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3 mt-1.5">
              <FolderGit2 className="w-8 h-8 text-cyan-400" />
              {t('مستودعات الأكواد ومستكشف الملفات الشجري', 'Repositories & GitHub Code Workstation')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
              {t('استكشف ملفات الكود الداخلية، شجرة المجلدات، نسب اللغات المستخدمة، وسجل الالتزامات بنقرة واحدة تماماً مثل GitHub.', 'Browse internal code files, repository trees, language breakdown bars, and commit history just like GitHub.')}
            </p>
          </div>

          {/* Search Box */}
          <div className="w-full md:w-80 relative">
            <Search className="w-4 h-4 absolute top-3.5 start-3.5 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('ابحث بالاسم، التقنية، أو الوصف...', 'Search repositories, stack...')}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 ps-10 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Filter Categories */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pt-6 mt-6 border-t border-slate-800/80">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-cyan-600 text-white font-bold shadow-md shadow-cyan-600/20'
                  : 'bg-slate-900/90 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {t(cat.labelAr, cat.labelEn)}
            </button>
          ))}
        </div>
      </div>

      {/* Repositories Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => {
          const isLiked = hasLikedProject(project.id);
          const likesCount = likesMap[project.id] || project.likes;
          const filesCount = project.files?.length || 4;

          return (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="p-6 rounded-2xl bg-[#0b0f19] border border-slate-800/90 hover:border-cyan-500/50 cursor-pointer transition-all duration-200 group flex flex-col justify-between shadow-xl hover:shadow-cyan-500/10 relative"
            >
              <div>
                {/* Top Badge & Branch */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${currentTheme.badgeBg}`}>
                    {t(project.badgeAr, project.badge)}
                  </span>

                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
                    <GitBranch className="w-3 h-3 text-cyan-400" />
                    <span>{project.defaultBranch || 'main'}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-bold text-base text-white group-hover:text-cyan-300 transition-colors flex items-center gap-2">
                  <Github className="w-4 h-4 text-slate-400 group-hover:text-cyan-400" />
                  <span>{t(project.titleAr, project.title)}</span>
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-3">
                  {t(project.descriptionAr, project.description)}
                </p>

                {/* GitHub Language Breakdown Bar on Card */}
                {project.languages && project.languages.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-semibold text-slate-300 flex items-center gap-1">
                        <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                        {project.languages[0].name} ({project.languages[0].percentage}%)
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {project.languages.length} {t('لغات', 'languages')}
                      </span>
                    </div>

                    <div className="w-full h-1.5 rounded-full overflow-hidden flex bg-slate-800">
                      {project.languages.map((lang) => (
                        <div
                          key={lang.name}
                          style={{ width: `${lang.percentage}%`, backgroundColor: lang.color }}
                          className="h-full"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {project.tech.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.tech.length > 4 && (
                    <span className="px-1.5 py-0.5 rounded bg-slate-900 text-[10px] font-mono text-slate-500">
                      +{project.tech.length - 4}
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Footer: Stars, Forks, Files, and Actions */}
              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                {/* Metrics */}
                <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
                  <span className="flex items-center gap-1 hover:text-white">
                    <Star className="w-3.5 h-3.5 text-amber-400" />
                    <span>{project.stars}</span>
                  </span>
                  <span className="flex items-center gap-1 hover:text-white">
                    <GitFork className="w-3.5 h-3.5 text-slate-400" />
                    <span>{project.forks || 34}</span>
                  </span>
                  <span className="flex items-center gap-1 text-cyan-400">
                    <FileCode className="w-3.5 h-3.5" />
                    <span>{filesCount} {t('ملفات', 'files')}</span>
                  </span>
                </div>

                {/* Clone & Like Action Buttons */}
                <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={(e) => handleCopyClone(e, project)}
                    title={t('نسخ أمر استنساخ المستودع (git clone)', 'Copy git clone command')}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 border border-slate-800 transition-colors"
                  >
                    {clonedId === project.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => toggleLikeProject(project.id)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold border transition-all ${
                      isLiked
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                    <span className="font-mono text-[11px]">{likesCount}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
