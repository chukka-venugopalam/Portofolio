"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { THEME_COOKIE_KEY, THEME_DEFAULT, type Theme } from "@/lib/theme";

/**
 * ThemeProvider + useTheme
 *
 * Manages the dark/light theme toggle — Implementation Blueprint 4.4.
 *
 * Architecture decisions:
 *
 * 1. Cookie-backed persistence: the theme cookie is set by this client
 *    component on every toggle, and read by the server in lib/theme.ts
 *    to set the initial data-theme attribute on <html> before hydration.
 *    This eliminates the flash-of-wrong-theme that localStorage-only
 *    approaches produce (localStorage can't be read server-side, so a
 *    stored light preference produces a brief dark flash on every load).
 *
 * 2. Respects prefers-color-scheme on first visit: if no cookie exists
 *    yet, we read the OS-level preference as the initial resolved theme
 *    before the user makes an explicit choice. After a manual toggle,
 *    the explicit choice takes over and prefers-color-scheme is ignored.
 *
 * 3. Instant DOM update: we set data-theme on <html> synchronously
 *    inside the toggle handler (before React re-renders) so the visual
 *    change happens immediately rather than waiting for a render cycle.
 *    React's state update follows for re-render, but the user already
 *    sees the correct theme.
 *
 * 4. Reduced-motion awareness: ThemeToggle consumes useReducedMotion()
 *    from Motion — this provider doesn't need to handle it, but the
 *    globals.css @media rule provides the CSS-level fallback for
 *    visitors without JS.
 */

interface ThemeContextValue {
  theme: Theme;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  children: React.ReactNode;
  /** Initial theme resolved server-side from the cookie (lib/theme.ts).
   *  Passed in by layout.tsx so the server and client start in sync. */
  initialTheme: Theme;
}

export function ThemeProvider({ children, initialTheme }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  // On first client mount: reconcile with prefers-color-scheme if no
  // explicit cookie preference has been set yet. We detect "no preference
  // stored" by checking whether initialTheme === THEME_DEFAULT (the
  // server fallback used when no cookie exists). If initialTheme differs
  // from the default, a real cookie existed — the user made an explicit
  // choice we should honour over the OS setting.
  useEffect(() => {
    if (initialTheme !== THEME_DEFAULT) return; // explicit choice — don't override
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const resolved: Theme = systemPrefersDark ? "dark" : "light";
    if (resolved !== theme) {
      applyTheme(resolved);
      setTheme(resolved);
    }
    // Run once on mount only — subsequent changes handled by the toggle.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = useCallback(() => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    applyTheme(next);
    setTheme(next);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

/** Sets data-theme on <html> + writes the cookie synchronously. */
function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  document.cookie = `${THEME_COOKIE_KEY}=${theme}; path=/; max-age=31536000; SameSite=Lax`;
}

/** Consume the theme context. Throws if used outside ThemeProvider. */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used inside <ThemeProvider>");
  }
  return ctx;
}
