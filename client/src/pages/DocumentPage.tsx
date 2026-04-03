import { useParams } from "react-router-dom"
import { useState } from "react"
import { api } from "@/lib/api"
import { Share2 } from "lucide-react"

import Editor from "@/features/editor/components/Editor"
import PresenceBar from "@/features/editor/components/PresenceBar"
import ShareModal from "@/features/editor/components/ShareModal"
import { usePresence } from "@/features/editor/hooks/usePresence"
import ThemeToggle from "@/components/ThemeToggle"
import UsernameModal from "@/features/editor/components/UsernameModal"
import { useUserIdentity } from "@/features/editor/hooks/useUserIdentity"

export default function DocumentPage() {
  const { publicId } = useParams()
  const { identity, setUsername, hasUsername } = useUserIdentity()
  const users = usePresence(publicId ?? "", identity)

  const [title, setTitle] = useState("")
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)

  if (!publicId) return null

  const handleTitleBlur = async () => {
    if (!title.trim()) return
    try {
      await api.patch(`/documents/${publicId}`, { title })
    } catch (error) {
      console.error("Failed to update title:", error)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur()
    }
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden theme-bg-base theme-bg-grid theme-text-base transition-colors duration-300">

      <header className="border-b theme-border p-2 md:p-4 flex items-center justify-between gap-2 md:gap-4 theme-bg-panel z-10 overflow-x-auto no-scrollbar">
        
        <input 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleTitleBlur}
          onKeyDown={handleKeyDown}
          placeholder="Untitled Document"
          className="font-semibold text-lg bg-transparent border-none outline-none focus:ring-1 focus:ring-violet-500/50 rounded px-2 py-1 flex-1 min-w-[140px] max-w-sm md:max-w-md transition-colors theme-bg-panel-hover"
        />

        <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
          <ThemeToggle />
          <button 
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center gap-2 theme-btn-secondary px-2 md:px-3 py-1.5 rounded transition text-sm font-medium border theme-border"
          >
            <Share2 size={16} />
            <span className="hidden sm:inline">Share</span>
          </button>
          <PresenceBar users={users} />
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <Editor
          documentId={publicId}
          onChangeTitle={setTitle}
        />
      </main>

      <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        publicId={publicId} 
      />

      {!hasUsername && (
        <UsernameModal
          onSubmit={(name) => {
            setUsername(name)
          }}
        />
      )}

    </div>
  )
}