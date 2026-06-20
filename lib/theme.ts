/**
 * Client-safe theme constants and types — Implementation Blueprint 4.4.
 *
 * Deliberately contains NO import of next/headers (or anything else
 * server-only). ThemeProvider.tsx ("use client") imports THEME_COOKIE_KEY
 * and THEME_DEFAULT from this file — if this file also imported
 * next/headers at module scope (as it previously did, in a single
 * combined lib/theme.ts), that server-only import would leak into the
 * client bundle through the shared module graph, which is exactly what
 * broke the Vercel build ("You're importing a component that needs
 * next/headers"). The actual cookie-reading logic now lives in
 * lib/theme.server.ts, a separate file imported only by server-only
 * call sites (currently just app/layout.tsx).
 */

export type Theme = "dark" | "light";

export const THEME_COOKIE_KEY = "portfolio-theme" as const;
export const THEME_DEFAULT: Theme = "dark";