import { cookies } from "next/headers";
import { THEME_COOKIE_KEY, THEME_DEFAULT, type Theme } from "@/lib/theme";

/**
 * Server-only theme cookie reader — Implementation Blueprint 4.4.
 *
 * Split out of lib/theme.ts specifically so this file's next/headers
 * import can never leak into a client bundle: only server-only call
 * sites (currently app/layout.tsx, a Server Component) import from
 * here. components/layout/ThemeProvider.tsx ("use client") imports
 * the constants/type from lib/theme.ts instead, which has no
 * server-only dependency at all.
 *
 * Uses a cookie (not localStorage) so the server can read the visitor's
 * theme preference during SSR and render the correct data-theme
 * attribute on <html> before any JavaScript runs — eliminating the
 * flash-of-wrong-theme a localStorage-only approach would cause on
 * every page load for a returning visitor who'd switched themes.
 */
export async function getThemeFromCookie(): Promise<Theme> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(THEME_COOKIE_KEY)?.value;
  return raw === "light" || raw === "dark" ? raw : THEME_DEFAULT;
}