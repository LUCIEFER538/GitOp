import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { ACCENT_THEMES } from '../utils/themeStyles';
import { RepoFile, LanguageStat } from '../types';
import { soundFx } from '../utils/audioSynth';
import {
  X,
  Github,
  ExternalLink,
  Heart,
  Star,
  GitBranch,
  GitCommit,
  Folder,
  FolderOpen,
  FileCode,
  FileText,
  File,
  Copy,
  Check,
  Cpu,
  Layers,
  Search,
  Terminal,
  Code2,
  RefreshCw,
  PieChart,
  Maximize2,
  Minimize2,
  Plus,
  Download,
  Eye,
  CheckCircle2,
} from 'lucide-react';

export const ProjectDetailModal: React.FC = () => {
  const {
    selectedProject,
    setSelectedProject,
    accent,
    t,
    language,
    likesMap,
    toggleLikeProject,
    hasLikedProject,
  } = useApp();
  const { isAuthenticated, setAuthModalOpen } = useAuth();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<'files' | 'create-file' | 'languages' | 'commits' | 'overview' | 'live-fetch'>('files');
  const [selectedFile, setSelectedFile] = useState<RepoFile | null>(null);
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({ src: true, 'src/components': true });
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [isRawView, setIsRawView] = useState(false);

  // Create new file state
  const [newFilePath, setNewFilePath] = useState('src/utils/aiHelper.ts');
  const [newFileCode, setNewFileCode] = useState(`// Created in OPEBAT GitHub Workstation
export function computeModelEmbeddings(tokens: string[]): Float32Array {
  const dim = 768;
  const embeddings = new Float32Array(dim);
  for (let i = 0; i < dim; i++) {
    embeddings[i] = Math.sin(i * 0.1) * Math.cos(tokens.length * 0.05);
  }
  return embeddings;
}
`);
  const [newFileLanguage, setNewFileLanguage] = useState('typescript');
  const [commitMessage, setCommitMessage] = useState('feat: add aiHelper neural embedding module');
  const [committedSuccess, setCommittedSuccess] = useState(false);

  // Custom live repo
  const [customRepoUrl, setCustomRepoUrl] = useState('GRYKJ249/OPEBAT-');
  const [liveRepoLoading, setLiveRepoLoading] = useState(false);
  const [liveRepoData, setLiveRepoData] = useState<any>(null);

  if (!selectedProject) return null;

  const currentTheme = ACCENT_THEMES[accent];
  const isLiked = hasLikedProject(selectedProject.id);
  const likesCount = likesMap[selectedProject.id] || selectedProject.likes;

  const filesList = selectedProject.files || [];
  const currentActiveFile = selectedFile || (filesList[0]?.children ? filesList[0].children[0] : filesList[0]) || null;

  const toggleFolder = (path: string) => {
    setOpenFolders((prev) => ({ ...prev, [path]: !prev[path] }));
    soundFx.playClick();
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    soundFx.playLaser();
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    soundFx.playClick();
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handleDownloadFile = (fileName: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
    soundFx.playChime();
  };

  const handleCommitNewFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFilePath.trim() || !newFileCode.trim()) return;

    if (!isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }

    const fileName = newFilePath.split('/').pop() || 'newFile.ts';
    const newFileObj: RepoFile = {
      name: fileName,
      path: newFilePath.trim(),
      type: 'file',
      size: `${(new Blob([newFileCode]).size / 1024).toFixed(1)} KB`,
      language: newFileLanguage,
      content: newFileCode,
    };

    if (selectedProject.files) {
      selectedProject.files.push(newFileObj);
    } else {
      selectedProject.files = [newFileObj];
    }

    if (selectedProject.commits) {
      selectedProject.commits.unshift({
        hash: Math.random().toString(36).substring(2, 9),
        message: commitMessage || `Create ${fileName}`,
        author: 'Verified Developer',
        date: 'Just now',
      });
    }

    setSelectedFile(newFileObj);
    setActiveTab('files');
    setCommittedSuccess(true);
    soundFx.playChime();
    setTimeout(() => setCommittedSuccess(false), 3000);
  };

  const handleFetchLiveRepo = async () => {
    if (!customRepoUrl.trim()) return;
    setLiveRepoLoading(true);
    try {
      let cleaned = customRepoUrl.replace('https://github.com/', '').replace('.git', '').trim();
      const parts = cleaned.split('/');
      if (parts.length >= 2) {
        const owner = parts[0];
        const repo = parts[1];
        const res = await fetch(`/api/github/repo?owner=${owner}&repo=${repo}`);
        const data = await res.json();
        setLiveRepoData(data);
        soundFx.playChime();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLiveRepoLoading(false);
    }
  };

  const renderFileTree = (files: RepoFile[], level = 0) => {
    return (
      <div className="space-y-1">
        {files.map((file) => {
          if (file.type === 'dir') {
            const isOpen = openFolders[file.path] ?? true;
            return (
              <div key={file.path}>
                <button
                  type="button"
                  onClick={() => toggleFolder(file.path)}
                  style={{ paddingInlineStart: `${level * 16 + 8}px` }}
                  className="w-full flex items-center gap-2 py-1.5 px-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800/60 hover:text-white transition-colors text-start"
                >
                  {isOpen ? (
                    <FolderOpen className="w-4 h-4 text-cyan-400 shrink-0" />
                  ) : (
                    <Folder className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                  <span className="truncate">{file.name}</span>
                </button>
                {isOpen && file.children && (
                  <div className="border-s border-slate-800 ms-3">
                    {renderFileTree(file.children, level + 1)}
                  </div>
                )}
              </div>
            );
          }

          const isSelected = currentActiveFile?.path === file.path;
          return (
            <button
              key={file.path}
              type="button"
              onClick={() => {
                setSelectedFile(file);
                soundFx.playClick();
              }}
              style={{ paddingInlineStart: `${level * 16 + 8}px` }}
              className={`w-full flex items-center justify-between py-1.5 px-2 rounded-xl text-xs transition-colors text-start ${
                isSelected
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border-s-2 border-cyan-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                {file.name.endsWith('.md') ? (
                  <FileText className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : file.name.endsWith('.ts') || file.name.endsWith('.tsx') ? (
                  <FileCode className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                ) : file.name.endsWith('.py') ? (
                  <FileCode className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                ) : (
                  <File className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                )}
                <span className="truncate">{file.name}</span>
              </div>
              {file.size && <span className="text-[10px] text-slate-500 font-mono ms-2">{file.size}</span>}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md animate-in fade-in duration-200 ${
      isFullscreen ? 'p-0' : 'p-2 sm:p-4'
    }`}>
      <div className={`flex flex-col bg-[#0b0f19] border border-slate-700/80 shadow-2xl overflow-hidden relative transition-all ${
        isFullscreen ? 'w-screen h-screen rounded-none' : 'w-full max-w-6xl h-[92vh] rounded-3xl'
      }`}>
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <span className={`text-[11px] px-3 py-1 rounded-full font-bold uppercase tracking-wider ${currentTheme.badgeBg}`}>
              {t(selectedProject.badgeAr, selectedProject.badge)}
            </span>
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <Github className="w-5 h-5 text-slate-300" />
              {t(selectedProject.titleAr, selectedProject.title)}
            </h2>
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-xl font-mono">
              <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
              <span>{selectedProject.defaultBranch || 'main'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Fullscreen Toggle */}
            <button
              onClick={() => {
                setIsFullscreen(!isFullscreen);
                soundFx.playClick();
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title={isFullscreen ? t('تصغير الحجم', 'Exit Fullscreen') : t('عرض ملء الشاشة الكاملة', 'Full Screen Workstation')}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={() => toggleLikeProject(selectedProject.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                isLiked
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{likesCount}</span>
            </button>

            {selectedProject.githubUrl && (
              <a
                href={selectedProject.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">GitHub</span>
              </a>
            )}

            <button
              onClick={() => setSelectedProject(null)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* GitHub-style Language Breakdown Bar */}
        {selectedProject.languages && selectedProject.languages.length > 0 && (
          <div className="bg-slate-900/60 px-6 py-3 border-b border-slate-800 shrink-0">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
              <span className="font-bold text-white flex items-center gap-1.5">
                <PieChart className="w-3.5 h-3.5 text-cyan-400" />
                {t('حاسب توزيع لغات البرمجة (Languages Breakdown)', 'Languages Calculator')}
              </span>
              <div className="flex items-center gap-3 text-[11px] font-mono">
                {selectedProject.languages.map((l) => (
                  <span key={l.name} className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: l.color }} />
                    <strong className="text-white">{l.name}</strong> {l.percentage}%
                  </span>
                ))}
              </div>
            </div>
            {/* Visual Color Bar */}
            <div className="w-full h-2 rounded-full overflow-hidden flex bg-slate-800">
              {selectedProject.languages.map((lang) => (
                <div
                  key={lang.name}
                  style={{ width: `${lang.percentage}%`, backgroundColor: lang.color }}
                  title={`${lang.name}: ${lang.percentage}% (${lang.bytes.toLocaleString()} bytes)`}
                  className="h-full transition-all"
                />
              ))}
            </div>
          </div>
        )}

        {/* Tabs Bar with "+ New File" Action */}
        <div className="px-6 bg-slate-900/40 border-b border-slate-800 flex items-center justify-between gap-3 overflow-x-auto text-xs font-semibold shrink-0">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('files')}
              className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                activeTab === 'files'
                  ? 'border-cyan-400 text-cyan-300 bg-cyan-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-4 h-4" />
              {t('مستكشف الملفات والأكواد (Code)', 'Code & Files')}
            </button>

            <button
              onClick={() => setActiveTab('commits')}
              className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                activeTab === 'commits'
                  ? 'border-cyan-400 text-cyan-300 bg-cyan-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <GitCommit className="w-4 h-4" />
              {t('سجل الالتزامات (Commits)', 'Commits')}
              {selectedProject.commits && (
                <span className="bg-slate-800 text-[10px] px-1.5 py-0.5 rounded-full text-slate-300">
                  {selectedProject.commits.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('overview')}
              className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'border-cyan-400 text-cyan-300 bg-cyan-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              {t('المعمارية والتوثيق', 'Architecture & Docs')}
            </button>

            <button
              onClick={() => setActiveTab('live-fetch')}
              className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                activeTab === 'live-fetch'
                  ? 'border-cyan-400 text-cyan-300 bg-cyan-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Search className="w-4 h-4" />
              {t('جيثب المباشر (GitHub API)', 'Live GitHub Fetch')}
            </button>
          </div>

          {/* GitHub Create New File Button */}
          <button
            onClick={() => {
              setActiveTab('create-file');
              soundFx.playLaser();
            }}
            className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-600/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{t('عمل ملف جديد (+ Add File)', '+ Add / Create File')}</span>
          </button>
        </div>

        {committedSuccess && (
          <div className="bg-emerald-500/15 border-b border-emerald-500/30 px-6 py-2 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{t('تم حفظ وإضافة الملف إلى المستودع بنجاح!', 'New file successfully committed to repository!')}</span>
          </div>
        )}

        {/* Tab Content Body */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* TAB: CODE FILES EXPLORER */}
          {activeTab === 'files' && (
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              {/* File Tree Left Sidebar */}
              <div className="w-full md:w-72 border-b md:border-b-0 md:border-e border-slate-800 bg-[#080c14] p-4 overflow-y-auto max-h-48 md:max-h-none scrollbar-thin scrollbar-thumb-slate-800 shrink-0">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 px-2 flex items-center justify-between">
                  <span>{t('شجرة الملفات', 'Repository Files')}</span>
                  <span className="text-cyan-400 font-mono text-[10px]">{filesList.length} items</span>
                </div>
                {renderFileTree(filesList)}
              </div>

              {/* Code Viewer Main Area */}
              <div className="flex-1 flex flex-col bg-[#07090e] overflow-hidden">
                {currentActiveFile ? (
                  <>
                    {/* File Header Bar */}
                    <div className="px-5 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs shrink-0">
                      <div className="flex items-center gap-2.5 font-mono text-slate-300">
                        <FileCode className="w-4 h-4 text-cyan-400" />
                        <span className="font-bold text-white">{currentActiveFile.path}</span>
                        {currentActiveFile.size && (
                          <span className="text-[11px] text-slate-500">({currentActiveFile.size})</span>
                        )}
                        <span className="text-[11px] text-slate-500">
                          • {(currentActiveFile.content || '').split('\n').length} lines
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setIsRawView(!isRawView)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-mono border transition-colors ${
                            isRawView ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          Raw
                        </button>
                        <button
                          onClick={() => handleDownloadFile(currentActiveFile.name, currentActiveFile.content || '')}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                          title="Download File"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleCopyCode(currentActiveFile.content || '')}
                          className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors text-xs"
                        >
                          {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedCode ? t('تم النسخ!', 'Copied!') : t('نسخ الكود', 'Copy')}</span>
                        </button>
                      </div>
                    </div>

                    {/* Syntax Code with Line Numbers */}
                    <div className="flex-1 overflow-auto p-5 font-mono text-xs text-slate-200 scrollbar-thin scrollbar-thumb-slate-800">
                      {isRawView ? (
                        <pre className="whitespace-pre text-slate-300 select-all font-mono">
                          {currentActiveFile.content || '// Empty file'}
                        </pre>
                      ) : (
                        <pre className="flex leading-relaxed">
                          <div className="select-none text-slate-600 text-end pe-4 border-e border-slate-800/80 me-4 font-mono">
                            {(currentActiveFile.content || '').split('\n').map((_, idx) => (
                              <div key={idx}>{idx + 1}</div>
                            ))}
                          </div>
                          <code className="text-slate-200 flex-1 whitespace-pre">
                            {currentActiveFile.content || '// Empty file'}
                          </code>
                        </pre>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
                    {t('اختر ملفاً من الشجرة البرمجية لعرضه', 'Select a file from the repository tree to view code')}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: GITHUB CREATE NEW FILE WORKSTATION */}
          {activeTab === 'create-file' && (
            <div className="flex-1 overflow-y-auto p-6 bg-[#07090e] space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <FileCode className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-bold text-sm text-white">
                    {t('إنشاء ملف جديد في المستودع (GitHub File Editor)', 'Create New File in Repository')}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab('files')}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  {t('إلغاء والعودة للملفات', 'Cancel')}
                </button>
              </div>

              <form onSubmit={handleCommitNewFile} className="space-y-4">
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="flex-1 w-full flex items-center bg-slate-950 border border-slate-700/80 rounded-2xl px-4 py-2 font-mono text-xs text-slate-300">
                    <span className="text-slate-500 me-2">{selectedProject.title}/</span>
                    <input
                      type="text"
                      required
                      value={newFilePath}
                      onChange={(e) => setNewFilePath(e.target.value)}
                      placeholder="path/to/filename.ts"
                      className="flex-1 bg-transparent text-white focus:outline-none text-xs font-mono"
                    />
                  </div>

                  <select
                    value={newFileLanguage}
                    onChange={(e) => setNewFileLanguage(e.target.value)}
                    className="w-full sm:w-44 bg-slate-950 border border-slate-700/80 rounded-2xl px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-400"
                  >
                    <option value="typescript">TypeScript (.ts/.tsx)</option>
                    <option value="javascript">JavaScript (.js)</option>
                    <option value="python">Python (.py)</option>
                    <option value="json">JSON (.json)</option>
                    <option value="css">CSS / Tailwind (.css)</option>
                    <option value="markdown">Markdown (.md)</option>
                  </select>
                </div>

                {/* Editor Textarea with live line numbers */}
                <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 p-4 font-mono text-xs">
                  <div className="flex justify-between text-[11px] text-slate-500 pb-2 border-b border-slate-800/80 mb-2">
                    <span>Code Editor</span>
                    <span>
                      {newFileCode.split('\n').length} lines • {newFileCode.length} chars
                    </span>
                  </div>
                  <textarea
                    rows={12}
                    value={newFileCode}
                    onChange={(e) => setNewFileCode(e.target.value)}
                    placeholder="// Write or paste code here..."
                    className="w-full bg-transparent text-cyan-300 focus:outline-none resize-none font-mono leading-relaxed"
                  />
                </div>

                {/* Commit Box */}
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <h4 className="font-bold text-xs text-white">
                    {t('تثبيت التغييرات (Commit New File):', 'Commit New File:')}
                  </h4>
                  <input
                    type="text"
                    value={commitMessage}
                    onChange={(e) => setCommitMessage(e.target.value)}
                    placeholder="Commit message (e.g. Create neuralCore.ts)..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-400 font-mono">
                      Target Branch: <strong>{selectedProject.defaultBranch || 'main'}</strong>
                    </span>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/20 active:scale-95 transition-all"
                    >
                      {t('تأكيد الالتزام وحفظ الملف (Commit Changes)', 'Commit Changes')}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* TAB: COMMITS */}
          {activeTab === 'commits' && (
            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                {t('سجل التحديثات والالتزامات الأخيرة', 'Commit History')}
              </h4>
              <div className="space-y-3">
                {(selectedProject.commits || []).map((commit) => (
                  <div
                    key={commit.hash}
                    className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
                        <GitCommit className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-200">{commit.message}</p>
                        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-0.5">
                          <span className="text-cyan-400">{commit.author}</span>
                          <span>•</span>
                          <span>{commit.date}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopyHash(commit.hash)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs border border-slate-700"
                    >
                      <span>{commit.hash}</span>
                      {copiedHash === commit.hash ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-800 text-sm">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  {t('نبذة تفصيلية عن المشروع', 'Project Overview')}
                </h4>
                <p className="text-slate-200 leading-relaxed bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
                  {t(selectedProject.longDescriptionAr, selectedProject.longDescription)}
                </p>
              </div>

              {selectedProject.architecture && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-emerald-400" />
                    {t('معمارية النظام وهندسة البرمجيات', 'System Architecture')}
                  </h4>
                  <p className="text-slate-300 leading-relaxed bg-slate-900/40 p-5 rounded-2xl border border-slate-800 font-mono text-xs">
                    {t(selectedProject.architectureAr || '', selectedProject.architecture)}
                  </p>
                </div>
              )}

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  {t('التقنيات المستخدمة (Tech Stack)', 'Technologies')}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tech.map((tItem) => (
                    <span
                      key={tItem}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 border border-slate-700/80"
                    >
                      {tItem}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: LIVE GITHUB */}
          {activeTab === 'live-fetch' && (
            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <label className="block text-xs font-semibold text-slate-300">
                  {t('استكشاف أي مستودع جيثب عام عبر GitHub REST API:', 'Explore any public GitHub repository:')}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customRepoUrl}
                    onChange={(e) => setCustomRepoUrl(e.target.value)}
                    placeholder="e.g. GRYKJ249/OPEBAT- or owner/repo"
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    onClick={handleFetchLiveRepo}
                    disabled={liveRepoLoading}
                    className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${liveRepoLoading ? 'animate-spin' : ''}`} />
                    <span>{liveRepoLoading ? t('جاري الجلب...', 'Fetching...') : t('جلب المستودع', 'Fetch Repo')}</span>
                  </button>
                </div>
              </div>

              {liveRepoData && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-white text-base">{liveRepoData.repo?.full_name}</h3>
                      <p className="text-xs text-slate-400 mt-1">{liveRepoData.repo?.description || 'No description provided'}</p>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-300 font-mono">
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-400" />
                        {liveRepoData.repo?.stargazers_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
                        {liveRepoData.repo?.forks_count}
                      </span>
                    </div>
                  </div>

                  {liveRepoData.contents && (
                    <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800">
                      <h4 className="text-xs font-bold text-slate-300 mb-3">{t('محتويات الجذر للمستودع:', 'Root Directory Contents:')}</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                        {liveRepoData.contents.map((item: any) => (
                          <div key={item.name} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
                            {item.type === 'dir' ? <Folder className="w-4 h-4 text-cyan-400" /> : <FileCode className="w-4 h-4 text-slate-400" />}
                            <span className="truncate text-slate-200">{item.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
