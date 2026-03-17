import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import { CustomBulletList } from "../extensions/CustomBulletList"
import { CustomOrderedList } from "../extensions/CustomOrderedList"
import { CommentExtension } from "../extensions/CommentExtension"
import { useEffect } from "react"

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
        class: "prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none max-w-none",
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
        <div className="w-full shrink-0 px-6 pt-6 pb-2">
          <div className="max-w-3xl mx-auto">
            <EditorToolbar editor={editor} />
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

      {/* Right Sidebar */}
      <div className="flex flex-col border-l theme-border w-[350px]">
        <div className="flex-1 overflow-y-auto">
          <CommentPanel documentId={documentId} editor={editor} />
          <ActivityPanel documentId={documentId} />
          <VersionPanel documentId={documentId} editor={editor} />
        </div>
        <div className="border-t theme-border pt-2 pb-2">
          <AIPanel getContent={getEditorContent} />
        </div>
      </div>

    </div>

  )
}