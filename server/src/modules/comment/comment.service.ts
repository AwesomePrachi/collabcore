import { Comment } from "./comment.model.js";
import { IComment, IReply } from "./comment.schema.js";

export const createComment = async (data: Partial<IComment>) => {
  const comment = new Comment(data);
  return await comment.save();
};

export const getCommentsByDocumentId = async (documentId: string) => {
  return await Comment.find({ documentId }).sort({ createdAt: 1 });
};

export const addReply = async (commentId: string, replyData: Partial<IReply>) => {
  const comment = await Comment.findById(commentId);
  if (!comment) throw new Error("Comment not found");
  
  comment.replies.push(replyData as IReply);
  return await comment.save();
};

export const resolveComment = async (commentId: string) => {
  return await Comment.findByIdAndUpdate(
    commentId, 
    { resolved: true },
    { new: true }
  );
};
