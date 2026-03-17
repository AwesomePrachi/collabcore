import { useState } from "react";
import { type Comment, useCommentStore } from "../../../store/commentStore";
import { api } from "@/lib/api";
import { useUserIdentity } from "../hooks/useUserIdentity";
import CommentInput from "./CommentInput";
import { Editor } from "@tiptap/react";
import { socket } from "@/lib/socket";

export default function CommentThread({ comment, editor }: { comment: Comment, editor: Editor }) {
  const { identity: user } = useUserIdentity();
  const { addReply, resolveComment } = useCommentStore();
  const [showReply, setShowReply] = useState(false);

  const handleReply = async (content: string) => {
    try {
      const res = await api.post(`/comments/${comment._id}/reply`, {
        userId: user.id,
        username: user.name,
        content,
      });
      const newReply = res.data.replies[res.data.replies.length - 1];
      addReply(comment._id, newReply);
      socket.emit("comment-replied", { publicId: comment.documentId, commentId: comment._id, reply: newReply });
      setShowReply(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleResolve = async () => {
    try {
      await api.patch(`/comments/${comment._id}/resolve`);
      resolveComment(comment._id);
      socket.emit("comment-resolved", { publicId: comment.documentId, commentId: comment._id });
    } catch (e) {
      console.error(e);
    }
  };

  const handleFocus = () => {
    // Basic focus to the start position where the comment begins
    editor.commands.setTextSelection(comment.selectionStart);
    editor.commands.scrollIntoView();
  };

  return (
    <div className="theme-bg-panel rounded-lg p-3 border theme-border hover:theme-border-hover transition group cursor-pointer" onClick={handleFocus}>
      <div className="flex justify-between items-start mb-2">
        <span className="font-semibold text-sm theme-text-base">{comment.username}</span>
        <button 
          onClick={(e) => { e.stopPropagation(); handleResolve(); }}
          className="text-xs theme-text-muted hover:text-green-500 opacity-0 group-hover:opacity-100 transition"
        >
          Resolve
        </button>
      </div>
      <p className="text-sm theme-text-base opacity-90 mb-3">{comment.content}</p>

      {comment.replies?.length > 0 && (
        <div className="pl-3 border-l-2 theme-border flex flex-col gap-2 mb-3">
          {comment.replies.map((r, i) => (
            <div key={i} className="text-sm">
              <span className="font-semibold theme-text-muted mr-2">{r.username}</span>
              <span className="theme-text-base opacity-90">{r.content}</span>
            </div>
          ))}
        </div>
      )}

      {!showReply ? (
        <button 
          onClick={(e) => { e.stopPropagation(); setShowReply(true); }}
          className="text-xs theme-text-muted hover:theme-text-base"
        >
          Reply
        </button>
      ) : (
        <div onClick={(e) => e.stopPropagation()}>
          <CommentInput onSubmit={handleReply} onCancel={() => setShowReply(false)} />
        </div>
      )}
    </div>
  );
}
