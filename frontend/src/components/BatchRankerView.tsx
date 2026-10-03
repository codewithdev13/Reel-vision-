'use me';
'use client';

import React, { useState, useRef, DragEvent } from 'react';
import { BatchRankResult } from '@/types';
import { UploadCloud, Trophy, BarChart3, Sparkles, RefreshCw, Medal, Flame, CheckCircle, ArrowUpRight } from 'lucide-react';

interface BatchRankerViewProps {
  onBatchRank: (files: File[]) => void;
  onLoadSampleBatch: () => void;
  isLoading: boolean;
  result: BatchRankResult | null;
  onReset: () => void;
}

export const BatchRankerView: React.FC<BatchRankerViewProps> = ({
  onBatchRank,
  onLoadSampleBatch,
  isLoading,
  result,
  onReset,
}) => {
  const [files, setFiles] = useState<(File | null)[]>([null, null, null]);
  const [previews, setPreviews] = useState<(string | null)[]>([null, null, null]);
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
  
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const handleSelect = (file: File, index: number) => {
    if (!file.type.startsWith('video/')) return;
    const updatedFiles = [...files];
    const updatedPreviews = [...previews];
    updatedFiles[index] = file;
    updatedPreviews[index] = URL.createObjectURL(file);
    setFiles(updatedFiles);
    setPreviews(updatedPreviews);
  };

  const handleRemove = (index: number) => {
    const updatedFiles = [...files];
    const updatedPreviews = [...previews];
    if (updatedPreviews[index]) {
      URL.revokeObjectURL(updatedPreviews[index]!);
    }
    updatedFiles[index] = null;
    updatedPreviews[index] = null;
    setFiles(updatedFiles);
    setPreviews(updatedPreviews);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    setDraggingIdx(index);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDraggingIdx(null);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    setDraggingIdx(null);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleSelect(e.dataTransfer.files[0], index);
    }
  };

  const handleRunBatch = () => {
    const activeFiles = files.filter((f): f is File => f !== null);
    if (activeFiles.length >= 2) {
      onBatchRank(activeFiles);
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-300">
          <Trophy className="w-4 h-4 text-amber-600" />
          <span>1st Place Winner</span>
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-slate-600 border border-gray-300">
          <Medal className="w-4 h-4 text-slate-500" />
          <span>2nd Place</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-600 border border-orange-200">
        <Medal className="w-4 h-4 text-orange-500" />
        <span>3rd Place</span>
      </span>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-semibold">
          <BarChart3 className="w-4 h-4 text-sky-500" />
          <span>Batch Video Ranker & Optimization</span>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Rank Up to 3 Reels from Strongest to Weakest
        </h2>
        <p className="text-sm text-slate-500">
          Upload 2 or 3 short reels to determine the algorithm favorite, compare hook metrics, and get instant recommendations before publishing.
        </p>
      </div>

      {/* Triple Upload Slot Grid */}
      {!result && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[0, 1, 2].map((idx) => (
              <div key={idx} className="bg-white rounded-2xl p-5 border border-gray-200 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-gray-100 text-slate-600 border border-gray-200">
                    Reel #{idx + 1}
                  </span>
                  {files[idx] && (
                    <button onClick={() => handleRemove(idx)} className="text-xs text-red-500 hover:underline">
                      Remove
                    </button>
                  )}
                </div>

                {!previews[idx] ? (
                  <div
                    onDragOver={(e) => handleDragOver(e, idx)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, idx)}
                    onClick={() => inputRefs[idx].current?.click()}
                    className={`cursor-pointer border-2 border-dashed rounded-xl p-6 text-center transition-all space-y-2 ${
                      draggingIdx === idx
                        ? 'border-sky-400 bg-sky-50 scale-[1.01]'
                        : 'border-gray-300 hover:border-sky-400 bg-gray-50/50 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="file"
                      ref={inputRefs[idx]}
                      onChange={(e) => e.target.files?.[0] && handleSelect(e.target.files[0], idx)}
                      accept="video/*"
                      className="hidden"
                    />
                    <div className="w-12 h-12 mx-auto rounded-xl bg-sky-50 text-sky-500 flex items-center justify-center border border-sky-200">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-semibold text-slate-600">Drag & Drop Video #{idx + 1}</p>
                    <p className="text-[10px] text-slate-400">or click to browse</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <video src={previews[idx]!} controls className="w-full aspect-[9/16] object-cover rounded-xl bg-gray-100 border border-gray-200" />
                    <p className="text-xs text-slate-600 font-mono truncate">{files[idx]?.name}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={handleRunBatch}
              disabled={files.filter((f) => f !== null).length < 2 || isLoading}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-sky-600 via-indigo-600 to-violet-600 hover:from-sky-500 hover:via-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-600/20 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              <BarChart3 className="w-5 h-5" />
              <span>{isLoading ? 'Ranking Batch with Gemini...' : 'Rank Batch Reels Now'}</span>
            </button>

            <button
              onClick={onLoadSampleBatch}
              disabled={isLoading}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-xs font-semibold bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 flex items-center justify-center space-x-2 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-sky-500 animate-pulse" />
              <span>Try Sample Batch Rank Demo</span>
            </button>
          </div>
        </div>
      )}

      {/* Batch Results View */}
      {result && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Winner Hero Card */}
          <div className="bg-white rounded-3xl p-8 border border-amber-200 bg-gradient-to-r from-amber-50 via-white to-indigo-50 shadow-sm relative overflow-hidden">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-300 flex items-center space-x-1.5">
                    <Trophy className="w-4 h-4 text-amber-600" />
                    <span>{result.winner.winner_badge}</span>
                  </span>
                </div>

                <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {result.winner.reel_name}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
                  {result.winner.key_advantage}
                </p>
              </div>

              <div className="flex items-center space-x-4 self-stretch lg:self-auto justify-between lg:justify-end">
                <div className="bg-gray-50 px-6 py-3 rounded-2xl border border-amber-200 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 block">Virality Index</span>
                  <span className="text-3xl font-extrabold font-mono text-slate-900">{result.winner.overall_virality_score}</span>
                  <span className="text-xs text-slate-400 font-mono">/10</span>
                </div>

                <button
                  onClick={onReset}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white hover:bg-gray-50 text-slate-700 border border-gray-200 transition-colors flex items-center space-x-2 shadow-sm"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Rank New Batch</span>
                </button>
              </div>
            </div>
          </div>

          {/* Ranked Leaderboard Cards */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-sky-500" />
              <span>Full Batch Leaderboard ({result.rankings.length} Reels)</span>
            </h4>

            <div className="grid grid-cols-1 gap-4">
              {result.rankings.map((item) => (
                <div
                  key={item.rank}
                  className={`bg-white rounded-2xl p-6 border transition-all shadow-sm ${
                    item.rank === 1 ? 'border-amber-200 bg-gradient-to-r from-amber-50/50 to-white' : 'border-gray-200'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      {getRankBadge(item.rank)}
                      <div>
                        <h5 className="text-lg font-bold text-slate-900">{item.reel_name}</h5>
                        <p className="text-xs text-slate-500 mt-1">
                          <strong className="text-sky-600">Strength:</strong> {item.key_strength}
                        </p>
                      </div>
                    </div>

                    {/* Scores Grid */}
                    <div className="flex items-center space-x-4 font-mono text-xs text-slate-500 bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-200">
                      <div><span className="text-slate-400 block text-[9px]">HOOK</span><strong className="text-slate-800">{item.hook_score}</strong></div>
                      <span className="text-gray-300">|</span>
                      <div><span className="text-slate-400 block text-[9px]">PACING</span><strong className="text-slate-800">{item.pacing_score}</strong></div>
                      <span className="text-gray-300">|</span>
                      <div><span className="text-slate-400 block text-[9px]">AUDIO</span><strong className="text-slate-800">{item.audio_score}</strong></div>
                      <span className="text-gray-300">|</span>
                      <div><span className="text-sky-600 block text-[9px]">OVERALL</span><strong className="text-sky-700 text-sm">{item.overall_score}</strong></div>
                    </div>
                  </div>

                  {/* Recommended Fix */}
                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center space-x-2 text-xs text-slate-500">
                    <ArrowUpRight className="w-4 h-4 text-violet-500 flex-shrink-0" />
                    <span><strong className="text-violet-600">Top Optimization:</strong> {item.top_fix}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Batch Strategy Summary Box */}
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 space-y-2">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider block">Batch Strategy Summary</span>
            <p className="text-xs text-slate-600 leading-relaxed">
              {result.batch_summary}
            </p>
          </div>

        </div>
      )}

    </div>
  );
};
