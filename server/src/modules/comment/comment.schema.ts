import { Schema, Document } from "mongoose";

export interface IReply {
  userId: string;
  username: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IComment extends Document {
  documentId: string;
  userId: string;
  username: string;
  content: string;
  selectionStart: number;
  selectionEnd: number;
  resolved: boolean;
  replies: IReply[];
  createdAt: Date;
  updatedAt: Date;
}

export const replySchema = new Schema<IReply>(
  {
    userId: { type: String, required: true },
    username: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export const commentSchema = new Schema<IComment>(
  {
    documentId: { type: String, required: true, index: true },
    userId: { type: String, required: true },
    username: { type: String, required: true },
    content: { type: String, required: true },
    selectionStart: { type: Number, required: true },
    selectionEnd: { type: Number, required: true },
    resolved: { type: Boolean, default: false },
    replies: [replySchema],
  },
  { timestamps: true }
);
