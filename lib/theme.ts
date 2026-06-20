// lib/theme.ts
import { cookies } from "next/headers";

export type Theme = "dark" | "light";

export const THEME_COOKIE_KEY = "portfolio-theme" as const;
export const THEME_DEFAULT: Theme = "dark";

export async function getThemeFromCookie(): Promise<Theme> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(THEME_COOKIE_KEY)?.value;
  return raw === "light" || raw === "dark" ? raw : THEME_DEFAULT;
}