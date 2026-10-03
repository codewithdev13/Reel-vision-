'use me';
'use client';

import React, { useState } from 'react';
import { ViralitySuggestions } from '@/types';
import { Rocket, CheckSquare, Square, Hash, Sparkles, Wand2, Lightbulb } from 'lucide-react';

interface ViralitySuggestionsCardProps {
  data: ViralitySuggestions;
}

export const ViralitySuggestionsCard: React.FC<ViralitySuggestionsCardProps> = ({ data }) => {
  const [completedFixes, setCompletedFixes] = useState<number[]>([]);

  const toggleFix = (index: number) => {
    if (completedFixes.includes(index)) {
      setCompletedFixes(completedFixes.filter(i => i !== index));
    } else {
      setCompletedFixes([...completedFixes, index]);
    }
  };

  return (
    <div className="glass-card glass-card-hover p-6 space-y-5">
      
      {/* Header */}
      <div className="flex items-center space-x-3 border-b border-gray-100 pb-4">
        <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
          <Rocket className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-base">Virality Suggestions & Optimizations</h3>
          <p className="text-xs text-slate-500">Actionable edits, caption aesthetics, and hashtag strategy</p>
        </div>
      </div>

      {/* Actionable Fixes Checklist */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-bold text-rose-600 uppercase tracking-wider">
            <Wand2 className="w-4 h-4" />
            <span>Actionable High-Impact Fixes</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {completedFixes.length} / {data.actionable_fixes.length} Completed
          </span>
        </div>

        <div className="space-y-2">
          {data.actionable_fixes.map((fix, idx) => {
            const isDone = completedFixes.includes(idx);
            return (
              <div
                key={idx}
                onClick={() => toggleFix(idx)}
                className={`cursor-pointer p-3 rounded-xl border transition-all flex items-start space-x-3 ${
                  isDone
                    ? 'bg-gray-50 border-gray-200 text-slate-400 line-through'
                    : 'bg-white border-gray-200 hover:border-indigo-300 text-slate-700 hover:shadow-sm'
                }`}
              >
                <div className="mt-0.5 flex-shrink-0">
                  {isDone ? (
                    <CheckSquare className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-300" />
                  )}
                </div>
                <p className="text-xs leading-relaxed flex-1 font-medium">{fix}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trending Caption Styles & Hashtag Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        
        {/* Caption Style Trends */}
        <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-200 space-y-2.5">
          <div className="flex items-center space-x-2 text-xs font-semibold text-violet-600">
            <Sparkles className="w-4 h-4" />
            <span>Trending Caption & Text Styles</span>
          </div>
          <div className="space-y-1.5">
            {data.trending_caption_styles.map((style, i) => (
              <div
                key={i}
                className="bg-violet-50 border border-violet-200 rounded-lg px-3 py-2 text-xs text-violet-700 flex items-center space-x-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" />
                <span>{style}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Structural Hashtag Strategies */}
        <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-200 space-y-2.5">
          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-600">
            <Hash className="w-4 h-4" />
            <span>Structural Hashtag Strategy</span>
          </div>
          <div className="space-y-1.5">
            {data.structural_hashtag_recommendations.map((rec, i) => (
              <div
                key={i}
                className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-xs text-blue-700 flex items-center space-x-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
