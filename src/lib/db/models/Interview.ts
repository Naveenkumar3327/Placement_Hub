import mongoose, { Schema, Document, Model } from "mongoose";

export interface IInterviewAnswer {
  questionId: number;
  question: string;
  category: "technical" | "behavioral" | "hr" | "system-design";
  userAnswer: string;
  feedback: string;
  score: number; // 0-100
  strengths: string[];
  improvements: string[];
}

export interface IInterview extends Document {
  studentId: mongoose.Types.ObjectId | string;
  studentName?: string;
  targetRole: string;
  difficulty: "junior" | "mid" | "senior";
  type: "technical" | "hr" | "behavioral" | "mixed";
  totalQuestions: number;
  completedQuestions: number;
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  problemSolvingScore: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  status: "in-progress" | "completed";
  questionsAndAnswers: IInterviewAnswer[];
  createdAt: Date;
  updatedAt: Date;
}

const InterviewSchema = new Schema<IInterview>(
  {
    studentId: { type: Schema.Types.Mixed, required: true },
    studentName: { type: String, default: "" },
    targetRole: { type: String, required: true },
    difficulty: { type: String, enum: ["junior", "mid", "senior"], default: "mid" },
    type: { type: String, enum: ["technical", "hr", "behavioral", "mixed"], default: "mixed" },
    totalQuestions: { type: Number, default: 5 },
    completedQuestions: { type: Number, default: 0 },
    overallScore: { type: Number, default: 0 },
    technicalScore: { type: Number, default: 0 },
    communicationScore: { type: Number, default: 0 },
    problemSolvingScore: { type: Number, default: 0 },
    strengths: { type: [String], default: [] },
    weaknesses: { type: [String], default: [] },
    recommendations: { type: [String], default: [] },
    status: { type: String, enum: ["in-progress", "completed"], default: "in-progress" },
    questionsAndAnswers: [
      {
        questionId: Number,
        question: String,
        category: String,
        userAnswer: String,
        feedback: String,
        score: Number,
        strengths: [String],
        improvements: [String],
      },
    ],
  },
  { timestamps: true }
);

export const Interview: Model<IInterview> =
  mongoose.models.Interview || mongoose.model<IInterview>("Interview", InterviewSchema);
