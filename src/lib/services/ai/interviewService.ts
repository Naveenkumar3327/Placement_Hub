import { AiProvider } from "./aiProvider";

export interface InterviewQuestionItem {
  id: number;
  question: string;
  category: "technical" | "behavioral" | "hr" | "system-design";
  contextHint: string;
}

export interface AnswerEvaluationResult {
  score: number; // 0-100
  technicalScore: number;
  communicationScore: number;
  problemSolvingScore: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

export interface FinalInterviewReport {
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  problemSolvingScore: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  summary: string;
}

const DEFAULT_QUESTIONS_MAP: Record<string, InterviewQuestionItem[]> = {
  "Full Stack Developer": [
    {
      id: 1,
      question: "Explain the critical differences between client-side rendering (CSR) and server-side rendering (SSR). In what scenarios would you choose SSR or Static Site Generation (SSG) in Next.js?",
      category: "technical",
      contextHint: "Focus on SEO, initial page load latency, hydration, and TTFB.",
    },
    {
      id: 2,
      question: "How do you handle database connection pooling and prevent memory leaks in a stateless serverless Node.js backend environment?",
      category: "technical",
      contextHint: "Mention singleton connection caching, connection limits, and execution timeouts.",
    },
    {
      id: 3,
      question: "Tell me about a challenging bug you encountered in a recent project. How did you diagnose it, trace the root cause, and verify the fix?",
      category: "behavioral",
      contextHint: "Use the STAR method (Situation, Task, Action, Result) and state clear technical details.",
    },
    {
      id: 4,
      question: "Design an API rate limiter for a multi-tenant web application. What data structures or algorithms would you employ?",
      category: "system-design",
      contextHint: "Discuss Token Bucket, Leaky Bucket, or Redis sliding window counters.",
    },
    {
      id: 5,
      question: "Why are you interested in this position, and how do you prioritize work when multiple high-priority deliverables collide?",
      category: "hr",
      contextHint: "Convey enthusiasm, communication with stakeholders, and practical prioritization frameworks.",
    },
  ],
  "AI / Machine Learning Engineer": [
    {
      id: 1,
      question: "How does self-attention work in the Transformer architecture, and why does it overcome the bottleneck limitations of recurrent neural networks (RNNs)?",
      category: "technical",
      contextHint: "Discuss Query, Key, Value vectors, dot product scaling, and parallel training.",
    },
    {
      id: 2,
      question: "What strategies do you employ when fine-tuning a Large Language Model with limited GPU VRAM?",
      category: "technical",
      contextHint: "Mention LoRA, QLoRA, parameter-efficient fine tuning (PEFT), and 4-bit/8-bit quantization.",
    },
    {
      id: 3,
      question: "How do you evaluate and safeguard against hallucinations in a Retrieval-Augmented Generation (RAG) system?",
      category: "system-design",
      contextHint: "Discuss chunking strategies, cosine similarity thresholds, reranking, and ground truth benchmarks.",
    },
    {
      id: 4,
      question: "Describe a project where your initial model failed to generalize or overfitted. How did you resolve the problem?",
      category: "behavioral",
      contextHint: "Address cross-validation, regularization, data augmentation, and hyperparameter tuning.",
    },
    {
      id: 5,
      question: "How do you stay abreast of the rapid weekly advancements in generative AI research and open-source tooling?",
      category: "hr",
      contextHint: "Highlight ArXiv, GitHub repos, technical communities, and experimentation habits.",
    },
  ],
};

export class InterviewService {
  public static async generateQuestions(
    role: string,
    difficulty: "junior" | "mid" | "senior" = "mid",
    type: "technical" | "hr" | "behavioral" | "mixed" = "mixed",
    count: number = 5
  ): Promise<InterviewQuestionItem[]> {
    const prompt = `Generate exactly ${count} professional mock interview questions for a ${difficulty}-level candidate applying for "${role}".
Interview type focus: ${type}.
Return ONLY a valid JSON array of objects with keys:
- "id": number (1 to ${count})
- "question": string
- "category": ("technical" | "behavioral" | "hr" | "system-design")
- "contextHint": string (guidance on what a great answer covers)`;

    try {
      const response = await AiProvider.generateText(prompt, { jsonMode: true, temperature: 0.5 });
      if (response) {
        const parsed = JSON.parse(response);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.slice(0, count);
        }
        if (parsed.questions && Array.isArray(parsed.questions)) {
          return parsed.questions.slice(0, count);
        }
      }
    } catch (e) {
      // Fallback to pre-curated high quality bank
    }

    const defaultBank = DEFAULT_QUESTIONS_MAP[role] || DEFAULT_QUESTIONS_MAP["Full Stack Developer"];
    return defaultBank.slice(0, count);
  }

  public static async evaluateAnswer(
    question: string,
    category: string,
    userAnswer: string,
    targetRole: string
  ): Promise<AnswerEvaluationResult> {
    const words = userAnswer.trim().split(/\s+/).filter(Boolean).length;

    // Minimum baseline logic
    if (words < 10) {
      return {
        score: 35,
        technicalScore: 30,
        communicationScore: 40,
        problemSolvingScore: 35,
        feedback: "Your response is too brief. Provide in-depth technical explanation, architecture reasoning, and concrete practical examples.",
        strengths: ["Direct and concise start"],
        improvements: [
          "Elaborate on core engineering mechanisms",
          "Include real-world examples or metrics",
          "Structure response logically (Context -> Implementation -> Outcome)",
        ],
      };
    }

    const prompt = `You are a Principal Software Engineering Interviewer evaluating an answer for role "${targetRole}".
Question (${category}): "${question}"
Candidate Answer: "${userAnswer}"

Evaluate strictly and return JSON with keys:
- "score": number (0-100)
- "technicalScore": number (0-100)
- "communicationScore": number (0-100)
- "problemSolvingScore": number (0-100)
- "feedback": string (Constructive, specific 2-3 sentence review)
- "strengths": string[] (2 bullet points)
- "improvements": string[] (2 actionable recommendations)`;

    try {
      const response = await AiProvider.generateText(prompt, { jsonMode: true, temperature: 0.3 });
      if (response) {
        const parsed = JSON.parse(response);
        if (typeof parsed.score === "number") {
          return {
            score: Math.min(100, Math.max(10, parsed.score)),
            technicalScore: parsed.technicalScore || parsed.score,
            communicationScore: parsed.communicationScore || parsed.score,
            problemSolvingScore: parsed.problemSolvingScore || parsed.score,
            feedback: parsed.feedback || "Good response demonstrating relevant knowledge.",
            strengths: Array.isArray(parsed.strengths) ? parsed.strengths : ["Clear articulation"],
            improvements: Array.isArray(parsed.improvements) ? parsed.improvements : ["Add further technical nuance"],
          };
        }
      }
    } catch (e) {
      // Fallback heuristic scoring
    }

    // High quality deterministic evaluator fallback
    const techWords = ["architecture", "scale", "performance", "api", "database", "latency", "async", "component", "state", "cache"];
    const foundTechWords = techWords.filter((w) => userAnswer.toLowerCase().includes(w)).length;
    const baseScore = Math.min(92, Math.max(50, 55 + words * 0.25 + foundTechWords * 5));

    return {
      score: Math.round(baseScore),
      technicalScore: Math.round(Math.min(95, baseScore + (foundTechWords > 2 ? 5 : -5))),
      communicationScore: Math.round(Math.min(95, words > 40 ? 88 : 75)),
      problemSolvingScore: Math.round(baseScore),
      feedback: `Well-structured answer addressing key tenets of the prompt. Your explanation highlights practical familiarity with ${foundTechWords > 0 ? "core architectural concepts" : "the topic"} while maintaining clear articulation.`,
      strengths: [
        "Structured flow demonstrating logical thought progression",
        "Clear communication of key ideas without excessive jargon",
      ],
      improvements: [
        "Include quantifiable performance benchmarks or trade-offs considered",
        "Mention alternative solutions and why your chosen path was superior",
      ],
    };
  }

  public static generateFinalReport(evaluations: AnswerEvaluationResult[], targetRole: string): FinalInterviewReport {
    if (evaluations.length === 0) {
      return {
        overallScore: 0,
        technicalScore: 0,
        communicationScore: 0,
        problemSolvingScore: 0,
        strengths: [],
        weaknesses: [],
        recommendations: [],
        summary: "No questions completed.",
      };
    }

    const avgOverall = Math.round(evaluations.reduce((acc, e) => acc + e.score, 0) / evaluations.length);
    const avgTech = Math.round(evaluations.reduce((acc, e) => acc + e.technicalScore, 0) / evaluations.length);
    const avgComm = Math.round(evaluations.reduce((acc, e) => acc + e.communicationScore, 0) / evaluations.length);
    const avgProblem = Math.round(evaluations.reduce((acc, e) => acc + e.problemSolvingScore, 0) / evaluations.length);

    const allStrengths = evaluations.flatMap((e) => e.strengths);
    const allImprovements = evaluations.flatMap((e) => e.improvements);

    const uniqueStrengths = Array.from(new Set(allStrengths)).slice(0, 4);
    const uniqueWeaknesses = Array.from(new Set(allImprovements)).slice(0, 4);

    const recommendations = [
      `Practice explaining system trade-offs aloud with the STAR technique for ${targetRole} scenarios`,
      "Review edge case handling and data consistency in distributed environments",
      "Incorporate concrete metric outcomes (e.g., 'achieved 40% latency reduction')",
    ];

    return {
      overallScore: avgOverall,
      technicalScore: avgTech,
      communicationScore: avgComm,
      problemSolvingScore: avgProblem,
      strengths: uniqueStrengths,
      weaknesses: uniqueWeaknesses,
      recommendations,
      summary: `Completed mock interview for ${targetRole} with an overall score of ${avgOverall}/100. Technical accuracy scored ${avgTech}%, communication clarity scored ${avgComm}%, and problem-solving scored ${avgProblem}%.`,
    };
  }
}
