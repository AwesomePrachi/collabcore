import { Router } from "express"
import { requireAuth } from "../../middleware/auth.middleware.js"

import {
  createDocumentHandler,
  getDocumentHandler,
  updateDocumentHandler,
  listDocumentsHandler,
  deleteDocumentHandler
} from "./document.controller.js"

const router = Router()

router.get("/", requireAuth as any, listDocumentsHandler as any)

router.post("/", requireAuth, createDocumentHandler as any)

router.get("/:id", getDocumentHandler)

router.patch("/:id", requireAuth, updateDocumentHandler)

router.delete("/:id", requireAuth, deleteDocumentHandler)

export default router