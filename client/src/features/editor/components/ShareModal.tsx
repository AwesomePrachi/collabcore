import { useState } from "react"
import { Copy, Check, X } from "lucide-react"

type Props = {
  isOpen: boolean
  onClose: () => void
  publicId: string
}

export default function ShareModal({ isOpen, onClose, publicId }: Props) {
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const shareLink = `${window.location.origin}/doc/${publicId}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy link", err)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="theme-bg-panel border theme-border rounded-lg p-6 w-full max-w-md shadow-2xl relative transition-colors duration-300">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 theme-text-muted hover:theme-text-base transition"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold theme-text-base mb-2">Share Document</h2>
        <p className="theme-text-muted text-sm mb-6">
          Anyone with this link can view and edit this document in real-time.
        </p>

        <div className="flex gap-2">
          <input 
            type="text" 
            readOnly 
            value={shareLink}
            className="flex-1 theme-bg-base border theme-border rounded px-3 py-2 text-sm theme-text-base outline-none focus:theme-border-hover transition-colors"
          />
          <button 
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 theme-btn-primary px-4 py-2 rounded transition font-medium text-sm whitespace-nowrap min-w-[110px]"
          >
            {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  )
}
