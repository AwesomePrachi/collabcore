import { Server, Socket } from "socket.io"
import { updateDocument } from "../modules/document/document.service.js"
import { createActivity } from "../modules/activity/activity.service.js"
import { createVersion } from "../modules/version/version.service.js"

/**
 * Track users per document room
 */
type PresenceUser = {
  id: string
  name: string
  color: string
}

const documentUsers: Record<string, Map<string, PresenceUser>> = {}

/**
 * Track if a user made any saves during their session in a document
 * Format: sessionSaves[publicId][socketId] = true
 */
const sessionSaves: Record<string, Record<string, boolean>> = {}

export const registerDocumentSocket = (io: Server) => {

  io.on("connection", (socket: Socket) => {
    console.log("⚡ User connected:", socket.id)

    /**
     * Join document room
     */
    socket.on("join-document", ({ documentId, user }) => {

      socket.join(documentId)

      if (!documentUsers[documentId]) {
        documentUsers[documentId] = new Map()
      }

      const existingNames = new Set(
        Array.from(documentUsers[documentId].values()).map((u) => u.name)
      )
      const baseName = String(user?.name ?? "").trim() || "Guest"
      let displayName = baseName
      if (existingNames.has(displayName)) {
        displayName = `${baseName} • ${socket.id.slice(0, 4)}`
      }

      documentUsers[documentId].set(socket.id, {
        id: socket.id,
        name: displayName,
        color: user.color,
      })

      if (!sessionSaves[documentId]) {
        sessionSaves[documentId] = {}
      }
      sessionSaves[documentId][socket.id] = false

      io.to(documentId).emit(
        "presence-update",
        Array.from(documentUsers[documentId].values())
      )

    })

    /**
     * Realtime editor changes
     */
    socket.on("send-changes", (data) => {
      socket.to(data.publicId).emit("receive-changes", data.delta)
    })    /**
     * Comment Events
     */
    socket.on("comment-created", (data) => {
      socket.to(data.publicId).emit("receive-comment", data.comment)
    })

    socket.on("comment-replied", (data) => {
      socket.to(data.publicId).emit("receive-reply", data)
    })

    socket.on("comment-resolved", (data) => {
      socket.to(data.publicId).emit("receive-resolve", data)
    })

    /**
     * Cursor position tracking
     */
    socket.on("cursor-position", (data) => {

      const user = documentUsers[data.publicId]?.get(socket.id)

      socket.to(data.publicId).emit("receive-cursor", {
        userId: socket.id,
        name: user?.name,
        color: user?.color,
        position: data.position,
      })

    })

    /**
     * Autosave document
     */
    socket.on("save-document", async (data) => {

      try {

        await updateDocument(data.publicId, {
          content: data.content,
        })

        await createVersion(
          data.publicId,
          data.content
        )

        // Mark that this user has saved the document at least once this session
        if (sessionSaves[data.publicId]) {
          sessionSaves[data.publicId][socket.id] = true
        }

      } catch (error) {

        console.error("Save document error:", error)

      }

    })

    const handleLeaveDocument = async (publicId: string) => {

      if (documentUsers[publicId]?.has(socket.id)) {

        documentUsers[publicId].delete(socket.id)

        io.to(publicId).emit(
          "presence-update",
          Array.from(documentUsers[publicId].values())
        )

      }

    }

    /**
     * Leave document
     */
    socket.on("leave-document", async (publicId: string) => {
      await handleLeaveDocument(publicId)
      socket.leave(publicId)
      console.log(`📄 Left document room: ${publicId}`)
    })


    /**
     * Handle user disconnect
     */
    socket.on("disconnect", async () => {

      for (const docId in documentUsers) {
        await handleLeaveDocument(docId)
      }

      console.log("❌ User disconnected:", socket.id)
    })
  })
}