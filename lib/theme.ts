"use server";

import { cookies } from "next/headers";

/**
 * Theme system foundation — Implementation Blueprint Section 4.4.
 *
 * Uses a cookie (not localStorage) so the server can read the visitor's
 * theme preference during SSR and render the correct data-theme attribute
 * on <html> before any JavaScript runs. A localStorage-only approach
 * would cause a visible flash from dark→light (or vice versa) on every
 * page load for a returning visitor who switched themes, because
 * localStorage can't be read until JS hydrates client-side.
 */

export type Theme = "dark" | "light";

export const THEME_COOKIE_KEY = "portfolio-theme" as const;
export const THEME_DEFAULT: Theme = "dark";

/**
 * Reads the theme cookie on the server. Called from layout.tsx to set
 * the initial data-theme attribute on <html> before client hydration.
 * Returns the default theme if no cookie is set or the value is invalid.
 */
export async function getThemeFromCookie(): Promise<Theme> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(THEME_COOKIE_KEY)?.value;
  return raw === "light" || raw === "dark" ? raw : THEME_DEFAULT;
}
