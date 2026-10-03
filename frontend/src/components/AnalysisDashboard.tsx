'use me';
'use client';

import React from 'react';
import { VideoAnalysisResult } from '@/types';
import { HookRetentionCard } from './modules/HookRetentionCard';
import { ProsConsCard } from './modules/ProsConsCard';
import { ViralitySuggestionsCard } from './modules/ViralitySuggestionsCard';
import { AudienceImpactCard } from './modules/AudienceImpactCard';
import { ContentClassificationCard } from './modules/ContentClassificationCard';
import { AutoSummaryMetadataCard } from './modules/AutoSummaryMetadataCard';
import { Sparkles, Flame, CheckCircle2, RefreshCw, BarChart2 } from 'lucide-react';

interface AnalysisDashboardProps {
  data: VideoAnalysisResult;
  onReset: () => void;
}

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ data, onReset }) => {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      
      {/* Top Banner Header */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50 rounded-full filter blur-3xl -z-10 pointer-events-none opacity-60" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Gemini 1.5 Pro Analysis Report</span>
              </span>
              <span className="text-xs text-slate-400 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Completed</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              AI Video Insights & Virality Audit
            </h2>
            <p className="text-sm text-slate-500 max-w-2xl">
              {data.auto_summary_and_metadata?.one_line_summary}
            </p>
          </div>

          <div className="flex items-center space-x-4 self-stretch lg:self-auto justify-between lg:justify-end">
            <div className="text-right">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Category</span>
              <span className="text-sm font-bold text-slate-700">
                {data.content_classification?.category_type}
              </span>
            </div>

            <button
              onClick={onReset}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white hover:bg-gray-50 text-slate-700 border border-gray-200 transition-colors flex items-center space-x-2 shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Analyze Another Reel</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid of the 6 Core Analysis Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Module 1: Hook & Retention */}
        <HookRetentionCard data={data.hook_and_retention} />

        {/* Module 5: Content Classification & Scores */}
        <ContentClassificationCard data={data.content_classification} />

        {/* Module 2: Pros & Cons */}
        <ProsConsCard data={data.pros_and_cons} />

        {/* Module 3: Virality Suggestions */}
        <ViralitySuggestionsCard data={data.virality_suggestions} />

        {/* Module 4: Audience Impact & Sentiment */}
        <AudienceImpactCard data={data.audience_impact_and_sentiment} />

        {/* Module 6: Auto-Summary & Metadata Generator */}
        <AutoSummaryMetadataCard data={data.auto_summary_and_metadata} />

      </div>

    </div>
  );
};
