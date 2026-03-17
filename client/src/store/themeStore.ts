import { create } from "zustand";

export type Theme = "light" | "dark" | "modern";

type ThemeStore = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

// Retrieve initial theme from localStorage or default to "dark"
const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem("collabcore-theme") as Theme | null;
  if (stored && ["light", "dark", "modern"].includes(stored)) {
    return stored;
  }
  return "dark";
};

// Apply the theme to the root HTML element
const applyThemeToDOM = (theme: Theme) => {
  if (typeof window !== "undefined") {
    document.documentElement.setAttribute("data-theme", theme);
    if (theme === "dark" || theme === "modern") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }
};

const initialTheme = getInitialTheme();
applyThemeToDOM(initialTheme);

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: initialTheme,
  setTheme: (theme) => {
    localStorage.setItem("collabcore-theme", theme);
    applyThemeToDOM(theme);
    set({ theme });
  },
}));
