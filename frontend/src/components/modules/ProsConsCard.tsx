'use me';
'use client';

import React, { useState } from 'react';
import { ProsAndCons, ProConItem } from '@/types';
import { ThumbsUp, ThumbsDown, Volume2, Sun, MessageSquare, Type, CheckCircle, XCircle } from 'lucide-react';

interface ProsConsCardProps {
  data: ProsAndCons;
}

export const ProsConsCard: React.FC<ProsConsCardProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'pros' | 'cons'>('all');

  const getCategoryIcon = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('audio') || cat.includes('sound') || cat.includes('voice')) return <Volume2 className="w-4 h-4 text-blue-500" />;
    if (cat.includes('light') || cat.includes('color') || cat.includes('exposure')) return <Sun className="w-4 h-4 text-amber-500" />;
    if (cat.includes('cta') || cat.includes('call') || cat.includes('action')) return <MessageSquare className="w-4 h-4 text-violet-500" />;
    return <Type className="w-4 h-4 text-emerald-500" />;
  };

  return (
    <div className="glass-card glass-card-hover p-6 space-y-5">
      
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-200 flex items-center justify-center text-violet-600">
            <ThumbsUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Pros & Cons Breakdown</h3>
            <p className="text-xs text-slate-500">Audio, lighting, CTA, and caption diagnostics</p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-200 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'all' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            All Feedback
          </button>
          <button
            onClick={() => setActiveTab('pros')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'pros' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Pros ({data.pros.length})
          </button>
          <button
            onClick={() => setActiveTab('cons')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'cons' ? 'bg-red-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Cons ({data.cons.length})
          </button>
        </div>
      </div>

      {/* Side-by-side or Tabbed View */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Pros Column */}
        {(activeTab === 'all' || activeTab === 'pros') && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-600 uppercase tracking-wider">
              <ThumbsUp className="w-4 h-4" />
              <span>Strengths & Highlights ({data.pros.length})</span>
            </div>
            
            <div className="space-y-2.5">
              {data.pros.map((item, index) => (
                <div
                  key={index}
                  className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-start space-x-3 hover:border-emerald-300 transition-colors"
                >
                  <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600 mt-0.5">
                    {getCategoryIcon(item.category)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700">
                      {item.category}
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cons Column */}
        {(activeTab === 'all' || activeTab === 'cons') && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-red-600 uppercase tracking-wider">
              <ThumbsDown className="w-4 h-4" />
              <span>Areas for Improvement ({data.cons.length})</span>
            </div>

            <div className="space-y-2.5">
              {data.cons.map((item, index) => (
                <div
                  key={index}
                  className="bg-red-50 border border-red-200 rounded-xl p-3.5 flex items-start space-x-3 hover:border-red-300 transition-colors"
                >
                  <div className="p-2 rounded-lg bg-red-100 text-red-600 mt-0.5">
                    {getCategoryIcon(item.category)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-100 text-red-700">
                      {item.category}
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
