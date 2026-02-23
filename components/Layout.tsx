
import React, { useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'workspace' | 'gallery';
  setActiveTab: (tab: 'workspace' | 'gallery') => void;
  usage: { daily: number; total: number };
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, usage }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden relative">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-surface flex flex-col shrink-0
        transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:hidden'}
      `}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-xl">camera</span>
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight">Shot AI</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Product Pro</p>
            </div>
          </div>
          {/* Close button for mobile */}
          <button onClick={closeSidebar} className="lg:hidden text-slate-400 hover:text-white">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          <button
            onClick={() => { setActiveTab('workspace'); if(window.innerWidth < 1024) closeSidebar(); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
              activeTab === 'workspace' 
                ? 'bg-primary/10 text-primary border border-primary/20' 
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">auto_fix_high</span>
            <span className="text-sm font-medium">Workspace</span>
          </button>
          
          <button
            onClick={() => { setActiveTab('gallery'); if(window.innerWidth < 1024) closeSidebar(); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
              activeTab === 'gallery' 
                ? 'bg-primary/10 text-primary border border-primary/20' 
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">grid_view</span>
            <span className="text-sm font-medium">History</span>
          </button>

          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition-all">
            <span className="material-symbols-outlined text-[20px]">settings</span>
            <span className="text-sm font-medium">Settings</span>
          </a>
        </nav>

        <div className="p-4 mt-auto">
          <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Usage</span>
              <span className="text-[11px] font-bold text-primary">{(usage.daily / 1000).toFixed(1)}k / 10k</span>
            </div>
            <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
              <div 
                className="bg-primary h-full transition-all duration-500" 
                style={{ width: `${Math.min(100, (usage.daily / 10000) * 100)}%` }}
              ></div>
            </div>
            <p className="text-[9px] text-slate-500 mt-2 text-center">Free Credits replenish daily</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto custom-scrollbar">
        <header className="h-16 border-b border-border flex items-center justify-between px-4 lg:px-8 bg-surface/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-2 lg:gap-4">
            <button 
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
              aria-label="Toggle Menu"
            >
              <span className="material-symbols-outlined text-[24px]">menu</span>
            </button>
            <h2 className="text-base lg:text-lg font-semibold tracking-tight truncate">
              {activeTab === 'workspace' ? 'Workspace' : 'History'}
            </h2>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/10 text-green-500 border border-green-500/20 uppercase tracking-widest">Active</span>
          </div>
          <div className="flex items-center gap-2 lg:gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-bold text-white">Active Session</span>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Pro Account</span>
            </div>
            <div className="size-8 rounded-full bg-gradient-to-tr from-primary to-purple-500 border border-white/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-sm">person</span>
            </div>
          </div>
        </header>

        <div className="flex-1">
          {children}
        </div>
      </main>
    </div>
  );
};
