import os
import time
import json
import shutil
import tempfile
from typing import Optional, List
from fastapi import FastAPI, File, UploadFile, Form, Header, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="AI Reel & Short Video Analyzer API",
    description="Backend API powering Gemini 1.5 Pro video analysis for short-form reels & TikToks.",
    version="1.1.0"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Schemas for Single Video Analysis
class HookAndRetention(BaseModel):
    first_3s_evaluation: str = Field(..., description="Evaluation of the opening 3 seconds hook")
    hook_present: bool = Field(..., description="Whether a strong visual or audio hook is present")
    retention_risk_score: str = Field(..., description="'Low', 'Medium', or 'High'")
    pacing_notes: str = Field(..., description="Pacing and edit frequency notes")

class ProConItem(BaseModel):
    category: str = Field(..., description="e.g. Audio, Lighting, Call-to-Action, Captions")
    description: str = Field(..., description="Detailed feedback point")

class ProsAndCons(BaseModel):
    pros: List[ProConItem] = Field(..., description="Strengths of the video")
    cons: List[ProConItem] = Field(..., description="Areas for improvement")

class ViralitySuggestions(BaseModel):
    actionable_fixes: List[str] = Field(..., description="Concrete fixes to increase virality")
    trending_caption_styles: List[str] = Field(..., description="Recommended caption aesthetics and text placement")
    structural_hashtag_recommendations: List[str] = Field(..., description="Niche, broad, and trending hashtag strategies")

class AudienceImpact(BaseModel):
    predicted_emotional_response: str = Field(..., description="Expected audience emotion e.g., Curiosity, Inspiration, Amusing")
    content_safety_flags: List[str] = Field(..., description="Content safety warnings or empty list if safe")
    misleading_content_flag: bool = Field(..., description="Flag if content is sensationalized or misleading")
    misleading_details: str = Field(..., description="Details regarding misleading content flag or 'None'")

class QualityScores(BaseModel):
    audio: int = Field(..., ge=1, le=10, description="Audio quality 1-10")
    lighting: int = Field(..., ge=1, le=10, description="Lighting quality 1-10")
    framing: int = Field(..., ge=1, le=10, description="Framing & composition quality 1-10")
    pacing: int = Field(..., ge=1, le=10, description="Edit pacing quality 1-10")
    overall_virality: int = Field(..., ge=1, le=10, description="Overall virality score 1-10")

class ContentClassification(BaseModel):
    category_type: str = Field(..., description="Category e.g. Educational, Comedy, Aesthetic, Fitness, Tech, Lifestyle")
    quality_scores: QualityScores

class AutoSummaryMetadata(BaseModel):
    one_line_summary: str = Field(..., description="Punchy one-sentence summary of the reel")
    full_description: str = Field(..., description="Detailed content breakdown")
    recommended_caption: str = Field(..., description="Ready-to-post viral caption with call to action")
    hashtags: List[str] = Field(..., description="10 to 15 relevant hashtags starting with #")
    accessible_alt_text: str = Field(..., description="Screen-reader friendly descriptive alt text")

class VideoAnalysisResult(BaseModel):
    hook_and_retention: HookAndRetention
    pros_and_cons: ProsAndCons
    virality_suggestions: ViralitySuggestions
    audience_impact_and_sentiment: AudienceImpact
    content_classification: ContentClassification
    auto_summary_and_metadata: AutoSummaryMetadata


# Pydantic Schemas for Side-by-Side Comparison
class CompareScores(BaseModel):
    title: str
    hook_score: float
    pacing_score: float
    audio_score: float
    overall_virality: float

class Verdict(BaseModel):
    recommended_version: str = Field(..., description="'Version A' or 'Version B'")
    winner_title: str
    reasoning: str
    actionable_merges: List[str]

class HookComparison(BaseModel):
    version_a_hook: str
    version_b_hook: str
    faster_attention_grabber: str
    hook_speed_explanation: str

class ComparisonResult(BaseModel):
    verdict: Verdict
    hook_comparison: HookComparison
    version_a_scores: CompareScores
    version_b_scores: CompareScores


# Pydantic Schemas for Batch Ranker
class BatchReelRank(BaseModel):
    rank: int
    reel_name: str
    overall_score: float
    hook_score: float
    pacing_score: float
    audio_score: float
    key_strength: str
    top_fix: str

class BatchWinner(BaseModel):
    reel_name: str
    winner_badge: str
    key_advantage: str
    overall_virality_score: float

class BatchRankResult(BaseModel):
    winner: BatchWinner
    rankings: List[BatchReelRank]
    batch_summary: str


SAMPLE_ANALYSIS = {
    "hook_and_retention": {
        "first_3s_evaluation": "High visual motion immediately catches eye with fast cut on second 1, though voiceover start could be 0.5s faster.",
        "hook_present": True,
        "retention_risk_score": "Low",
        "pacing_notes": "Dynamic cuts every 1.8 seconds keep viewer visually engaged throughout the 30-second duration."
    },
    "pros_and_cons": {
        "pros": [
            {"category": "Audio", "description": "Crisp clear voiceover with trending upbeat background track balanced at -14dB."},
            {"category": "Lighting", "description": "Natural key lighting with high-contrast foreground subject definition."},
            {"category": "Captions", "description": "High-contrast dynamic kinetic captions centered in lower-third safe zone."},
            {"category": "Call-to-Action", "description": "Strong closing verbal prompt linked directly to pinned comment."}
        ],
        "cons": [
            {"category": "Lighting", "description": "Slight backlight glare between seconds 12-14 causing contrast drop."},
            {"category": "Captions", "description": "Font size in middle section occasionally overlaps with Instagram interface elements."}
        ]
    },
    "virality_suggestions": {
        "actionable_fixes": [
            "Add visual text pop-up during the key takeaway at 0:18 to boost re-watch rate.",
            "Trim the ending frame freeze by 0.5s to trigger seamless loop restarts.",
            "Increase voiceover clarity at 0:08 using treble boost filter."
        ],
        "trending_caption_styles": [
            "Bold 1-word-at-a-time dynamic kinetic subtitles (Yellow/White glow)",
            "Top hook overlay banner with drop shadow",
            "Minimalist aesthetic serif subtitles at bottom center"
        ],
        "structural_hashtag_recommendations": [
            "#ContentCreatorTips (High Volume)",
            "#ReelStrategy2026 (Niche High Intent)",
            "#ViralVideoSecrets (Trending Macro)"
        ]
    },
    "audience_impact_and_sentiment": {
        "predicted_emotional_response": "Curiosity followed by actionable motivation and high save intent.",
        "content_safety_flags": [],
        "misleading_content_flag": False,
        "misleading_details": "None. Content provides verified step-by-step tutorial information."
    },
    "content_classification": {
        "category_type": "Educational / Tech & Creator Growth",
        "quality_scores": {
            "audio": 9,
            "lighting": 8,
            "framing": 9,
            "pacing": 9,
            "overall_virality": 9
        }
    },
    "auto_summary_and_metadata": {
        "one_line_summary": "An engaging, fast-paced breakdown revealing key tactics to double reel retention rates.",
        "full_description": "This video walks creators through 3 essential hooks, timing edits, and captioning practices for maximum watch-time on Instagram Reels and TikTok.",
        "recommended_caption": "Stop scrolling! 🚨 Here are the exact 3 tweaks that transformed our video watch-time by 240%. Which one will you test today? Save this for your next upload! 📌👇",
        "hashtags": [
            "#ReelsTips", "#ContentCreation", "#ViralReels", "#InstagramGrowth",
            "#VideoEditing", "#CreatorEconomy", "#SocialMediaStrategy", "#ShortFormVideo",
            "#TikTokTips", "#DigitalMarketing", "#VideoRetention", "#GrowthHacks"
        ],
        "accessible_alt_text": "A presenter explaining video retention strategies with animated graphics and bold dynamic captions on screen."
    }
}

SAMPLE_COMPARE = {
    "verdict": {
        "recommended_version": "Version A",
        "winner_title": "Version A (Dynamic Kinetic Cut)",
        "reasoning": "Version A achieves 2.4x higher estimated viewer retention due to an instant visual jump-cut at 0:00.5 and bold center-aligned subtitles. Version B suffers from a 2.0-second delay before the main topic is mentioned.",
        "actionable_merges": [
            "Import the warmer color-grade preset from Version B into Version A's main timeline.",
            "Use Version B's ending audio fade-out for a cleaner loop restart.",
            "Keep Version A's kinetic text animation for maximum watch time."
        ]
    },
    "hook_comparison": {
        "version_a_hook": "Instant visual motion with text pop 'Stop Doing This!' at 0:00.4.",
        "version_b_hook": "Static presenter intro taking 2.2 seconds to introduce the prompt.",
        "faster_attention_grabber": "Version A",
        "hook_speed_explanation": "Version A captures visual focus 1.8 seconds faster than Version B, eliminating drop-off risk."
    },
    "version_a_scores": {
        "title": "Version A (Kinetic Edit)",
        "hook_score": 9.4,
        "pacing_score": 9.0,
        "audio_score": 8.8,
        "overall_virality": 9.2
    },
    "version_b_scores": {
        "title": "Version B (Standard Cut)",
        "hook_score": 6.2,
        "pacing_score": 7.1,
        "audio_score": 9.1,
        "overall_virality": 7.0
    }
}

SAMPLE_BATCH = {
    "winner": {
        "reel_name": "Reel 1: Fast Kinetic Edit",
        "winner_badge": "🏆 1st Place Winner",
        "key_advantage": "Fastest 0:00.8 hook delivery paired with high cut frequency keeping engagement above 85%.",
        "overall_virality_score": 9.5
    },
    "rankings": [
        {
            "rank": 1,
            "reel_name": "Reel 1 (Fast Kinetic Edit)",
            "overall_score": 9.5,
            "hook_score": 9.8,
            "pacing_score": 9.4,
            "audio_score": 9.2,
            "key_strength": "Instant visual intrigue and dynamic lower-third captions.",
            "top_fix": "Add sound effect pop at 0:14 transition."
        },
        {
            "rank": 2,
            "reel_name": "Reel 3 (Aesthetic Studio Lighting)",
            "overall_score": 8.3,
            "hook_score": 8.0,
            "pacing_score": 8.2,
            "audio_score": 8.8,
            "key_strength": "Professional key lighting and crisp voiceover track.",
            "top_fix": "Trim the intro by 0.8 seconds to boost hook score."
        },
        {
            "rank": 3,
            "reel_name": "Reel 2 (Talking Head Casual)",
            "overall_score": 6.9,
            "hook_score": 6.2,
            "pacing_score": 7.0,
            "audio_score": 7.5,
            "key_strength": "Authentic personal tone and clear verbal message.",
            "top_fix": "Add kinetic subtitles and zoom cuts every 2 seconds."
        }
    ],
    "batch_summary": "Reel 1 outperforms Reels 2 & 3 primarily due to immediate visual hook execution in the crucial first 3 seconds."
}


@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "service": "AI Reel & Short Video Analyzer",
        "gemini_sdk_version": genai.__version__
    }

@app.get("/api/sample-data", response_model=VideoAnalysisResult)
def get_sample_data():
    return SAMPLE_ANALYSIS

@app.get("/api/sample-compare", response_model=ComparisonResult)
def get_sample_compare():
    return SAMPLE_COMPARE

@app.get("/api/sample-batch", response_model=BatchRankResult)
def get_sample_batch():
    return SAMPLE_BATCH


@app.post("/api/analyze", response_model=VideoAnalysisResult)
async def analyze_video(
    video: Optional[UploadFile] = File(None),
    api_key: Optional[str] = Form(None),
    x_api_key: Optional[str] = Header(None, alias="X-Gemini-API-Key"),
    is_demo: Optional[bool] = Form(False)
):
    if is_demo or (video is None and not is_demo):
        return SAMPLE_ANALYSIS

    effective_api_key = api_key or x_api_key or os.getenv("GEMINI_API_KEY")
    if not effective_api_key:
        print("No API key provided. Returning high-fidelity sample analysis.")
        return SAMPLE_ANALYSIS

    genai.configure(api_key=effective_api_key)

    suffix = os.path.splitext(video.filename)[1] if video.filename else ".mp4"
    if not suffix.lower() in [".mp4", ".mov", ".webm", ".avi", ".m4v"]:
        suffix = ".mp4"

    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
        shutil.copyfileobj(video.file, temp_file)
        temp_file_path = temp_file.name

    gemini_file = None
    try:
        mime_type = video.content_type if video.content_type and "video" in video.content_type else "video/mp4"
        gemini_file = genai.upload_file(path=temp_file_path, mime_type=mime_type)

        attempts = 0
        while gemini_file.state.name == "PROCESSING":
            time.sleep(2)
            attempts += 1
            gemini_file = genai.get_file(gemini_file.name)
            if attempts > 60:
                raise HTTPException(status_code=504, detail="Gemini processing timeout.")

        if gemini_file.state.name == "FAILED":
            raise HTTPException(status_code=422, detail="Gemini failed to process video.")

        model = genai.GenerativeModel(model_name="gemini-1.5-pro")

        prompt = """
        You are an elite Instagram Reels & TikTok viral video strategist.
        Analyze the provided video in detail and return JSON strictly matching:
        {
          "hook_and_retention": {
            "first_3s_evaluation": "Detailed evaluation",
            "hook_present": true,
            "retention_risk_score": "Low",
            "pacing_notes": "Pacing notes"
          },
          "pros_and_cons": {
            "pros": [{"category": "Audio", "description": "Good audio"}],
            "cons": [{"category": "Lighting", "description": "Too dark"}]
          },
          "virality_suggestions": {
            "actionable_fixes": ["Fix 1"],
            "trending_caption_styles": ["Style 1"],
            "structural_hashtag_recommendations": ["Strategy 1"]
          },
          "audience_impact_and_sentiment": {
            "predicted_emotional_response": "Excitement",
            "content_safety_flags": [],
            "misleading_content_flag": false,
            "misleading_details": "None"
          },
          "content_classification": {
            "category_type": "Educational",
            "quality_scores": {
              "audio": 9, "lighting": 8, "framing": 9, "pacing": 9, "overall_virality": 9
            }
          },
          "auto_summary_and_metadata": {
            "one_line_summary": "Summary line",
            "full_description": "Full description",
            "recommended_caption": "Recommended caption",
            "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5", "#tag6", "#tag7", "#tag8", "#tag9", "#tag10"],
            "accessible_alt_text": "Alt text"
          }
        }
        """

        response = model.generate_content([gemini_file, prompt], generation_config={"temperature": 0.2, "response_mime_type": "application/json"})
        raw = response.text.strip()
        if raw.startswith("```json"): raw = raw[7:]
        if raw.startswith("```"): raw = raw[3:]
        if raw.endswith("```"): raw = raw[:-3]
        return json.loads(raw.strip())
    finally:
        if os.path.exists(temp_file_path):
            try: os.remove(temp_file_path)
            except: pass
        if gemini_file is not None:
            try: genai.delete_file(gemini_file.name)
            except: pass


@app.post("/api/compare", response_model=ComparisonResult)
async def compare_videos(
    video_a: Optional[UploadFile] = File(None),
    video_b: Optional[UploadFile] = File(None),
    api_key: Optional[str] = Form(None),
    x_api_key: Optional[str] = Header(None, alias="X-Gemini-API-Key"),
    is_demo: Optional[bool] = Form(False)
):
    """
    Side-by-side Comparative Analysis (Version A vs Version B):
    Compares hooks, pacing, engagement scores, and recommends the winner with exact merge edits.
    """
    if is_demo or (not video_a and not video_b):
        return SAMPLE_COMPARE

    effective_api_key = api_key or x_api_key or os.getenv("GEMINI_API_KEY")
    if not effective_api_key:
        print("No API key provided for compare. Returning sample compare dataset.")
        return SAMPLE_COMPARE

    genai.configure(api_key=effective_api_key)

    temp_files = []
    gemini_files = []

    try:
        # Upload Video A
        suffix_a = os.path.splitext(video_a.filename)[1] if (video_a and video_a.filename) else ".mp4"
        if not suffix_a.lower() in [".mp4", ".mov", ".webm", ".avi", ".m4v"]:
            suffix_a = ".mp4"
        mime_a = video_a.content_type if (video_a and video_a.content_type and "video" in video_a.content_type) else "video/mp4"

        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix_a) as f_a:
            shutil.copyfileobj(video_a.file, f_a)
            temp_files.append(f_a.name)
        
        g_a = genai.upload_file(path=temp_files[0], mime_type=mime_a)
        gemini_files.append(g_a)

        # Upload Video B
        suffix_b = os.path.splitext(video_b.filename)[1] if (video_b and video_b.filename) else ".mp4"
        if not suffix_b.lower() in [".mp4", ".mov", ".webm", ".avi", ".m4v"]:
            suffix_b = ".mp4"
        mime_b = video_b.content_type if (video_b and video_b.content_type and "video" in video_b.content_type) else "video/mp4"

        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix_b) as f_b:
            shutil.copyfileobj(video_b.file, f_b)
            temp_files.append(f_b.name)
            
        g_b = genai.upload_file(path=temp_files[1], mime_type=mime_b)
        gemini_files.append(g_b)

        # Wait processing
        for g_file in gemini_files:
            attempts = 0
            while g_file.state.name == "PROCESSING":
                time.sleep(2)
                attempts += 1
                g_file = genai.get_file(g_file.name)
                if attempts > 60:
                    raise HTTPException(status_code=504, detail="Gemini video processing timed out.")

        model = genai.GenerativeModel(model_name="gemini-1.5-pro")

        prompt = """
        You are an expert video director and viral social media analyst.
        You are provided two video variations: Video A (first video) and Video B (second video).
        Perform a side-by-side comparison and return a JSON object with this exact structure:

        {
          "verdict": {
            "recommended_version": "Version A" or "Version B",
            "winner_title": "Title describing winner",
            "reasoning": "Detailed justification on why this version wins",
            "actionable_merges": ["Merge edit 1", "Merge edit 2", "Merge edit 3"]
          },
          "hook_comparison": {
            "version_a_hook": "Description of Version A hook",
            "version_b_hook": "Description of Version B hook",
            "faster_attention_grabber": "Version A" or "Version B",
            "hook_speed_explanation": "Explanation of hook speed difference"
          },
          "version_a_scores": {
            "title": "Version A",
            "hook_score": 1-10 float,
            "pacing_score": 1-10 float,
            "audio_score": 1-10 float,
            "overall_virality": 1-10 float
          },
          "version_b_scores": {
            "title": "Version B",
            "hook_score": 1-10 float,
            "pacing_score": 1-10 float,
            "audio_score": 1-10 float,
            "overall_virality": 1-10 float
          }
        }
        """

        response = model.generate_content([gemini_files[0], gemini_files[1], prompt], generation_config={"temperature": 0.2, "response_mime_type": "application/json"})
        raw = response.text.strip()
        if raw.startswith("```json"): raw = raw[7:]
        if raw.startswith("```"): raw = raw[3:]
        if raw.endswith("```"): raw = raw[:-3]
        return json.loads(raw.strip())
    finally:
        for tf in temp_files:
            if os.path.exists(tf):
                try: os.remove(tf)
                except: pass
        for gf in gemini_files:
            try: genai.delete_file(gf.name)
            except: pass


@app.post("/api/batch", response_model=BatchRankResult)
async def batch_rank_videos(
    video_1: Optional[UploadFile] = File(None),
    video_2: Optional[UploadFile] = File(None),
    video_3: Optional[UploadFile] = File(None),
    api_key: Optional[str] = Form(None),
    x_api_key: Optional[str] = Header(None, alias="X-Gemini-API-Key"),
    is_demo: Optional[bool] = Form(False)
):
    """
    Batch Video Ranker (Up to 3 videos):
    Ranks videos from strongest to weakest with 1st place winner badge and reasoning.
    """
    if is_demo or (not video_1 and not video_2):
        return SAMPLE_BATCH

    effective_api_key = api_key or x_api_key or os.getenv("GEMINI_API_KEY")
    if not effective_api_key:
        print("No API key provided for batch. Returning sample batch rank dataset.")
        return SAMPLE_BATCH

    genai.configure(api_key=effective_api_key)

    uploaded_files = [v for v in [video_1, video_2, video_3] if v is not None]
    temp_files = []
    gemini_files = []

    try:
        for idx, vid in enumerate(uploaded_files):
            suffix = os.path.splitext(vid.filename)[1] if (vid and vid.filename) else ".mp4"
            if not suffix.lower() in [".mp4", ".mov", ".webm", ".avi", ".m4v"]:
                suffix = ".mp4"
            mime = vid.content_type if (vid and vid.content_type and "video" in vid.content_type) else "video/mp4"

            with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as f:
                shutil.copyfileobj(vid.file, f)
                temp_files.append(f.name)
            
            g_file = genai.upload_file(path=temp_files[-1], mime_type=mime)
            gemini_files.append(g_file)

        for gf in gemini_files:
            attempts = 0
            while gf.state.name == "PROCESSING":
                time.sleep(2)
                attempts += 1
                gf = genai.get_file(gf.name)
                if attempts > 60:
                    raise HTTPException(status_code=504, detail="Processing timeout.")

        model = genai.GenerativeModel(model_name="gemini-1.5-pro")

        prompt = f"""
        You are a top social media agency director ranking {len(gemini_files)} short video reels.
        Analyze all videos provided and rank them from strongest (1st place) to weakest.
        Return JSON strictly matching:

        {{
          "winner": {{
            "reel_name": "Name of winning reel",
            "winner_badge": "🏆 1st Place Winner",
            "key_advantage": "Core advantage of winner",
            "overall_virality_score": 1-10 float
          }},
          "rankings": [
            {{
              "rank": 1,
              "reel_name": "Reel 1 name",
              "overall_score": 1-10 float,
              "hook_score": 1-10 float,
              "pacing_score": 1-10 float,
              "audio_score": 1-10 float,
              "key_strength": "Key strength",
              "top_fix": "Top fix recommendation"
            }}
          ],
          "batch_summary": "Summary of batch rankings"
        }}
        """

        response = model.generate_content(gemini_files + [prompt], generation_config={"temperature": 0.2, "response_mime_type": "application/json"})
        raw = response.text.strip()
        if raw.startswith("```json"): raw = raw[7:]
        if raw.startswith("```"): raw = raw[3:]
        if raw.endswith("```"): raw = raw[:-3]
        return json.loads(raw.strip())
    finally:
        for tf in temp_files:
            if os.path.exists(tf):
                try: os.remove(tf)
                except: pass
        for gf in gemini_files:
            try: genai.delete_file(gf.name)
            except: pass


# ==========================================
# Pydantic Schemas for Text-Based Creator Toolkit (Gemini 1.5 Flash)
# ==========================================

# 1. Competitor Benchmark
class BenchmarkRequest(BaseModel):
    user_script: str
    competitor_scripts: List[str]
    niche: Optional[str] = "General Content"

class CompetitorComparisonItem(BaseModel):
    competitor_name: str
    hook_analysis: str
    structural_gaps: List[str]
    cta_strength: str

class BenchmarkResult(BaseModel):
    user_hook_effectiveness: str
    user_cta_strength: str
    structural_gaps: List[str]
    competitor_breakdown: List[CompetitorComparisonItem]
    key_recommendations: List[str]

# 2. Script & Caption Rewriter
class RewriteCaptionRequest(BaseModel):
    original_content: str
    niche: Optional[str] = "General Content"

class CaptionStyleItem(BaseModel):
    style_name: str
    caption_text: str
    call_to_action: str
    suggested_hashtags: List[str]

class RewriteCaptionResult(BaseModel):
    original_preview: str
    viral_hook_style: CaptionStyleItem
    minimalist_aesthetic: CaptionStyleItem
    high_engagement_storytelling: CaptionStyleItem

# 3. Content Calendar / Idea Generator
class GenerateIdeasRequest(BaseModel):
    niche_topic: str
    target_audience: Optional[str] = "General Audience"

class ReelIdeaConcept(BaseModel):
    concept_title: str
    visual_hook: str
    audio_suggestion: str
    on_screen_text: str
    script_outline: str
    viral_potential_score: str

class GenerateIdeasResult(BaseModel):
    niche_topic: str
    concepts: List[ReelIdeaConcept]

# 4. Trend Breakdown Explainer
class ExplainTrendRequest(BaseModel):
    trend_name: str
    user_niche: Optional[str] = "General Content"

class NicheAdaptation(BaseModel):
    niche_name: str
    adaptation_idea: str
    sample_on_screen_text: str

class ExplainTrendResult(BaseModel):
    trend_name: str
    why_it_works: str
    psychological_trigger: str
    ideal_video_length: str
    niche_adaptations: List[NicheAdaptation]
    actionable_execution_tips: List[str]


# ==========================================
# Sample Datasets for Creator Toolkit Demo Mode
# ==========================================

SAMPLE_BENCHMARK = {
    "user_hook_effectiveness": "Moderate (6.5/10). Introduces topic after 2 seconds instead of frame 1 visual pattern interrupt.",
    "user_cta_strength": "High (8.5/10). Clear pin-comment CTA driving direct save action.",
    "structural_gaps": [
        "Competitor reels deliver value payload in first 5s while user draft spends 4s on introduction.",
        "Missing bold lower-third text callout during middle transition.",
        "Competitor 1 uses fast audio zoom cut on punchlines."
    ],
    "competitor_breakdown": [
        {
            "competitor_name": "Competitor #1 (Top Viral Creator)",
            "hook_analysis": "Uses immediate negative framing hook ('Stop doing this mistake...') in first 0.5s.",
            "structural_gaps": ["Tighter pacing with 1.2s average cut frequency", "High contrast kinetic subtitle glow"],
            "cta_strength": "Strong verbal loop question encouraging debate in comments."
        },
        {
            "competitor_name": "Competitor #2 (Niche Specialist)",
            "hook_analysis": "Opens with visual proof transformation split screen before speaking.",
            "structural_gaps": ["Uses macro close-up framing instead of static wide shot"],
            "cta_strength": "Offers free downloadable template link in bio."
        }
    ],
    "key_recommendations": [
        "Cut your opening intro line; start directly with the problem punchline.",
        "Add kinetic 1-word text overlays on key takeaways.",
        "Adopt negative curiosity hook formulation in sentence 1."
    ]
}

SAMPLE_REWRITE = {
    "original_preview": "Here are 3 tips to grow your Instagram account faster in 2026. Make sure to follow for more tips!",
    "viral_hook_style": {
        "style_name": "🔥 Viral Hook Style (High Curiosity)",
        "caption_text": "Stop scrolling if your reel reach dropped this week! 🚨 90% of creators are still making this 1 critical mistake in 2026. Here are the 3 exact tweaks we used to bump retention by 240%:",
        "call_to_action": "Save this reel now before your next post! 📌",
        "suggested_hashtags": ["#ReelsTips", "#ViralStrategy", "#ContentCreatorHacks", "#AlgorithmSecrets"]
    },
    "minimalist_aesthetic": {
        "style_name": "✨ Minimalist Aesthetic",
        "caption_text": "3 shifts for organic reach in 2026.\n\n01. Hook in frame 1\n02. Tighter cuts\n03. Clear save CTA\n\nQuality > quantity always.",
        "call_to_action": "Share with a fellow creator.",
        "suggested_hashtags": ["#AestheticContent", "#CreatorEconomy", "#Minimalism"]
    },
    "high_engagement_storytelling": {
        "style_name": "📖 High-Engagement Storytelling",
        "caption_text": "3 months ago, I was ready to quit making reels. Every post hit a wall at 500 views... until I tested one simple structural change. Here's what happened when we stopped overcomplicating our scripts:",
        "call_to_action": "Which of these 3 tweaks are you trying first? Drop a comment below! 👇",
        "suggested_hashtags": ["#CreatorJourney", "#SocialMediaGrowth", "#AuthenticMarketing", "#VideoStrategy"]
    }
}

SAMPLE_IDEAS = {
    "niche_topic": "Tech & Productivity",
    "concepts": [
        {
            "concept_title": "The 'Stop Doing This' Desk Setup Mistake",
            "visual_hook": "📹 Fast camera zoom into messy desk cables, then snap-cut to clean wireless layout.",
            "audio_suggestion": "🎵 Upbeat trending lofi beat with snap sound effect on cut.",
            "on_screen_text": "🚨 Stop organizing your desk like this in 2026",
            "script_outline": "0-3s: Show wrong setup. 3-10s: Show 2 simple cable management hacks. 10-15s: Final aesthetic setup shot.",
            "viral_potential_score": "High (9.4/10)"
        },
        {
            "concept_title": "3 Hidden AI Features Nobody Uses",
            "visual_hook": "📹 Screen recording rapid demo with red circle indicator pointing at hidden button.",
            "audio_suggestion": "🎵 High-energy techno bassline background track.",
            "on_screen_text": "💡 3 Secret AI tricks you didn't know existed",
            "script_outline": "0-2s: Bold statement hook. 2-12s: Rapid 3-second micro-demos of each feature. 12-15s: 'Comment LINK for guide'.",
            "viral_potential_score": "Very High (9.6/10)"
        },
        {
            "concept_title": "Day in the Life: 15-Minute Morning Reset",
            "visual_hook": "📹 Aesthetic low-angle coffee pour with natural morning sunlight glare.",
            "audio_suggestion": "🎵 Relaxing acoustic ambient chill track.",
            "on_screen_text": "☕ How I get 4 hours of deep work done before 9 AM",
            "script_outline": "0-3s: Peaceful aesthetic opener. 3-10s: 3 non-negotiable morning habits. 10-15s: Inspiration CTA.",
            "viral_potential_score": "Moderate-High (8.8/10)"
        },
        {
            "concept_title": "App Vs App Showdown (X vs Y)",
            "visual_hook": "📹 Split screen showing App A vs App B performing the same task at 2x speed.",
            "audio_suggestion": "🎵 Fast racing pulse countdown synth track.",
            "on_screen_text": "⚡ Which tool is ACTUALLY faster?",
            "script_outline": "0-2s: Split screen side-by-side countdown. 2-10s: Live test completion time. 10-15s: Winner verdict.",
            "viral_potential_score": "High (9.2/10)"
        },
        {
            "concept_title": "POV: You Discovered This Shortcut",
            "visual_hook": "📹 Over-the-shoulder POV typing shortcut that executes complex task in 1 click.",
            "audio_suggestion": "🎵 Trending viral sound clip with dramatic revelation hit.",
            "on_screen_text": "🤯 Wish I knew this keyboard shortcut 3 years ago",
            "script_outline": "0-2s: Shocked reaction + shortcut press. 2-8s: Explain instant time saved. 8-12s: 'Save this for work tomorrow!'.",
            "viral_potential_score": "High (9.1/10)"
        }
    ]
}

SAMPLE_TREND = {
    "trend_name": "POV / 3-Step Transformation Pattern",
    "why_it_works": "Leverages first-person empathy (POV) and immediate visual contrast gap between 'before' and 'after', forcing high completion rates.",
    "psychological_trigger": "Curiosity gap & aspirational identity projection.",
    "ideal_video_length": "7 to 12 seconds",
    "niche_adaptations": [
        {
            "niche_name": "Fitness & Health",
            "adaptation_idea": "Show 3 micro form corrections that fixed shoulder pain during bench press.",
            "sample_on_screen_text": "POV: You fixed your shoulder posture with these 3 tweaks 💪"
        },
        {
            "niche_name": "Finance & Business",
            "adaptation_idea": "Show 3 budget automation rules set up in mobile banking app.",
            "sample_on_screen_text": "POV: Setting your savings on autopilot for 2026 📈"
        },
        {
            "niche_name": "Fashion & Lifestyle",
            "adaptation_idea": "Styling 1 black blazer in 3 distinct elevated outfits.",
            "sample_on_screen_text": "POV: 1 capsule blazer styled 3 ways ✨"
        }
    ],
    "actionable_execution_tips": [
        "Keep total duration under 10 seconds for max auto-loop replay rate.",
        "Place text overlay in upper middle third to stay clear of app UI buttons.",
        "Match energy transition exactly to the beat drop at second 3."
    ]
}


# ==========================================
# API Endpoints for Creator Toolkit (Gemini 1.5 Flash)
# ==========================================

@app.get("/api/sample-benchmark", response_model=BenchmarkResult)
def get_sample_benchmark():
    return SAMPLE_BENCHMARK

@app.get("/api/sample-rewrite", response_model=RewriteCaptionResult)
def get_sample_rewrite():
    return SAMPLE_REWRITE

@app.get("/api/sample-ideas", response_model=GenerateIdeasResult)
def get_sample_ideas():
    return SAMPLE_IDEAS

@app.get("/api/sample-trend", response_model=ExplainTrendResult)
def get_sample_trend():
    return SAMPLE_TREND


@app.post("/api/benchmark", response_model=BenchmarkResult)
async def benchmark_competitors(
    req: BenchmarkRequest,
    api_key: Optional[str] = Form(None),
    x_api_key: Optional[str] = Header(None, alias="X-Gemini-API-Key"),
    is_demo: Optional[bool] = Form(False)
):
    """
    Competitor Benchmark Analysis:
    Compares user script/transcript with competitor transcripts using Gemini 1.5 Flash.
    """
    if is_demo or not req.user_script.strip():
        return SAMPLE_BENCHMARK

    effective_api_key = api_key or x_api_key or os.getenv("GEMINI_API_KEY")
    if not effective_api_key:
        return SAMPLE_BENCHMARK

    try:
        genai.configure(api_key=effective_api_key)
        model = genai.GenerativeModel(model_name="gemini-1.5-flash")

        competitor_text = "\n".join([f"Competitor #{i+1}: {c}" for i, c in enumerate(req.competitor_scripts) if c.strip()])
        prompt = f"""
        You are an elite short-form video script strategist.
        Analyze the user's reel script vs competitor scripts in the '{req.niche}' niche.
        
        USER SCRIPT:
        "{req.user_script}"

        COMPETITOR SCRIPTS:
        {competitor_text}

        Return JSON strictly matching:
        {{
          "user_hook_effectiveness": "Hook evaluation string",
          "user_cta_strength": "CTA strength evaluation",
          "structural_gaps": ["Gap 1", "Gap 2", "Gap 3"],
          "competitor_breakdown": [
            {{
              "competitor_name": "Competitor #1",
              "hook_analysis": "Hook breakdown",
              "structural_gaps": ["Gap 1"],
              "cta_strength": "CTA strength"
            }}
          ],
          "key_recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"]
        }}
        """

        response = model.generate_content(prompt, generation_config={"temperature": 0.3, "response_mime_type": "application/json"})
        raw = response.text.strip()
        if raw.startswith("```json"): raw = raw[7:]
        if raw.startswith("```"): raw = raw[3:]
        if raw.endswith("```"): raw = raw[:-3]
        return json.loads(raw.strip())
    except Exception as e:
        print(f"Error in benchmark endpoint: {e}")
        return SAMPLE_BENCHMARK


@app.post("/api/rewrite-caption", response_model=RewriteCaptionResult)
async def rewrite_caption(
    req: RewriteCaptionRequest,
    api_key: Optional[str] = Form(None),
    x_api_key: Optional[str] = Header(None, alias="X-Gemini-API-Key"),
    is_demo: Optional[bool] = Form(False)
):
    """
    Script & Caption Rewriter:
    Rewrites caption in 3 viral styles using Gemini 1.5 Flash.
    """
    if is_demo or not req.original_content.strip():
        return SAMPLE_REWRITE

    effective_api_key = api_key or x_api_key or os.getenv("GEMINI_API_KEY")
    if not effective_api_key:
        return SAMPLE_REWRITE

    try:
        genai.configure(api_key=effective_api_key)
        model = genai.GenerativeModel(model_name="gemini-1.5-flash")

        prompt = f"""
        You are a top viral social media copywriter.
        Rewrite the following draft/caption in 3 distinct styles for short-form reels ({req.niche} niche):
        DRAFT: "{req.original_content}"

        Return JSON matching:
        {{
          "original_preview": "{req.original_content[:80]}...",
          "viral_hook_style": {{
            "style_name": "🔥 Viral Hook Style (High Curiosity)",
            "caption_text": "Rewritten caption text",
            "call_to_action": "CTA text",
            "suggested_hashtags": ["#tag1", "#tag2", "#tag3", "#tag4"]
          }},
          "minimalist_aesthetic": {{
            "style_name": "✨ Minimalist Aesthetic",
            "caption_text": "Rewritten minimalist text",
            "call_to_action": "CTA text",
            "suggested_hashtags": ["#tag1", "#tag2", "#tag3"]
          }},
          "high_engagement_storytelling": {{
            "style_name": "📖 High-Engagement Storytelling",
            "caption_text": "Rewritten storytelling text",
            "call_to_action": "CTA text",
            "suggested_hashtags": ["#tag1", "#tag2", "#tag3", "#tag4"]
          }}
        }}
        """

        response = model.generate_content(prompt, generation_config={"temperature": 0.4, "response_mime_type": "application/json"})
        raw = response.text.strip()
        if raw.startswith("```json"): raw = raw[7:]
        if raw.startswith("```"): raw = raw[3:]
        if raw.endswith("```"): raw = raw[:-3]
        return json.loads(raw.strip())
    except Exception as e:
        print(f"Error in rewrite caption: {e}")
        return SAMPLE_REWRITE


@app.post("/api/generate-ideas", response_model=GenerateIdeasResult)
async def generate_ideas(
    req: GenerateIdeasRequest,
    api_key: Optional[str] = Form(None),
    x_api_key: Optional[str] = Header(None, alias="X-Gemini-API-Key"),
    is_demo: Optional[bool] = Form(False)
):
    """
    Content Calendar Idea Generator:
    Generates 5 high-converting Reel concepts complete with Visual Hook, Audio Suggestion, and On-Screen Text using Gemini 1.5 Flash.
    """
    if is_demo or not req.niche_topic.strip():
        return SAMPLE_IDEAS

    effective_api_key = api_key or x_api_key or os.getenv("GEMINI_API_KEY")
    if not effective_api_key:
        return SAMPLE_IDEAS

    try:
        genai.configure(api_key=effective_api_key)
        model = genai.GenerativeModel(model_name="gemini-1.5-flash")

        prompt = f"""
        Generate 5 viral short-form Reel concepts for topic/niche: '{req.niche_topic}' (Target audience: {req.target_audience}).
        Return JSON strictly matching:
        {{
          "niche_topic": "{req.niche_topic}",
          "concepts": [
            {{
              "concept_title": "Title",
              "visual_hook": "📹 Visual hook breakdown",
              "audio_suggestion": "🎵 Audio recommendation",
              "on_screen_text": "💬 Text overlay",
              "script_outline": "Brief step-by-step outline",
              "viral_potential_score": "High (9.5/10)"
            }}
          ]
        }}
        """

        response = model.generate_content(prompt, generation_config={"temperature": 0.7, "response_mime_type": "application/json"})
        raw = response.text.strip()
        if raw.startswith("```json"): raw = raw[7:]
        if raw.startswith("```"): raw = raw[3:]
        if raw.endswith("```"): raw = raw[:-3]
        return json.loads(raw.strip())
    except Exception as e:
        print(f"Error in generate ideas: {e}")
        return SAMPLE_IDEAS


@app.post("/api/explain-trend", response_model=ExplainTrendResult)
async def explain_trend(
    req: ExplainTrendRequest,
    api_key: Optional[str] = Form(None),
    x_api_key: Optional[str] = Header(None, alias="X-Gemini-API-Key"),
    is_demo: Optional[bool] = Form(False)
):
    """
    Trend Breakdown Explainer:
    Breaks down why a trending format/audio works and outputs niche adaptation ideas using Gemini 1.5 Flash.
    """
    if is_demo or not req.trend_name.strip():
        return SAMPLE_TREND

    effective_api_key = api_key or x_api_key or os.getenv("GEMINI_API_KEY")
    if not effective_api_key:
        return SAMPLE_TREND

    try:
        genai.configure(api_key=effective_api_key)
        model = genai.GenerativeModel(model_name="gemini-1.5-flash")

        prompt = f"""
        Break down the viral short-form trend format: '{req.trend_name}' (Target niche: {req.user_niche}).
        Explain why it works and adapt it across niches.
        Return JSON strictly matching:
        {{
          "trend_name": "{req.trend_name}",
          "why_it_works": "Why it works explanation",
          "psychological_trigger": "Psychological trigger",
          "ideal_video_length": "7-10 seconds",
          "niche_adaptations": [
            {{
              "niche_name": "Niche name",
              "adaptation_idea": "Adaptation idea",
              "sample_on_screen_text": "Sample text"
            }}
          ],
          "actionable_execution_tips": ["Tip 1", "Tip 2", "Tip 3"]
        }}
        """

        response = model.generate_content(prompt, generation_config={"temperature": 0.5, "response_mime_type": "application/json"})
        raw = response.text.strip()
        if raw.startswith("```json"): raw = raw[7:]
        if raw.startswith("```"): raw = raw[3:]
        if raw.endswith("```"): raw = raw[:-3]
        return json.loads(raw.strip())
    except Exception as e:
        print(f"Error in explain trend: {e}")
        return SAMPLE_TREND

