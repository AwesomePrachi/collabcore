import { useState } from "react";

type Props = {
  onSubmit: (content: string) => void;
  onCancel?: () => void;
  placeholder?: string;
};

export default function CommentInput({ onSubmit, onCancel, placeholder }: Props) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!text.trim()) return;
    onSubmit(text);
    setText("");
  };

  return (
    <div className="flex flex-col gap-2">
      <textarea
        autoFocus
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder || "Reply..."}
        className="w-full theme-bg-base border theme-border rounded p-2 text-sm theme-text-base placeholder:theme-text-muted focus:outline-none focus:theme-border-hover resize-none transition-colors"
        rows={2}
      />
      <div className="flex gap-2 justify-end">
        {onCancel && (
          <button onClick={onCancel} className="px-3 py-1 text-xs theme-text-muted hover:theme-text-base transition">
            Cancel
          </button>
        )}
        <button
          onClick={handleSubmit}
          disabled={!text.trim()}
          className="px-3 py-1 text-xs theme-btn-primary rounded transition disabled:opacity-50"
        >
          Post
        </button>
      </div>
    </div>
  );
}
