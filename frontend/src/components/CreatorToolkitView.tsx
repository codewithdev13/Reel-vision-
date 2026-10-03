'use me';
'use client';

import React, { useState } from 'react';
import {
  BenchmarkResult,
  RewriteCaptionResult,
  GenerateIdeasResult,
  ExplainTrendResult,
} from '@/types';
import {
  Wand2,
  GitCompare,
  Copy,
  Check,
  Calendar,
  Flame,
  Sparkles,
  Zap,
  BookOpen,
  TrendingUp,
  RefreshCw,
  Plus,
  Trash2,
  ArrowRight,
  Layers,
  Award,
  Video,
  Music,
  MessageSquare,
  Compass,
  Lightbulb,
} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface CreatorToolkitViewProps {
  apiKey: string;
}

export const CreatorToolkitView: React.FC<CreatorToolkitViewProps> = ({ apiKey }) => {
  const [subTab, setSubTab] = useState<'benchmark' | 'rewriter' | 'ideas' | 'trends'>('benchmark');
  
  // Shared state
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // 1. Benchmark state
  const [userScript, setUserScript] = useState('');
  const [competitorScripts, setCompetitorScripts] = useState<string[]>(['', '']);
  const [benchmarkNiche, setBenchmarkNiche] = useState('');
  const [benchmarkResult, setBenchmarkResult] = useState<BenchmarkResult | null>(null);

  // 2. Rewriter state
  const [originalDraft, setOriginalDraft] = useState('');
  const [rewriterNiche, setRewriterNiche] = useState('');
  const [rewriteResult, setRewriteResult] = useState<RewriteCaptionResult | null>(null);

  // 3. Ideas Generator state
  const [nicheTopic, setNicheTopic] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [ideasResult, setIdeasResult] = useState<GenerateIdeasResult | null>(null);

  // 4. Trend Explainer state
  const [trendName, setTrendName] = useState('');
  const [trendNiche, setTrendNiche] = useState('');
  const [trendResult, setTrendResult] = useState<ExplainTrendResult | null>(null);

  // Copy helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // --- 1. BENCHMARK HANDLER ---
  const handleRunBenchmark = async (isDemo = false) => {
    setIsLoading(true);
    try {
      if (isDemo) {
        const res = await fetch(`${API_BASE_URL}/api/sample-benchmark`);
        const data = await res.json();
        setBenchmarkResult(data);
      } else {
        const res = await fetch(`${API_BASE_URL}/api/benchmark`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(apiKey ? { 'X-Gemini-API-Key': apiKey } : {}),
          },
          body: JSON.stringify({
            user_script: userScript,
            competitor_scripts: competitorScripts.filter((s) => s.trim().length > 0),
            niche: benchmarkNiche || 'General Content',
          }),
        });
        const data = await res.json();
        setBenchmarkResult(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  // --- 2. REWRITE CAPTION HANDLER ---
  const handleRunRewrite = async (isDemo = false) => {
    setIsLoading(true);
    try {
      if (isDemo) {
        const res = await fetch(`${API_BASE_URL}/api/sample-rewrite`);
        const data = await res.json();
        setRewriteResult(data);
      } else {
        const res = await fetch(`${API_BASE_URL}/api/rewrite-caption`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(apiKey ? { 'X-Gemini-API-Key': apiKey } : {}),
          },
          body: JSON.stringify({
            original_content: originalDraft,
            niche: rewriterNiche || 'General Content',
          }),
        });
        const data = await res.json();
        setRewriteResult(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  // --- 3. GENERATE IDEAS HANDLER ---
  const handleRunIdeas = async (isDemo = false) => {
    setIsLoading(true);
    try {
      if (isDemo) {
        const res = await fetch(`${API_BASE_URL}/api/sample-ideas`);
        const data = await res.json();
        setIdeasResult(data);
      } else {
        const res = await fetch(`${API_BASE_URL}/api/generate-ideas`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(apiKey ? { 'X-Gemini-API-Key': apiKey } : {}),
          },
          body: JSON.stringify({
            niche_topic: nicheTopic,
            target_audience: targetAudience || 'General Viewers',
          }),
        });
        const data = await res.json();
        setIdeasResult(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  // --- 4. EXPLAIN TREND HANDLER ---
  const handleRunTrend = async (isDemo = false) => {
    setIsLoading(true);
    try {
      if (isDemo) {
        const res = await fetch(`${API_BASE_URL}/api/sample-trend`);
        const data = await res.json();
        setTrendResult(data);
      } else {
        const res = await fetch(`${API_BASE_URL}/api/explain-trend`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(apiKey ? { 'X-Gemini-API-Key': apiKey } : {}),
          },
          body: JSON.stringify({
            trend_name: trendName,
            user_niche: trendNiche || 'General Content',
          }),
        });
        const data = await res.json();
        setTrendResult(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
          <Wand2 className="w-4 h-4 text-emerald-500" />
          <span>Powered by Gemini 1.5 Flash Speed Engine</span>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Text-Based AI Creator Toolkit
        </h2>
        <p className="text-sm text-slate-500">
          Instant script benchmarking, viral caption rewriting, content calendar reel generation, and trend breakdown analysis.
        </p>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex bg-gray-50 p-1.5 rounded-2xl border border-gray-200 shadow-sm flex-wrap justify-center gap-1">
          <button
            onClick={() => setSubTab('benchmark')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold tab-transition ${
              subTab === 'benchmark'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-500 hover:text-slate-800 hover:bg-white'
            }`}
          >
            <GitCompare className="w-4 h-4" />
            <span>Competitor Benchmark</span>
          </button>

          <button
            onClick={() => setSubTab('rewriter')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold tab-transition ${
              subTab === 'rewriter'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-500 hover:text-slate-800 hover:bg-white'
            }`}
          >
            <Wand2 className="w-4 h-4" />
            <span>Caption & Script Rewriter</span>
          </button>

          <button
            onClick={() => setSubTab('ideas')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold tab-transition ${
              subTab === 'ideas'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20'
                : 'text-slate-500 hover:text-slate-800 hover:bg-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Content Calendar Generator</span>
          </button>

          <button
            onClick={() => setSubTab('trends')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold tab-transition ${
              subTab === 'trends'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                : 'text-slate-500 hover:text-slate-800 hover:bg-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Trend Breakdown Explainer</span>
          </button>
        </div>
      </div>

      {/* ========================================== */}
      {/* SUB-TAB 1: Competitor Benchmark             */}
      {/* ========================================== */}
      {subTab === 'benchmark' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* User Script Side */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                  Your Reel Script / Transcript
                </span>
                <span className="text-[11px] text-slate-400">Target Draft</span>
              </div>
              <textarea
                value={userScript}
                onChange={(e) => setUserScript(e.target.value)}
                rows={7}
                placeholder="Paste your script or draft here...&#10;E.g. Stop scrolling if you want to grow on Instagram in 2026. Here are 3 tweaks I made to increase retention..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 font-mono leading-relaxed"
              />
              <input
                type="text"
                value={benchmarkNiche}
                onChange={(e) => setBenchmarkNiche(e.target.value)}
                placeholder="Niche (Optional e.g. Tech, Fitness, Finance)"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
              />
            </div>

            {/* Competitor Scripts Side */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  Competitor Reel Transcripts (2-3)
                </span>
                {competitorScripts.length < 3 && (
                  <button
                    onClick={() => setCompetitorScripts([...competitorScripts, ''])}
                    className="text-xs text-indigo-600 hover:underline flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Competitor</span>
                  </button>
                )}
              </div>

              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {competitorScripts.map((comp, idx) => (
                  <div key={idx} className="relative">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] text-slate-400 font-semibold">Competitor Reel #{idx + 1}</span>
                      {competitorScripts.length > 1 && (
                        <button
                          onClick={() => setCompetitorScripts(competitorScripts.filter((_, i) => i !== idx))}
                          className="text-red-500 hover:text-red-600 text-[10px]"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <textarea
                      value={comp}
                      onChange={(e) => {
                        const next = [...competitorScripts];
                        next[idx] = e.target.value;
                        setCompetitorScripts(next);
                      }}
                      rows={3}
                      placeholder={`Competitor #${idx + 1} transcript or video description...`}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 font-mono"
                    />
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => handleRunBenchmark(false)}
              disabled={isLoading || !userScript.trim()}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-600/20 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              <GitCompare className="w-5 h-5" />
              <span>{isLoading ? 'Benchmarking with Gemini 1.5 Flash...' : 'Run Competitor Benchmark'}</span>
            </button>

            <button
              onClick={() => handleRunBenchmark(true)}
              disabled={isLoading}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center space-x-2 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-emerald-500 animate-pulse" />
              <span>Try Sample Benchmark Demo</span>
            </button>
          </div>

          {/* Benchmark Results Display */}
          {benchmarkResult && (
            <div className="space-y-6 pt-4 animate-in fade-in duration-500">
              
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-white rounded-2xl p-5 border border-emerald-200 bg-emerald-50/50 space-y-2 shadow-sm">
                  <span className="text-xs font-bold text-emerald-600 block uppercase tracking-wider">
                    Your Hook Effectiveness
                  </span>
                  <p className="text-sm font-semibold text-slate-800">{benchmarkResult.user_hook_effectiveness}</p>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-indigo-200 bg-indigo-50/50 space-y-2 shadow-sm">
                  <span className="text-xs font-bold text-indigo-600 block uppercase tracking-wider">
                    Your CTA Strength
                  </span>
                  <p className="text-sm font-semibold text-slate-800">{benchmarkResult.user_cta_strength}</p>
                </div>
              </div>

              {/* Structural Gaps */}
              <div className="bg-white rounded-2xl p-6 border border-amber-200 bg-amber-50/30 space-y-3 shadow-sm">
                <div className="flex items-center space-x-2 text-amber-700 font-bold text-sm">
                  <Zap className="w-5 h-5" />
                  <span>Key Structural Gaps Identified vs Competitors</span>
                </div>
                <div className="space-y-2 text-xs text-slate-700">
                  {benchmarkResult.structural_gaps.map((gap, i) => (
                    <div key={i} className="flex items-start space-x-2">
                      <span className="text-amber-500 font-bold">•</span>
                      <p>{gap}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Competitor Breakdown Side-by-Side Cards */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Competitor Breakdown</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {benchmarkResult.competitor_breakdown.map((comp, idx) => (
                    <div key={idx} className="bg-white rounded-2xl p-5 border border-gray-200 space-y-3 shadow-sm">
                      <h5 className="font-bold text-indigo-600 text-sm">{comp.competitor_name}</h5>
                      <div className="space-y-2 text-xs text-slate-600">
                        <div>
                          <strong className="text-slate-500 block">Hook Analysis:</strong>
                          <p>{comp.hook_analysis}</p>
                        </div>
                        <div>
                          <strong className="text-slate-500 block">CTA Strength:</strong>
                          <p className="text-emerald-600">{comp.cta_strength}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Recommendations */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 space-y-3 shadow-sm">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <span>Actionable Recommendations</span>
                </h4>
                <div className="space-y-2">
                  {benchmarkResult.key_recommendations.map((rec, i) => (
                    <div key={i} className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-xs text-slate-700 flex items-start space-x-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <p>{rec}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>
      )}

      {/* ========================================== */}
      {/* SUB-TAB 2: Script & Caption Rewriter       */}
      {/* ========================================== */}
      {subTab === 'rewriter' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 space-y-4 max-w-3xl mx-auto shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Existing Caption or Video Draft
              </span>
              <span className="text-[11px] text-slate-400">3 Viral Rewrite Styles</span>
            </div>
            
            <textarea
              value={originalDraft}
              onChange={(e) => setOriginalDraft(e.target.value)}
              rows={5}
              placeholder="Paste your rough caption draft or video script text here...&#10;E.g., 3 tips to grow your Instagram account faster in 2026. Make sure to follow for more tips!"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 font-mono leading-relaxed"
            />

            <input
              type="text"
              value={rewriterNiche}
              onChange={(e) => setRewriterNiche(e.target.value)}
              placeholder="Target Niche (Optional e.g., Creator Growth, Fitness, Real Estate)"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
            />

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                onClick={() => handleRunRewrite(false)}
                disabled={isLoading || !originalDraft.trim()}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-600/20 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
              >
                <Wand2 className="w-5 h-5" />
                <span>{isLoading ? 'Rewriting with Gemini 1.5 Flash...' : 'Rewrite in 3 Viral Styles'}</span>
              </button>

              <button
                onClick={() => handleRunRewrite(true)}
                disabled={isLoading}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-xs font-semibold bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200 flex items-center justify-center space-x-2 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-violet-500 animate-pulse" />
                <span>Try Sample Caption Rewriter Demo</span>
              </button>
            </div>
          </div>

          {/* Rewriter Results Display */}
          {rewriteResult && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 animate-in fade-in duration-500">
              
              {/* Style 1: Viral Hook */}
              <div className="bg-white rounded-2xl p-6 border border-orange-200 bg-orange-50/30 space-y-4 flex flex-col justify-between shadow-sm">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700 border border-orange-200">
                      {rewriteResult.viral_hook_style.style_name}
                    </span>
                    <button
                      onClick={() => handleCopy(`${rewriteResult.viral_hook_style.caption_text}\n\n${rewriteResult.viral_hook_style.call_to_action}\n\n${rewriteResult.viral_hook_style.suggested_hashtags.join(' ')}`, 'hook')}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        copiedId === 'hook' ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                      }`}
                      title="Copy full caption"
                    >
                      {copiedId === 'hook' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
                    </button>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed font-sans whitespace-pre-line">
                    {rewriteResult.viral_hook_style.caption_text}
                  </p>

                  <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 text-xs text-orange-700 font-semibold">
                    💬 CTA: {rewriteResult.viral_hook_style.call_to_action}
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200 text-[11px] text-slate-500 space-x-1">
                  {rewriteResult.viral_hook_style.suggested_hashtags.map((tag, i) => (
                    <span key={i} className="inline-block text-orange-600 font-mono">{tag}</span>
                  ))}
                </div>
              </div>

              {/* Style 2: Minimalist Aesthetic */}
              <div className="bg-white rounded-2xl p-6 border border-sky-200 bg-sky-50/30 space-y-4 flex flex-col justify-between shadow-sm">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-700 border border-sky-200">
                      {rewriteResult.minimalist_aesthetic.style_name}
                    </span>
                    <button
                      onClick={() => handleCopy(`${rewriteResult.minimalist_aesthetic.caption_text}\n\n${rewriteResult.minimalist_aesthetic.call_to_action}\n\n${rewriteResult.minimalist_aesthetic.suggested_hashtags.join(' ')}`, 'minimal')}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        copiedId === 'minimal' ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                      }`}
                      title="Copy full caption"
                    >
                      {copiedId === 'minimal' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
                    </button>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed font-sans whitespace-pre-line">
                    {rewriteResult.minimalist_aesthetic.caption_text}
                  </p>

                  <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-700 font-semibold">
                    💬 CTA: {rewriteResult.minimalist_aesthetic.call_to_action}
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200 text-[11px] text-slate-500 space-x-1">
                  {rewriteResult.minimalist_aesthetic.suggested_hashtags.map((tag, i) => (
                    <span key={i} className="inline-block text-sky-600 font-mono">{tag}</span>
                  ))}
                </div>
              </div>

              {/* Style 3: High-Engagement Storytelling */}
              <div className="bg-white rounded-2xl p-6 border border-violet-200 bg-violet-50/30 space-y-4 flex flex-col justify-between shadow-sm">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-violet-100 text-violet-700 border border-violet-200">
                      {rewriteResult.high_engagement_storytelling.style_name}
                    </span>
                    <button
                      onClick={() => handleCopy(`${rewriteResult.high_engagement_storytelling.caption_text}\n\n${rewriteResult.high_engagement_storytelling.call_to_action}\n\n${rewriteResult.high_engagement_storytelling.suggested_hashtags.join(' ')}`, 'story')}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        copiedId === 'story' ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                      }`}
                      title="Copy full caption"
                    >
                      {copiedId === 'story' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
                    </button>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed font-sans whitespace-pre-line">
                    {rewriteResult.high_engagement_storytelling.caption_text}
                  </p>

                  <div className="p-3 rounded-xl bg-violet-50 border border-violet-200 text-xs text-violet-700 font-semibold">
                    💬 CTA: {rewriteResult.high_engagement_storytelling.call_to_action}
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200 text-[11px] text-slate-500 space-x-1">
                  {rewriteResult.high_engagement_storytelling.suggested_hashtags.map((tag, i) => (
                    <span key={i} className="inline-block text-violet-600 font-mono">{tag}</span>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>
      )}

      {/* ========================================== */}
      {/* SUB-TAB 3: Content Calendar Generator     */}
      {/* ========================================== */}
      {subTab === 'ideas' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 space-y-4 max-w-3xl mx-auto shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-violet-600 uppercase tracking-wider">
                Generate 5 High-Converting Reel Ideas
              </span>
              <span className="text-[11px] text-slate-400">Niche & Audience Focused</span>
            </div>

            <input
              type="text"
              value={nicheTopic}
              onChange={(e) => setNicheTopic(e.target.value)}
              placeholder="Topic or Niche (e.g., Tech & Productivity, Fitness, Personal Finance, Fashion)"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20"
            />

            {/* Quick preset niche pills */}
            <div className="flex items-center space-x-2 text-xs overflow-x-auto pb-1">
              <span className="text-slate-400 text-[11px]">Presets:</span>
              {['Tech & AI', 'Fitness & Form', 'Personal Finance', 'Fashion & Beauty', 'Real Estate'].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setNicheTopic(preset)}
                  className="px-2.5 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-slate-600 text-[11px] font-medium border border-gray-200 whitespace-nowrap transition-colors"
                >
                  {preset}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="Target Audience (Optional e.g., Beginners, Busy Professionals)"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20"
            />

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                onClick={() => handleRunIdeas(false)}
                disabled={isLoading || !nicheTopic.trim()}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-600/20 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
              >
                <Calendar className="w-5 h-5" />
                <span>{isLoading ? 'Generating Concepts with Gemini...' : 'Generate 5 Reel Concepts'}</span>
              </button>

              <button
                onClick={() => handleRunIdeas(true)}
                disabled={isLoading}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-xs font-semibold bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200 flex items-center justify-center space-x-2 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-violet-500 animate-pulse" />
                <span>Try Sample Calendar Ideas</span>
              </button>
            </div>
          </div>

          {/* Ideas Results View */}
          {ideasResult && (
            <div className="space-y-4 pt-4 animate-in fade-in duration-500">
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-violet-500" />
                <span>5 Viral Reel Concepts for "{ideasResult.niche_topic}"</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {ideasResult.concepts.map((concept, idx) => (
                  <div key={idx} className="bg-white rounded-2xl p-5 border border-gray-200 space-y-3.5 flex flex-col justify-between hover:border-violet-300 transition-all shadow-sm">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="w-7 h-7 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center font-bold text-xs">
                          #{idx + 1}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-100 text-amber-700 border border-amber-200">
                          {concept.viral_potential_score}
                        </span>
                      </div>

                      <h4 className="font-bold text-slate-900 text-sm">{concept.concept_title}</h4>

                      <div className="space-y-2 text-xs">
                        <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-200 space-y-1">
                          <span className="text-[10px] font-bold text-indigo-600 flex items-center space-x-1">
                            <Video className="w-3 h-3" />
                            <span>Visual Hook (0-3s)</span>
                          </span>
                          <p className="text-slate-600">{concept.visual_hook}</p>
                        </div>

                        <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-200 space-y-1">
                          <span className="text-[10px] font-bold text-rose-500 flex items-center space-x-1">
                            <Music className="w-3 h-3" />
                            <span>Audio Suggestion</span>
                          </span>
                          <p className="text-slate-600">{concept.audio_suggestion}</p>
                        </div>

                        <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-200 space-y-1">
                          <span className="text-[10px] font-bold text-sky-600 flex items-center space-x-1">
                            <MessageSquare className="w-3 h-3" />
                            <span>On-Screen Text</span>
                          </span>
                          <p className="text-slate-800 font-semibold">{concept.on_screen_text}</p>
                        </div>

                        <div className="p-2.5 text-slate-500 text-[11px] leading-relaxed">
                          <strong className="text-slate-600 block mb-0.5">Script Outline:</strong>
                          {concept.script_outline}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCopy(`Title: ${concept.concept_title}\nVisual Hook: ${concept.visual_hook}\nAudio: ${concept.audio_suggestion}\nOn-Screen Text: ${concept.on_screen_text}\nOutline: ${concept.script_outline}`, `idea-${idx}`)}
                      className={`w-full py-2 rounded-xl text-xs font-semibold border flex items-center justify-center space-x-1.5 transition-colors ${
                        copiedId === `idea-${idx}`
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                          : 'bg-gray-50 hover:bg-gray-100 text-violet-600 border-gray-200'
                      }`}
                    >
                      {copiedId === `idea-${idx}` ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Copied! ✓</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Concept Script</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================== */}
      {/* SUB-TAB 4: Trend Breakdown Explainer       */}
      {/* ========================================== */}
      {subTab === 'trends' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 space-y-4 max-w-3xl mx-auto shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                Trend Breakdown Explainer
              </span>
              <span className="text-[11px] text-slate-400">Deconstruct & Adapt Any Trend</span>
            </div>

            <input
              type="text"
              value={trendName}
              onChange={(e) => setTrendName(e.target.value)}
              placeholder="Trending Format or Audio Name (e.g., POV / 3-Step Transformation, Fast Cut Photo Dump)"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20"
            />

            {/* Quick preset trends */}
            <div className="flex items-center space-x-2 text-xs overflow-x-auto pb-1">
              <span className="text-slate-400 text-[11px]">Popular Trends:</span>
              {['POV Transformation', 'Stop Doing This', 'Fast Audio Cut Dump', 'Tell Me Without Telling Me'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTrendName(t)}
                  className="px-2.5 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-slate-600 text-[11px] font-medium border border-gray-200 whitespace-nowrap transition-colors"
                >
                  {t}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={trendNiche}
              onChange={(e) => setTrendNiche(e.target.value)}
              placeholder="Your Specific Niche (Optional e.g., Fitness, Tech, Business)"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20"
            />

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                onClick={() => handleRunTrend(false)}
                disabled={isLoading || !trendName.trim()}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-rose-600 via-pink-600 to-violet-600 hover:from-rose-500 hover:to-violet-500 shadow-lg shadow-rose-600/20 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
              >
                <TrendingUp className="w-5 h-5" />
                <span>{isLoading ? 'Deconstructing Trend with Gemini...' : 'Explain & Adapt Trend'}</span>
              </button>

              <button
                onClick={() => handleRunTrend(true)}
                disabled={isLoading}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 flex items-center justify-center space-x-2 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-rose-500 animate-pulse" />
                <span>Try Sample Trend Explainer</span>
              </button>
            </div>
          </div>

          {/* Trend Results Display */}
          {trendResult && (
            <div className="space-y-6 pt-4 animate-in fade-in duration-500">
              
              {/* Why It Works Card */}
              <div className="bg-white rounded-3xl p-7 border border-rose-200 bg-gradient-to-r from-rose-50/40 via-white to-violet-50/30 space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700 border border-rose-200">
                      Trend Analysis: {trendResult.trend_name}
                    </span>
                    <h3 className="text-xl font-extrabold text-slate-900 mt-2">Why This Trend Goes Viral</h3>
                  </div>

                  <div className="bg-gray-50 px-4 py-2 rounded-xl border border-rose-200 font-mono text-xs text-center">
                    <span className="text-[10px] text-slate-400 block uppercase">Ideal Duration</span>
                    <strong className="text-rose-700">{trendResult.ideal_video_length}</strong>
                  </div>
                </div>

                <p className="text-sm text-slate-700 leading-relaxed">{trendResult.why_it_works}</p>

                <div className="p-3.5 rounded-xl bg-violet-50 border border-violet-200 text-xs text-violet-700 flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-violet-500 flex-shrink-0" />
                  <span><strong>Psychological Trigger:</strong> {trendResult.psychological_trigger}</span>
                </div>
              </div>

              {/* Niche Adaptation Grid */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                  <Compass className="w-4 h-4 text-sky-500" />
                  <span>How to Adapt This Trend to Any Niche</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {trendResult.niche_adaptations.map((adapt, idx) => (
                    <div key={idx} className="bg-white rounded-2xl p-5 border border-gray-200 space-y-3 shadow-sm">
                      <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-sky-100 text-sky-700 border border-sky-200">
                        {adapt.niche_name}
                      </span>
                      <p className="text-xs text-slate-600 leading-relaxed">{adapt.adaptation_idea}</p>
                      
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-xs text-slate-800 font-mono">
                        💬 "{adapt.sample_on_screen_text}"
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Execution Tips */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 space-y-3 shadow-sm">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Actionable Execution Tips</h4>
                <div className="space-y-2">
                  {trendResult.actionable_execution_tips.map((tip, i) => (
                    <div key={i} className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-xs text-slate-600 flex items-start space-x-2">
                      <Check className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                      <p>{tip}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>
      )}

    </div>
  );
};
