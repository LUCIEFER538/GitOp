import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { ParticleBackground } from './components/ParticleBackground';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { AIChatModal } from './components/AIChatModal';
import { AuthModal } from './components/AuthModal';

// Views
import { DashboardView } from './views/DashboardView';
import { ProjectsView } from './views/ProjectsView';
import { MultiAIChatView } from './views/MultiAIChatView';
import { SmartDataAnalyticsView } from './views/SmartDataAnalyticsView';
import { MediaStudioView } from './views/MediaStudioView';
import { AIArsenalView } from './views/AIArsenalView';
import { FeaturesDirectoryView } from './views/FeaturesDirectoryView';
import { CyberToolsView } from './views/CyberToolsView';
import { ProductivityView } from './views/ProductivityView';
import { UserSettingsView } from './views/UserSettingsView';
import { HomeView } from './views/HomeView';
import { AIVideoStudioView } from './views/AIVideoStudioView';
import { DeveloperAPIView } from './views/DeveloperAPIView';
import { VideoAnalyticsView } from './views/VideoAnalyticsView';
import { SmartCMSView } from './views/SmartCMSView';

const MainLayout: React.FC = () => {
  const { activePage, sidebarCollapsed, language } = useApp();

  const renderActiveView = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardView />;
      case 'projects':
        return <ProjectsView />;
      case 'video-studio':
        return <AIVideoStudioView />;
      case 'developer-api':
        return <DeveloperAPIView />;
      case 'video-analytics':
        return <VideoAnalyticsView />;
      case 'smart-cms':
        return <SmartCMSView />;
      case 'media-studio':
        return <MediaStudioView />;
      case 'ai-chat':
        return <MultiAIChatView />;
      case 'data-analytics':
        return <SmartDataAnalyticsView />;
      case 'ai-arsenal':
        return <AIArsenalView />;
      case 'features-500':
        return <FeaturesDirectoryView />;
      case 'cyber':
        return <CyberToolsView />;
      case 'productivity':
        return <ProductivityView />;
      case 'settings':
        return <UserSettingsView />;
      case 'home':
        return <HomeView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#07090f] text-slate-100 flex flex-col relative selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Dynamic Star / Particle Constellation */}
      <ParticleBackground />

      {/* Main Persistent Sidebar */}
      <Sidebar />

      {/* Main Application Workstation Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          language === 'ar'
            ? sidebarCollapsed
              ? 'lg:mr-20'
              : 'lg:mr-72'
            : sidebarCollapsed
            ? 'lg:ml-20'
            : 'lg:ml-72'
        }`}
      >
        {/* Top Header with live ticker & quick actions */}
        <Header />

        {/* Dynamic View Body */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto relative z-10">
          {renderActiveView()}
        </main>

        {/* Platform Footer */}
        <footer className="border-t border-slate-800/80 bg-[#05070c]/90 py-5 px-4 text-xs text-slate-400 relative z-10">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-center sm:text-start">
              © {new Date().getFullYear()} OPEBAT Developer Suite v5.2 • Built with React 19, TypeScript & Gemini AI.
            </p>
            <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                All Systems Operational
              </span>
              <span>•</span>
              <a
                href="https://github.com/GRYKJ249/OPEBAT-.git"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
              >
                GitHub @GRYKJ249
              </a>
            </div>
          </div>
        </footer>
      </div>

      {/* Global Application Modals */}
      <ProjectDetailModal />
      <AIChatModal />
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <MainLayout />
      </AppProvider>
    </AuthProvider>
  );
}
