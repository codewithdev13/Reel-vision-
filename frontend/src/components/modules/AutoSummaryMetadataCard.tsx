'use me';
'use client';

import React, { useState } from 'react';
import { AutoSummaryMetadata } from '@/types';
import { FileText, Copy, Check, Hash, Sparkles, Accessibility, MessageSquare, Info } from 'lucide-react';

interface AutoSummaryMetadataCardProps {
  data: AutoSummaryMetadata;
}

export const AutoSummaryMetadataCard: React.FC<AutoSummaryMetadataCardProps> = ({ data }) => {
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [copiedHashtags, setCopiedHashtags] = useState(false);
  const [copiedAltText, setCopiedAltText] = useState(false);

  const copyToClipboard = (text: string, setter: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  const allHashtagsString = data.hashtags ? data.hashtags.join(' ') : '';

  return (
    <div className="glass-card glass-card-hover p-6 space-y-6">
      
      {/* Header */}
      <div className="flex items-center space-x-3 border-b border-gray-100 pb-4">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-base">Auto-Summary & Metadata Generator</h3>
          <p className="text-xs text-slate-500">Ready-to-publish viral caption, hashtags, and accessibility alt text</p>
        </div>
      </div>

      {/* One Line Summary Banner */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-gray-50 p-4 rounded-xl border border-emerald-200 flex items-start space-x-3">
        <Sparkles className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
        <div>
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">
            One-Line Reel Summary
          </span>
          <p className="text-sm font-semibold text-slate-800 leading-snug">
            "{data.one_line_summary}"
          </p>
        </div>
      </div>

      {/* Full Description */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600">
          <Info className="w-3.5 h-3.5 text-indigo-500" />
          <span>Full Content Overview</span>
        </div>
        <p className="text-xs text-slate-600 bg-gray-50 p-3.5 rounded-xl border border-gray-200 leading-relaxed">
          {data.full_description}
        </p>
      </div>

      {/* Recommended Viral Caption Box */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-bold text-violet-600 uppercase tracking-wider">
            <MessageSquare className="w-4 h-4" />
            <span>Recommended Viral Caption</span>
          </div>
          <button
            onClick={() => copyToClipboard(data.recommended_caption, setCopiedCaption)}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
              copiedCaption
                ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                : 'bg-violet-50 hover:bg-violet-100 text-violet-600 border-violet-200'
            }`}
          >
            {copiedCaption ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCaption ? 'Copied! ✓' : 'Copy Caption'}</span>
          </button>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 font-sans text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
          {data.recommended_caption}
        </div>
      </div>

      {/* Hashtags Grid (10-15 items) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
            <Hash className="w-4 h-4" />
            <span>Optimized Hashtags ({data.hashtags?.length || 0})</span>
          </div>
          <button
            onClick={() => copyToClipboard(allHashtagsString, setCopiedHashtags)}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
              copiedHashtags
                ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                : 'bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200'
            }`}
          >
            {copiedHashtags ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedHashtags ? 'Copied All! ✓' : 'Copy All Hashtags'}</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2 bg-gray-50 p-3.5 rounded-xl border border-gray-200">
          {data.hashtags?.map((tag, i) => (
            <span
              key={i}
              onClick={() => copyToClipboard(tag, () => {})}
              className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-blue-50 text-blue-600 border border-blue-200 hover:border-blue-400 cursor-pointer transition-colors"
              title="Click to copy individual hashtag"
            >
              {tag.startsWith('#') ? tag : `#${tag}`}
            </span>
          ))}
        </div>
      </div>

      {/* Accessible Alt-Text Box */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600">
            <Accessibility className="w-4 h-4 text-emerald-500" />
            <span>Screen-Reader Accessible Alt Text</span>
          </div>
          <button
            onClick={() => copyToClipboard(data.accessible_alt_text, setCopiedAltText)}
            className={`flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] transition-colors ${
              copiedAltText
                ? 'text-emerald-600'
                : 'text-slate-400 hover:text-indigo-600'
            }`}
          >
            {copiedAltText ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedAltText ? 'Copied! ✓' : 'Copy'}</span>
          </button>
        </div>

        <p className="text-xs text-slate-500 bg-gray-50 p-3 rounded-lg border border-gray-200 italic leading-relaxed">
          "{data.accessible_alt_text}"
        </p>
      </div>

    </div>
  );
};
