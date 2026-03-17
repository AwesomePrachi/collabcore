import { useEffect, useState } from "react"
import { socket } from "@/lib/socket"
import type { UserIdentity } from "./useUserIdentity"

type PresenceUser = {
  id: string
  name: string
  color: string
}

export function usePresence(documentId: string, user: UserIdentity) {

  const [users, setUsers] = useState<PresenceUser[]>([])

  useEffect(() => {

    if (!documentId) return
    if (!user?.name?.trim()) return

    socket.emit("join-document", {
      documentId,
      user
    })

    socket.on("presence-update", (userList: PresenceUser[]) => {
      setUsers(userList)
    })

    return () => {
      socket.emit("leave-document", documentId)
      socket.off("presence-update")
    }

  }, [documentId, user])

  return users
}