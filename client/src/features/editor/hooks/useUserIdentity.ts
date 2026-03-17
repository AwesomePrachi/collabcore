import { useCallback, useEffect, useMemo, useState } from "react"
import { nanoid } from "nanoid"

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
  const [identity, setIdentity] = useState<UserIdentity>(() => {
    const stored = safeParse<UserIdentity>(localStorage.getItem(STORAGE_KEY))
    return stored ?? createBaseIdentity()
  })

  useEffect(() => {
    // keep in sync if another tab updates username
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return
      const next = safeParse<UserIdentity>(e.newValue)
      if (next) setIdentity(next)
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  const setUsername = useCallback((name: string) => {
    const trimmed = name.trim()
    if (!trimmed) return
    const next: UserIdentity = { ...identity, name: trimmed }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    setIdentity(next)
  }, [identity])

  const hasUsername = useMemo(() => Boolean(identity.name?.trim()), [identity.name])

  return { identity, setUsername, hasUsername }
}