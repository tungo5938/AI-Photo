
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'workspace' | 'gallery';
  setActiveTab: (tab: 'workspace' | 'gallery') => void;
  usage: { daily: number; total: number };
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, usage }) => {
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-surface flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="size-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-xl">camera</span>
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight">SnapStudio AI</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Product Pro</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          <button
            onClick={() => setActiveTab('workspace')}
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
            onClick={() => setActiveTab('gallery')}
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
        <header className="h-16 border-b border-border flex items-center justify-between px-8 bg-surface/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold tracking-tight">
              {activeTab === 'workspace' ? 'Generation Workspace' : 'Your History'}
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/10 text-green-500 border border-green-500/20 uppercase tracking-widest">Active</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-xs font-bold text-white">Guest User</span>
              <span className="text-[10px] text-slate-500">Free Tier</span>
            </div>
            <div className="size-8 rounded-full bg-gradient-to-tr from-primary to-purple-500 border border-white/20"></div>
          </div>
        </header>

        <div className="flex-1">
          {children}
        </div>
      </main>
    </div>
  );
};
