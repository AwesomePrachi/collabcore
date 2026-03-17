import { Router } from "express";
import * as commentController from "./comment.controller.js";

const router = Router();

router.post("/", commentController.createComment);
router.get("/:documentId", commentController.getComments);
router.post("/:commentId/reply", commentController.addReply);
router.patch("/:commentId/resolve", commentController.resolveComment);

export default router;
