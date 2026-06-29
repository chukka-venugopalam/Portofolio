# PROJECT_CONTEXT.md

> **AI Handoff Document** — This file gives any future AI assistant a complete understanding of this portfolio project before making changes. Automatically updated when major architectural or content changes occur.

---

## 1. Project Overview

### Purpose
A personal portfolio website for **Venugopalam Chukka** — a student, builder, and AI/ML engineer showcasing flagship products, production projects, and learning in public. The site positions the owner as an ambitious AI engineer building startup-quality systems, not a student completing assignments.

### Target Audience
- **Recruiters** — need to assess engineering capability in under 60 seconds
- **Founders/Collaborators** — evaluating whether to build something together
- **Engineers** — inspecting architecture decisions and tradeoffs
- **Future self** — a dated, honest record of what was built and learned

### Personal Branding Strategy
- **Truth over polish** — honest status tags (Shipped/Building/Exploring), no "coming soon" placeholders, real dates on everything
- **Learn in public** — the Learning Log is a dated, falsifiable record of actual learning
- **Startup-quality framing** — flagship projects read as startup case studies with Vision, Architecture, Tradeoffs, and Roadmap
- **One flagship mindset** — visual weight matches actual substance, never promoted beyond real status

### Long-term Vision
Transition from portfolio → platform. The site should evolve into a living record of the owner's engineering career — each project a timestamped case study, each learning entry a data point in a genuine growth trajectory.

### Design Philosophy
- **Content-honesty model** — every visual treatment matches the actual substance of what's being shown
- **Lowest ornamentation that still communicates hierarchy** — no decorative elements, every pixel has purpose
- **Typography-forward** — Space Grotesk for display, Inter for body, JetBrains Mono for code/meta
- **Dark-first** — dark theme is default and primary; light theme is a respectful accommodation

### Engineering Philosophy
- **Fail loud at build time** — malformed project content fails the build rather than rendering silently broken pages
- **Content is data** — MDX files for projects, JSON for metadata, TypeScript schemas for validation
- **Static-first** — every route is statically generated at build time; zero server-side rendering at request time
- **Accessibility is non-negotiable** — screen reader navigation, keyboard operability, reduced motion, proper heading outlines


---

## 2. Current Status

| Attribute | Value |
|-----------|-------|
| Overall completion | ~70% |
| Development stage | Active development (V1) |
| Last updated | June 29, 2026 |
| Current branch | `main` |
| Deployment | Not yet deployed to production |
| Latest production URL | TODO |
| Build status | ✅ Passing (exit code 0) |
| Known issues | See Known Issues section |
| Pending improvements | Social links need real URLs, resume PDF placeholder, Learning Log has no .mdx entries |

---

## 3. Tech Stack

| Category | Technology | Version |
|----------|------------|---------|
| **Framework** | Next.js (App Router) | ^15.5.0 |
| **UI Library** | React | ^19.0.0 |
| **Language** | TypeScript | ^5.7.0 |
| **Styling** | Tailwind CSS | ^4.0.0 |
| **Animation** | Motion (framer-motion successor) | ^12.0.0 |
| **Content** | MDX via next-mdx-remote-client | ^2.1.0 |
| **Validation** | Zod | ^3.24.0 |
| **Date handling** | date-fns | ^4.1.0 |
| **CSS utilities** | clsx + tailwind-merge | latest |
| **Package manager** | npm | — |
| **Linting** | ESLint (flat config) | ^9.17.0 |
| **Deployment target** | Vercel | — |

### No Backend
This is a fully static site. No database, no API, no authentication. All content is read from the filesystem at build time via `readFileSync`/`readdirSync` with defensive error handling for Vercel's serverless environment.


---

## 4. Folder Structure

### `app/` — Next.js App Router Pages
Every route in the application. Uses the file-system-based routing convention.

| Path | Responsibility |
|------|----------------|
| `app/layout.tsx` | Root layout — fonts, ThemeProvider, Navbar, Footer, JSON-LD script |
| `app/page.tsx` | Home page — Hero, FrameworkStrip, Flagship Projects, Learning Pulse, Connect Strip |
| `app/not-found.tsx` | Site-wide 404 page |
| `app/globals.css` | Single CSS file: theme tokens, Tailwind config, shared utilities, base styles |
| `app/robots.ts` | Dynamic robots.txt |
| `app/sitemap.ts` | Dynamic sitemap.xml from `getAllProjects()` |
| `app/opengraph-image.tsx` | Default OG image via `ImageResponse` |
| `app/work/page.tsx` | Work page — three sections: Flagship, Production, Experiments |
| `app/work/loading.tsx` | Skeleton state for Work page |
| `app/work/[slug]/page.tsx` | Project detail page — MDX rendering via next-mdx-remote-client |
| `app/work/[slug]/not-found.tsx` | Project-specific 404 |
| `app/learning/page.tsx` | Learning Log — year-grouped entries, stats |
| `app/resume/page.tsx` | Resume page — snapshot, highlights, PDF embed |
| `app/connect/page.tsx` | Connect page — opportunity tags, contact methods, CTA |

### `components/` — Reusable UI Components
Organized by domain, not by type.

| Directory | Contents |
|-----------|----------|
| `components/ui/` | Primitives: Button, Container, Section, SectionHeader, StatusTag, TechTag |
| `components/layout/` | Structural: Navbar, Footer, ThemeProvider, ThemeToggle, MobileNavOverlay |
| `components/home/` | Home-specific: Hero, FrameworkStrip |
| `components/project/` | Project-related: ProjectCard, ProjectHeader, TradeoffsBlock, StatusFooter, BackLink, AlsoBuildingEntry |
| `components/learning/` | Learning-related: LearningEntry, YearDivider |
| `components/resume/` | Resume-specific: ResumeSummaryBlock, PDFViewerContainer |
| `components/connect/` | Connect: ConnectStrip |

### `lib/` — Shared Logic and Data Access

| File | Responsibility |
|------|----------------|
| `lib/constants.ts` | Single source of truth: SITE_NAME, SITE_URL, NAV_ITEMS, SOCIAL_LINKS |
| `lib/utils.ts` | `cn()` for class merging, date formatters |
| `lib/theme.ts` | Theme types and constants (client-safe) |
| `lib/theme.server.ts` | Cookie-based theme detection (server-only) |
| `lib/resume.ts` | Resume content + `getResumePdfStatus()` |
| `lib/content/projects.ts` | Project content functions |
| `lib/content/learning.ts` | Learning entry functions |
| `lib/content/also-building.ts` | Also-building entry functions |
| `lib/seo/metadata.ts` | `buildMetadata()` and `buildHomeMetadata()` |
| `lib/seo/structured-data.ts` | `buildPersonJsonLd()` and `buildProjectJsonLd()` |

### `content/` — Content Files

| Path | Contents |
|------|----------|
| `content/projects/_schema.ts` | Zod schemas for project frontmatter |
| `content/projects/concept-intelligence-platform.mdx` | Flagship: AI diagnostic for DSA |
| `content/projects/silicon-valley-learning-os.mdx` | Flagship: AI learning operating system |
| `content/projects/pulse-vote.mdx` | Flagship: real-time decision-making platform |
| `content/projects/silicon-city.mdx` | Production: urban data dashboard |
| `content/learning/_schema.ts` | Zod schema for learning entries |
| `content/also-building.json` | JSON array of one-liner entries |


---

## 5. Route Map

| Route | Purpose | Completion | Major Components | Notes |
|-------|---------|------------|------------------|-------|
| `/` | Home | 100% | Hero, FrameworkStrip, ProjectCard, LearningEntry, ConnectStrip | All sections functional |
| `/work` | Project listing — 3 categories | 100% | SectionHeader, ProjectCard, AlsoBuildingEntry, StatusTag | Flagship/Production/Experiments |
| `/work/[slug]` | Project detail | 100% | ProjectHeader, MDXRemote, TradeoffsBlock, StatusFooter, BackLink | Statically generated |
| `/learning` | Learning Log | 90% | LearningEntry, YearDivider, StatItem | No .mdx entries yet |
| `/resume` | Resume page | 90% | ResumeSummaryBlock, PDFViewerContainer | PDF doesn't exist yet |
| `/connect` | Contact page | 100% | ConnectStrip (page variant), Button | Full contact rows |
| `/sitemap.xml` | Dynamic sitemap | 100% | — | Generated from projects |
| `/robots.txt` | Robots file | 100% | — | Allows all crawling |
| `/opengraph-image` | Default OG image | 100% | ImageResponse | Dark-themed |

---

## 6. Component Inventory

### UI Primitives

#### `Button` (`components/ui/Button.tsx`)
- **Purpose**: Universal CTA — exactly 2 variants (primary/secondary)
- **Used in**: Hero, ProjectCard, ProjectHeader, ConnectStrip, not-found pages, PDFViewerContainer
- **Dependencies**: `Link` from next/link, `cn()`
- **Notes**: Renders as `<Link>` when `href` is provided, `<button>` when `onClick` is provided. No "looks like a link" mode. Hover: 1px upward translateY.

#### `Container` (`components/ui/Container.tsx`)
- **Purpose**: Horizontal rhythm — max-width 1200px centered, responsive padding
- **Used in**: Every page section
- **Dependencies**: `cn()`
- **Notes**: Padding scales per breakpoint (20px → 32px → 40px). `wide` prop removes max-width cap.

#### `Section` (`components/ui/Section.tsx`)
- **Purpose**: Vertical spacing between content blocks
- **Used in**: Every page
- **Dependencies**: `cn()`
- **Notes**: 4 spacing levels: home (128px), secondary (96px), tight (64px), none.

#### `SectionHeader` (`components/ui/SectionHeader.tsx`)
- **Purpose**: Section heading — label mode (compact uppercase) or page mode (display H1 + subline)
- **Used in**: Every page with sections
- **Dependencies**: `cn()`
- **Notes**: Two modes never mix on same page. Heading level controlled by `level` prop.

#### `StatusTag` (`components/ui/StatusTag.tsx`)
- **Purpose**: Project status indicator — shipped/building/exploring
- **Used in**: ProjectCard, ProjectHeader, AlsoBuildingEntry, Work page empty states
- **Dependencies**: `cn()`, `ProjectStatus` type
- **Notes**: Color dot + text label. Non-interactive. Never color-only.

#### `TechTag` / `TechTagList` (`components/ui/TechTag.tsx`)
- **Purpose**: Technology badges
- **Used in**: ProjectCard, ProjectHeader
- **Dependencies**: `cn()`
- **Notes**: Single variant. Real `<ul>`/`<li>` for accessibility.

### Layout Components

#### `Navbar` (`components/layout/Navbar.tsx`)
- **Purpose**: Sticky top nav — scroll blur, active route indicator, responsive
- **Used in**: layout.tsx
- **Dependencies**: NAV_ITEMS, SITE_NAME, ThemeToggle, MobileNavOverlay
- **Notes**: 72px/64px. Scroll blur at 8px. Mobile hamburger + overlay.

#### `Footer` (`components/layout/Footer.tsx`)
- **Purpose**: Site footer — name, copyright, social icons
- **Used in**: layout.tsx
- **Dependencies**: SITE_NAME, SOCIAL_LINKS, Container
- **Notes**: Static server component. Desktop: row. Mobile: stacked.

#### `ThemeProvider` (`components/layout/ThemeProvider.tsx`)
- **Purpose**: Dark/light theme management
- **Used in**: layout.tsx
- **Dependencies**: Theme constants
- **Notes**: Cookie-backed. Respects prefers-color-scheme. Instant DOM update.

#### `ThemeToggle` (`components/layout/ThemeToggle.tsx`)
- **Purpose**: Sun/moon icon toggle
- **Used in**: Navbar
- **Dependencies**: useTheme, useReducedMotion
- **Notes**: Icon = theme you switch TO. Icon crossfade.

#### `MobileNavOverlay` (`components/layout/MobileNavOverlay.tsx`)
- **Purpose**: Full-screen mobile nav panel
- **Used in**: Navbar
- **Dependencies**: NAV_ITEMS, SITE_NAME, motion, AnimatePresence
- **Notes**: Focus trap, Escape to close, body scroll lock.

### Home Components

#### `Hero` (`components/home/Hero.tsx`)
- **Purpose**: Home page hero — headline, subline, focus, CTAs
- **Used in**: Home page
- **Dependencies**: Button, Link, motion
- **Notes**: Staggered fade-up (80ms offset). Mobile: secondary CTA as text link.

#### `FrameworkStrip` (`components/home/FrameworkStrip.tsx`)
- **Purpose**: Curiosity→Learning→Understanding→Building→Impact narrative
- **Used in**: Home page
- **Dependencies**: motion, AnimatePresence, useReducedMotion
- **Notes**: One node expanded at a time. Arrow-key nav. Scrollable on mobile.

### Project Components

#### `ProjectCard` (`components/project/ProjectCard.tsx`)
- **Purpose**: Project proof unit — 2 variants (flagship/grid)
- **Used in**: Home, Work pages
- **Dependencies**: Link, StatusTag, TechTagList, Button
- **Notes**: NOT one giant clickable div. Multiple individually focusable links.

#### `ProjectHeader` (`components/project/ProjectHeader.tsx`)
- **Purpose**: Opening block of project detail page
- **Used in**: work/[slug]/page.tsx
- **Dependencies**: StatusTag, TechTagList, Button
- **Notes**: Single variant. Missing links handled gracefully.

#### `TradeoffsBlock` (`components/project/TradeoffsBlock.tsx`)
- **Purpose**: "Decisions & Tradeoffs" — the most differentiated section
- **Used in**: work/[slug]/page.tsx
- **Dependencies**: motion (client component)
- **Notes**: Only bg-tertiary fill + accent left border. Animated border entrance (0→4px).

#### `StatusFooter` (`components/project/StatusFooter.tsx`)
- **Purpose**: Project metadata — started/last updated dates
- **Used in**: work/[slug]/page.tsx
- **Dependencies**: formatFullDate
- **Notes**: text-tertiary. Real `<time>` elements.

#### `BackLink` (`components/project/BackLink.tsx`)
- **Purpose**: Navigation back to Work page
- **Used in**: work/[slug]/page.tsx
- **Dependencies**: Link, cn
- **Notes**: `<a>` to `/work` — never router.back().

#### `AlsoBuildingEntry` (`components/project/AlsoBuildingEntry.tsx`)
- **Purpose**: One-liner project entries (no detail page)
- **Used in**: Home, Work pages
- **Dependencies**: StatusTag
- **Notes**: No card chrome, no tech tags, no links.

### Learning Components

#### `LearningEntry` (`components/learning/LearningEntry.tsx`)
- **Purpose**: Atomic learning log unit — 2 variants (preview/full)
- **Used in**: Home, Learning pages
- **Dependencies**: Link, formatCompactDate
- **Notes**: Lowest-ornamentation component. No card border.

#### `YearDivider` (`components/learning/YearDivider.tsx`)
- **Purpose**: Groups entries by calendar year
- **Used in**: Learning page
- **Dependencies**: cn
- **Notes**: Real `<h2>`. Border rule extends right of year text.

### Resume Components

#### `ResumeSummaryBlock` (`components/resume/ResumeSummaryBlock.tsx`)
- **Purpose**: Quick Snapshot — name, status, focus
- **Used in**: Resume page
- **Dependencies**: cn
- **Notes**: bg-secondary + border-default. Reading order = visual order.

#### `PDFViewerContainer` / `ResumeDownloadButton` (`components/resume/PDFViewerContainer.tsx`)
- **Purpose**: Inline PDF embed + download CTA
- **Used in**: Resume page
- **Dependencies**: Button, cn
- **Notes**: 8.5:11 aspect ratio. Missing PDF fallback. Accessible iframe.

### Connect Components

#### `ConnectStrip` (`components/connect/ConnectStrip.tsx`)
- **Purpose**: Conversion surface — 2 variants (home/page)
- **Used in**: Home, Connect pages
- **Dependencies**: Button, Link, motion, SOCIAL_LINKS, cn
- **Notes**: Home: icon row. Page: labeled rows. Copy button with "Copied" state.


---

## 7. Design System

### Typography

| Token | Family | Size | Weight | Line Height | Letter Spacing |
|-------|--------|------|--------|-------------|----------------|
| display-xl | Space Grotesk | 72px | 600 | 1.05 | -0.02em |
| display-lg | Space Grotesk | 56px | 600 | 1.1 | -0.02em |
| heading-lg | Space Grotesk | 32px | 600 | 1.2 | — |
| heading-md | Space Grotesk | 24px | 600 | 1.3 | — |
| heading-sm | Space Grotesk | 18px | 600 | 1.4 | — |
| body-lg | Inter | 18px | 400 | 1.6 | — |
| body-md | Inter | 16px | 400 | 1.6 | — |
| body-sm | Inter | 14px | 400 | 1.5 | — |
| mono-md | JetBrains Mono | 14px | 500 | 1.4 | 0.02em |
| mono-sm | JetBrains Mono | 12px | 500 | 1.4 | 0.02em |

### Color Palette

**Dark Theme (default):**
- bg-primary: #0a0a0b, bg-secondary: #121214, bg-tertiary: #1a1a1d
- border-subtle: #262629, border-default: #34343a
- text-primary: #f2f2f0, text-secondary: #a3a3aa, text-tertiary: #6b6b72
- accent: #5eead4, accent-dim: #1f5f58
- status: shipped #5eead4, building #a78bfa, exploring #6b6b72

**Light Theme:**
- bg-primary: #fafaf9, bg-secondary: #ffffff, bg-tertiary: #f0f0ee
- border-subtle: #e5e5e2, border-default: #d4d4d0
- text-primary: #16161a, text-secondary: #5c5c63, text-tertiary: #8c8c92
- accent: #0d9488, accent-dim: #0f766e
- status: shipped #0d9488, building #7c3aed, exploring #8c8c92

### Spacing Scale
space-1 (4px), space-2 (12px), space-3 (16px), space-5 (24px), space-6 (48px), space-7 (64px), space-8 (96px), space-9 (128px), space-10 (160px)

### Border Radius
- card: 10px, pill: 6px

### Animation Philosophy
Purposeful, not decorative. Fast by default: hover 150ms, scroll reveal 250ms, expand 400ms.
Respects reduced motion. Two easing curves: standard (0.4, 0, 0.2, 1), expand (0.16, 1, 0.3, 1).

### Responsive Breakpoints
- Mobile: < 600px (default), Tablet: >= 600px, Desktop: >= 1024px

### Accessibility Rules
- All interactive elements focusable/keyboard-operable
- Focus ring: 2px accent outline + 2px offset
- Color dot + text label on status tags (never color-only)
- Semantic heading outline on every page
- Skip-to-content link at top of every page
- Icon-only links carry aria-label
- aria-current="page" on active nav links
- Real ul/ol for lists (screen reader navigation)
- prefers-reduced-motion respected at CSS and JS levels
- Copy status announced via aria-live

---

## 8. Content System

All content is read from the filesystem at build time. No database, no CMS, no API.

### Projects
- Stored as `.mdx` files in `content/projects/`
- Validated via Zod schema (`_schema.ts`) — invalid project fails the build
- Each project has required frontmatter: name, slug, status, category, oneLiner, techTags, links, startedDate, lastUpdated
- Body split into 5 required sections by heading: The Problem, What It Does, How It's Built, Decisions & Tradeoffs, What's Next
- Loaded via `lib/content/projects.ts` — `readdirSync` + `readFileSync` with defensive error handling

### Learning Entries
- Stored as `.mdx` files in `content/learning/`
- Currently zero entries (empty state renders gracefully)
- Loaded via `lib/content/learning.ts`

### Also-Building Entries
- Stored as `content/also-building.json`
- Simple JSON array with name, status, description
- Loaded via `lib/content/also-building.ts`

### Resume
- Static content in `lib/resume.ts` — no separate file
- PDF availability checked at build time via `existsSync`

### SEO
- Metadata built via `lib/seo/metadata.ts` — canonical, OG, Twitter cards
- Structured data via `lib/seo/structured-data.ts` — Person + SoftwareSourceCode schemas
- Dynamic sitemap from `getAllProjects()`
- OG image generated via `ImageResponse` (dark-themed)

---

## 9. Flagship Projects

### Concept Intelligence Platform
- **Status**: Building
- **Vision**: An AI diagnostic that finds gaps in DSA understanding, not just whether you solved a problem
- **Tech**: Next.js, FastAPI, PostgreSQL, Supabase, Gemini 1.5 Flash, Python
- **Architecture**: 3 layers — Next.js frontend, FastAPI backend, AI layer (Gemini)
- **Roadmap**: Postgres schema → concept graph → API → frontend
- **Priority**: Primary — the most-developed project
- **Completion**: Design phase complete, implementation in progress

### Silicon Valley Learning OS
- **Status**: Building
- **Vision**: AI-powered learning operating system that adapts curriculum, schedule, and strategy in real time
- **Tech**: Next.js, FastAPI, PostgreSQL, Redis, Gemini 2.0 Pro, Docker, Kubernetes, Python
- **Architecture**: 5 microservices — Context Ingestion, Learning Graph, Curriculum Engine, Delivery, Analytics
- **Roadmap**: Context Ingestion → Learning Graph → MVP → GitLab/Bitbucket support → Analytics → API

### PulseVote
- **Status**: Building
- **Vision**: Real-time collective decision-making that surfaces authentic consensus, not just the loudest voice
- **Tech**: Next.js, FastAPI, WebSockets, PostgreSQL, Redis, Tailwind, Python
- **Architecture**: Session Service, Voting Engine, Real-time Broadcast (Redis Pub/Sub), Frontend, Persistence
- **Roadmap**: Core voting → real-group validation → recurring sessions → facilitator dashboard → pricing

---

## 10. Production Projects

### Silicon City
- **Purpose**: Real-time urban data dashboard — traffic, air quality, energy
- **Status**: Shipped
- **Deployment**: Vercel (demo link configured)
- **Stack**: Next.js, Python, PostgreSQL, Chart.js, Mapbox, Docker
- **Notes**: Batch-oriented data pipeline. Feature-complete for current scope.


---

## 11. Experimental Projects

| Name | Status | Description | Future Plans |
|------|--------|-------------|--------------|
| LLM Prompt Playground | Exploring | Interactive sandbox for comparing LLM prompt strategies | Possible full project page |
| Code Review Bot | Exploring | GitHub Action for test case and documentation suggestions | Integrate into SV Learning OS |
| Viz Explorer | Exploring | D3.js visualization experiments | Portfolio showcase piece |

---

## 12. Current Homepage

### Hero
- Headline: "building systems that turn curiosity into shipped work."
- Subline: "Student & builder — AI/ML, full-stack, cloud."
- Current focus: dynamically shows the first flagship project name
- CTAs: "View the work" (primary), "Get the resume" (secondary, renders as link on mobile)

### FrameworkStrip (Builder Snapshot)
- 5-stage narrative: Curiosity, Learning, Understanding, Building, Impact
- Each stage has a descriptive philosophy text
- Interactive: click to expand, one node at a time
- Animated panel with height transition (400ms, expand ease)

### Flagship Projects
- Shows all `category: "flagship"` projects
- Uses `ProjectCard` with `variant="flagship"` (larger, border-default, hover→accent)
- Shows: name, status tag, one-liner, tech tags, Writeup button

### Production Projects & Experiments
- Shows `category: "production"` projects as grid cards
- Shows experiments as one-liner `AlsoBuildingEntry` entries
- "See all work" button linking to `/work`

### Learning Pulse
- Shows 4 most recent learning entries (compact preview variant)
- "Full log →" link to `/learning`
- Only renders if there are entries (currently empty)

### Connect Strip
- Availability tags: Internships, Hackathons, Collaboration
- Icon row: Email, GitHub, LinkedIn, Resume PDF

### Navigation
- Sticky navbar with site name + nav links (Work, Learning, Resume, Connect)
- Theme toggle (dark/light)
- Current route highlighted with accent underline
- Mobile: hamburger opens overlay panel

---

## 13. Page-by-Page Analysis

### Home (`/`)
- **Purpose**: Portfolio entry point — make-or-break first impression
- **Content**: Hero, FrameworkStrip, Flagship Projects, Learning Pulse, Connect Strip
- **Strengths**: Clear narrative arc, honest status system, reusable components
- **Weaknesses**: No learning entries yet, social links are placeholders
- **Completion**: 100%

### Work (`/work`)
- **Purpose**: Project listing — organized by category
- **Content**: 3 sections — Flagship, Production, Experiments
- **Strengths**: Clear categorization, flagship variant for important projects, empty states handled
- **Weaknesses**: Only 1 production project, experiments are one-liners without detail pages
- **Completion**: 100%

### Project Detail (`/work/[slug]`)
- **Purpose**: Full project writeup — problem, solution, architecture, tradeoffs
- **Content**: Header + 5 prose sections + decisions block + status footer
- **Strengths**: Rich MDX content, structured sections, TradeoffsBlock is distinctive
- **Weaknesses**: No per-project OG images yet, no `public/images/projects/` screenshots
- **Completion**: 100%

### Learning (`/learning`)
- **Purpose**: Dated, falsifiable record of actual learning
- **Content**: Year-grouped entries, learning stats
- **Strengths**: Honest empty state, well-structured component hierarchy
- **Weaknesses**: Zero .mdx entries — page shows empty state only
- **Completion**: 90% (needs content)

### Resume (`/resume`)
- **Purpose**: Recruiter-friendly snapshot + PDF download
- **Content**: Quick Snapshot, Key Highlights, Download CTA, PDF embed, Last Updated
- **Strengths**: Honest missing-PDF fallback, recruiter-friendly layout
- **Weaknesses**: No PDF file yet, resume content is placeholder
- **Completion**: 90% (needs real content + PDF)

### Connect (`/connect`)
- **Purpose**: Conversion surface for recruiters and collaborators
- **Content**: Hero, ConnectStrip (page variant), Current Focus, CTA card
- **Strengths**: Copy button with success state, honest focus display
- **Weaknesses**: Social links are placeholders
- **Completion**: 100%

---

## 14. Portfolio Narrative

### How a Recruiter Should Experience It
1. Land on Home — see the tagline, immediately understand the positioning
2. Scan the FrameworkStrip — grasp the philosophy in 5 seconds
3. See flagship projects — judge engineering capability from real products
4. Visit Work page — see the full breadth, status system builds trust
5. Read a project detail — inspect architecture decisions and tradeoffs
6. Visit Resume — quick snapshot + PDF
7. Connect — easy to reach out

### How a Founder/Collaborator Should Experience It
1. Same flow as recruiter, but spend more time on the narrative (FrameworkStrip)
2. Read the "Currently" focus in Hero — see alignment with their interests
3. Read tradeoffs on flagship projects — evaluate engineering judgment
4. Check the Learning Log — see demonstrated growth, not static claims
5. Use Connect page's collaboration-friendly CTA — "Building something?"

### How an Engineer Should Experience It
1. Notice the dark theme and typography → good taste
2. Inspect the page source → clean TypeScript, proper accessibility
3. Read the TradeoffsBlock → real engineering decisions with reasoning
4. Check the "How It's Built" sections → no hand-waving
5. Notice the build-time validation → cares about correctness

### How an Investor Should Experience It
1. See three ambitious products being built simultaneously
2. Read the vision statements — each is a startup pitch
3. Notice the architecture diagrams (in prose) — can build at scale
4. Check the status system — honest about progress, no overclaiming

---

## 15. Architecture Decisions

### Why Next.js
- Industry standard for React-based static sites
- App Router provides file-based routing, layouts, metadata API
- Excellent Vercel deployment story

### Why App Router
- Server Components by default for static content
- Layout nesting for consistent header/footer
- Metadata API for SEO
- generateStaticParams for dynamic routes

### Why Current Folder Structure
- `app/` for pages (Next.js convention)
- `components/` organized by domain (not by type) — scales better than atomic design
- `lib/` for shared logic — clear separation from components
- `content/` for content — keeps data separate from code

### Why Current Design System
- CSS custom properties for theme tokens (no runtime CSS-in-JS overhead)
- Tailwind v4 for utility classes (no custom CSS except tokens)
- Single globals.css file (not multiple CSS modules)
- Dark-first with light as override

### Why Current Animation Approach
- Motion (framer-motion successor) for JS-driven animations
- CSS transitions for simple hover/color transitions
- useReducedMotion() checked in every client component
- Animations are purposeful, not decorative

### Tradeoffs
- Static-only means no real-time features (acceptable for portfolio)
- Filesystem content means no CMS for non-technical users (acceptable for solo dev)
- No test suite yet (acceptable for V1 portfolio)

### Rejected Alternatives
- No CSS-in-JS (emotion, styled-components) — adds runtime overhead without benefit for static site
- No app state management (Redux, Zustand) — no client state to manage
- No database — all content is static
- No CMS — content is managed via MDX files


---

## 16. Known Issues

| Issue | Priority | Status | Notes |
|-------|----------|--------|-------|
| Social links are placeholders (github: your-username) | High | TODO | Update in lib/constants.ts |
| Resume PDF doesn't exist at public/resume.pdf | Medium | TODO | Fallback renders gracefully |
| No learning entries (content/learning/ has no .mdx files) | Medium | TODO | Page shows empty state |
| getNonFlagshipProjects() is unused after category refactor | Low | TODO | Keep for future use or remove |
| Vercel ENOENT crash fixed with try-catch but not deployed | Low | Done | Already patched |
| No test suite | Low | TODO | Acceptable for V1 |
| No unit tests for content parsing | Low | TODO | |

---

## 17. Future Roadmap

### Immediate (Next)
- Update SOCIAL_LINKS with real GitHub, LinkedIn, email
- Add resume PDF to public/
- Create sample .mdx learning entries for content/learning/
- Deploy to Vercel

### Next Week
- Add real resume content in lib/resume.ts
- Create per-project OG images for app/work/[slug]/opengraph-image.tsx
- Add project screenshots to public/images/projects/

### Next Month
- Add actual .mdx learning entries to content/learning/
- Expand about-building.json with real experiment entries
- Write tests for content loading functions

### Long-term
- Transition from portfolio to platform (living career record)
- Add filtering on Work page (FilterChip component)
- System Map feature (V2 full-bleed section)
- Dark/light mode image optimization

### Dream Features
- AI-powered project summary generation
- Interactive architecture diagrams
- Real-time learning graph visualization
- Built-in blog/essays section

---

## 18. AI Instructions

When working on this project, follow these rules:

### Design Rules
- Always preserve design consistency with existing components
- Never change typography without explicit justification
- Never remove or reduce accessibility features
- Never break responsive layouts
- Always preserve existing animations unless explicitly instructed
- Use the existing component system (Button, Container, Section, SectionHeader) for new features
- Do NOT introduce new CSS files — use Tailwind utilities and globals.css tokens
- All SVG icons should be inline (no icon library imports)

### Code Rules
- Always run `npm run build` before finishing — fix any errors
- Fix all TypeScript errors (strict mode is enabled)
- Fix all ESLint warnings and errors
- Prefer reusable components over new ones
- Do not introduce unnecessary dependencies
- Use `@/` path aliases for imports
- New components must follow the existing pattern (cn() for classes, proper types)
- Client components only when necessary ("use client" only if using hooks or browser APIs)

### Content Rules
- All project content goes in content/projects/ as .mdx files
- All metadata goes in lib/constants.ts (single source of truth)
- All resume content goes in lib/resume.ts
- All "also building" entries go in content/also-building.json
- Content is validated at build time — invalid schema fails the build

### Git Rules
- Do NOT run git push, git commit, or any git commands unless the user explicitly asks
- Use descriptive commit messages

---

## 19. Important Files

### Configuration
| File | Why It Matters |
|------|----------------|
| `lib/constants.ts` | Single source of truth for SITE_NAME, SITE_URL, NAV_ITEMS, SOCIAL_LINKS — every reference to these values flows through here |
| `app/layout.tsx` | Root layout — sets up fonts, ThemeProvider, Navbar, Footer, JSON-LD, metadata defaults |
| `app/globals.css` | Entire design system in one file — theme tokens, Tailwind config, shared utilities |
| `tsconfig.json` | Strict mode, path aliases (@/ for src root), bundler module resolution |
| `next.config.ts` | Image optimization, static generation settings |
| `package.json` | All dependencies and scripts |

### Core Logic
| File | Why It Matters |
|------|----------------|
| `lib/content/projects.ts` | Project content loading — getAllProjects, getProjectsByCategory, parseTradeoffs |
| `lib/content/learning.ts` | Learning entry loading — getAllLearningEntries, getLearningStats |
| `lib/content/also-building.ts` | Also-building entry loading |
| `lib/resume.ts` | Resume content + PDF availability check |
| `lib/seo/metadata.ts` | Consistent metadata generation across all pages |
| `lib/seo/structured-data.ts` | JSON-LD structured data for SEO |
| `lib/utils.ts` | cn() utility is used in every component |
| `lib/theme.ts` | Theme types and constants |
| `lib/theme.server.ts` | Server-only cookie-based theme detection |

### Pages
| File | Why It Matters |
|------|----------------|
| `app/page.tsx` | Home page — portfolio entry point, flagship showcase |
| `app/work/page.tsx` | Work page — three-section project listing |
| `app/work/[slug]/page.tsx` | Project detail — MDX rendering, static generation |
| `app/learning/page.tsx` | Learning Log — year grouping, stats, empty state |
| `app/resume/page.tsx` | Resume — snapshot, highlights, PDF embed |
| `app/connect/page.tsx` | Connect — contact methods, collaboration CTA |
| `app/sitemap.ts` | Dynamic sitemap from getAllProjects() |
| `app/opengraph-image.tsx` | Default OG image |

### Components
| File | Why It Matters |
|------|----------------|
| `components/layout/Navbar.tsx` | Persistent navigation — scroll blur, active route, responsive |
| `components/layout/ThemeProvider.tsx` | Dark/light theme — cookie-backed, no flash |
| `components/home/Hero.tsx` | Primary value proposition — first thing visitors see |
| `components/home/FrameworkStrip.tsx` | Narrative spine — most expressive animation component |
| `components/project/ProjectCard.tsx` | Core proof unit — flagship/grid variants |
| `components/project/TradeoffsBlock.tsx` | Most differentiated section — unique visual treatment |
| `components/connect/ConnectStrip.tsx` | Conversion surface — copy button, contact rows |
| `components/ui/Button.tsx` | Universal CTA — primary/secondary variants |

---

## 20. Build & Deployment

### Local Development

```bash
npm install           # Install dependencies (already done)
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build — must pass before commit
npm run start        # Start production server
npm run lint         # ESLint check (flat config)
npm run typecheck    # TypeScript type check (tsc --noEmit)
```

### Build Process
1. TypeScript compilation with strict mode
2. ESLint with Next.js + TypeScript rules
3. Static generation of all routes
4. Content validation (Zod schemas)
5. MDX compilation via next-mdx-remote-client
6. Image optimization
7. Sitemap generation

### Deployment (Vercel)
- Deploy via Vercel CLI or GitHub integration
- `content/` directory must be included in the deployment (not gitignored)
- Serverless functions have try-catch for missing content directories

### Environment Variables
- None currently required
- `NEXT_PUBLIC_SITE_URL` — optional, defaults to localhost:3000

### Common Build Issues

| Issue | Cause | Fix |
|-------|-------|-----|
| SITE_NAME not found in layout.tsx | Missing import | Add `import { SITE_NAME } from "@/lib/constants"` |
| MDX section heading missing | Content error | Check all 5 section headings exist in .mdx file |
| Unescaped apostrophe in JSX | ESLint rule | Use `&rsquo;` instead of `'` |
| Unused import warning | ESLint rule | Remove the unused import |
| `ENOENT: content/learning` | Missing dir on serverless | Try-catch handles this gracefully |

---

## 21. Change Log

| Date | Summary | Files Changed | Reason |
|------|---------|--------------|--------|
| 2026-06-29 | Added PROJECT_CONTEXT.md | PROJECT_CONTEXT.md (new) | AI handoff documentation |
| 2026-06-29 | Major content restructure | See session below | User requested portfolio update |

### June 29, 2026 — Major Portfolio Update
- **Reason**: User request to replace placeholders, update philosophy text, restructure work page, add flagship projects
- **Files modified**: lib/constants.ts, lib/resume.ts, app/layout.tsx, components/home/Fra
