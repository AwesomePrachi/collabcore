import { Editor } from "@tiptap/react";
import { useCommentStore } from "../../../store/commentStore";
import { useEffect, useState } from "react";

export default function CommentButton({ editor }: { editor: Editor }) {
  const setNewCommentParams = useCommentStore((s) => s.setNewCommentParams);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const update = () => {
      const { selection } = editor.state;
      setShow(!selection.empty && !editor.isActive("comment"));
    };
    editor.on("selectionUpdate", update);
    editor.on("transaction", update);
    return () => {
      editor.off("selectionUpdate", update);
      editor.off("transaction", update);
    };
  }, [editor]);

  if (!show) return null;

  return (
    <div className="absolute -top-4 right-4 z-50">
      <button
        onClick={() => {
          const { from, to } = editor.state.selection;
          setNewCommentParams({ selectionStart: from, selectionEnd: to });
        }}
        className="theme-bg-panel text-sm theme-text-base px-3 py-2 rounded-lg shadow-xl border theme-border flex items-center gap-2 hover:theme-bg-panel-hover transition transform hover:scale-105"
      >
        <span>💬</span> Add Comment
      </button>
    </div>
  );
}
