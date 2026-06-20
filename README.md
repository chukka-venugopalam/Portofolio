# Portfolio — Project Scaffold

This is the V1 scaffold built from the Strategic & Technical Specification, Visual Design Specification, Component Library, and Implementation Blueprint already produced for this project. It contains every configuration file, the App Router structure, the content-loading and validation layer, and SEO/structured-data plumbing — **no page UI has been implemented yet**, by design (see "What's intentionally not here" below).

## Stack actually used, and two corrections worth knowing about

The original Implementation Blueprint assumed Tailwind v3 (a `tailwind.config.ts` with `theme.extend`) and left the MDX tooling choice open between Contentlayer and `next-mdx-remote`. Building this scaffold against current reality changed both:

**Tailwind v4** is now the correct default for a new project, not v3. V4 replaces the JS-based config file with a CSS-first `@theme` block living directly in `app/globals.css`. Every token from the Visual Design Spec is still mapped exactly as planned — `bg-bg-primary`, `text-display-xl`, `p-space-6` all resolve correctly — only the mechanism changed. There is no `tailwind.config.ts` in this scaffold; that's correct for v4, not a missing file.

**MDX tooling**: both candidates considered in the Implementation Blueprint are now risky. Contentlayer is unmaintained, and `next-mdx-remote` (the proposed fallback) was archived by its maintainer in April 2026. This scaffold uses **`next-mdx-remote-client`**, an actively maintained fork with full React Server Components support, which is the better fit for content living outside `app/` (our `content/projects/` and `content/learning/` directories) — `@next/mdx`'s official pattern requires content to live inside `app/` as `page.mdx` files, which doesn't match this project's architecture.

One more naming note: Framer Motion was rebranded to **Motion** in 2025. The `framer-motion` package still works, but `package.json` installs the current `motion` package, imported as `motion/react` rather than `framer-motion`.

## Setup

1. `npm install`
2. Copy `.env.local.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL` to your Vercel preview URL (e.g. `https://your-project.vercel.app`).
3. Add real font files to `public/fonts/` — see `app/layout.tsx`'s `localFont` calls for the exact filenames expected (Space Grotesk weights 500/600, Inter weights 400/500/600, JetBrains Mono weight 500). Until these exist, the build will fail at the font-loading step; this is intentional rather than silently falling back, so a missing font asset is caught immediately.
4. Add your first project: copy the shape described in `content/projects/_schema.ts` into a new `content/projects/your-slug.mdx` file, with frontmatter plus the five required section headings (`## The Problem`, `## What It Does`, `## How It's Built`, `## Decisions & Tradeoffs`, `## What's Next`) in the body. Exactly one project across the whole collection needs `featured: true`.
5. `npm run dev`

## What's intentionally not here

Per this task's scope, no component implementations exist yet — `components/ui/`, `components/layout/`, etc. are empty directories. Every `page.tsx` is a structural placeholder returning `null`, just enough to validate routing, metadata, and `generateStaticParams` wiring. `ThemeProvider`'s actual cookie-reading/theme-persistence logic (Implementation Blueprint Section 4.4) is real component logic and isn't implemented in `app/layout.tsx` yet — that file documents what's needed via comments instead. Building out the 19 components from the Component Library against this scaffold is the next task.

## Where things live, and why

See the accompanying "Project Structure — Explained" document for a complete file-by-file walkthrough. The short version: `app/` is routing and rendering only; all content lives in `content/`; `lib/content/` is the validated, typed bridge between the two; `lib/seo/` and the root-level `sitemap.ts`/`robots.ts`/`opengraph-image.tsx` implement the SEO strategy; everything reads the live domain from a single `SITE_URL` constant so the eventual swap from a temporary subdomain to a real domain is a one-line environment variable change.
