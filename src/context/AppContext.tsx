import React, { createContext, useContext, useState, useEffect } from 'react';
import { ActivePage, Language, ThemeAccent, Project } from '../types';
import { soundFx } from '../utils/audioSynth';
import { PROJECTS_DATA } from '../data/projectsData';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  accent: ThemeAccent;
  setAccent: (accent: ThemeAccent) => void;
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  aiModalOpen: boolean;
  setAiModalOpen: (open: boolean) => void;
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
  likesMap: Record<string, number>;
  toggleLikeProject: (projectId: string) => void;
  hasLikedProject: (projectId: string) => boolean;
  t: (arText: string, enText: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('gry_lang') as Language) || 'ar';
  });

  const [accent, setAccentState] = useState<ThemeAccent>(() => {
    return (localStorage.getItem('gry_accent') as ThemeAccent) || 'cyan';
  });

  const [activePage, setActivePageState] = useState<ActivePage>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [aiModalOpen, setAiModalOpen] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Initialize project likes
  const [likesMap, setLikesMap] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    PROJECTS_DATA.forEach((p) => {
      initial[p.id] = p.likes;
    });
    try {
      const saved = localStorage.getItem('gry_likes');
      if (saved) {
        return { ...initial, ...JSON.parse(saved) };
      }
    } catch {
      // ignore
    }
    return initial;
  });

  const [likedUserProjects, setLikedUserProjects] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('gry_user_likes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('gry_lang', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    soundFx.playClick();
  };

  const setAccent = (acc: ThemeAccent) => {
    setAccentState(acc);
    localStorage.setItem('gry_accent', acc);
    soundFx.playChime();
  };

  const setActivePage = (page: ActivePage) => {
    setActivePageState(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    soundFx.playClick();
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundFx.setEnabled(next);
  };

  const toggleLikeProject = (projectId: string) => {
    const isCurrentlyLiked = likedUserProjects[projectId];
    const newLiked = !isCurrentlyLiked;
    const currentCount = likesMap[projectId] || 100;
    const newCount = newLiked ? currentCount + 1 : Math.max(0, currentCount - 1);

    const updatedLikesMap = { ...likesMap, [projectId]: newCount };
    const updatedLikedUser = { ...likedUserProjects, [projectId]: newLiked };

    setLikesMap(updatedLikesMap);
    setLikedUserProjects(updatedLikedUser);

    localStorage.setItem('gry_likes', JSON.stringify(updatedLikesMap));
    localStorage.setItem('gry_user_likes', JSON.stringify(updatedLikedUser));

    if (newLiked) {
      soundFx.playLaser();
    } else {
      soundFx.playClick();
    }
  };

  const hasLikedProject = (projectId: string) => {
    return Boolean(likedUserProjects[projectId]);
  };

  const t = (arText: string, enText: string) => {
    return language === 'ar' ? arText : enText;
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        accent,
        setAccent,
        activePage,
        setActivePage,
        sidebarCollapsed,
        setSidebarCollapsed,
        mobileMenuOpen,
        setMobileMenuOpen,
        soundEnabled,
        toggleSound,
        aiModalOpen,
        setAiModalOpen,
        selectedProject,
        setSelectedProject,
        likesMap,
        toggleLikeProject,
        hasLikedProject,
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
