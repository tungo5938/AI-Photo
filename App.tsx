
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Layout } from './components/Layout';
import { HistoryGrid } from './components/HistoryGrid';
import { PreviewModal } from './components/PreviewModal';
import { 
  AppState, 
  AspectRatio, 
  ModelId, 
  GenerationRecord 
} from './types';
import { 
  PROMPT_TEMPLATES, 
  MODEL_OPTIONS, 
  ASPECT_RATIOS 
} from './constants';
import { generateProductImage } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'workspace' | 'gallery'>('workspace');
  const [state, setState] = useState<AppState>({
    history: [],
    isGenerating: false,
    uploadedImage: null,
    uploadedFile: null,
    config: {
      model: ModelId.FLASH,
      aspectRatio: AspectRatio.SQUARE,
      resolution: '1024x1024',
    },
    prompt: '',
    usage: {
      dailyTokens: 0,
      totalTokens: 0,
    }
  });

  const [selectedRecord, setSelectedRecord] = useState<GenerationRecord | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load history from local storage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('snapstudio-history');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setState(prev => ({ ...prev, history: parsed }));
      } catch (e) {
        console.error("Failed to parse history");
      }
    }

    const savedUsage = localStorage.getItem('snapstudio-usage');
    if (savedUsage) {
      try {
        const parsed = JSON.parse(savedUsage);
        setState(prev => ({ ...prev, usage: parsed }));
      } catch (e) {
        console.error("Failed to parse usage");
      }
    }
  }, []);

  // Save history when it changes
  useEffect(() => {
    localStorage.setItem('snapstudio-history', JSON.stringify(state.history));
  }, [state.history]);

  useEffect(() => {
    localStorage.setItem('snapstudio-usage', JSON.stringify(state.usage));
  }, [state.usage]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        setState(prev => ({
          ...prev,
          uploadedFile: file,
          uploadedImage: readerEvent.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!state.uploadedImage || !state.prompt) return;

    setState(prev => ({ ...prev, isGenerating: true }));

    try {
      const result = await generateProductImage(
        state.uploadedImage,
        state.prompt,
        state.config
      );

      const newRecord: GenerationRecord = {
        id: Date.now().toString(),
        originalImage: state.uploadedImage,
        generatedImage: result.imageUrl,
        prompt: state.prompt,
        timestamp: Date.now(),
        model: state.config.model,
        aspectRatio: state.config.aspectRatio,
        tokensUsed: result.tokens,
      };

      setState(prev => ({
        ...prev,
        history: [newRecord, ...prev.history],
        usage: {
          dailyTokens: prev.usage.dailyTokens + result.tokens,
          totalTokens: prev.usage.totalTokens + result.tokens,
        },
        isGenerating: false,
      }));

      setSelectedRecord(newRecord);
    } catch (error: any) {
      alert(`Error generating image: ${error.message}`);
      setState(prev => ({ ...prev, isGenerating: false }));
    }
  };

  const setConfig = (key: string, value: any) => {
    setState(prev => ({
      ...prev,
      config: { ...prev.config, [key]: value }
    }));
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
      usage={{ daily: state.usage.dailyTokens, total: state.usage.totalTokens }}
    >
      {activeTab === 'workspace' ? (
        <div className="flex h-full flex-col lg:flex-row">
          {/* Main Area */}
          <div className="flex-1 p-8 space-y-8 overflow-y-auto custom-scrollbar">
            {/* Image Upload Zone */}
            <section>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`relative group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden ${
                  state.uploadedImage ? 'border-primary bg-primary/5 p-4' : 'border-border bg-surface py-20 px-10 hover:border-primary/50'
                }`}
              >
                {state.uploadedImage ? (
                  <div className="relative w-full max-w-lg aspect-square rounded-xl overflow-hidden shadow-2xl border border-white/10 group">
                    <img src={state.uploadedImage} className="w-full h-full object-contain bg-black" alt="Upload" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-4xl">cloud_upload</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <span className="material-symbols-outlined text-primary text-3xl">upload_file</span>
                    </div>
                    <h3 className="text-xl font-bold mb-1">Drop Product Photo</h3>
                    <p className="text-slate-400 text-sm mb-6 text-center max-w-sm">
                      Upload your high-res product image (PNG/JPG).
                    </p>
                    <button className="px-6 py-2.5 bg-primary text-white rounded-lg font-bold text-sm shadow-lg shadow-primary/20">
                      Browse Files
                    </button>
                  </>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleFileUpload}
                />
              </div>
            </section>

            {/* Prompt Studio */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Prompt Studio</h3>
                <button 
                  onClick={() => setState(prev => ({ ...prev, prompt: '' }))}
                  className="text-slate-500 hover:text-white text-xs flex items-center gap-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">refresh</span>
                  Reset
                </button>
              </div>
              <div className="bg-surface rounded-xl border border-border p-1 overflow-hidden shadow-xl ring-1 ring-white/5">
                <div className="flex flex-col">
                  <textarea 
                    value={state.prompt}
                    onChange={(e) => setState(prev => ({ ...prev, prompt: e.target.value }))}
                    className="w-full bg-transparent border-0 focus:ring-0 text-white placeholder:text-slate-600 p-4 min-h-[100px] text-lg leading-relaxed resize-none" 
                    placeholder="Describe the new scene... e.g. 'on a luxury marble pedestal with soft window lighting'"
                  ></textarea>
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-b-lg border-t border-border">
                    <div className="flex gap-2">
                      <button className="p-2 text-slate-400 hover:text-primary transition-colors rounded-lg hover:bg-primary/10" title="Enhance prompt">
                        <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                      </button>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">
                      {state.prompt.length} / 500 chars
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Prompt Templates */}
            <section className="space-y-4">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Quick Templates</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {PROMPT_TEMPLATES.map(template => (
                  <button
                    key={template.id}
                    onClick={() => setState(prev => ({ ...prev, prompt: template.prompt }))}
                    className={`group relative aspect-square rounded-xl overflow-hidden border transition-all ${
                      state.prompt === template.prompt ? 'border-primary ring-2 ring-primary/20' : 'border-border'
                    }`}
                  >
                    <img src={template.previewUrl} className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all" alt={template.name} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent flex flex-col justify-end p-3">
                      <span className="text-[10px] font-bold text-white uppercase">{template.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* Config Sidebar */}
          <aside className="w-full lg:w-80 border-l border-border bg-surface p-6 flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">tune</span>
              Settings
            </h3>
            
            <div className="space-y-8 flex-1">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Model</label>
                <div className="space-y-2">
                  {MODEL_OPTIONS.map(model => (
                    <button
                      key={model.id}
                      onClick={() => setConfig('model', model.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-all ${
                        state.config.model === model.id 
                          ? 'border-primary bg-primary/10 ring-1 ring-primary' 
                          : 'border-border bg-background hover:border-slate-600'
                      }`}
                    >
                      <div className="text-xs font-bold text-white">{model.name}</div>
                      <div className="text-[10px] text-slate-500 uppercase">{model.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Aspect Ratio</label>
                <div className="grid grid-cols-3 gap-2">
                  {ASPECT_RATIOS.map(ratio => (
                    <button
                      key={ratio.id}
                      onClick={() => setConfig('aspectRatio', ratio.id)}
                      className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
                        state.config.aspectRatio === ratio.id 
                          ? 'border-primary bg-primary/10 text-primary' 
                          : 'border-border bg-background text-slate-500 hover:border-slate-600'
                      }`}
                    >
                      <span className="material-symbols-outlined text-lg mb-1">{ratio.icon}</span>
                      <span className="text-[10px] font-bold">{ratio.id}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-border">
                 <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold">High Resolution</span>
                      <span className="text-[9px] text-slate-500 uppercase">2048px Upscaling</span>
                    </div>
                    <button className="w-10 h-5 bg-primary rounded-full relative">
                      <div className="absolute right-1 top-1 size-3 bg-white rounded-full"></div>
                    </button>
                 </div>
                 <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold">Content Aware</span>
                      <span className="text-[9px] text-slate-500 uppercase">Smart Relighting</span>
                    </div>
                    <button className="w-10 h-5 bg-slate-800 rounded-full relative">
                      <div className="absolute left-1 top-1 size-3 bg-slate-400 rounded-full"></div>
                    </button>
                 </div>
              </div>
            </div>

            <div className="pt-8">
              <button 
                disabled={state.isGenerating || !state.uploadedImage || !state.prompt}
                onClick={handleGenerate}
                className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-4 rounded-xl shadow-2xl shadow-primary/40 flex items-center justify-center gap-3 transition-all transform hover:-translate-y-1 active:translate-y-0 group"
              >
                {state.isGenerating ? (
                  <div className="size-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">auto_fix_high</span>
                )}
                {state.isGenerating ? 'GENERATING...' : 'GENERATE PHOTO'}
              </button>
              <p className="text-center text-[10px] text-slate-500 mt-4 italic">
                {state.isGenerating ? 'Mixing pixels with light...' : 'Uses approx. 1,000 credits'}
              </p>
            </div>
          </aside>
        </div>
      ) : (
        <HistoryGrid 
          history={state.history} 
          onSelect={(record) => setSelectedRecord(record)} 
        />
      )}

      {selectedRecord && (
        <PreviewModal 
          record={selectedRecord} 
          onClose={() => setSelectedRecord(null)} 
        />
      )}
    </Layout>
  );
};

export default App;
