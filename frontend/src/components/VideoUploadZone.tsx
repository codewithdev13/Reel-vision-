'use me';
'use client';

import React, { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { UploadCloud, Video, Play, Pause, RefreshCw, Sparkles, CheckCircle2, AlertCircle, FileVideo, ShieldAlert, Zap, Clock, Star, FileText } from 'lucide-react';

interface VideoUploadZoneProps {
  onAnalyze: (file: File) => void;
  isLoading: boolean;
  loadingStep: string;
  onLoadDemo?: () => void;
}

export const VideoUploadZone: React.FC<VideoUploadZoneProps> = ({ onAnalyze, isLoading, loadingStep, onLoadDemo }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('video/')) {
      alert('Please upload a valid video file (.mp4, .mov, .webm)');
      return;
    }
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setIsPlaying(false);
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleClear = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsPlaying(false);
  };

  const handleTriggerAnalyze = () => {
    if (selectedFile) {
      onAnalyze(selectedFile);
    }
  };

  // Determine current active loader step for animated timeline
  const getActiveStepIndex = () => {
    const step = loadingStep.toLowerCase();
    if (step.includes('uploading')) return 1;
    if (step.includes('hook') || step.includes('first 3')) return 2;
    if (step.includes('retention') || step.includes('pacing') || step.includes('calculating')) return 3;
    if (step.includes('metadata') || step.includes('caption') || step.includes('generating')) return 4;
    return 1;
  };

  const activeStep = getActiveStepIndex();

  return (
    <div className="w-full max-w-4xl mx-auto my-6 space-y-6">
      {!previewUrl ? (
        // Dropzone Area
        <div className="space-y-4">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative group cursor-pointer rounded-2xl p-10 text-center border-2 border-dashed transition-all duration-300 ${
              isDragging
                ? 'border-indigo-400 bg-indigo-50 scale-[1.01]'
                : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50/80 bg-white'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={onInputChange}
              accept="video/mp4,video/mov,video/webm,video/quicktime"
              className="hidden"
            />

            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-20 h-20 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <UploadCloud className="w-10 h-10 text-indigo-500" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  Upload Instagram Reel or Short Video
                </h3>
                <p className="text-sm text-slate-500">
                  Drag and drop your <span className="text-indigo-600 font-medium">.mp4</span> or <span className="text-indigo-600 font-medium">.mov</span> file here, or click to browse
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400 pt-2">
                <span className="flex items-center space-x-1">
                  <FileVideo className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Up to 100MB</span>
                </span>
                <span>•</span>
                <span>Gemini 1.5 Pro File API</span>
                <span>•</span>
                <span>Structured Multi-Modal Analysis</span>
              </div>
            </div>
          </div>

          {/* Fallback Instant Sample Demo Mode Button */}
          {onLoadDemo && (
            <div className="text-center pt-2">
              <button
                onClick={onLoadDemo}
                disabled={isLoading}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200 transition-all shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-violet-500 animate-pulse" />
                <span>No video file? Try Instant Pre-loaded Demo Reel Analysis</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        // Preview Player Area
        <div className="bg-white rounded-2xl p-6 border border-gray-200 space-y-6 shadow-sm">
          <div className="flex flex-col md:flex-row items-center gap-6">
            
            {/* Video Player Frame */}
            <div className="relative w-full md:w-80 aspect-[9/16] bg-gray-100 rounded-xl overflow-hidden border border-gray-200 shadow-md flex items-center justify-center group">
              <video
                ref={videoRef}
                src={previewUrl}
                className="w-full h-full object-cover"
                onEnded={() => setIsPlaying(false)}
                playsInline
              />
              <button
                onClick={togglePlay}
                className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-lg backdrop-blur-md opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
              </button>
            </div>

            {/* Video Meta & Controls */}
            <div className="flex-1 flex flex-col justify-between space-y-5 w-full">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-600 border border-indigo-200">
                    Ready for Gemini Analysis
                  </span>
                  <button
                    onClick={handleClear}
                    disabled={isLoading}
                    className="text-xs text-slate-400 hover:text-red-500 transition-colors flex items-center space-x-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Change Video</span>
                  </button>
                </div>

                <h4 className="text-lg font-bold text-slate-900 truncate max-w-md">
                  {selectedFile?.name}
                </h4>

                <div className="grid grid-cols-2 gap-3 mt-3 text-xs text-slate-500">
                  <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                    <span className="block text-slate-400 text-[10px] uppercase font-semibold">File Size</span>
                    <span className="text-slate-800 font-mono">
                      {selectedFile ? (selectedFile.size / (1024 * 1024)).toFixed(2) : '0'} MB
                    </span>
                  </div>
                  <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                    <span className="block text-slate-400 text-[10px] uppercase font-semibold">File Format</span>
                    <span className="text-slate-800 font-mono uppercase">
                      {selectedFile?.type.split('/')[1] || 'MP4'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Message / Animated Step-by-Step Progress Loader */}
              {isLoading ? (
                <div className="bg-gray-50 border border-indigo-200 rounded-2xl p-5 space-y-4 shadow-sm animate-in fade-in duration-300">
                  <div className="flex items-center space-x-3 border-b border-gray-200 pb-3">
                    <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                    <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                      {loadingStep || 'Processing video stream with Gemini 1.5 Pro...'}
                    </span>
                  </div>

                  {/* Animated 4-Step Progress Loader Timeline */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
                    
                    {/* Step 1 */}
                    <div className={`p-2.5 rounded-xl border flex flex-col space-y-1 transition-all ${
                      activeStep >= 1 ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-gray-50 border-gray-200 text-slate-400'
                    }`}>
                      <div className="flex items-center justify-between font-bold">
                        <span>1. Upload</span>
                        {activeStep > 1 ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : activeStep === 1 ? <UploadCloud className="w-3 h-3 text-indigo-500 animate-pulse" /> : null}
                      </div>
                      <span className="truncate">File API Stream</span>
                    </div>

                    {/* Step 2 */}
                    <div className={`p-2.5 rounded-xl border flex flex-col space-y-1 transition-all ${
                      activeStep >= 2 ? 'bg-violet-50 border-violet-200 text-violet-700' : 'bg-gray-50 border-gray-200 text-slate-400'
                    }`}>
                      <div className="flex items-center justify-between font-bold">
                        <span>2. Hook</span>
                        {activeStep > 2 ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : activeStep === 2 ? <Zap className="w-3 h-3 text-violet-500 animate-pulse" /> : null}
                      </div>
                      <span className="truncate">Opening 3s Cadence</span>
                    </div>

                    {/* Step 3 */}
                    <div className={`p-2.5 rounded-xl border flex flex-col space-y-1 transition-all ${
                      activeStep >= 3 ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-gray-50 border-gray-200 text-slate-400'
                    }`}>
                      <div className="flex items-center justify-between font-bold">
                        <span>3. Scores</span>
                        {activeStep > 3 ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : activeStep === 3 ? <Star className="w-3 h-3 text-rose-500 animate-pulse" /> : null}
                      </div>
                      <span className="truncate">Virality Index</span>
                    </div>

                    {/* Step 4 */}
                    <div className={`p-2.5 rounded-xl border flex flex-col space-y-1 transition-all ${
                      activeStep >= 4 ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-gray-50 border-gray-200 text-slate-400'
                    }`}>
                      <div className="flex items-center justify-between font-bold">
                        <span>4. Metadata</span>
                        {activeStep === 4 ? <FileText className="w-3 h-3 text-emerald-500 animate-pulse" /> : null}
                      </div>
                      <span className="truncate">Captions & Tags</span>
                    </div>

                  </div>

                  {/* Gradient Progress Line */}
                  <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-400 h-full transition-all duration-500 ease-out animate-progress"
                      style={{ width: `${(activeStep / 4) * 100}%` }}
                    />
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleTriggerAnalyze}
                  className="w-full py-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 hover:from-indigo-500 hover:via-violet-500 hover:to-purple-500 shadow-lg shadow-indigo-600/20 flex items-center justify-center space-x-2 transition-all transform active:scale-[0.99]"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Run AI Reel & Short Video Analysis</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
