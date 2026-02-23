
import React, { useState } from 'react';
import { GenerationRecord } from '../types';

interface PreviewModalProps {
  record: GenerationRecord;
  onClose: () => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ record, onClose }) => {
  const [showOriginal, setShowOriginal] = useState(false);

  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = record.generatedImage;
    link.download = `snapstudio-${record.id}.png`;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
      <div className="relative bg-surface w-full max-w-6xl rounded-2xl overflow-hidden shadow-2xl border border-border flex flex-col md:flex-row h-[90vh]">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 size-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {/* Comparison Viewer */}
        <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden">
          <img 
            src={showOriginal ? record.originalImage : record.generatedImage} 
            alt="Product Preview"
            className="max-w-full max-h-full object-contain"
          />
          
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            <button 
              onMouseDown={() => setShowOriginal(true)}
              onMouseUp={() => setShowOriginal(false)}
              onMouseLeave={() => setShowOriginal(false)}
              className="px-4 py-2 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-full text-xs font-bold hover:bg-white/20 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">compare</span>
              HOLD TO VIEW ORIGINAL
            </button>
          </div>
        </div>

        {/* Details Panel */}
        <div className="w-full md:w-96 p-8 border-l border-border bg-surface overflow-y-auto custom-scrollbar flex flex-col">
          <div className="mb-8">
            <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4">Prompt Used</h3>
            <p className="text-sm text-slate-200 leading-relaxed italic border-l-2 border-primary pl-4 bg-primary/5 py-3 rounded-r-lg">
              "{record.prompt}"
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <span className="text-xs text-slate-400">Quality</span>
              <span className="text-xs font-bold text-white uppercase">ULTRA HD</span>
            </div>
            <div className="flex items-center justify-between border-b border-border pb-4">
              <span className="text-xs text-slate-400">Resolution</span>
              <span className="text-xs font-bold text-white">High Quality</span>
            </div>
            <div className="flex items-center justify-between border-b border-border pb-4">
              <span className="text-xs text-slate-400">Cost</span>
              <span className="text-xs font-bold text-green-400">{record.tokensUsed} Tokens</span>
            </div>
            <div className="flex items-center justify-between border-b border-border pb-4">
              <span className="text-xs text-slate-400">Date</span>
              <span className="text-xs font-bold text-white">{new Date(record.timestamp).toLocaleString()}</span>
            </div>
          </div>

          <div className="mt-auto pt-8">
            <button 
              onClick={downloadImage}
              className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl flex items-center justify-center gap-3 shadow-lg shadow-primary/20 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined">download</span>
              DOWNLOAD PHOTO
            </button>
            <p className="text-center text-[10px] text-slate-500 mt-4">Standard License Included</p>
          </div>
        </div>
      </div>
    </div>
  );
};
