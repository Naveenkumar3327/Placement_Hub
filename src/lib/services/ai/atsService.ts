import { AiProvider } from "./aiProvider";

export interface AtsAnalysisResult {
  overallScore: number;
  keywordMatch: number;
  skillsMatch: number;
  experienceMatch: number;
  formattingScore: number;
  detectedSkills: string[];
  missingKeywords: string[];
  missingSections: string[];
  actionVerbQuality: {
    score: number;
    strongVerbsFound: string[];
    suggestedVerbs: string[];
  };
  suggestions: {
    category: "skills" | "formatting" | "impact" | "keywords";
    issue: string;
    recommendation: string;
    severity: "high" | "medium" | "low";
  }[];
  summary: string;
  disclaimer: string;
}

const STRONG_ACTION_VERBS = [
  "architected", "developed", "orchestrated", "engineered", "implemented",
  "accelerated", "optimized", "spearheaded", "designed", "streamlined",
  "deployed", "refactored", "integrated", "automated", "mentored", "maximized"
];

const STANDARD_SECTIONS = [
  "experience", "work history", "education", "skills", "projects",
  "certifications", "contact", "summary", "objective"
];

const COMMON_TECH_KEYWORDS = [
  "react", "typescript", "javascript", "node.js", "next.js", "python", "sql",
  "mongodb", "postgresql", "docker", "aws", "git", "ci/cd", "rest api", "graphql",
  "tailwind", "html5", "css3", "microservices", "unit testing"
];

export class AtsService {
  public static async analyzeResume(
    resumeText: string,
    jobDescription?: string
  ): Promise<AtsAnalysisResult> {
    const textLower = resumeText.toLowerCase();

    // 1. Detect standard sections
    const foundSections: string[] = [];
    const missingSections: string[] = [];
    for (const section of STANDARD_SECTIONS) {
      if (textLower.includes(section)) {
        foundSections.push(section);
      } else if (["experience", "education", "skills", "projects"].includes(section)) {
        missingSections.push(section.charAt(0).toUpperCase() + section.slice(1));
      }
    }

    // 2. Detect strong action verbs
    const foundVerbs: string[] = [];
    for (const verb of STRONG_ACTION_VERBS) {
      if (textLower.includes(verb)) {
        foundVerbs.push(verb);
      }
    }

    // 3. Detect skills & keywords
    const detectedSkills: string[] = [];
    for (const kw of COMMON_TECH_KEYWORDS) {
      if (textLower.includes(kw)) {
        detectedSkills.push(kw.toUpperCase());
      }
    }

    // 4. Job description alignment if provided
    let jdKeywords: string[] = [];
    let missingKeywords: string[] = [];
    if (jobDescription) {
      const jdWords = jobDescription.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
      const wordFreq: Record<string, number> = {};
      for (const w of jdWords) {
        if (!["and", "the", "for", "with", "that", "this", "from", "have", "will"].includes(w)) {
          wordFreq[w] = (wordFreq[w] || 0) + 1;
        }
      }
      jdKeywords = Object.keys(wordFreq).sort((a, b) => wordFreq[b] - wordFreq[a]).slice(0, 15);
      missingKeywords = jdKeywords.filter((kw) => !textLower.includes(kw)).slice(0, 6);
    } else {
      missingKeywords = COMMON_TECH_KEYWORDS.filter((kw) => !textLower.includes(kw)).slice(0, 5);
    }

    // Calculate deterministic base metrics
    const formattingScore = Math.min(95, 60 + foundSections.length * 5);
    const verbScore = Math.min(95, 40 + foundVerbs.length * 8);
    const skillsMatch = Math.min(95, Math.max(50, detectedSkills.length * 6 + 30));
    const keywordMatch = Math.min(95, Math.max(55, 100 - missingKeywords.length * 8));
    const experienceMatch = textLower.includes("intern") || textLower.includes("engineer") || textLower.includes("developer") ? 84 : 70;

    const calculatedOverall = Math.round(
      keywordMatch * 0.25 + skillsMatch * 0.25 + experienceMatch * 0.2 + formattingScore * 0.15 + verbScore * 0.15
    );

    // Call LLM for rich personalized commentary
    let aiSummary = "";
    let aiSuggestions: any[] = [];

    const prompt = `You are a certified ATS (Applicant Tracking System) and Senior Technical Hiring Manager.
Analyze this resume extract against modern hiring criteria:
Resume text:
"""
${resumeText.slice(0, 3000)}
"""
${jobDescription ? `Target Job Description:\n"""\n${jobDescription.slice(0, 1500)}\n"""` : ""}

Respond with a JSON object containing:
- "summary": A 2-sentence executive critique of the candidate's ATS readiness.
- "suggestions": Array of objects with "category" ("skills"|"formatting"|"impact"|"keywords"), "issue", "recommendation", "severity" ("high"|"medium"|"low").`;

    try {
      const aiResponse = await AiProvider.generateText(prompt, { jsonMode: true, temperature: 0.3 });
      if (aiResponse) {
        const parsed = JSON.parse(aiResponse);
        if (parsed.summary) aiSummary = parsed.summary;
        if (Array.isArray(parsed.suggestions)) aiSuggestions = parsed.suggestions;
      }
    } catch (e) {
      // Fallback
    }

    // Default suggestions if LLM was unavailable or parsed empty
    if (aiSuggestions.length === 0) {
      aiSuggestions = [
        {
          category: "impact",
          issue: "Bullet points lack quantified business or performance impact metrics.",
          recommendation: "Use the Google XYZ formula: 'Accomplished [X] as measured by [Y], by doing [Z]'. Example: 'Reduced API latency by 35% by implementing Redis caching.'",
          severity: "high",
        },
        {
          category: "keywords",
          issue: `Missing critical industry keywords: ${missingKeywords.slice(0, 3).join(", ")}.`,
          recommendation: `Incorporate high-demand skills like ${missingKeywords.slice(0, 3).join(", ")} into your projects or skills section.`,
          severity: "medium",
        },
        {
          category: "skills",
          issue: "Skills section could group competencies into distinct categories (Frontend, Backend, DevOps, Tools).",
          recommendation: "Categorized skills help ATS parsers index competencies into relevant role queries accurately.",
          severity: "low",
        },
      ];
    }

    if (!aiSummary) {
      aiSummary = `The resume exhibits strong fundamental technical competencies with a ${calculatedOverall}/100 ATS compatibility rating. Elevating metric quantification and incorporating targeted keywords will significantly improve recruiter shortlist rates.`;
    }

    return {
      overallScore: calculatedOverall,
      keywordMatch,
      skillsMatch,
      experienceMatch,
      formattingScore,
      detectedSkills,
      missingKeywords,
      missingSections,
      actionVerbQuality: {
        score: verbScore,
        strongVerbsFound: foundVerbs,
        suggestedVerbs: STRONG_ACTION_VERBS.filter((v) => !foundVerbs.includes(v)).slice(0, 5),
      },
      suggestions: aiSuggestions,
      summary: aiSummary,
      disclaimer: "Estimated ATS compatibility score generated via multi-factor parsing heuristics and algorithmic job alignment. Real ATS algorithms vary across individual employer systems.",
    };
  }
}
