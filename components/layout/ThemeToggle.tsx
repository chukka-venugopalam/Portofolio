"use client";

import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/layout/ThemeProvider";

/**
 * ThemeToggle
 *
 * The sun/moon icon button that swaps between dark and light themes.
 * Sits in the Navbar's right end at every breakpoint.
 *
 * Design spec (Component Library A2):
 * - Icon-only, 32px touch target minimum
 * - aria-label updates with current state ("Switch to light theme" / "…dark")
 * - Pressed state: 4% scale-down, 100ms, standard ease (no bounce)
 * - Icon crossfade between sun/moon: motion-fast (150ms)
 * - Respects prefers-reduced-motion — no animation when reduced
 *
 * Convention note (Component Library A2): the icon shown represents
 * the theme you'll SWITCH TO, not the current theme. Moon = "go dark",
 * Sun = "go light". This is the more common and intuitive convention.
 */

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const reducedMotion = useReducedMotion();

  const isDark = theme === "dark";
  const label = isDark ? "Switch to light theme" : "Switch to dark theme";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      className={cn(
        // Layout
        "relative flex h-9 w-9 items-center justify-center rounded-pill",
        // Colors
        "text-text-secondary",
        // Hover
        "hover:bg-bg-tertiary hover:text-text-primary",
        // Transition
        !reducedMotion && "transition-colors duration-fast ease-standard",
        // Focus
        "focus-visible:outline-none focus-visible:focus-ring",
        className
      )}
    >
      {/* Sun icon — shown when in dark mode (click to go light) */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-0 flex items-center justify-center",
          !reducedMotion && "transition-opacity duration-fast ease-standard",
          isDark ? "opacity-100" : "opacity-0"
        )}
      >
        <SunIcon />
      </span>

      {/* Moon icon — shown when in light mode (click to go dark) */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-0 flex items-center justify-center",
          !reducedMotion && "transition-opacity duration-fast ease-standard",
          isDark ? "opacity-0" : "opacity-100"
        )}
      >
        <MoonIcon />
      </span>
    </button>
  );
}

/* ── Inline SVG icons — no external icon library dependency ── */

function SunIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
