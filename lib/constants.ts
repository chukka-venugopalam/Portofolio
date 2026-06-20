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

export const SITE_NAME = "[Your Name]"; // replace before launch

export const SITE_TAGLINE =
  "building systems that turn curiosity into shipped work.";

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

export const SOCIAL_LINKS = {
  github: "https://github.com/your-username",
  linkedin: "https://linkedin.com/in/your-username",
  email: "you@example.com",
} as const;
