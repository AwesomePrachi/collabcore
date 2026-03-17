import { Request, Response } from "express"
import {
  createDocument,
  getDocumentByPublicId,
  updateDocument,
  updateDocumentForOwner,
  getDocuments,
  deleteDocument
} from "./document.service.js"

import {
  createDocumentSchema,
  updateDocumentSchema,
  documentParamSchema
} from "./document.schema.js"


import { AuthRequest } from "../../middleware/auth.middleware.js"

export const createDocumentHandler = async (
  req: AuthRequest,
  res: Response
) => {

  try {

    const parsed = createDocumentSchema.parse(req.body)

    const document = await createDocument(parsed.title, req.user?.userId)

    return res.status(201).json(document)

  } catch {

    return res.status(400).json({
      message: "Invalid request payload"
    })

  }

}


export const getDocumentHandler = async (
  req: Request,
  res: Response
) => {

  try {

    const { id } = documentParamSchema.parse(req.params)

    const document = await getDocumentByPublicId(id)

    if (!document) {

      return res.status(404).json({
        message: "Document not found"
      })

    }

    return res.json(document)

  } catch {

    return res.status(400).json({
      message: "Invalid document ID"
    })

  }

}


export const updateDocumentHandler = async (
  req: AuthRequest,
  res: Response
) => {

  try {

    const { id } = documentParamSchema.parse(req.params)

    const parsed = updateDocumentSchema.parse(req.body)

    if (!req.user?.userId) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const document = await updateDocumentForOwner(
      id,
      req.user.userId,
      parsed
    )

    if (!document) {

      return res.status(404).json({
        message: "Document not found"
      })

    }

    return res.json(document)

  } catch {

    return res.status(400).json({
      message: "Invalid update data"
    })

  }

}


export const listDocumentsHandler = async (
  req: AuthRequest,
  res: Response
) => {

  try {

    if (!req.user?.userId) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const documents = await getDocuments(req.user.userId)

    return res.json(documents)

  } catch (error) {

    console.error("Fetch documents error:", error)

    return res.status(500).json({
      message: "Failed to fetch documents"
    })

  }

}

export const deleteDocumentHandler = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = documentParamSchema.parse(req.params)
    if (!req.user?.userId) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const deleted = await deleteDocument(id, req.user.userId)
    if (!deleted) {
      return res.status(404).json({ message: "Document not found" })
    }
    return res.status(200).json({ message: "Document deleted successfully" })
  } catch (error) {
    console.error("Delete document error:", error)
    return res.status(500).json({
      message: "Failed to delete document"
    })
  }
}