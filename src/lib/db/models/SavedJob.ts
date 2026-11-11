import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISavedJob extends Document<string> {
  _id: string;
  studentId: mongoose.Types.ObjectId | string;
  jobId: mongoose.Types.ObjectId | string;
  createdAt: Date;
}

const SavedJobSchema = new Schema<ISavedJob>(
  {
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    studentId: { type: Schema.Types.Mixed, required: true },
    jobId: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

SavedJobSchema.index({ studentId: 1, jobId: 1 }, { unique: true });

export const SavedJob: Model<ISavedJob> =
  mongoose.models.SavedJob || mongoose.model<ISavedJob>("SavedJob", SavedJobSchema);
