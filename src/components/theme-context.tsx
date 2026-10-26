"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { gsap } from "gsap";

export type VaultTheme = "obsidian" | "alabaster";

interface ThemeContextType {
  theme: VaultTheme;
  isDark: boolean;
  colorMode: "dark" | "light";
  toggleTheme: () => void;
  setTheme: (theme: VaultTheme) => void;
}

const THEME_STORAGE_KEY = "vault-vogue-theme";
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<VaultTheme>("obsidian");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY) as VaultTheme | null;
    if (saved === "obsidian" || saved === "alabaster") {
      setThemeState(saved);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setThemeState(prefersDark ? "obsidian" : "alabaster");
    }
    setMounted(true);
  }, []);

  const applyThemeToDOM = useCallback((nextTheme: VaultTheme, animate = false) => {
    const root = document.documentElement;
    const body = document.body;
    const isDark = nextTheme === "obsidian";

    root.setAttribute("data-vault-theme", nextTheme);
    root.style.colorScheme = isDark ? "dark" : "light";
    root.classList.toggle("dark", isDark);
    root.classList.toggle("light", !isDark);
    root.classList.add("vault-storefront");

    if (body) {
      body.setAttribute("data-vault-theme", nextTheme);
      body.classList.toggle("dark", isDark);
      body.classList.toggle("light", !isDark);
      body.classList.add("vault-storefront");

      if (animate && typeof window !== "undefined") {
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (!reduceMotion) {
          gsap.fromTo(
            body,
            { opacity: 0.94 },
            { opacity: 1, duration: 0.35, ease: "power2.out" },
          );
        }
      }
    }

    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    // Backward compatibility for legacy code checking 'theme' key
    window.localStorage.setItem("theme", isDark ? "dark" : "light");
  }, []);

  useEffect(() => {
    if (mounted) {
      applyThemeToDOM(theme, false);
    }
  }, [theme, mounted, applyThemeToDOM]);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const nextTheme = prev === "obsidian" ? "alabaster" : "obsidian";
      applyThemeToDOM(nextTheme, true);
      return nextTheme;
    });
  }, [applyThemeToDOM]);

  const setTheme = useCallback(
    (nextTheme: VaultTheme) => {
      setThemeState(nextTheme);
      applyThemeToDOM(nextTheme, true);
    },
    [applyThemeToDOM],
  );

  const isDark = theme === "obsidian";
  const colorMode: "dark" | "light" = isDark ? "dark" : "light";

  const value = useMemo(
    () => ({
      theme,
      isDark,
      colorMode,
      toggleTheme,
      setTheme,
    }),
    [theme, isDark, colorMode, toggleTheme, setTheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      <div data-vault-theme={theme} className="vault-storefront min-h-screen">
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
