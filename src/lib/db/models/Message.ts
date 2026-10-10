import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMessage extends Document {
  conversationId: string;
  senderId: mongoose.Types.ObjectId | string;
  senderName: string;
  senderRole: "student" | "company" | "admin";
  recipientId: mongoose.Types.ObjectId | string;
  content: string;
  read: boolean;
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    conversationId: { type: String, required: true, index: true },
    senderId: { type: Schema.Types.Mixed, required: true },
    senderName: { type: String, required: true },
    senderRole: { type: String, required: true },
    recipientId: { type: Schema.Types.Mixed, required: true, index: true },
    content: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Message: Model<IMessage> =
  mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);
