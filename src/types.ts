export type Language = 'ar' | 'en';

export type ThemeAccent = 'cyan' | 'emerald' | 'violet' | 'amber' | 'rose' | 'obsidian' | 'matrix' | 'solar';

export type ActivePage =
  | 'dashboard'
  | 'home'
  | 'projects'
  | 'repo-browser'
  | 'ai-chat'
  | 'data-analytics'
  | 'media-studio'
  | 'video-studio'
  | 'video-analytics'
  | 'smart-cms'
  | 'developer-api'
  | 'ai-arsenal'
  | 'features-500'
  | 'ai-lab'
  | 'cyber'
  | 'productivity'
  | 'analytics'
  | 'about'
  | 'contact'
  | 'settings';

export interface RepoFile {
  name: string;
  path: string;
  type: 'file' | 'dir';
  size?: string;
  language?: string;
  content?: string;
  children?: RepoFile[];
}

export interface LanguageStat {
  name: string;
  percentage: number;
  color: string;
  bytes: number;
}

export interface CommitItem {
  hash: string;
  message: string;
  author: string;
  date: string;
}

export interface Project {
  id: string;
  title: string;
  titleAr: string;
  category: 'ai' | 'bots' | 'fullstack' | 'cyber' | 'tools';
  badge: string;
  badgeAr: string;
  badgeType: 'active' | 'new' | 'featured' | 'popular';
  description: string;
  descriptionAr: string;
  longDescription: string;
  longDescriptionAr: string;
  tech: string[];
  stars: number;
  likes: number;
  forks?: number;
  watchers?: number;
  githubUrl?: string;
  demoUrl?: string;
  highlights: string[];
  highlightsAr: string[];
  architecture?: string;
  architectureAr?: string;
  languages?: LanguageStat[];
  files?: RepoFile[];
  commits?: CommitItem[];
  defaultBranch?: string;
}

export interface SkillCategory {
  title: string;
  titleAr: string;
  icon: string;
  skills: {
    name: string;
    level: number;
    tag: string;
    icon?: string;
  }[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  roleAr: string;
  company: string;
  companyAr: string;
  period: string;
  periodAr: string;
  description: string;
  descriptionAr: string;
  achievements: string[];
  achievementsAr: string[];
  tech: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  model?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar: string;
  badge: string;
  joinedDate: string;
  credits: number;
  token?: string;
  bio?: string;
  githubUsername?: string;
  twoFactorEnabled?: boolean;
  twoFactorSecret?: string;
  backupCodes?: string[];
  socialProvider?: 'github' | 'google' | 'discord' | 'twitter' | 'email';
  apiKeys?: DeveloperApiKey[];
  customWidgets?: string[];
}

export interface DeveloperApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string;
  active: boolean;
}

export interface VideoScene {
  id: string;
  timestamp: string;
  shot: string;
  description: string;
  visualPrompt: string;
  audioEffect: string;
  subtitleAr: string;
  subtitleEn: string;
  duration: number;
}

export interface VideoStoryboard {
  title: string;
  aspect: '16:9' | '9:16' | '1:1';
  totalDuration: number;
  scenes: VideoScene[];
  editingTips: string[];
}

export interface VideoMetricPoint {
  second: number;
  retentionPercent: number;
  dropReason?: string;
}

export interface VideoReport {
  id: string;
  title: string;
  platform: 'youtube' | 'tiktok' | 'reels';
  views: number;
  likes: number;
  shares: number;
  avgWatchTime: string;
  completionRate: number;
  performanceScore: number;
  audienceRetentionVerdict: string;
  hookAnalysis: string;
  retentionCurve: VideoMetricPoint[];
  actionableRecommendations: string[];
  hashtags: string[];
}

export interface AIModelEngine {
  id: 'gpt-4o' | 'claude-3-5-sonnet' | 'gemini-3-8-flash' | 'deepseek-r1' | 'copilot';
  name: string;
  provider: string;
  tagline: string;
  taglineAr: string;
  icon: string;
  color: string;
  badge: string;
  systemPrompt: string;
}

export interface AIToolItem {
  id: string;
  title: string;
  titleAr: string;
  category: 'code' | 'cyber' | 'data' | 'content' | 'productivity' | 'architecture';
  categoryAr: string;
  description: string;
  descriptionAr: string;
  icon: string;
  badge: string;
  defaultInput: string;
  placeholderAr: string;
  placeholderEn: string;
  promptPrefix: string;
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  style: string;
  aspectRatio: string;
  createdAt: string;
}

export interface SongProject {
  id: string;
  title: string;
  titleAr: string;
  genre: string;
  mood: string;
  bpm: number;
  key: string;
  lyrics: string;
  createdAt: string;
}
