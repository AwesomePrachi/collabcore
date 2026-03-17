import { create } from "zustand";

export type Reply = {
  userId: string;
  username: string;
  content: string;
  createdAt: string;
};

export type Comment = {
  _id: string;
  documentId: string;
  userId: string;
  username: string;
  content: string;
  selectionStart: number;
  selectionEnd: number;
  resolved: boolean;
  replies: Reply[];
  createdAt: string;
};

type CommentStore = {
  comments: Comment[];
  setComments: (comments: Comment[]) => void;
  addComment: (comment: Comment) => void;
  addReply: (commentId: string, reply: Reply) => void;
  resolveComment: (commentId: string) => void;
  activeCommentId: string | null;
  setActiveCommentId: (id: string | null) => void;
  newCommentParams: { selectionStart: number; selectionEnd: number } | null;
  setNewCommentParams: (params: { selectionStart: number; selectionEnd: number } | null) => void;
};

export const useCommentStore = create<CommentStore>((set) => ({
  comments: [],
  activeCommentId: null,
  newCommentParams: null,

  setNewCommentParams: (params) => set({ newCommentParams: params }),

  setComments: (comments) => set({ comments }),

  addComment: (comment) =>
    set((state) => ({
      comments: [...state.comments, comment],
    })),

  addReply: (commentId, reply) =>
    set((state) => ({
      comments: state.comments.map((c) =>
        c._id === commentId ? { ...c, replies: [...c.replies, reply] } : c
      ),
    })),

  resolveComment: (commentId) =>
    set((state) => ({
      comments: state.comments.map((c) =>
        c._id === commentId ? { ...c, resolved: true } : c
      ),
    })),

  setActiveCommentId: (id) => set({ activeCommentId: id }),
}));
