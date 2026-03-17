import { Mark, mergeAttributes } from "@tiptap/core";

export interface CommentOptions {
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    comment: {
      setComment: (commentId: string) => ReturnType;
      unsetComment: (commentId: string) => ReturnType;
    };
  }
}

export const CommentExtension = Mark.create<CommentOptions>({
  name: "comment",

  addOptions() {
    return {
      HTMLAttributes: {
        class: "bg-yellow-500/30 border-b-2 border-yellow-500 cursor-pointer hover:bg-yellow-500/50 transition-colors",
      },
    };
  },

  addAttributes() {
    return {
      commentId: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-comment-id"),
        renderHTML: (attributes) => {
          if (!attributes.commentId) {
            return {};
          }
          return {
            "data-comment-id": attributes.commentId,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "span[data-comment-id]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },

  addCommands() {
    return {
      setComment:
        (commentId) =>
        ({ commands }) => {
          return commands.setMark(this.name, { commentId });
        },
      unsetComment:
        () =>
        ({ tr, dispatch }) => {
          // This removes all comments in the current selection.
          // In a more complex scenario, we would only unset the specific commentId.
          if (dispatch) {
            tr.removeMark(tr.selection.from, tr.selection.to, this.type);
          }
          return true;
        },
    };
  },
});
