/**
 * Single source of truth for site-wide values referenced across
 * metadata, navigation, and structured data. Per Implementation
 * Blueprint Section 7.3: SITE_URL must be the ONLY place a domain is
 * allowed to appear in this codebase. Every canonical tag, OG image,
 * and sitemap entry reads from this constant — never hardcode the
 * temporary *.vercel.app subdomain (or the eventual custom domain)
 * anywhere else, or it will silently survive the future domain swap.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const SITE_NAME = "Venugopalam Chukka";

export const SITE_TAGLINE =
  "Systems that reason. Interfaces that feel considered.";

export const HERO_TAGLINE_LINE_1 = "Systems that reason.";
export const HERO_TAGLINE_LINE_2 = "Interfaces that feel considered.";
export const HERO_STATUS_SUBLINE =
  "Project status below isn't a badge — shipped work renders at full clarity, active work renders a shade softer.";

/**
 * Navigation source of truth — per Implementation Blueprint Section
 * 6.4, both the desktop Navbar and the mobile overlay panel import from
 * this single array rather than duplicating the link list in two
 * component files.
 */
export const NAV_ITEMS = [
  { href: "/work", label: "Work" },
  { href: "/learning", label: "Learning" },
  { href: "/resume", label: "Resume" },
  { href: "/connect", label: "Connect" },
] as const;

/**
 * Shared "Now" status line — current focus area + date, displayed
 * consistently across Home, Work, and Connect pages. Update this one
 * value when focus shifts, and every page stays in sync.
 */
export const NOW_STATUS = {
  line: "Building AI-driven diagnostics, real-time collective intelligence, and adaptive learning systems.",
  date: "Jul 2026",
} as const;

export const SOCIAL_LINKS = {
  github: "https://github.com/chukka-venugopalam",
  linkedin: "https://linkedin.com/in/venugopal-chukka-baa17a402",
  email: "chukkavenugopalam@gmail.com",
  leetcode: "https://leetcode.com/u/xifpLOmHqY/",
} as const;
