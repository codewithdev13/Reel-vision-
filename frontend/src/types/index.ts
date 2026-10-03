export interface HookAndRetention {
  first_3s_evaluation: string;
  hook_present: boolean;
  retention_risk_score: 'Low' | 'Medium' | 'High' | string;
  pacing_notes: string;
}

export interface ProConItem {
  category: string;
  description: string;
}

export interface ProsAndCons {
  pros: ProConItem[];
  cons: ProConItem[];
}

export interface ViralitySuggestions {
  actionable_fixes: string[];
  trending_caption_styles: string[];
  structural_hashtag_recommendations: string[];
}

export interface AudienceImpact {
  predicted_emotional_response: string;
  content_safety_flags: string[];
  misleading_content_flag: boolean;
  misleading_details: string;
}

export interface QualityScores {
  audio: number;
  lighting: number;
  framing: number;
  pacing: number;
  overall_virality: number;
}

export interface ContentClassification {
  category_type: string;
  quality_scores: QualityScores;
}

export interface AutoSummaryMetadata {
  one_line_summary: string;
  full_description: string;
  recommended_caption: string;
  hashtags: string[];
  accessible_alt_text: string;
}

export interface VideoAnalysisResult {
  hook_and_retention: HookAndRetention;
  pros_and_cons: ProsAndCons;
  virality_suggestions: ViralitySuggestions;
  audience_impact_and_sentiment: AudienceImpact;
  content_classification: ContentClassification;
  auto_summary_and_metadata: AutoSummaryMetadata;
}

// Side-by-Side Comparison Interfaces
export interface CompareScores {
  title: string;
  hook_score: number;
  pacing_score: number;
  audio_score: number;
  overall_virality: number;
}

export interface Verdict {
  recommended_version: string;
  winner_title: string;
  reasoning: string;
  actionable_merges: string[];
}

export interface HookComparison {
  version_a_hook: string;
  version_b_hook: string;
  faster_attention_grabber: string;
  hook_speed_explanation: string;
}

export interface ComparisonResult {
  verdict: Verdict;
  hook_comparison: HookComparison;
  version_a_scores: CompareScores;
  version_b_scores: CompareScores;
}

// Batch Ranker Interfaces
export interface BatchReelRank {
  rank: number;
  reel_name: string;
  overall_score: number;
  hook_score: number;
  pacing_score: number;
  audio_score: number;
  key_strength: string;
  top_fix: string;
}

export interface BatchWinner {
  reel_name: string;
  winner_badge: string;
  key_advantage: string;
  overall_virality_score: number;
}

export interface BatchRankResult {
  winner: BatchWinner;
  rankings: BatchReelRank[];
  batch_summary: string;
}

// Creator Toolkit Interfaces

// 1. Competitor Benchmark
export interface CompetitorComparisonItem {
  competitor_name: string;
  hook_analysis: string;
  structural_gaps: string[];
  cta_strength: string;
}

export interface BenchmarkResult {
  user_hook_effectiveness: string;
  user_cta_strength: string;
  structural_gaps: string[];
  competitor_breakdown: CompetitorComparisonItem[];
  key_recommendations: string[];
}

// 2. Script & Caption Rewriter
export interface CaptionStyleItem {
  style_name: string;
  caption_text: string;
  call_to_action: string;
  suggested_hashtags: string[];
}

export interface RewriteCaptionResult {
  original_preview: string;
  viral_hook_style: CaptionStyleItem;
  minimalist_aesthetic: CaptionStyleItem;
  high_engagement_storytelling: CaptionStyleItem;
}

// 3. Content Calendar / Generate Ideas
export interface ReelIdeaConcept {
  concept_title: string;
  visual_hook: string;
  audio_suggestion: string;
  on_screen_text: string;
  script_outline: string;
  viral_potential_score: string;
}

export interface GenerateIdeasResult {
  niche_topic: string;
  concepts: ReelIdeaConcept[];
}

// 4. Trend Breakdown Explainer
export interface NicheAdaptation {
  niche_name: string;
  adaptation_idea: string;
  sample_on_screen_text: string;
}

export interface ExplainTrendResult {
  trend_name: string;
  why_it_works: string;
  psychological_trigger: string;
  ideal_video_length: string;
  niche_adaptations: NicheAdaptation[];
  actionable_execution_tips: string[];
}

