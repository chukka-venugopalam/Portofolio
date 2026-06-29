import { readFileSync, readdirSync } from "fs";
import path from "path";
import matter from "gray-matter";
import {
  projectFrontmatterSchema,
  type Project,
  type ProjectSections,
} from "@/content/projects/_schema";

const PROJECTS_DIR = path.join(process.cwd(), "content", "projects");

// Headings a project's MDX body is expected to contain, in order, per
// the PRD's Project Page Blueprint and Implementation Blueprint Section
// 3.2. Matching is case-insensitive and tolerant of the exact heading
// level (## or ###) since that's a style choice, not a content one.
const SECTION_HEADINGS: Record<keyof ProjectSections, RegExp> = {
  problem: /^#{2,3}\s*the problem\s*$/im,
  whatItDoes: /^#{2,3}\s*what it does\s*$/im,
  howItsBuilt: /^#{2,3}\s*how it'?s built\s*$/im,
  tradeoffs: /^#{2,3}\s*decisions\s*(&|and)\s*tradeoffs\s*$/im,
  whatsNext: /^#{2,3}\s*what'?s next\s*$/im,
};

/**
 * Splits a project's raw MDX body into named sections by heading, per
 * Implementation Blueprint Section 3.2. This is what lets the Tradeoffs
 * Block (Component Library D3) render through its own distinctly-styled
 * component while "The Problem" renders as plain prose, even though both
 * started as MDX content in the same file.
 *
 * Throws if any expected section heading is missing — a project page
 * with a missing section is a content error, not a valid partial state,
 * consistent with this codebase's "fail loudly at build time" principle
 * (Implementation Blueprint 3.1).
 */
function splitIntoSections(body: string, slug: string): ProjectSections {
  const headingEntries = Object.entries(SECTION_HEADINGS) as [
    keyof ProjectSections,
    RegExp,
  ][];

  const positions = headingEntries.map(([key, pattern]) => {
    const match = body.match(pattern);
    if (!match || match.index === undefined) {
      throw new Error(
        `Project "${slug}" is missing the required "${String(key)}" section. ` +
          `Every project MDX file must contain all five section headings.`
      );
    }
    return { key, start: match.index, headingLength: match[0].length };
  });

  positions.sort((a, b) => a.start - b.start);

  const sections = {} as ProjectSections;
  for (let i = 0; i < positions.length; i++) {
    const current = positions[i]!;
    const next = positions[i + 1];
    const contentStart = current.start + current.headingLength;
    const contentEnd = next ? next.start : body.length;
    sections[current.key] = body.slice(contentStart, contentEnd).trim();
  }

  return sections;
}

let cache: Project[] | null = null;

/**
 * Reads, validates, and parses every project in content/projects/.
 * Results are cached for the lifetime of the build process (this runs
 * at build time only, per the static-generation architecture — see
 * Implementation Blueprint Section 6.1 — so a long-lived in-memory cache
 * is safe and avoids re-reading the filesystem for every helper call).
 */
export function getAllProjects(): Project[] {
  if (cache) return cache;

  let files: string[] = [];
  try {
    files = readdirSync(PROJECTS_DIR).filter(
      (file) => file.endsWith(".mdx") && !file.startsWith("_")
    );
  } catch {
    // Directory doesn't exist — e.g. on Vercel's serverless runtime where
    // content/ is not bundled. Return empty rather than crashing; every
    // caller already handles the zero-projects case gracefully.
    cache = [];
    return cache;
  }

  const seenSlugs = new Set<string>();

  const projects = files.map((file) => {
    const raw = readFileSync(path.join(PROJECTS_DIR, file), "utf-8");
    const { data, content } = matter(raw);

    // .parse() (not .safeParse()) is deliberate — an invalid project
    // file should throw and fail the build, not be silently skipped.
    const frontmatter = projectFrontmatterSchema.parse(data);

    if (seenSlugs.has(frontmatter.slug)) {
      throw new Error(
        `Duplicate project slug "${frontmatter.slug}" found in ${file}. ` +
          `Every project's slug must be unique.`
      );
    }
    seenSlugs.add(frontmatter.slug);

    if (frontmatter.oneLiner.length > 120) {
      console.warn(
        `[content warning] Project "${frontmatter.slug}"'s oneLiner is ` +
          `${frontmatter.oneLiner.length} characters — consider trimming ` +
          `toward 120 for readability in compact card layouts.`
      );
    }

    const lastUpdated = new Date(frontmatter.lastUpdated);
    const daysSinceUpdate =
      (Date.now() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceUpdate > 60) {
      console.warn(
        `[content warning] Project "${frontmatter.slug}" was last updated ` +
          `${Math.floor(daysSinceUpdate)} days ago — consider refreshing ` +
          `lastUpdated if work is still active (PRD Part 10's trust-signal ` +
          `reasoning applies to projects too).`
      );
    }

    const sections = splitIntoSections(content, frontmatter.slug);

    return { frontmatter, sections };
  });

  // Multiple simultaneous flagships is still a genuine content error —
  // the system can only honestly present one "strongest proof point" at
  // a time, and two competing for the slot is an authoring mistake, not
  // a valid state. Zero flagships, by contrast, is a legitimate state:
  // a portfolio with no project substantial enough to earn the
  // flagship's visual weight yet should say so honestly rather than be
  // forced to crown one prematurely. See getFlagshipProject() below for
  // how callers are expected to handle the zero case.
  const featuredCount = projects.filter((p) => p.frontmatter.featured).length;
  if (featuredCount > 1) {
    throw new Error(
      `${featuredCount} projects have featured: true — at most one ` +
        `flagship is allowed at a time. Check: ${projects
          .filter((p) => p.frontmatter.featured)
          .map((p) => p.frontmatter.slug)
          .join(", ")}`
    );
  }

  cache = projects.sort(
    (a, b) =>
      new Date(b.frontmatter.lastUpdated).getTime() -
      new Date(a.frontmatter.lastUpdated).getTime()
  );

  return cache;
}

export function getProjectBySlug(slug: string): Project | null {
  const found = getAllProjects().find((p) => p.frontmatter.slug === slug);
  return found ?? null;
}

/**
 * Returns the single flagship project, or null if none exists yet.
 *
 * Per the schema-validation change above: zero flagships is a legitimate
 * state, not a build error. Every caller MUST handle the null case
 * explicitly and honestly — rendering nothing, or rendering a real
 * "no flagship yet" state (see getStrongestInProgressProject() below
 * for the recommended honest fallback), never silently substituting a
 * non-flagship project as if it were one. A project that hasn't earned
 * featured: true shouldn't receive the flagship's visual treatment
 * (Visual Design Spec's border-default + full padding + top billing)
 * just because the page needs something to show — that defeats the
 * entire point of the status system.
 */
export function getFlagshipProject(): Project | null {
  return getAllProjects().find((p) => p.frontmatter.featured) ?? null;
}

export function getNonFlagshipProjects(): Project[] {
  return getAllProjects().filter((p) => !p.frontmatter.featured);
}

/**
 * The honest fallback for when no project has earned featured: true yet.
 * Returns the most-recently-updated non-exploring project if one exists,
 * otherwise the most-recently-updated project overall (which may be
 * "exploring" — and that's fine, AS LONG AS its real status is shown
 * honestly wherever it's displayed, never silently upgraded).
 *
 * This is deliberately NOT the same thing as "the flagship." Callers
 * should render this project using the ProjectCard's "grid" variant
 * (or an equivalently lighter treatment), with its real StatusTag
 * clearly visible, and ideally a short explanatory note ("no flagship
 * yet — here's the strongest work in progress") rather than implying
 * via visual weight alone that this is the site's best, most-finished
 * proof point. See app/page.tsx and app/work/page.tsx for the actual
 * rendered treatment.
 */
export function getStrongestInProgressProject(): Project | null {
  const all = getAllProjects();
  if (all.length === 0) return null;

  // Prefer non-exploring projects; fall back to all projects.
  // getAllProjects() is already sorted by lastUpdated descending.
  const nonExploring = all.filter((p) => p.frontmatter.status !== "exploring");

  if (nonExploring.length > 0) {
    return nonExploring[0]!;
  }

  return all[0]!;
}

/**
 * Parses a project's "tradeoffs" section (raw markdown, an ordered or
 * unordered list per the PRD's "1. Chose X over Y because Z" content
 * model) into the structured Decision[] shape the TradeoffsBlock
 * component renders — Component Library D3, which requires a real <ol>
 * in the DOM, not visually-numbered paragraphs.
 *
 * This conversion lives at the content layer (here), not inside the
 * page component, because it's a content-shape concern: the raw
 * markdown produced by splitIntoSections() and the structured props
 * TradeoffsBlock expects are two different representations of the same
 * data, and reconciling them is exactly what lib/content/ exists for.
 *
 * Accepts both "1. " and "- "/"* " list markers, since a project author
 * writing markdown by hand may reasonably use either — the heading
 * itself ("Decisions & Tradeoffs") already establishes these are
 * discrete, ordered points regardless of which markdown list syntax
 * was used to write them.
 *
 * Throws if the section contains no parseable list items — an empty or
 * malformed Decisions & Tradeoffs section is a content error (the PRD's
 * Part 9 calls this "the single most differentiating section," so a
 * project with nothing here shouldn't silently render an empty block),
 * consistent with this codebase's fail-loudly-at-build-time principle.
 */
export function parseTradeoffs(
  tradeoffsMarkdown: string,
  slug: string
): { id: string; text: string }[] {
  const lines = tradeoffsMarkdown.split("\n");
  const listItemPattern = /^\s*(?:\d+[.)]|[-*])\s+(.+)$/;

  const decisions: { id: string; text: string }[] = [];

  for (const line of lines) {
    const match = line.match(listItemPattern);
    if (match) {
      const text = match[1]!.trim();
      if (text.length > 0) {
        decisions.push({ id: `${slug}-tradeoff-${decisions.length + 1}`, text });
      }
    }
  }

  if (decisions.length === 0) {
    throw new Error(
      `Project "${slug}"'s "Decisions & Tradeoffs" section contains no ` +
        `parseable list items. Write each decision as a markdown list ` +
        `item (e.g. "1. Chose X over Y because Z.").`
    );
  }

  return decisions;
}
