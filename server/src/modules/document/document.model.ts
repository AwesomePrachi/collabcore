import mongoose, { Schema, Document } from "mongoose";
import { nanoid } from "nanoid";

export interface IDocument extends Document {
  publicId: string;
  title: string;
  content: string;
  ownerId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const documentSchema = new Schema<IDocument>(
  {
    publicId: {
      type: String,
      unique: true,
      default: () => nanoid(10), // short, shareable ID
    },
    title: {
      type: String,
      required: true,
      default: "Untitled Document",
    },
    content: {
      type: String,
      default: "",
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false, // Optional for backward compatibility with existing documents
    },
  },
  {
    timestamps: true,
  }
);

export const DocumentModel = mongoose.model<IDocument>(
  "Document",
  documentSchema
);