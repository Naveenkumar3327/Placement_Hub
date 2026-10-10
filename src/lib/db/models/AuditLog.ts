import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAuditLog extends Document {
  actorId: mongoose.Types.ObjectId | string;
  actorEmail: string;
  actorRole: "student" | "company" | "admin";
  action: string;
  entity: "User" | "Job" | "Application" | "Interview" | "System";
  entityId?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    actorId: { type: Schema.Types.Mixed, required: true },
    actorEmail: { type: String, required: true },
    actorRole: { type: String, required: true },
    action: { type: String, required: true },
    entity: {
      type: String,
      enum: ["User", "Job", "Application", "Interview", "System"],
      required: true,
    },
    entityId: { type: String },
    metadata: { type: Schema.Types.Mixed, default: {} },
    ipAddress: { type: String, default: "" },
  },
  { timestamps: true }
);

export const AuditLog: Model<IAuditLog> =
  mongoose.models.AuditLog || mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);
