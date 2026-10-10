import mongoose, { Schema, Document, Model } from "mongoose";

export type ApplicationStatus =
  | "Applied"
  | "Under Review"
  | "Shortlisted"
  | "Interview Scheduled"
  | "Interview Completed"
  | "Selected"
  | "Rejected"
  | "Withdrawn";

export interface IApplication extends Document {
  jobId: mongoose.Types.ObjectId | string;
  studentId: mongoose.Types.ObjectId | string;
  companyId: mongoose.Types.ObjectId | string;
  jobTitle: string;
  companyName: string;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  resumeUrl?: string;
  coverLetter?: string;
  status: ApplicationStatus;
  aiMatchScore: number;
  aiMatchDetails?: {
    overallScore: number;
    skillsScore: number;
    experienceScore: number;
    educationScore: number;
    matchedSkills: string[];
    missingSkills: string[];
    explanation: string;
  };
  notes?: string;
  interviewDetails?: {
    scheduledDate: Date;
    roundName: string;
    meetingLink?: string;
    interviewerName?: string;
    instructions?: string;
  };
  appliedDate: Date;
  updatedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    jobId: { type: Schema.Types.Mixed, required: true },
    studentId: { type: Schema.Types.Mixed, required: true },
    companyId: { type: Schema.Types.Mixed, required: true },
    jobTitle: { type: String, required: true },
    companyName: { type: String, required: true },
    studentName: { type: String, required: true },
    studentEmail: { type: String, required: true },
    studentPhone: { type: String, default: "" },
    resumeUrl: { type: String, default: "" },
    coverLetter: { type: String, default: "" },
    status: {
      type: String,
      enum: [
        "Applied",
        "Under Review",
        "Shortlisted",
        "Interview Scheduled",
        "Interview Completed",
        "Selected",
        "Rejected",
        "Withdrawn",
      ],
      default: "Applied",
    },
    aiMatchScore: { type: Number, default: 75 },
    aiMatchDetails: {
      overallScore: Number,
      skillsScore: Number,
      experienceScore: Number,
      educationScore: Number,
      matchedSkills: [String],
      missingSkills: [String],
      explanation: String,
    },
    notes: { type: String, default: "" },
    interviewDetails: {
      scheduledDate: Date,
      roundName: String,
      meetingLink: String,
      interviewerName: String,
      instructions: String,
    },
    appliedDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Application: Model<IApplication> =
  mongoose.models.Application || mongoose.model<IApplication>("Application", ApplicationSchema);
