import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import type { JSONContent } from "@tiptap/react"
import type { Editor } from "@tiptap/react"

type Version = {
  _id: string
  content: JSONContent
  createdAt: string
  updatedAt?: string
}

type Props = {
  documentId: string
  editor: Editor | null
}

export default function VersionPanel({
  documentId,
  editor,
}: Props) {

  const [versions, setVersions] =
    useState<Version[]>([])
  const [isRestoringId, setIsRestoringId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {

    async function loadVersions() {

      try {
        const res = await api.get(
          `/versions/${documentId}`
        )
        setVersions(res.data)
      } catch (e: unknown) {
        const msg =
          typeof e === "object" && e !== null && "response" in e
            ? (e as { response?: { data?: { message?: string } } }).response?.data?.message
            : undefined
        setError(msg ?? "Failed to load versions")
      }

    }

    loadVersions()

  }, [documentId])

  const handleRestore = async (versionId: string) => {
    if (!editor) return
    setError(null)
    setIsRestoringId(versionId)
    try {
      const res = await api.post(`/versions/${documentId}/restore/${versionId}`)
      if (res.data?.content !== undefined) {
        editor.commands.setContent(res.data.content)
      }
    } catch (e: unknown) {
      const msg =
        typeof e === "object" && e !== null && "response" in e
          ? (e as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined
      setError(msg ?? "Restore failed")
    } finally {
      setIsRestoringId(null)
    }
  }

  return (
    <div className="w-64 border-l theme-border p-4 theme-bg-base transition-colors duration-300">

      <h2 className="text-sm font-semibold mb-4 theme-text-base">
        Version History
      </h2>

      {error && (
        <div className="mb-3 theme-border border rounded-xl p-2 bg-red-500/10 text-red-400 text-xs font-semibold">
          {error}
        </div>
      )}

      <div className="space-y-2">

        {versions.map((v) => (

          <div
            key={v._id}
            className="flex items-center justify-between gap-2 text-xs theme-text-muted theme-bg-panel border theme-border rounded-lg px-2 py-2"
          >
            <span>
              {new Date(v.updatedAt || v.createdAt).toLocaleString()}
            </span>
            <button
              onClick={() => handleRestore(v._id)}
              disabled={!editor || isRestoringId === v._id}
              className="px-2 py-1 rounded theme-btn-secondary border theme-border text-xs font-semibold disabled:opacity-60"
              title={!editor ? "Editor not ready" : "Restore this version"}
            >
              {isRestoringId === v._id ? "Restoring..." : "Restore"}
            </button>
          </div>

        ))}

      </div>

    </div>
  )
}
