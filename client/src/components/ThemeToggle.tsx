import { useThemeStore } from "../store/themeStore";
import { Sun, Moon, Sparkles } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="flex bg-zinc-800 rounded-md p-1 items-center gap-1 border border-zinc-700 shadow-sm">
      <button
        onClick={() => setTheme("light")}
        className={`px-2 py-1 flex items-center gap-1.5 text-xs font-medium rounded transition-all ${theme === "light"
            ? "bg-zinc-200 text-zinc-900 shadow"
            : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50"
          }`}
      >
        <Sun size={14} />
        Light
      </button>

      <button
        onClick={() => setTheme("dark")}
        className={`px-2 py-1 flex items-center gap-1.5 text-xs font-medium rounded transition-all ${theme === "dark"
            ? "bg-zinc-700 text-white shadow"
            : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50"
          }`}
      >
        <Moon size={14} />
        Dark
      </button>

      <button
        onClick={() => setTheme("modern")}
        className={`px-2 py-1 flex items-center gap-1.5 text-xs font-medium rounded transition-all ${theme === "modern"
            ? "bg-gradient-to-r from-pink-500 to-violet-500 text-white shadow-[0_0_8px_rgba(236,72,153,0.5)] border border-violet-400/50"
            : "text-zinc-400 hover:text-pink-300 hover:bg-zinc-700/50"
          }`}
      >
        <Sparkles size={14} />
        Neon
      </button>
    </div>
  );
}
