# AI Service Layer Architecture: CampusAI

## 1. Modular AI Architecture Overview

CampusAI separates all AI logic into a dedicated service layer (`src/lib/services/ai/`) instead of scattering raw LLM calls within React components.

```
                  ┌─────────────────────────────────┐
                  │          AiProvider             │
                  │   (Google Gemini / OpenAI)      │
                  └───────────────┬─────────────────┘
                                  │
         ┌────────────────────────┼────────────────────────┐
         ▼                        ▼                        ▼
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│   AtsService     │    │  MatcherService  │    │ InterviewService │
│ - ATS Scorer     │    │ - Skill Overlap  │    │ - Dynamic Q Gen  │
│ - Keyword Parser │    │ - Semantic Fit   │    │ - Real-time Eval │
│ - Action Verbs   │    │ - LLM Rationale  │    │ - Final Radar    │
└──────────────────┘    └──────────────────┘    └──────────────────┘
```

---

## 2. Supported LLM Providers & Configuration

Configuration is managed via standard environment variables:

```env
AI_PROVIDER=gemini        # "gemini" or "openai"
GEMINI_API_KEY=your_key   # When using Google Gemini 1.5 Flash
OPENAI_API_KEY=your_key   # When using OpenAI GPT-4o-mini
```

### Hybrid Deterministic Fallback Engine
When an API key is not supplied (e.g. offline testing, reviewer demonstrations), CampusAI seamlessly engages its built-in algorithmic engine:
- ATS scanning analyzes section presence, action verbs, keyword densities, and formatting heuristics.
- Resume matching computes set-theoretic skill intersections, academic cutoffs, and experience relevance.
- Mock interviews utilize a pre-curated bank of technical and behavioral questions with word-count and architectural keyword scoring.
- Skill gap analysis references benchmark taxonomies across Frontend, Backend, Database, Cloud/DevOps, and Core AI.

---

## 3. Core AI Modules

### 3.1 ATS Resume Auditor (`atsService.ts`)
1. **Section Discovery**: Identifies standard resume sections (Education, Skills, Experience, Projects).
2. **Action Verb Detection**: Matches strong action verbs (`architected`, `engineered`, `streamlined`).
3. **Keyword Density**: Detects presence of technical keywords and highlights missing industry requisites.
4. **Impact Analysis**: Critiques bullet points against the Google XYZ formula (`Accomplished [X] as measured by [Y], by doing [Z]`).
5. **ATS Compatibility Gauge**: Calculates 0-100 score with explicit non-binding heuristic disclaimer.

### 3.2 Semantic Resume-Job Matcher (`matcherService.ts`)
- **Formula**:
  $$\text{Match Score} = 0.40 \cdot \text{Skills} + 0.20 \cdot \text{Experience} + 0.15 \cdot \text{Education} + 0.15 \cdot \text{Projects} + 0.10 \cdot \text{Preferences}$$
- Outputs matched skills (green badges), missing skills (amber warnings), and a contextual AI explanation explaining the candidate's alignment.

### 3.3 AI Mock Interview Simulator (`interviewService.ts`)
- **Generation**: Role, difficulty (Junior/Mid/Senior), and category (Technical/HR/Behavioral) tailored questions.
- **Evaluation**: Per-answer feedback with technical precision score, communication score, and problem-solving depth.
- **Report**: Aggregated final report with strengths, weaknesses, and personalized improvement roadmap.

### 3.4 Skill Gap Engine (`skillGapService.ts`)
- Compares student profile against target job role benchmarks.
- Produces category coverage % (Frontend, Backend, Database, Cloud/DevOps).
- Generates a 4-week structured roadmap with weekly capstone project ideas and recognized certifications.
