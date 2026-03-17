import mongoose from "mongoose";
import { IComment, commentSchema } from "./comment.schema.js";

export const Comment = mongoose.model<IComment>("Comment", commentSchema);
