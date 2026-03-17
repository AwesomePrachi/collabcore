import { useState } from "react"
import { api } from "@/lib/api"

type Props = {
  getContent: () => string
}

export default function AIPanel({ getContent }: Props) {

  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)

  async function summarize() {

    setLoading(true)

    const content = getContent()

    const res = await api.post("/ai/summarize", {
      content
    })

    setResult(res.data.result)

    setLoading(false)

  }

  async function improve() {

    setLoading(true)

    const content = getContent()

    const res = await api.post("/ai/improve", {
      content
    })

    setResult(res.data.result)

    setLoading(false)

  }

  return (

    <div className="w-72 border-l theme-border p-4 flex flex-col gap-4 theme-bg-base transition-colors duration-300">

      <h2 className="font-semibold theme-text-base">
        AI Assistant
      </h2>

      <button
        onClick={summarize}
        className="bg-blue-600 px-3 py-2 rounded theme-text-inverse modern-gradient-btn"
      >
        Summarize
      </button>

      <button
        onClick={improve}
        className="bg-purple-600 px-3 py-2 rounded theme-text-inverse modern-gradient-btn"
      >
        Improve Writing
      </button>

      {loading && (
        <div className="text-sm theme-text-muted">
          Generating...
        </div>
      )}

      {result && (
        <div className="text-sm theme-bg-panel p-3 rounded theme-text-base border theme-border">
          {result}
        </div>
      )}

    </div>

  )
}
