import mongoose, { Schema, Document, Model } from "mongoose";

export interface INotification extends Document {
  recipientId: mongoose.Types.ObjectId | string;
  senderId?: mongoose.Types.ObjectId | string;
  title: string;
  message: string;
  type:
    | "application_status"
    | "job_recommendation"
    | "interview_scheduled"
    | "resume_analysis"
    | "message_received"
    | "company_approval"
    | "system";
  link?: string;
  read: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    recipientId: { type: Schema.Types.Mixed, required: true },
    senderId: { type: Schema.Types.Mixed },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: [
        "application_status",
        "job_recommendation",
        "interview_scheduled",
        "resume_analysis",
        "message_received",
        "company_approval",
        "system",
      ],
      default: "system",
    },
    link: { type: String, default: "" },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Notification: Model<INotification> =
  mongoose.models.Notification ||
  mongoose.model<INotification>("Notification", NotificationSchema);
