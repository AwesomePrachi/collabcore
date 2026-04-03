import { useState } from "react"
import { User, ArrowRight } from "lucide-react"

type Props = {
    onSubmit: (name: string) => void
}

export default function UsernameModal({ onSubmit }: Props) {

    const [name, setName] = useState("")

    function handleSubmit() {
        if (!name.trim()) return
        onSubmit(name.trim())
    }

    return (

        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">

            <div className="w-full max-w-md theme-bg-panel theme-border border p-8 rounded-3xl shadow-2xl shadow-black/30">

                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-extrabold theme-text-base">
                        Join as a Guest
                    </h2>
                    <div className="h-10 w-10 rounded-2xl bg-emerald-500/15 text-emerald-300 flex items-center justify-center border theme-border">
                        <User size={18} />
                    </div>
                </div>

                <p className="theme-text-muted text-sm font-medium mb-6">
                    Please provide a temporary display name so others can identify you during this session.
                </p>

                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Prachi Patel"
                    className="w-full px-4 py-3 rounded-2xl theme-bg-base theme-border border outline-none focus:ring-2 focus:ring-emerald-500/35 transition mb-5"
                />

                <button
                    onClick={handleSubmit}
                    disabled={!name.trim()}
                    className="w-full px-6 py-3 rounded-2xl font-semibold shadow-lg transition-all disabled:opacity-60 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5"
                >
                    <span className="inline-flex items-center justify-center gap-2">
                        Save & Continue
                        <ArrowRight size={16} />
                    </span>
                </button>

            </div>

        </div>

    )
}