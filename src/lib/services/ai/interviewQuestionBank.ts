import dataset from "@/data/interview-questions.json";

export type QuestionCategory = "technical" | "behavioral" | "hr" | "system-design";

export interface InterviewQuestionItem {
  id: number;
  question: string;
  category: QuestionCategory;
  contextHint: string;
}

interface KaggleQuestion {
  id: number;
  question: string;
  answer: string;
  category: string;
  difficulty: string;
}

interface KaggleQuestionDataset {
  sourceName: string;
  sourceUrl: string;
  license: string;
  questions: KaggleQuestion[];
}

const questionDataset = dataset as KaggleQuestionDataset;

function normalizeCategory(category: string): QuestionCategory {
  const normalized = category.toLowerCase();
  if (normalized.includes("system design") || normalized.includes("distributed system")) {
    return "system-design";
  }
  if (normalized.includes("behavior")) return "behavioral";
  if (normalized.includes("human resource") || normalized === "hr") return "hr";
  return "technical";
}

export function getQuestionBankMetadata() {
  return {
    sourceName: questionDataset.sourceName,
    sourceUrl: questionDataset.sourceUrl,
    license: questionDataset.license,
    totalQuestions: questionDataset.questions.length,
  };
}

export function getQuestionBank(limit = 12, search = "", offset = 0) {
  const normalizedSearch = search.trim().toLowerCase();
  const questions = questionDataset.questions.filter((question) =>
    !normalizedSearch ||
    question.question.toLowerCase().includes(normalizedSearch) ||
    question.category.toLowerCase().includes(normalizedSearch)
  );

  return {
    ...getQuestionBankMetadata(),
    matchingQuestions: questions.length,
    questions: questions.slice(offset, offset + limit),
  };
}

export function getDatasetQuestions(
  count: number,
  difficulty: "junior" | "mid" | "senior",
  type: "technical" | "hr" | "behavioral" | "mixed"
): InterviewQuestionItem[] {
  const difficultyMatch: Record<typeof difficulty, RegExp> = {
    junior: /easy|beginner|medium/i,
    mid: /medium|intermediate/i,
    senior: /hard|advanced/i,
  };
  const categoryMatch: Partial<Record<typeof type, (category: QuestionCategory) => boolean>> = {
    technical: (category) => category === "technical" || category === "system-design",
    hr: (category) => category === "hr",
    behavioral: (category) => category === "behavioral",
  };

  const allQuestions = questionDataset.questions;
  const matchingType = type === "mixed"
    ? allQuestions
    : allQuestions.filter((question) => categoryMatch[type]?.(normalizeCategory(question.category)));
  const matchingDifficulty = matchingType.filter((question) => difficultyMatch[difficulty].test(question.difficulty));
  const source = matchingDifficulty.length >= count
    ? matchingDifficulty
    : matchingType.length >= count
      ? matchingType
      : allQuestions;
  const shuffled = [...source].sort(() => Math.random() - 0.5).slice(0, count);

  return shuffled.map((question, index) => ({
    id: index + 1,
    question: question.question,
    category: normalizeCategory(question.category),
    contextHint: `${question.category} · ${question.difficulty} level · Kaggle question bank`,
  }));
}
