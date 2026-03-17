import { useEffect } from "react"
import { Editor } from "@tiptap/react"
import type { JSONContent } from "@tiptap/react"
import { socket } from "@/lib/socket"
import { useCursorStore } from "../../../store/cursorStore"
import { useCommentStore } from "../../../store/commentStore"

export function useEditorSocket(
  editor: Editor | null,
  documentId: string
) {

  const updateCursor = useCursorStore((s) => s.updateCursor)
  const { addComment, addReply, resolveComment } = useCommentStore()

  /*
  Join document + receive updates
  */
  useEffect(() => {
    if (!editor) return

    const receiveChanges = (delta: JSONContent) => {
      editor.commands.setContent(delta)
    }

    const receiveCursor = ({
      userId,
      name,
      color,
      position,
    }: {
      userId: string
      name: string
      color: string
      position: number
    }) => {

      updateCursor({
        userId,
        name,
        color,
        position,
      })

    }

    socket.on("receive-changes", receiveChanges)
    socket.on("receive-cursor", receiveCursor)
    socket.on("receive-comment", addComment)
    
    const handleReceiveReply = (data: any) => addReply(data.commentId, data.reply)
    socket.on("receive-reply", handleReceiveReply)
    
    const handleReceiveResolve = (data: any) => resolveComment(data.commentId)
    socket.on("receive-resolve", handleReceiveResolve)

    return () => {
      socket.off("receive-changes", receiveChanges)
      socket.off("receive-cursor", receiveCursor)
      socket.off("receive-comment", addComment)
      socket.off("receive-reply", handleReceiveReply)
      socket.off("receive-resolve", handleReceiveResolve)
    }

  }, [editor, documentId, updateCursor, addComment, addReply, resolveComment])


  /*
  Send editor changes (realtime collaboration)
  */
  useEffect(() => {
    if (!editor) return

    const updateHandler = () => {

      socket.emit("send-changes", {
        publicId: documentId,
        delta: editor.getJSON(),
      })

    }

    editor.on("update", updateHandler)

    return () => {
      editor.off("update", updateHandler)
    }

  }, [editor, documentId])


  /*
  Send cursor position
  */
  useEffect(() => {
    if (!editor) return

    const cursorHandler = () => {

      const position = editor.state.selection.from

      socket.emit("cursor-position", {
        publicId: documentId,
        position,
        userId: socket.id,
      })

    }

    editor.on("selectionUpdate", cursorHandler)

    return () => {
      editor.off("selectionUpdate", cursorHandler)
    }

  }, [editor, documentId])


  /*
  AUTO SAVE DOCUMENT
  */
  useEffect(() => {
    if (!editor) return

    let lastSavedContent = editor.getHTML()

    const interval = setInterval(() => {
      const currentContent = editor.getHTML()

      if (currentContent !== lastSavedContent) {
        socket.emit("save-document", {
          publicId: documentId,
          content: currentContent,
        })
        lastSavedContent = currentContent
      }
    }, 2000) // check every 2 seconds

    return () => {
      clearInterval(interval)
      socket.emit("leave-document", documentId)
    }

  }, [editor, documentId])

}