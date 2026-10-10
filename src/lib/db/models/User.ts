import mongoose, { Schema, Document, Model } from "mongoose";

export type UserRole = "student" | "company" | "admin";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  avatarUrl?: string;
  isVerified: boolean;
  status: "active" | "suspended" | "pending";
  createdAt: Date;
  updatedAt: Date;

  // Student specific embedded / linked fields
  headline?: string;
  phone?: string;
  location?: string;
  bio?: string;
  department?: string;
  graduationYear?: number;
  cgpa?: number;
  skills: string[];
  education: Array<{
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startYear: number;
    endYear?: number;
    grade?: string;
  }>;
  experience: Array<{
    title: string;
    company: string;
    location?: string;
    startDate: string;
    endDate?: string;
    current?: boolean;
    description?: string;
  }>;
  projects: Array<{
    title: string;
    description: string;
    technologies: string[];
    link?: string;
    github?: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    issueDate?: string;
    credentialUrl?: string;
  }>;
  socialLinks?: {
    github?: string;
    linkedin?: string;
    portfolio?: string;
  };
  preferredRoles: string[];
  preferredLocations: string[];
  workModePreference?: "remote" | "hybrid" | "on-site" | "any";
  resumeUrl?: string;
  profileCompletion: number;

  // Company specific embedded fields
  companyName?: string;
  companyWebsite?: string;
  companySize?: string;
  industry?: string;
  companyDescription?: string;
  companyLogo?: string;
  companyLocation?: string;
  companyApproved?: boolean;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["student", "company", "admin"], required: true },
    avatarUrl: { type: String, default: "" },
    isVerified: { type: Boolean, default: true },
    status: { type: String, enum: ["active", "suspended", "pending"], default: "active" },

    // Student fields
    headline: { type: String, default: "" },
    phone: { type: String, default: "" },
    location: { type: String, default: "" },
    bio: { type: String, default: "" },
    department: { type: String, default: "" },
    graduationYear: { type: Number },
    cgpa: { type: Number },
    skills: { type: [String], default: [] },
    education: {
      type: [
        {
          institution: String,
          degree: String,
          fieldOfStudy: String,
          startYear: Number,
          endYear: Number,
          grade: String,
        },
      ],
      default: [],
    },
    experience: {
      type: [
        {
          title: String,
          company: String,
          location: String,
          startDate: String,
          endDate: String,
          current: Boolean,
          description: String,
        },
      ],
      default: [],
    },
    projects: {
      type: [
        {
          title: String,
          description: String,
          technologies: [String],
          link: String,
          github: String,
        },
      ],
      default: [],
    },
    certifications: {
      type: [
        {
          name: String,
          issuer: String,
          issueDate: String,
          credentialUrl: String,
        },
      ],
      default: [],
    },
    socialLinks: {
      github: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      portfolio: { type: String, default: "" },
    },
    preferredRoles: { type: [String], default: [] },
    preferredLocations: { type: [String], default: [] },
    workModePreference: { type: String, enum: ["remote", "hybrid", "on-site", "any"], default: "any" },
    resumeUrl: { type: String, default: "" },
    profileCompletion: { type: Number, default: 25 },

    // Company fields
    companyName: { type: String, default: "" },
    companyWebsite: { type: String, default: "" },
    companySize: { type: String, default: "" },
    industry: { type: String, default: "" },
    companyDescription: { type: String, default: "" },
    companyLogo: { type: String, default: "" },
    companyLocation: { type: String, default: "" },
    companyApproved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
