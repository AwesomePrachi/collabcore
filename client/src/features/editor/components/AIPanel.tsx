import { useState } from "react"
import { api } from "@/lib/api"
import ReactMarkdown from "react-markdown"

type Props = {
  getContent: () => string
}

export default function AIPanel({ getContent }: Props) {

  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)

  async function summarize() {
    setLoading(true)
    try {
      const content = getContent()
      const res = await api.post("/ai/summarize", { content })
      setResult(res.data.result)
    } catch (error) {
      console.error("Summarize error:", error)
      setResult("Error generating response. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  async function improve() {
    setLoading(true)
    try {
      const content = getContent()
      const res = await api.post("/ai/improve", { content })
      setResult(res.data.result)
    } catch (error) {
      console.error("Improve error:", error)
      setResult("Error generating response. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (

    <div className="w-full p-4 flex flex-col gap-4 theme-bg-base transition-colors duration-300">

      <h2 className="font-semibold theme-text-base">
        AI Assistant
      </h2>

      <button
        onClick={summarize}
        className="bg-blue-600 px-3 py-2 rounded text-white modern-gradient-btn"
      >
        Summarize
      </button>

      <button
        onClick={improve}
        className="bg-purple-600 px-3 py-2 rounded text-white modern-gradient-btn"
      >
        Improve Writing
      </button>

      {loading && (
        <div className="text-sm theme-text-muted">
          Generating...
        </div>
      )}

      {result && (
        <div className="theme-bg-panel p-3 rounded border theme-border prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown>
            {result}
          </ReactMarkdown>
        </div>
      )}

    </div>

  )
}
