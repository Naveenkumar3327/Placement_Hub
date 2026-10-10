import mongoose, { Schema, Document, Model } from "mongoose";

export interface IJob extends Document {
  title: string;
  type: "full-time" | "internship" | "part-time" | "contract";
  description: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  experienceLevel: "entry" | "mid" | "senior" | "lead";
  minExperienceYears: number;
  salaryMin?: number;
  salaryMax?: number;
  salaryPeriod: "year" | "month";
  currency: string;
  location: string;
  workMode: "remote" | "hybrid" | "on-site";
  deadline: Date;
  openings: number;
  companyId: mongoose.Types.ObjectId | string;
  companyName: string;
  companyLogo?: string;
  department?: string;
  educationRequirements?: string;
  eligibilityCgpa?: number;
  status: "published" | "draft" | "closed";
  approvalStatus: "approved" | "pending" | "rejected";
  applicantsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ["full-time", "internship", "part-time", "contract"], required: true },
    description: { type: String, required: true },
    responsibilities: { type: [String], default: [] },
    requirements: { type: [String], default: [] },
    skills: { type: [String], default: [] },
    experienceLevel: { type: String, enum: ["entry", "mid", "senior", "lead"], default: "entry" },
    minExperienceYears: { type: Number, default: 0 },
    salaryMin: { type: Number },
    salaryMax: { type: Number },
    salaryPeriod: { type: String, enum: ["year", "month"], default: "year" },
    currency: { type: String, default: "INR" },
    location: { type: String, required: true },
    workMode: { type: String, enum: ["remote", "hybrid", "on-site"], default: "on-site" },
    deadline: { type: Date, required: true },
    openings: { type: Number, default: 1 },
    companyId: { type: Schema.Types.Mixed, required: true },
    companyName: { type: String, required: true },
    companyLogo: { type: String, default: "" },
    department: { type: String, default: "" },
    educationRequirements: { type: String, default: "B.Tech / B.E. / MCA / Equivalent" },
    eligibilityCgpa: { type: Number, default: 6.0 },
    status: { type: String, enum: ["published", "draft", "closed"], default: "published" },
    approvalStatus: { type: String, enum: ["approved", "pending", "rejected"], default: "approved" },
    applicantsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Job: Model<IJob> =
  mongoose.models.Job || mongoose.model<IJob>("Job", JobSchema);
