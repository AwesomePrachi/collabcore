import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import { CustomBulletList } from "../extensions/CustomBulletList"
import { CustomOrderedList } from "../extensions/CustomOrderedList"
import { CommentExtension } from "../extensions/CommentExtension"
import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"

import { api } from "@/lib/api"

import { useEditorSocket } from "../hooks/useEditorSocket"
import { useCursorStore } from "../../../store/cursorStore"

import EditorToolbar from "./EditorToolbar"
import ActivityPanel from "./ActivityPanel"
import AIPanel from "./AIPanel"
import CommentButton from "./CommentButton"
import CommentPanel from "./CommentPanel"
import VersionPanel from "./VersionPanel"

type Props = {
  documentId: string
  onChangeTitle?: (title: string) => void
}

export default function Editor({ documentId, onChangeTitle }: Props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false, // Disable default bullet list to use our custom one
        orderedList: false, // Disable default ordered list to use our custom one
      }),
      Underline,
      CustomBulletList,
      CustomOrderedList,
      CommentExtension,
    ],
    content: "<p>Loading...</p>",
    editorProps: {
      attributes: {
        class: "prose dark:prose-invert m-5 focus:outline-none max-w-none",
      },
    },
  })

  useEditorSocket(editor, documentId)

  const cursors = useCursorStore((s) => s.cursors)

  function getEditorContent() {
    return editor?.getText() || ""
  }

  /*
  Load document from backend
  */
  useEffect(() => {
    if (!editor) return

    async function loadDocument() {
      try {
        const res = await api.get(`/documents/${documentId}`)

        if (res.data && res.data.content !== undefined) {
          editor.commands.setContent(res.data.content)
        }

        if (res.data?.title && onChangeTitle) {
          onChangeTitle(res.data.title)
        }
      } catch (error) {
        console.error("Failed to load document", error)
      }
    }

    loadDocument()

  }, [editor, documentId, onChangeTitle])

  return (

    <div className="flex h-full w-full">

      {/* Editor Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">

        {/* Static Toolbar Area */}
        <div className="w-full shrink-0 px-4 md:px-6 pt-4 md:pt-6 pb-2">
          <div className="max-w-3xl mx-auto flex items-center justify-between gap-2">
            <div className="flex-1 overflow-x-auto no-scrollbar">
              <EditorToolbar editor={editor} />
            </div>
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="xl:hidden p-2 mb-3 rounded border theme-border theme-bg-panel hover:theme-bg-panel-hover"
            >
              <Menu size={20} className="theme-text-base" />
            </button>
          </div>
        </div>

        {/* Scrollable Document Area */}
        <div className="flex-1 overflow-y-auto w-full px-6 pb-6 pt-2">
          <div className="max-w-3xl mx-auto h-full">

            <div className="border theme-border modern-glow-border rounded-lg theme-bg-panel p-6 min-h-[400px] relative transition-colors duration-300">

              {editor && <CommentButton editor={editor} />}

              <EditorContent editor={editor} className="editor-content" />

              {cursors.map(cursor => (
                <div
                  key={cursor.userId}
                  className="absolute text-xs px-2 py-1 rounded pointer-events-none collaborative-cursor"
                  style={{
                    top: cursor.position * 2,
                    left: 10,
                    background: cursor.color,
                    color: cursor.color,
                  }}
                >
                  <span className="text-white drop-shadow-md">{cursor.name}</span>
                </div>
              ))}

            </div>

          </div>

        </div>

      </div>

      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 xl:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Right Sidebar */}
      <div className={`
        fixed inset-y-0 right-0 z-50 w-80 shadow-2xl transform transition-transform duration-300 theme-bg-base flex flex-col
        xl:relative xl:w-[350px] xl:translate-x-0 xl:shadow-none xl:border-l xl:theme-border xl:bg-transparent
        ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="flex items-center justify-between p-4 border-b theme-border xl:hidden bg-background theme-bg-panel">
          <span className="font-semibold text-lg">Menu</span>
          <button onClick={() => setIsSidebarOpen(false)} className="p-1 rounded hover:theme-bg-panel-hover">
            <X size={20} className="theme-text-base" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto pb-4">
          <CommentPanel documentId={documentId} editor={editor} />
          <ActivityPanel documentId={documentId} />
          <VersionPanel documentId={documentId} editor={editor} />
          <div className="border-t theme-border mt-2 pt-2">
            <AIPanel getContent={getEditorContent} />
          </div>
        </div>
      </div>

    </div>

  )
}