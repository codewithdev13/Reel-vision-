'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { VideoUploadZone } from '@/components/VideoUploadZone';
import { AnalysisDashboard } from '@/components/AnalysisDashboard';
import { CompareView } from '@/components/CompareView';
import { BatchRankerView } from '@/components/BatchRankerView';
import { CreatorToolkitView } from '@/components/CreatorToolkitView';
import { VideoAnalysisResult, ComparisonResult, BatchRankResult } from '@/types';
import { Sparkles, AlertCircle, Film, GitCompare, BarChart3, Wand2, X } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Toast notification component
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-[100] toast-enter">
      <div className="flex items-center space-x-3 bg-white border border-gray-200 shadow-xl rounded-xl px-4 py-3 text-sm text-slate-700">
        <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs">✓</span>
        <span className="font-medium">{message}</span>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 ml-2">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'single' | 'compare' | 'batch' | 'tools'>('single');
  const [apiKey, setApiKey] = useState<string>('');
  
  // Single Reel State
  const [analysisResult, setAnalysisResult] = useState<VideoAnalysisResult | null>(null);
  
  // Compare State
  const [compareResult, setCompareResult] = useState<ComparisonResult | null>(null);
  
  // Batch State
  const [batchResult, setBatchResult] = useState<BatchRankResult | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  const handleSetApiKey = (key: string) => {
    setApiKey(key);
    if (key) {
      localStorage.setItem('gemini_api_key', key);
    } else {
      localStorage.removeItem('gemini_api_key');
    }
  };

  // --- Single Reel Analysis Handler ---
  const handleAnalyzeVideo = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setLoadingStep('Uploading video to Gemini File API...');

    const timer1 = setTimeout(() => {
      setLoadingStep('Analyzing Opening 3 Seconds & Visual Hooks...');
    }, 2500);

    const timer2 = setTimeout(() => {
      setLoadingStep('Calculating Retention Risk & Virality Index...');
    }, 5500);

    const timer3 = setTimeout(() => {
      setLoadingStep('Generating Viral Captions, Hashtags & Alt Text...');
    }, 8500);

    try {
      const formData = new FormData();
      formData.append('video', file);
      if (apiKey) formData.append('api_key', apiKey);

      const response = await fetch(`${API_BASE_URL}/api/analyze`, {
        method: 'POST',
        headers: apiKey ? { 'X-Gemini-API-Key': apiKey } : {},
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ detail: 'Analysis failed' }));
        throw new Error(errData.detail || 'Failed to analyze video');
      }

      const data: VideoAnalysisResult = await response.json();
      setAnalysisResult(data);
      setToast('Analysis complete — results are ready!');
    } catch (err: any) {
      setError(err.message || 'An error occurred during single video analysis.');
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  const handleLoadSingleDemo = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/sample-data`);
      if (!response.ok) throw new Error('Failed to fetch sample data');
      const data: VideoAnalysisResult = await response.json();
      setAnalysisResult(data);
      setToast('Sample demo loaded successfully');
    } catch (err: any) {
      setError('Could not load sample data.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- A/B Version Compare Handler ---
  const handleCompareVideos = async (fileA: File, fileB: File) => {
    setIsLoading(true);
    setError(null);
    setLoadingStep('Uploading dual video cuts to Gemini File API...');

    try {
      const formData = new FormData();
      formData.append('video_a', fileA);
      formData.append('video_b', fileB);
      if (apiKey) formData.append('api_key', apiKey);

      const response = await fetch(`${API_BASE_URL}/api/compare`, {
        method: 'POST',
        headers: apiKey ? { 'X-Gemini-API-Key': apiKey } : {},
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ detail: 'Comparison failed' }));
        throw new Error(errData.detail || 'Failed to compare videos');
      }

      const data: ComparisonResult = await response.json();
      setCompareResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred during comparison analysis.');
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  const handleLoadCompareDemo = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/sample-compare`);
      if (!response.ok) throw new Error('Failed to fetch sample comparison');
      const data: ComparisonResult = await response.json();
      setCompareResult(data);
    } catch (err: any) {
      setError('Could not load sample comparison.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- Batch Ranker Handler ---
  const handleBatchRank = async (files: File[]) => {
    setIsLoading(true);
    setError(null);
    setLoadingStep(`Uploading ${files.length} batch videos to Gemini File API...`);

    try {
      const formData = new FormData();
      if (files[0]) formData.append('video_1', files[0]);
      if (files[1]) formData.append('video_2', files[1]);
      if (files[2]) formData.append('video_3', files[2]);
      if (apiKey) formData.append('api_key', apiKey);

      const response = await fetch(`${API_BASE_URL}/api/batch`, {
        method: 'POST',
        headers: apiKey ? { 'X-Gemini-API-Key': apiKey } : {},
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ detail: 'Batch ranking failed' }));
        throw new Error(errData.detail || 'Failed to rank batch videos');
      }

      const data: BatchRankResult = await response.json();
      setBatchResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred during batch ranking.');
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  const handleLoadBatchDemo = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/sample-batch`);
      if (!response.ok) throw new Error('Failed to fetch sample batch');
      const data: BatchRankResult = await response.json();
      setBatchResult(data);
    } catch (err: any) {
      setError('Could not load sample batch rank.');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'single' as const, label: 'Single Reel Audit', icon: Film, color: 'indigo' },
    { id: 'compare' as const, label: 'A/B Version Compare', icon: GitCompare, color: 'violet' },
    { id: 'batch' as const, label: 'Batch Ranker (Up to 3)', icon: BarChart3, color: 'indigo' },
    { id: 'tools' as const, label: 'Creator Tools', icon: Wand2, color: 'emerald' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* Toast Notification */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      {/* Top Navbar */}
      <Navbar
        apiKey={apiKey}
        setApiKey={handleSetApiKey}
        onLoadDemo={handleLoadSingleDemo}
        isLoading={isLoading}
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
        
        {/* Navigation Tabs Bar */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-gray-50 p-1.5 rounded-2xl border border-gray-200 shadow-sm flex-wrap justify-center gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold tab-transition ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="max-w-4xl mx-auto mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start justify-between space-x-3">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-xs font-medium">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-xs text-red-500 hover:text-red-700 underline">
              Dismiss
            </button>
          </div>
        )}

        {/* TAB 1: Single Reel Audit */}
        {activeTab === 'single' && (
          <>
            {!analysisResult && (
              <div className="text-center max-w-3xl mx-auto space-y-4 mb-8">
                <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold shadow-sm">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  <span>Powered by Gemini 1.5 Pro Multi-Modal Vision</span>
                </div>
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
                  AI Reel & Short Video <span className="gradient-text">Analyzer</span>
                </h1>
                <p className="text-slate-500 text-base leading-relaxed">
                  Upload your Instagram Reel, TikTok, or YouTube Short to get instant retention insights, quality scores, virality fixes, and copyable viral metadata.
                </p>
              </div>
            )}

            {!analysisResult ? (
              <VideoUploadZone
                onAnalyze={handleAnalyzeVideo}
                isLoading={isLoading}
                loadingStep={loadingStep}
                onLoadDemo={handleLoadSingleDemo}
              />
            ) : (
              <AnalysisDashboard
                data={analysisResult}
                onReset={() => setAnalysisResult(null)}
              />
            )}
          </>
        )}

        {/* TAB 2: A/B Version Compare */}
        {activeTab === 'compare' && (
          <CompareView
            onCompare={handleCompareVideos}
            onLoadSampleCompare={handleLoadCompareDemo}
            isLoading={isLoading}
            result={compareResult}
            onReset={() => setCompareResult(null)}
          />
        )}

        {/* TAB 3: Batch Ranker */}
        {activeTab === 'batch' && (
          <BatchRankerView
            onBatchRank={handleBatchRank}
            onLoadSampleBatch={handleLoadBatchDemo}
            isLoading={isLoading}
            result={batchResult}
            onReset={() => setBatchResult(null)}
          />
        )}

        {/* TAB 4: Creator Tools */}
        {activeTab === 'tools' && (
          <CreatorToolkitView apiKey={apiKey} />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-700">ReelVision AI</span>
            <span>•</span>
            <span>Gemini 1.5 Pro Multi-Video Engine</span>
          </div>
          <p>© 2026 AI Reel & Short Video Analyzer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
