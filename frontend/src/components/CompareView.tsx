'use me';
'use client';

import React, { useState, useRef, DragEvent } from 'react';
import { ComparisonResult } from '@/types';
import { UploadCloud, Trophy, Zap, Sparkles, CheckCircle2, ArrowRight, GitCompare, RefreshCw, Star, Layers, ShieldCheck } from 'lucide-react';

interface CompareViewProps {
  onCompare: (fileA: File, fileB: File) => void;
  onLoadSampleCompare: () => void;
  isLoading: boolean;
  result: ComparisonResult | null;
  onReset: () => void;
}

export const CompareView: React.FC<CompareViewProps> = ({
  onCompare,
  onLoadSampleCompare,
  isLoading,
  result,
  onReset,
}) => {
  const [fileA, setFileA] = useState<File | null>(null);
  const [fileB, setFileB] = useState<File | null>(null);
  const [previewA, setPreviewA] = useState<string | null>(null);
  const [previewB, setPreviewB] = useState<string | null>(null);
  const [isDraggingA, setIsDraggingA] = useState(false);
  const [isDraggingB, setIsDraggingB] = useState(false);

  const inputARef = useRef<HTMLInputElement>(null);
  const inputBRef = useRef<HTMLInputElement>(null);

  const handleSelectA = (file: File) => {
    if (!file.type.startsWith('video/')) return;
    setFileA(file);
    setPreviewA(URL.createObjectURL(file));
  };

  const handleSelectB = (file: File) => {
    if (!file.type.startsWith('video/')) return;
    setFileB(file);
    setPreviewB(URL.createObjectURL(file));
  };

  // Drag and Drop handlers for Version A
  const handleDragOverA = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingA(true);
  };
  const handleDragLeaveA = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingA(false);
  };
  const handleDropA = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingA(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleSelectA(e.dataTransfer.files[0]);
    }
  };

  // Drag and Drop handlers for Version B
  const handleDragOverB = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingB(true);
  };
  const handleDragLeaveB = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingB(false);
  };
  const handleDropB = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingB(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleSelectB(e.dataTransfer.files[0]);
    }
  };

  const handleRunCompare = () => {
    if (fileA && fileB) {
      onCompare(fileA, fileB);
    }
  };

  const isWinnerA = result?.verdict.recommended_version.includes('A');
  const isWinnerB = result?.verdict.recommended_version.includes('B');

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* View Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-xs font-semibold">
          <GitCompare className="w-4 h-4 text-violet-500" />
          <span>A/B Version Comparative Analysis</span>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Compare Two Reel Cuts Side-by-Side
        </h2>
        <p className="text-sm text-slate-500">
          Upload 2 edits of your reel (e.g., different hooks, music, or captions) to see which will generate higher watch-time and virality.
        </p>
      </div>

      {/* Upload Dual Drag-and-Drop Zone (when no result yet) */}
      {!result && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Version A Drag and Dropzone */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 space-y-4 relative group shadow-sm">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600 border border-indigo-200">
                  Version A (Cut #1)
                </span>
                {fileA && (
                  <button
                    onClick={() => { setFileA(null); setPreviewA(null); }}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>

              {!previewA ? (
                <div
                  onDragOver={handleDragOverA}
                  onDragLeave={handleDragLeaveA}
                  onDrop={handleDropA}
                  onClick={() => inputARef.current?.click()}
                  className={`cursor-pointer border-2 border-dashed rounded-xl p-8 text-center transition-all space-y-3 ${
                    isDraggingA
                      ? 'border-indigo-400 bg-indigo-50 scale-[1.01]'
                      : 'border-gray-300 hover:border-indigo-400 bg-gray-50/50 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="file"
                    ref={inputARef}
                    onChange={(e) => e.target.files?.[0] && handleSelectA(e.target.files[0])}
                    accept="video/*"
                    className="hidden"
                  />
                  <div className="w-14 h-14 mx-auto rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center border border-indigo-200">
                    <UploadCloud className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-700">Drag & Drop Version A Here</p>
                    <p className="text-xs text-slate-400">or click to browse (.mp4, .mov)</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <video src={previewA} controls className="w-full aspect-[9/16] object-cover rounded-xl bg-gray-100 border border-gray-200" />
                  <p className="text-xs text-slate-600 font-mono truncate">{fileA?.name}</p>
                </div>
              )}
            </div>

            {/* Version B Drag and Dropzone */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 space-y-4 relative group shadow-sm">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-violet-50 text-violet-600 border border-violet-200">
                  Version B (Cut #2)
                </span>
                {fileB && (
                  <button
                    onClick={() => { setFileB(null); setPreviewB(null); }}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>

              {!previewB ? (
                <div
                  onDragOver={handleDragOverB}
                  onDragLeave={handleDragLeaveB}
                  onDrop={handleDropB}
                  onClick={() => inputBRef.current?.click()}
                  className={`cursor-pointer border-2 border-dashed rounded-xl p-8 text-center transition-all space-y-3 ${
                    isDraggingB
                      ? 'border-violet-400 bg-violet-50 scale-[1.01]'
                      : 'border-gray-300 hover:border-violet-400 bg-gray-50/50 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="file"
                    ref={inputBRef}
                    onChange={(e) => e.target.files?.[0] && handleSelectB(e.target.files[0])}
                    accept="video/*"
                    className="hidden"
                  />
                  <div className="w-14 h-14 mx-auto rounded-xl bg-violet-50 text-violet-500 flex items-center justify-center border border-violet-200">
                    <UploadCloud className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-700">Drag & Drop Version B Here</p>
                    <p className="text-xs text-slate-400">or click to browse (.mp4, .mov)</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <video src={previewB} controls className="w-full aspect-[9/16] object-cover rounded-xl bg-gray-100 border border-gray-200" />
                  <p className="text-xs text-slate-600 font-mono truncate">{fileB?.name}</p>
                </div>
              )}
            </div>

          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={handleRunCompare}
              disabled={!fileA || !fileB || isLoading}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 hover:from-indigo-500 hover:via-violet-500 hover:to-purple-500 shadow-lg shadow-indigo-600/20 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              <GitCompare className="w-5 h-5" />
              <span>{isLoading ? 'Analyzing Side-by-Side with Gemini...' : 'Compare Versions Now'}</span>
            </button>

            <button
              onClick={onLoadSampleCompare}
              disabled={isLoading}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-xs font-semibold bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200 flex items-center justify-center space-x-2 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-violet-500 animate-pulse" />
              <span>Try Sample A/B Compare Demo</span>
            </button>
          </div>
        </div>
      )}

      {/* Comparison Results Section */}
      {result && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Winner Verdict Banner */}
          <div className="bg-white rounded-3xl p-8 border border-amber-200 bg-gradient-to-r from-amber-50 via-white to-violet-50 relative overflow-hidden shadow-sm">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-3">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-300">
                  <Trophy className="w-4 h-4 text-amber-600" />
                  <span>Winning Version: {result.verdict.recommended_version}</span>
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900">
                  {result.verdict.winner_title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
                  {result.verdict.reasoning}
                </p>
              </div>

              <button
                onClick={onReset}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white hover:bg-gray-50 text-slate-700 border border-gray-200 transition-colors flex items-center space-x-2 self-start lg:self-auto shadow-sm"
              >
                <RefreshCw className="w-4 h-4" />
                <span>New Comparison</span>
              </button>
            </div>
          </div>

          {/* Side-by-Side Comparison Table Card */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 space-y-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center space-x-3">
                <Star className="w-5 h-5 text-amber-500" />
                <div>
                  <h4 className="font-bold text-slate-900 text-base">Side-by-Side Comparative Matrix</h4>
                  <p className="text-xs text-slate-500">Direct score breakdown and hook speed analysis</p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-slate-500 font-semibold">
                    <th className="py-3.5 px-4 rounded-l-xl">Evaluation Metric</th>
                    <th className={`py-3.5 px-4 ${isWinnerA ? 'bg-amber-50 text-amber-700' : ''}`}>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-indigo-600">{result.version_a_scores.title}</span>
                        {isWinnerA && (
                          <span className="px-2 py-0.5 rounded text-[9px] font-extrabold bg-amber-500 text-white uppercase">
                            WINNER 🏆
                          </span>
                        )}
                      </div>
                    </th>
                    <th className={`py-3.5 px-4 ${isWinnerB ? 'bg-amber-50 text-amber-700' : ''}`}>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-violet-600">{result.version_b_scores.title}</span>
                        {isWinnerB && (
                          <span className="px-2 py-0.5 rounded text-[9px] font-extrabold bg-amber-500 text-white uppercase">
                            WINNER 🏆
                          </span>
                        )}
                      </div>
                    </th>
                    <th className="py-3.5 px-4 rounded-r-xl">Advantage & Verdict</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-mono">
                  
                  {/* Row 1: Hook Score */}
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 font-sans font-semibold text-slate-800 flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-indigo-500" />
                      <span>Hook Retention Score</span>
                    </td>
                    <td className={`py-4 px-4 font-bold ${isWinnerA && result.version_a_scores.hook_score >= result.version_b_scores.hook_score ? 'text-amber-700' : 'text-slate-700'}`}>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{result.version_a_scores.hook_score}/10</span>
                        {result.version_a_scores.hook_score > result.version_b_scores.hook_score && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 font-sans border border-emerald-200">+{(result.version_a_scores.hook_score - result.version_b_scores.hook_score).toFixed(1)}</span>
                        )}
                      </div>
                    </td>
                    <td className={`py-4 px-4 font-bold ${isWinnerB && result.version_b_scores.hook_score >= result.version_a_scores.hook_score ? 'text-amber-700' : 'text-slate-700'}`}>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{result.version_b_scores.hook_score}/10</span>
                        {result.version_b_scores.hook_score > result.version_a_scores.hook_score && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 font-sans border border-emerald-200">+{(result.version_b_scores.hook_score - result.version_a_scores.hook_score).toFixed(1)}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 font-sans text-slate-600">
                      Faster grabber: <strong className="text-slate-800">{result.hook_comparison.faster_attention_grabber}</strong>
                    </td>
                  </tr>

                  {/* Row 2: Pacing Score */}
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 font-sans font-semibold text-slate-800 flex items-center space-x-2">
                      <Layers className="w-4 h-4 text-violet-500" />
                      <span>Pacing & Engagement Score</span>
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-700">
                      <span className="text-sm">{result.version_a_scores.pacing_score}/10</span>
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-700">
                      <span className="text-sm">{result.version_b_scores.pacing_score}/10</span>
                    </td>
                    <td className="py-4 px-4 font-sans text-slate-600">
                      {result.version_a_scores.pacing_score > result.version_b_scores.pacing_score ? 'Version A cuts tighter' : 'Version B pacing smoother'}
                    </td>
                  </tr>

                  {/* Row 3: Audio Score */}
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 font-sans font-semibold text-slate-800 flex items-center space-x-2">
                      <Star className="w-4 h-4 text-amber-500" />
                      <span>Audio & Voiceover Quality</span>
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-700">
                      <span className="text-sm">{result.version_a_scores.audio_score}/10</span>
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-700">
                      <span className="text-sm">{result.version_b_scores.audio_score}/10</span>
                    </td>
                    <td className="py-4 px-4 font-sans text-slate-600">
                      {result.version_a_scores.audio_score >= result.version_b_scores.audio_score ? 'Version A audio balanced' : 'Version B audio track clearer'}
                    </td>
                  </tr>

                  {/* Row 4: Overall Virality */}
                  <tr className="bg-gray-50 font-bold border-t-2 border-b-2 border-gray-200">
                    <td className="py-4 px-4 font-sans text-slate-900 text-sm flex items-center space-x-2">
                      <Trophy className="w-4 h-4 text-amber-500" />
                      <span>Overall Virality Index</span>
                    </td>
                    <td className={`py-4 px-4 text-base ${isWinnerA ? 'text-amber-700 font-extrabold' : 'text-slate-600'}`}>
                      {result.version_a_scores.overall_virality}/10
                    </td>
                    <td className={`py-4 px-4 text-base ${isWinnerB ? 'text-amber-700 font-extrabold' : 'text-slate-600'}`}>
                      {result.version_b_scores.overall_virality}/10
                    </td>
                    <td className="py-4 px-4 font-sans text-emerald-600 text-xs">
                      Recommend Posting: <strong>{result.verdict.recommended_version}</strong>
                    </td>
                  </tr>

                </tbody>
              </table>
            </div>
          </div>

          {/* Hook Comparison & Actionable Merges Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Hook Comparison Detail Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 space-y-4 shadow-sm">
              <div className="flex items-center space-x-3 border-b border-gray-100 pb-3">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">Hook Speed & Attention Breakdown</h4>
                  <p className="text-xs text-slate-500">Opening 3 seconds attention battle</p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200 space-y-1">
                  <span className="font-bold text-indigo-600 block">Version A Hook</span>
                  <p className="text-slate-600">{result.hook_comparison.version_a_hook}</p>
                </div>

                <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200 space-y-1">
                  <span className="font-bold text-violet-600 block">Version B Hook</span>
                  <p className="text-slate-600">{result.hook_comparison.version_b_hook}</p>
                </div>

                <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-200 space-y-1">
                  <div className="flex items-center space-x-1.5 text-emerald-700 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Faster Hook: {result.hook_comparison.faster_attention_grabber}</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed pt-1">
                    {result.hook_comparison.hook_speed_explanation}
                  </p>
                </div>
              </div>
            </div>

            {/* Actionable Merges Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 space-y-4 shadow-sm">
              <div className="flex items-center space-x-3 border-b border-gray-100 pb-3">
                <div className="p-2 rounded-xl bg-violet-50 text-violet-600 border border-violet-200">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">Actionable Edit Recommendations</h4>
                  <p className="text-xs text-slate-500">Exact tweaks to merge best elements of both cuts</p>
                </div>
              </div>

              <div className="space-y-2.5">
                {result.verdict.actionable_merges.map((merge, i) => (
                  <div key={i} className="bg-gray-50 p-3.5 rounded-xl border border-gray-200 flex items-start space-x-3">
                    <div className="w-5 h-5 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">{merge}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
