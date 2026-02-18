
import React from 'react';
import { GenerationRecord } from '../types';

interface HistoryGridProps {
  history: GenerationRecord[];
  onSelect: (record: GenerationRecord) => void;
}

export const HistoryGrid: React.FC<HistoryGridProps> = ({ history, onSelect }) => {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500">
        <span className="material-symbols-outlined text-6xl mb-4">image_not_supported</span>
        <h3 className="text-lg font-bold">No history yet</h3>
        <p className="text-sm">Your generated photos will appear here.</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {history.map((record) => (
          <div 
            key={record.id}
            onClick={() => onSelect(record)}
            className="group relative bg-surface border border-border rounded-xl overflow-hidden cursor-pointer hover:border-primary/50 transition-all shadow-lg"
          >
            <div className="aspect-[4/5] overflow-hidden bg-black">
              <img 
                src={record.generatedImage} 
                alt={record.prompt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-4 bg-surface">
              <p className="text-xs text-slate-300 line-clamp-2 font-medium mb-2 h-8">
                {record.prompt}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase">
                  {new Date(record.timestamp).toLocaleDateString()}
                </span>
                <span className="text-[10px] font-bold text-primary px-1.5 py-0.5 bg-primary/10 rounded">
                  {record.model.includes('pro') ? 'PRO' : 'FLASH'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
