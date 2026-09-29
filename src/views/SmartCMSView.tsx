import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { ACCENT_THEMES } from '../utils/themeStyles';
import { soundFx } from '../utils/audioSynth';
import { ProtectedFeature } from '../components/ProtectedFeature';
import {
  FolderKanban,
  Sparkles,
  Search,
  Plus,
  Trash2,
  Bookmark,
  Share2,
  Film,
  Music,
  Image as ImageIcon,
  Code2,
  Download,
  Tag,
  Check,
  Copy,
  ExternalLink,
} from 'lucide-react';

interface CMSItem {
  id: string;
  title: string;
  category: 'video' | 'image' | 'song' | 'code';
  tags: string[];
  snippet: string;
  createdAt: string;
  favorite: boolean;
  metadata?: any;
}

const INITIAL_CMS_ITEMS: CMSItem[] = [
  {
    id: 'cms-1',
    title: 'سيناريو إعلان روبوتات OPEBAT المستقبلية',
    category: 'video',
    tags: ['AI_Video', 'Cyberpunk', 'Commercial'],
    snippet: 'لوحة مشاهد سينمائية كاملة من 4 لقطات مع نصوص الترجمة ومؤثرات صوتية Synth Riser 4K.',
    createdAt: '2026-02-28',
    favorite: true,
  },
  {
    id: 'cms-2',
    title: 'أغنية شفرات النيون الرقمية (Cyberpunk Synthwave)',
    category: 'song',
    tags: ['Music', 'Synthwave', 'Lyrics', '125BPM'],
    snippet: '[المقدمة] في عتمة الليل تلمع الشاشات... مقامات Cm - Ab - Bb مع إيقاع 808.',
    createdAt: '2026-02-27',
    favorite: true,
  },
  {
    id: 'cms-3',
    title: 'صورة المعمار السيبراني الفائق 8K Octane',
    category: 'image',
    tags: ['Generative_Art', '8K', 'Hologram'],
    snippet: 'Prompt: Futuristic AI cyber bot coding on holographic screens with neon skyline, ray tracing.',
    createdAt: '2026-02-26',
    favorite: false,
  },
  {
    id: 'cms-4',
    title: 'دالة Node.js الآمنة لفك تشفير JWT مع 2FA',
    category: 'code',
    tags: ['TypeScript', 'Security', 'Auth', '2FA'],
    snippet: 'export function verifyTotpToken(secret: string, token: string): boolean { /* crypto logic */ }',
    createdAt: '2026-02-25',
    favorite: true,
  },
];

export const SmartCMSView: React.FC = () => {
  const { accent, t } = useApp();
  const { user } = useAuth();
  const currentTheme = ACCENT_THEMES[accent];

  const [items, setItems] = useState<CMSItem[]>(INITIAL_CMS_ITEMS);
  const [activeCategory, setActiveCategory] = useState<'all' | 'video' | 'image' | 'song' | 'code'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'video' | 'image' | 'song' | 'code'>('code');
  const [newSnippet, setNewSnippet] = useState('');
  const [newTags, setNewTags] = useState('Production, Custom');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredItems = items.filter((item) => {
    const matchCat = activeCategory === 'all' ? true : item.category === activeCategory;
    const matchSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.snippet.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  const handleToggleFavorite = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, favorite: !item.favorite } : item))
    );
    soundFx.playClick();
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    soundFx.playClick();
  };

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: CMSItem = {
      id: `cms_${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      tags: newTags.split(',').map((t) => t.trim()).filter((t) => t.length > 0),
      snippet: newSnippet.trim(),
      createdAt: new Date().toISOString().split('T')[0],
      favorite: true,
    };

    setItems((prev) => [newItem, ...prev]);
    setIsAddingNew(false);
    setNewTitle('');
    setNewSnippet('');
    soundFx.playChime();
  };

  const handleCopySnippet = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    soundFx.playClick();
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportBackup = () => {
    const blob = new Blob([JSON.stringify(items, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `opebat-smart-cms-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    soundFx.playChime();
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0b0f19] border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div>
          <span className={`text-[11px] px-3 py-1 rounded-full font-bold uppercase ${currentTheme.badgeBg}`}>
            Personalized Content Engine
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 mt-2">
            <FolderKanban className="w-6 h-6 text-cyan-400" />
            {t('نظام إدارة المحتوى المخصص للمطورين (Smart CMS)', 'Personalized Smart CMS & Collections')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {t(
              'مكتبتك السحابية الخاصة لحفظ وتصنيف نصوص الفيديو، الأغاني، الصور، القوالب البرمجية والمشاريع المفضلة.',
              'Your cloud repository for saved video scripts, generated music, artwork, code snippets, and assets.'
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddingNew(true)}
            className="px-4 py-2.5 rounded-2xl font-bold text-xs bg-cyan-600 hover:bg-cyan-500 text-white flex items-center gap-2 shadow-lg shadow-cyan-600/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{t('إضافة عنصر جديد', 'Add Item')}</span>
          </button>

          <button
            onClick={handleExportBackup}
            className="p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 transition-colors"
            title="Download JSON Backup"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      <ProtectedFeature
        featureTitle="Personalized Smart Content Management System"
        featureTitleAr="نظام إدارة المحتوى المخصص للأعضاء"
        featureDescAr="الوصول إلى مكتبتك السحابية الخاصة وتخزين عناصر الميديا والأكواد متاح لحسابك المعتمد."
      >
        <div className="space-y-6">
          {/* Controls: Search & Category Pills */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-[#0b0f19] border border-slate-800 shadow-xl">
            {/* Search */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute top-3.5 start-3 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('البحث في المحتوى والوسوم...', 'Search title, snippet or tag...')}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl ps-9 pe-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Category tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
              {[
                { id: 'all', nameAr: 'الكل', nameEn: 'All' },
                { id: 'video', nameAr: 'فيديو', nameEn: 'Videos', icon: Film },
                { id: 'image', nameAr: 'صور', nameEn: 'Images', icon: ImageIcon },
                { id: 'song', nameAr: 'أغاني', nameEn: 'Music', icon: Music },
                { id: 'code', nameAr: 'أكواد', nameEn: 'Code', icon: Code2 },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id as any);
                    soundFx.playClick();
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeCategory === cat.id
                      ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
                      : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat.icon && <cat.icon className="w-3.5 h-3.5" />}
                  <span>{t(cat.nameAr, cat.nameEn)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* New Item Modal Drawer */}
          {isAddingNew && (
            <div className="p-6 rounded-3xl bg-[#0b0f19] border border-cyan-500/50 shadow-2xl space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  {t('إضافة عنصر جديد إلى مكتبتك السحابية', 'Add New Asset to Smart CMS')}
                </h3>
                <button
                  onClick={() => setIsAddingNew(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateItem} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {t('العنوان أو اسم العنصر:', 'Title / Asset Name:')}
                    </label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. Cyberpunk Storyboard Scene 1"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {t('التصنيف:', 'Category:')}
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                    >
                      <option value="code">{t('شفرة برمجية (Code)', 'Code')}</option>
                      <option value="video">{t('مشهد فيديو (Video)', 'Video')}</option>
                      <option value="image">{t('صورة فنية (Image)', 'Image')}</option>
                      <option value="song">{t('أغنية ولحن (Song)', 'Song')}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {t('المحتوى أو الكود أو أمر التوليد:', 'Content / Snippet / Prompt:')}
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={newSnippet}
                    onChange={(e) => setNewSnippet(e.target.value)}
                    placeholder="Enter code snippet, prompt, or lyrics..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-400 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {t('الوسوم (مفصولة بفواصل):', 'Tags (comma separated):')}
                  </label>
                  <input
                    type="text"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    placeholder="AI, Production, Security"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingNew(false)}
                    className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                  >
                    {t('إلغاء', 'Cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl font-bold text-xs bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/20"
                  >
                    {t('حفظ في المكتبة', 'Save to CMS')}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-3xl bg-[#0b0f19] border border-slate-800 shadow-xl space-y-3 relative group hover:border-slate-700 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400">
                      {item.category === 'video' && <Film className="w-4 h-4" />}
                      {item.category === 'image' && <ImageIcon className="w-4 h-4" />}
                      {item.category === 'song' && <Music className="w-4 h-4" />}
                      {item.category === 'code' && <Code2 className="w-4 h-4" />}
                    </span>
                    <div>
                      <h4 className="font-bold text-xs text-white">{item.title}</h4>
                      <span className="text-[10px] text-slate-500 font-mono">{item.createdAt}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleToggleFavorite(item.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        item.favorite ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 ${item.favorite ? 'fill-amber-400' : ''}`} />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Snippet box */}
                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 font-mono text-xs text-slate-300 line-clamp-3 leading-relaxed">
                  {item.snippet}
                </div>

                {/* Tags & Action */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {item.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-lg bg-slate-900 text-slate-400 text-[10px] font-mono border border-slate-800"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => handleCopySnippet(item.id, item.snippet)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition-colors"
                  >
                    {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === item.id ? t('تم النسخ', 'Copied') : t('نسخ', 'Copy')}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ProtectedFeature>
    </div>
  );
};
