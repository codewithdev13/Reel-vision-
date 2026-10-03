'use me';
'use client';

import React from 'react';
import { ContentClassification } from '@/types';
import { Layers, Star, Mic, Sun, Frame, Zap, Flame } from 'lucide-react';

interface ContentClassificationCardProps {
  data: ContentClassification;
}

export const ContentClassificationCard: React.FC<ContentClassificationCardProps> = ({ data }) => {
  const scores = data.quality_scores;

  const renderMeter = (label: string, score: number, icon: React.ReactNode, barColor: string, bgColor: string) => {
    const percentage = Math.min(Math.max(score * 10, 10), 100);

    return (
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-3 hover:border-gray-300 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`p-1.5 rounded-lg ${bgColor}`}>
              {icon}
            </div>
            <span className="text-xs font-semibold text-slate-700">{label}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-lg font-bold font-mono text-slate-900">{score}</span>
            <span className="text-xs text-slate-400 font-mono">/10</span>
          </div>
        </div>

        {/* Score Bar */}
        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 animate-progress ${barColor}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="glass-card glass-card-hover p-6 space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 gap-2">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Content Classification & Quality Scores</h3>
            <p className="text-xs text-slate-500">Multi-modal production ratings out of 10</p>
          </div>
        </div>

        {/* Category Type Badge */}
        <div className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 font-semibold text-xs flex items-center space-x-1.5 shadow-sm">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>{data.category_type}</span>
        </div>
      </div>

      {/* Hero Virality Score Banner */}
      <div className="bg-gradient-to-r from-indigo-50 via-violet-50 to-purple-50 rounded-2xl p-5 border border-indigo-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-600 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <Flame className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 block">
              Overall Virality Index
            </span>
            <h4 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {scores.overall_virality >= 8 ? 'High Virality Potential 🚀' : scores.overall_virality >= 5 ? 'Moderate Virality Potential 📈' : 'Optimization Needed ⚠️'}
            </h4>
          </div>
        </div>

        <div className="flex items-baseline space-x-1 bg-white px-5 py-2.5 rounded-xl border border-indigo-200 shadow-sm">
          <span className="text-3xl font-extrabold font-mono text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
            {scores.overall_virality}
          </span>
          <span className="text-sm font-semibold text-slate-400 font-mono">/10</span>
        </div>
      </div>

      {/* Grid of 4 Core Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {renderMeter(
          'Audio & Voiceover Quality',
          scores.audio,
          <Mic className="w-4 h-4 text-sky-600" />,
          'bg-gradient-to-r from-sky-400 to-blue-500',
          'bg-sky-50'
        )}
        {renderMeter(
          'Lighting & Exposure',
          scores.lighting,
          <Sun className="w-4 h-4 text-amber-600" />,
          'bg-gradient-to-r from-amber-400 to-yellow-500',
          'bg-amber-50'
        )}
        {renderMeter(
          'Framing & Composition',
          scores.framing,
          <Frame className="w-4 h-4 text-emerald-600" />,
          'bg-gradient-to-r from-emerald-400 to-teal-500',
          'bg-emerald-50'
        )}
        {renderMeter(
          'Edit Pacing & Rhythm',
          scores.pacing,
          <Zap className="w-4 h-4 text-violet-600" />,
          'bg-gradient-to-r from-violet-400 to-purple-500',
          'bg-violet-50'
        )}
      </div>

    </div>
  );
};
