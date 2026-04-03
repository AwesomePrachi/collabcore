import { useEffect, useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { api } from "@/lib/api"
import { useAuthStore } from "@/store/authStore"
import { Lock, Mail, ArrowRight, Sparkles } from "lucide-react"

type LoginResponse = {
  token: string
  user: {
    userId: string
    name: string
    email: string
  }
}

export default function LoginPage() {
  const navigate = useNavigate()
  const token = useAuthStore((s) => s.token)
  const login = useAuthStore((s) => s.login)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (token) navigate("/", { replace: true })
  }, [token, navigate])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      const res = await api.post<LoginResponse>("/auth/login", { email, password })
      login(res.data.user, res.data.token)
      navigate("/", { replace: true })
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Login failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen theme-bg-base theme-bg-grid theme-text-base relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="absolute left-1/2 top-24 h-64 w-64 -translate-x-1/2 rounded-full bg-sky-400/10 blur-3xl" />
      </div>

      <div className="relative flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Left marketing panel */}
          <div className="hidden lg:flex flex-col justify-between rounded-3xl border theme-border theme-bg-panel p-10 shadow-2xl shadow-black/20 overflow-hidden relative">
            <div className="pointer-events-none absolute inset-0 opacity-70">
              <div className="absolute -top-28 -right-28 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl" />
              <div className="absolute -bottom-28 -left-28 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl" />
            </div>

            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold theme-bg-base/40 border theme-border">
                <Sparkles size={14} className="text-emerald-600 dark:text-emerald-300" />
                Real-time collaboration
              </div>
              <h1 className="mt-5 text-4xl font-extrabold leading-tight">
                CollabCore{" "}
                <span className="bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-300 dark:to-cyan-300 bg-clip-text text-transparent">
                  Workspace
                </span>
              </h1>
              <p className="mt-4 theme-text-muted text-base leading-relaxed max-w-md">
                Edit together, track presence, comment inline, and restore versions—without losing momentum.
              </p>
            </div>

            <div className="relative grid grid-cols-2 gap-4">
              <div className="rounded-2xl border theme-border theme-bg-base/30 p-4">
                <div className="text-sm font-semibold">Live presence</div>
                <div className="text-xs theme-text-muted mt-1">See who’s active instantly</div>
              </div>
              <div className="rounded-2xl border theme-border theme-bg-base/30 p-4">
                <div className="text-sm font-semibold">Auto-save</div>
                <div className="text-xs theme-text-muted mt-1">Persistent document state</div>
              </div>
              <div className="rounded-2xl border theme-border theme-bg-base/30 p-4">
                <div className="text-sm font-semibold">AI assist</div>
                <div className="text-xs theme-text-muted mt-1">Summaries & improvements</div>
              </div>
              <div className="rounded-2xl border theme-border theme-bg-base/30 p-4">
                <div className="text-sm font-semibold">Version history</div>
                <div className="text-xs theme-text-muted mt-1">Restore anytime</div>
              </div>
            </div>
          </div>

          {/* Auth card */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md theme-bg-panel theme-border border rounded-3xl p-8 shadow-2xl shadow-black/20 backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-300 dark:to-cyan-300 bg-clip-text text-transparent">
                    Welcome back
                  </h2>
                  <p className="theme-text-muted mt-1 font-medium">Sign in to your workspace</p>
                </div>
                <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-emerald-600 to-cyan-600 dark:from-emerald-500 dark:to-cyan-500 shadow-lg shadow-emerald-500/20 flex items-center justify-center">
                  <ArrowRight size={18} className="text-white" />
                </div>
              </div>

              <form onSubmit={onSubmit} className="mt-8 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold theme-text-muted">Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      autoComplete="email"
                      required
                      className="w-full pl-11 pr-4 py-3 rounded-2xl theme-bg-base theme-border border outline-none focus:ring-2 focus:ring-emerald-500/35 transition"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold theme-text-muted">Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type="password"
                      autoComplete="current-password"
                      required
                      className="w-full pl-11 pr-4 py-3 rounded-2xl theme-bg-base theme-border border outline-none focus:ring-2 focus:ring-emerald-500/35 transition"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {error && (
                  <div className="theme-border border rounded-2xl p-3 bg-red-500/10 text-red-400 text-sm font-semibold">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 rounded-2xl font-semibold shadow-lg transition-all disabled:opacity-60 disabled:hover:translate-y-0 bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-500 dark:to-cyan-500 hover:from-emerald-500 hover:to-cyan-500 dark:hover:from-emerald-400 dark:hover:to-cyan-400 text-white shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5"
                >
                  <span className="inline-flex items-center justify-center gap-2">
                    {isSubmitting ? "Signing in..." : "Sign in"}
                    <ArrowRight size={16} />
                  </span>
                </button>
              </form>

              <div className="mt-6 flex items-center justify-between text-sm">
                <p className="theme-text-muted font-medium">
                  New here?{" "}
                  <Link to="/signup" className="text-emerald-600 hover:text-emerald-500 dark:text-emerald-300 dark:hover:text-emerald-200 font-bold">
                    Create an account
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

