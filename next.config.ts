import type { NextConfig } from "next";

/**
 * Next.js configuration.
 *
 * Note on MDX: this project does NOT use @next/mdx's page-extension approach
 * (i.e. .mdx files living inside app/ as page.mdx). Content lives in
 * /content/projects and /content/learning and is rendered through
 * next-mdx-remote-client inside ordinary .tsx route files — see
 * lib/content/projects.ts and lib/content/learning.ts. That's why
 * `pageExtensions` below stays at the default (no 'mdx' added) and there's
 * no `createMDX()` wrapper here. If a future version moves to colocated
 * .mdx page files instead, this file is the place that decision gets
 * reflected.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Every route in this project is statically generated at build time
  // (see the Implementation Blueprint, Section 6.1) — no server-only
  // features are needed here. This is left implicit (Next.js infers
  // static generation per-route automatically); nothing forces it
  // globally, since a future route that genuinely needs server rendering
  // shouldn't be blocked by an overly strict global setting.

  images: {
    // Project screenshots are served from /public/images/projects via
    // next/image (Implementation Blueprint Section 8.3). No remote image
    // domains are configured because V1 has no remote image sources —
    // add a `remotePatterns` entry here only if a future project's MDX
    // references an externally-hosted image.
    formats: ["image/avif", "image/webp"],
  },

  // typedRoutes was considered here (catches broken internal Links at
  // build time) but is deliberately left OFF: this project includes
  // Link instances pointing to static assets (e.g. /resume.pdf from
  // ConnectStrip.tsx) which are not part of Next.js's Route type,
  // and the typed-routes constraint would force unnecessary casts or
  // workarounds for legitimate static-file navigation.
};

export default nextConfig;
