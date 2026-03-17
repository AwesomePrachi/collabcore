import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "@/lib/api"
import { Trash2, Plus, FileText, Calendar, LayoutDashboard, LogOut } from "lucide-react"
import { useAuthStore } from "@/store/authStore"
import UsernameModal from "@/features/editor/components/UsernameModal"
import { useUserIdentity } from "@/features/editor/hooks/useUserIdentity"

type Document = {
  publicId: string
  title: string
  updatedAt: string
}

export default function DashboardPage() {

  const [documents, setDocuments] = useState<Document[]>([])
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [pendingNewDocId, setPendingNewDocId] = useState<string | null>(null)
  const navigate = useNavigate()
  const logout = useAuthStore((s) => s.logout)
  const user = useAuthStore((s) => s.user)
  const { hasUsername, setUsername } = useUserIdentity()

  async function loadDocuments() {
    try {
      const res = await api.get("/documents")
      setDocuments(res.data)
    } catch (error) {
      console.error("Failed to load documents", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadDocuments()
  }, [])

  async function createDocument() {
    try {
      const res = await api.post("/documents", {
        title: "Untitled Document"
      })
      const publicId = res.data.publicId as string
      if (!hasUsername) {
        setPendingNewDocId(publicId)
        return
      }
      navigate(`/doc/${publicId}`)
    } catch (error) {
      console.error("Failed to create document", error)
    }
  }

  async function handleDeleteConfirm() {
    if (!documentToDelete) return

    try {
      await api.delete(`/documents/${documentToDelete}`)
      
      // Update local state to remove the document immediately
      setDocuments(docs => docs.filter(doc => doc.publicId !== documentToDelete))
      
      // Close modal
      setDocumentToDelete(null)
    } catch (error) {
      console.error("Failed to delete document:", error)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date)
  }

  function handleSignOut() {
    logout()
    navigate("/login", { replace: true })
  }

  return (

    <div className="min-h-screen theme-bg-base theme-bg-grid theme-text-base p-6 md:p-12 transition-colors duration-300">

      <div className="max-w-6xl mx-auto">

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6 mb-12">
          
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl shadow-lg shadow-violet-500/20 text-white">
              <LayoutDashboard size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                CollabCore Workspace
              </h1>
              <p className="theme-text-muted mt-1 text-sm md:text-base font-medium">
                Manage and collaborate on your documents in real-time
              </p>
            </div>
          </div>

          <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl theme-bg-panel theme-border border">
              <div className="h-7 w-7 rounded-lg bg-violet-500/15 text-violet-400 flex items-center justify-center text-xs font-bold">
                {(user?.name?.trim()?.[0] ?? "U").toUpperCase()}
              </div>
              <div className="leading-tight">
                <div className="text-sm font-semibold theme-text-base">
                  {user?.name ?? "User"}
                </div>
                <div className="text-xs theme-text-muted">
                  {user?.email ?? ""}
                </div>
              </div>
            </div>

            <button
              onClick={createDocument}
              className="flex items-center justify-center gap-2 px-6 py-2.5 theme-btn-primary rounded-xl font-semibold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-0.5 transition-all text-sm md:text-base w-full sm:w-auto"
            >
              <Plus size={20} strokeWidth={2.5} />
              New Document
            </button>

            <button
              onClick={handleSignOut}
              className="flex items-center justify-center gap-2 px-5 py-2.5 theme-btn-secondary rounded-xl font-semibold border theme-border hover:theme-border-hover transition-all text-sm md:text-base w-full sm:w-auto"
              title="Sign out"
            >
              <LogOut size={18} />
              Sign out
            </button>
          </div>

        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-violet-500"></div>
          </div>
        ) : documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-4 theme-bg-panel theme-border border rounded-2xl text-center shadow-xl shadow-black/5">
            <div className="p-6 bg-violet-500/10 text-violet-500 rounded-full mb-6 relative">
              <div className="absolute inset-0 border border-violet-500/20 rounded-full animate-ping opacity-20"></div>
              <FileText size={48} strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-bold theme-text-base mb-3">No documents yet</h3>
            <p className="theme-text-muted mb-8 max-w-md text-center leading-relaxed">
              Your workspace is empty. Create your first document to start capturing ideas and collaborating with your team.
            </p>
            <button
              onClick={createDocument}
              className="flex items-center gap-2 px-6 py-3 theme-btn-primary rounded-xl font-semibold transition-all hover:scale-105 shadow-lg shadow-violet-500/20"
            >
              <Plus size={20} />
              Create your first document
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {documents.filter(doc => doc.publicId).map((doc) => (

              <div
                key={doc.publicId}
                onClick={() => navigate(`/doc/${doc.publicId}`)}
                className="group relative flex flex-col p-6 theme-bg-panel theme-border border rounded-2xl hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgb(0,0,0,0.15)] transition-all duration-300 cursor-pointer overflow-hidden"
              >
                
                {/* Decorative Top Gradient */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="flex items-start justify-between mb-6">
                  <div className="p-3 bg-violet-500/10 text-violet-500 rounded-xl group-hover:scale-110 group-hover:bg-violet-500/20 transition-all duration-300">
                    <FileText size={24} strokeWidth={2} />
                  </div>

                  {/* Delete Button (visible on hover) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation() // Prevent navigating to the document
                      setDocumentToDelete(doc.publicId)
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-2 text-red-500 hover:bg-red-500/15 hover:text-red-600 rounded-lg scale-90 group-hover:scale-100"
                    title="Delete Document"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <h3 className="text-xl font-bold theme-text-base mb-3 line-clamp-1 group-hover:text-violet-400 transition-colors">
                  {doc.title || "Untitled Document"}
                </h3>

                <div className="mt-auto flex items-center gap-2 text-sm theme-text-muted font-medium">
                  <Calendar size={16} className="opacity-70" />
                  <span>{formatDate(doc.updatedAt)}</span>
                </div>

              </div>

            ))}

          </div>
        )}

      </div>

      {/* Confirmation Modal */}
      {documentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="theme-bg-panel border theme-border p-8 rounded-2xl shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-5 border border-red-500/20">
              <Trash2 className="text-red-500" size={24} />
            </div>
            
            <h3 className="text-xl font-bold mb-3 theme-text-base">Delete Document</h3>
            <p className="theme-text-muted text-base mb-8 leading-relaxed">
              Are you sure you want to delete this document permanently? This action cannot be undone.
            </p>
            
            <div className="flex justify-end gap-3 sm:gap-4">
              <button
                onClick={() => setDocumentToDelete(null)}
                className="px-5 py-2.5 text-sm sm:text-base font-semibold theme-btn-secondary rounded-xl transition-all hover:bg-opacity-80 flex-1 sm:flex-none"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-5 py-2.5 text-sm sm:text-base font-semibold bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all shadow-lg shadow-red-600/20 hover:shadow-red-600/40 hover:-translate-y-0.5 flex-1 sm:flex-none"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {pendingNewDocId && (
        <UsernameModal
          onSubmit={(name) => {
            setUsername(name)
            navigate(`/doc/${pendingNewDocId}`)
            setPendingNewDocId(null)
          }}
        />
      )}

    </div>

  )

}