import { useEffect } from "react";
import { useCommentStore } from "../../../store/commentStore";
import CommentThread from "./CommentThread";
import CommentInput from "./CommentInput";
import { Editor } from "@tiptap/react";
import { useUserIdentity } from "../hooks/useUserIdentity";
import { api } from "@/lib/api";
import { socket } from "@/lib/socket";

export default function CommentPanel({ documentId, editor }: { documentId: string, editor: Editor | null }) {
  const { comments, setComments, newCommentParams, setNewCommentParams, addComment } = useCommentStore();
  const { identity: user } = useUserIdentity();

  useEffect(() => {
    async function fetchComments() {
      try {
        const res = await api.get(`/comments/${documentId}`);
        setComments(res.data);
      } catch (err) {
        console.error("Failed to fetch comments", err);
      }
    }
    fetchComments();
  }, [documentId, setComments]);

  const activeComments = comments.filter((c) => !c.resolved);

  const handlePostComment = async (content: string) => {
    if (!newCommentParams || !editor) return;
    try {
      const res = await api.post("/comments", {
        documentId,
        userId: user.id,
        username: user.name,
        content,
        selectionStart: newCommentParams.selectionStart,
        selectionEnd: newCommentParams.selectionEnd,
      });
      
      const newComment = res.data;
      addComment(newComment);
      socket.emit("comment-created", { publicId: documentId, comment: newComment });
      
      editor.commands.setTextSelection({ from: newCommentParams.selectionStart, to: newCommentParams.selectionEnd });
      editor.commands.setComment(newComment._id);
      
      setNewCommentParams(null);
    } catch (error) {
      console.error("Failed to post comment", error);
    }
  };

  return (
    <div className="w-80 theme-bg-base border-l theme-border flex flex-col h-full overflow-y-auto transition-colors duration-300">
      <div className="p-4 border-b theme-border font-semibold theme-text-base flex items-center gap-2">
        <span>💬</span> Comments
      </div>
      
      <div className="p-4 flex flex-col gap-4">
        {newCommentParams && (
          <div className="theme-bg-panel p-3 rounded-lg border theme-border shadow-sm">
             <div className="text-xs theme-text-muted mb-2">Adding new comment...</div>
             <CommentInput 
                onSubmit={handlePostComment} 
                onCancel={() => setNewCommentParams(null)} 
                placeholder="Write a comment..."
             />
          </div>
        )}

        {activeComments.length === 0 && !newCommentParams ? (
          <p className="theme-text-muted text-sm italic">No active comments.</p>
        ) : (
          activeComments.map((comment) => (
            <CommentThread key={comment._id} comment={comment} editor={editor!} />
          ))
        )}
      </div>
    </div>
  );
}
