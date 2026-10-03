'use me';
'use client';

import React from 'react';
import { HookAndRetention } from '@/types';
import { Anchor, Zap, AlertTriangle, CheckCircle2, Clock, FastForward } from 'lucide-react';

interface HookRetentionCardProps {
  data: HookAndRetention;
}

export const HookRetentionCard: React.FC<HookRetentionCardProps> = ({ data }) => {
  const getRiskBadge = (risk: string) => {
    const cleanRisk = risk.toLowerCase();
    if (cleanRisk.includes('low')) {
      return (
        <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Low Retention Risk</span>
        </span>
      );
    }
    if (cleanRisk.includes('medium')) {
      return (
        <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Medium Retention Risk</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
        <AlertTriangle className="w-3.5 h-3.5" />
        <span>High Retention Risk</span>
      </span>
    );
  };

  return (
    <div className="glass-card glass-card-hover p-6 space-y-5">
      
      {/* Module Title */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
            <Anchor className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Hook & Retention Analysis</h3>
            <p className="text-xs text-slate-500">First 3 seconds & viewer drop-off factors</p>
          </div>
        </div>

        <div>{getRiskBadge(data.retention_risk_score)}</div>
      </div>

      {/* Main Hook Status Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Hook Present Flag */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 flex items-center space-x-3">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
            data.hook_present ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'
          }`}>
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Visual / Verbal Hook
            </span>
            <span className={`text-sm font-bold ${data.hook_present ? 'text-emerald-700' : 'text-red-700'}`}>
              {data.hook_present ? 'Strong Opening Hook Detected' : 'Weak Opening Hook'}
            </span>
          </div>
        </div>

        {/* Pacing Speed Summary */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center">
            <FastForward className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Cut Cadence & Pacing
            </span>
            <span className="text-sm font-bold text-slate-700">
              High Velocity Edits
            </span>
          </div>
        </div>
      </div>

      {/* First 3 Seconds Detailed Evaluation */}
      <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-200 space-y-2">
        <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-600">
          <Clock className="w-4 h-4" />
          <span>First 3 Seconds Breakdown (0:00 - 0:03)</span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed pl-6">
          {data.first_3s_evaluation}
        </p>
      </div>

      {/* Pacing Notes */}
      <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-200 space-y-2">
        <div className="flex items-center space-x-2 text-xs font-semibold text-violet-600">
          <FastForward className="w-4 h-4" />
          <span>Pacing & Editing Rhythm</span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed pl-6">
          {data.pacing_notes}
        </p>
      </div>

    </div>
  );
};
