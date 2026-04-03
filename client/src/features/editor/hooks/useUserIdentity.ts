import { useCallback, useEffect, useMemo, useState } from "react"
import { nanoid } from "nanoid"
import { useAuthStore } from "@/store/authStore"

export type UserIdentity = {
  id: string
  name: string
  color: string
}

const colors = [
  "#22c55e",
  "#3b82f6",
  "#a855f7",
  "#eab308",
  "#ef4444",
]

const STORAGE_KEY = "collabcore-user"

function safeParse<T>(value: string | null): T | null {
  if (!value) return null
  try {
    return JSON.parse(value) as T
  } catch {
    return null
  }
}

function createBaseIdentity() {
  const id = nanoid(5)
  return {
    id,
    name: "",
    color: colors[id.charCodeAt(0) % colors.length],
  } satisfies UserIdentity
}

export function useUserIdentity() {
  const authUser = useAuthStore((state) => state.user)

  const [localIdentity, setLocalIdentity] = useState<UserIdentity>(() => {
    const stored = safeParse<UserIdentity>(localStorage.getItem(STORAGE_KEY))
    return stored ?? createBaseIdentity()
  })

  useEffect(() => {
    // keep in sync if another tab updates username
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return
      const next = safeParse<UserIdentity>(e.newValue)
      if (next) setLocalIdentity(next)
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  const identity = useMemo(() => {
    if (authUser) {
      // Deterministically pick a color based on the actual userId
      let charSum = 0
      for (let i = 0; i < (authUser.userId || "").length; i++) {
        charSum += authUser.userId.charCodeAt(i)
      }
      return {
        id: authUser.userId,
        name: authUser.name,
        color: colors[charSum % colors.length]
      } satisfies UserIdentity
    }
    return localIdentity
  }, [authUser, localIdentity])

  const setUsername = useCallback((name: string) => {
    const trimmed = name.trim()
    if (!trimmed) return
    
    // Only saves anonymous identity to local storage.
    // Real authenticated user names should be managed in profile settings.
    const next: UserIdentity = { ...localIdentity, name: trimmed }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    setLocalIdentity(next)
  }, [localIdentity])

  const hasUsername = useMemo(() => Boolean(identity.name?.trim()), [identity.name])

  return { identity, setUsername, hasUsername }
}