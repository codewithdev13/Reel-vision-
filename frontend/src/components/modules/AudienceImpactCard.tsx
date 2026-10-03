'use me';
'use client';

import React from 'react';
import { AudienceImpact } from '@/types';
import { HeartHandshake, ShieldCheck, ShieldAlert, Sparkles, Smile, AlertOctagon } from 'lucide-react';

interface AudienceImpactCardProps {
  data: AudienceImpact;
}

export const AudienceImpactCard: React.FC<AudienceImpactCardProps> = ({ data }) => {
  return (
    <div className="glass-card glass-card-hover p-6 space-y-5">
      
      {/* Header */}
      <div className="flex items-center space-x-3 border-b border-gray-100 pb-4">
        <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600">
          <HeartHandshake className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-base">Audience Impact & Sentiment Prediction</h3>
          <p className="text-xs text-slate-500">Predicted emotional reaction and compliance check</p>
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Predicted Emotional Response */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-3">
          <div className="flex items-center space-x-2 text-xs font-semibold text-sky-600">
            <Smile className="w-4 h-4" />
            <span>Predicted Primary Emotion</span>
          </div>
          <div className="bg-sky-50 border border-sky-200 rounded-xl p-3">
            <p className="text-sm font-bold text-sky-700">
              {data.predicted_emotional_response}
            </p>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            High emotional resonance boosts shares, comment arguments, and bookmark saves.
          </p>
        </div>

        {/* Content Safety & Misleading Flags */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-3">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600">
            {data.misleading_content_flag ? (
              <ShieldAlert className="w-4 h-4 text-red-500" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
            )}
            <span>Safety & Authenticity Verification</span>
          </div>

          <div className={`rounded-xl p-3 border flex items-center space-x-3 ${
            data.misleading_content_flag
              ? 'bg-red-50 border-red-200 text-red-700'
              : 'bg-emerald-50 border-emerald-200 text-emerald-700'
          }`}>
            {data.misleading_content_flag ? (
              <AlertOctagon className="w-5 h-5 text-red-500 flex-shrink-0" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-emerald-500 flex-shrink-0" />
            )}
            <div>
              <span className="text-xs font-bold block">
                {data.misleading_content_flag ? 'Misleading Content Warning' : 'Safe & Verified Content'}
              </span>
              <span className="text-[11px] text-slate-500">
                {data.misleading_details || 'No misleading claims or platform policy violations detected.'}
              </span>
            </div>
          </div>

          {data.content_safety_flags && data.content_safety_flags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {data.content_safety_flags.map((flag, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded text-[10px] bg-red-50 text-red-600 border border-red-200">
                  ⚠️ {flag}
                </span>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
