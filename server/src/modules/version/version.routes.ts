import { Router } from "express"
import {
  getVersions,
} from "./version.service.js"
import { requireAuth, AuthRequest } from "../../middleware/auth.middleware.js"
import { VersionModel } from "./version.model.js"
import { getDocumentByPublicId, updateDocumentForOwner } from "../document/document.service.js"

const router = Router()

router.get("/:publicId", requireAuth as any, async (req: AuthRequest, res) => {

  if (!req.user?.userId) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  const publicIdParam = req.params.publicId
  const publicId = Array.isArray(publicIdParam) ? publicIdParam[0] : publicIdParam
  if (!publicId) return res.status(400).json({ message: "Invalid document id" })

  const versions = await getVersions(publicId)

  res.json(versions)
})

router.post(
  "/:publicId/restore/:versionId",
  requireAuth as any,
  async (req: AuthRequest, res) => {
    try {
      if (!req.user?.userId) {
        return res.status(401).json({ message: "Unauthorized" })
      }

      const publicIdParam = req.params.publicId
      const versionIdParam = req.params.versionId
      const publicId = Array.isArray(publicIdParam) ? publicIdParam[0] : publicIdParam
      const versionId = Array.isArray(versionIdParam) ? versionIdParam[0] : versionIdParam
      if (!publicId || !versionId) {
        return res.status(400).json({ message: "Invalid request parameters" })
      }

      const doc = await getDocumentByPublicId(publicId)
      if (!doc) return res.status(404).json({ message: "Document not found" })

      if (String(doc.ownerId) !== String(req.user.userId)) {
        return res.status(403).json({ message: "Forbidden" })
      }

      const version = await VersionModel.findOne({ _id: versionId, publicId })
      if (!version) return res.status(404).json({ message: "Version not found" })

      const updated = await updateDocumentForOwner(publicId, req.user.userId, { content: version.content })
      return res.json(updated)
    } catch (error) {
      console.error("Restore version error:", error)
      return res.status(500).json({ message: "Failed to restore version" })
    }
  }
)

export default router
