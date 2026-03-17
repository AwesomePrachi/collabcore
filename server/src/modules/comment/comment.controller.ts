import { Request, Response } from "express";
import * as commentService from "./comment.service.js";

export const createComment = async (req: Request, res: Response) => {
  try {
    const comment = await commentService.createComment(req.body);
    res.status(201).json(comment);
  } catch (error) {
    console.error("Failed to create comment", error);
    res.status(500).json({ error: "Failed to create comment" });
  }
};

export const getComments = async (req: Request, res: Response) => {
  try {
    const documentId = req.params.documentId as string;
    const comments = await commentService.getCommentsByDocumentId(documentId);
    res.status(200).json(comments);
  } catch (error) {
    console.error("Failed to fetch comments", error);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
};

export const addReply = async (req: Request, res: Response) => {
  try {
    const commentId = req.params.commentId as string;
    const comment = await commentService.addReply(commentId, req.body);
    res.status(200).json(comment);
  } catch (error) {
    console.error("Failed to add reply", error);
    res.status(500).json({ error: "Failed to add reply" });
  }
};

export const resolveComment = async (req: Request, res: Response) => {
  try {
    const commentId = req.params.commentId as string;
    const comment = await commentService.resolveComment(commentId);
    res.status(200).json(comment);
  } catch (error) {
    console.error("Failed to resolve comment", error);
    res.status(500).json({ error: "Failed to resolve comment" });
  }
};
