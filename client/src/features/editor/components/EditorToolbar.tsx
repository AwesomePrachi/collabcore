import { Editor } from "@tiptap/react"
import { Bold, Italic, Code, Underline, List, ListOrdered, ChevronDown, Heading1 } from "lucide-react"
import { useState, useRef, useEffect } from "react"

type Props = {
  editor: Editor | null
}

const actions = [
  {
    icon: Bold,
    isActive: (editor: Editor) => editor.isActive("bold"),
    action: (editor: Editor) => editor.chain().focus().toggleBold().run(),
  },
  {
    icon: Italic,
    isActive: (editor: Editor) => editor.isActive("italic"),
    action: (editor: Editor) => editor.chain().focus().toggleItalic().run(),
  },
  {
    icon: Underline,
    isActive: (editor: Editor) => editor.isActive("underline"),
    action: (editor: Editor) => editor.chain().focus().toggleUnderline().run(),
  },
  {
    icon: Heading1,
    isActive: (editor: Editor) => editor.isActive("heading", { level: 1 }),
    action: (editor: Editor) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
  },
  {
    icon: Code,
    isActive: (editor: Editor) => editor.isActive("codeBlock"),
    action: (editor: Editor) => editor.chain().focus().toggleCodeBlock().run(),
  },
]

const bulletOptions = [
  { label: "●", value: "circle" },
  { label: "■", value: "square" },
  { label: "◆", value: "'◆ '" },
  { label: "➤", value: "'➤ '" },
]

const orderedOptions = [
  { label: "1.", value: "decimal" },
  { label: "a.", value: "lower-alpha" },
  { label: "i.", value: "lower-roman" },
]

export default function EditorToolbar({ editor }: Props) {
  const [openDropdown, setOpenDropdown] = useState<"bullet" | "ordered" | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  if (!editor) return null

  const handleBulletChange = (value: string) => {
    if (editor.isActive("bulletList")) {
      const currentStyle = editor.getAttributes("bulletList").listStyleType || "disc"
      if (currentStyle === value) {
        editor.chain().focus().toggleBulletList().run()
      } else {
        editor.chain().focus().updateAttributes("bulletList", { listStyleType: value }).run()
      }
    } else {
      editor.chain().focus().toggleBulletList().updateAttributes("bulletList", { listStyleType: value }).run()
    }
    setOpenDropdown(null)
  }

  const handleOrderedChange = (value: string) => {
    if (editor.isActive("orderedList")) {
      const currentStyle = editor.getAttributes("orderedList").listStyleType || "decimal"
      if (currentStyle === value) {
        editor.chain().focus().toggleOrderedList().run()
      } else {
        editor.chain().focus().updateAttributes("orderedList", { listStyleType: value }).run()
      }
    } else {
      editor.chain().focus().toggleOrderedList().updateAttributes("orderedList", { listStyleType: value }).run()
    }
    setOpenDropdown(null)
  }

  return (
    <div className="flex gap-2 border theme-border rounded-lg p-2 theme-bg-panel mb-3 items-center relative transition-colors duration-300 flex-wrap" ref={dropdownRef}>
      {actions.map(({ icon: Icon, action, isActive }, index) => {
        const active = isActive(editor)
        return (
          <button
            key={index}
            onClick={() => action(editor)}
            className={`p-2 rounded transition ${active
              ? "theme-btn-active shadow-sm"
              : "theme-toolbar-btn theme-text-muted hover:theme-text-base"
              }`}
          >
            <Icon size={18} />
          </button>
        )
      })}

      <div className="h-6 w-px theme-bg-panel-hover mx-1" />

      {/* Bullet List Split Button */}
      <div className={`flex items-center rounded transition ${editor.isActive("bulletList") ? "theme-btn-active shadow-sm" : "theme-toolbar-btn"}`}>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded-l ${editor.isActive("bulletList") ? "" : "theme-text-muted hover:theme-text-base"}`}
        >
          <List size={18} />
        </button>
        <button
          onClick={() => setOpenDropdown(openDropdown === "bullet" ? null : "bullet")}
          className={`p-2 border-l rounded-r ${editor.isActive("bulletList") ? "theme-border theme-text-base" : "theme-border theme-text-muted hover:theme-text-base"}`}
        >
          <ChevronDown size={14} />
        </button>

        {openDropdown === "bullet" && (
          <div className="absolute top-full mt-2 theme-bg-panel border theme-border rounded shadow-lg p-1 z-10 flex gap-1">
            {bulletOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleBulletChange(opt.value)}
                className="w-8 h-8 flex items-center justify-center hover:theme-bg-panel-hover rounded text-sm theme-text-muted hover:theme-text-base"
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Ordered List Split Button */}
      <div className={`flex items-center rounded transition ${editor.isActive("orderedList") ? "theme-btn-active shadow-sm" : "theme-toolbar-btn"}`}>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded-l ${editor.isActive("orderedList") ? "" : "theme-text-muted hover:theme-text-base"}`}
        >
          <ListOrdered size={18} />
        </button>
        <button
          onClick={() => setOpenDropdown(openDropdown === "ordered" ? null : "ordered")}
          className={`p-2 border-l rounded-r ${editor.isActive("orderedList") ? "theme-border theme-text-base" : "theme-border theme-text-muted hover:theme-text-base"}`}
        >
          <ChevronDown size={14} />
        </button>

        {openDropdown === "ordered" && (
          <div className="absolute top-full mt-2 theme-bg-panel border theme-border rounded shadow-lg p-1 z-10 flex gap-1">
            {orderedOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleOrderedChange(opt.value)}
                className="w-8 h-8 flex items-center justify-center hover:theme-bg-panel-hover rounded text-sm theme-text-muted hover:theme-text-base"
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}