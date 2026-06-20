import { z } from "zod";

/**
 * Validates a single project's MDX frontmatter.
 *
 * Per the PRD's content model and Implementation Blueprint Section 5.1:
 * every field here is required unless explicitly marked optional, and
 * validation failures should fail the build loudly (see
 * lib/content/projects.ts, which calls .parse() rather than .safeParse()
 * for exactly this reason — a malformed project file should never
 * silently produce a broken or missing page in production).
 */
export const projectStatusSchema = z.enum(["shipped", "building", "exploring"]);

export const projectFrontmatterSchema = z.object({
  name: z.string().min(1, "name is required"),

  slug: z
    .string()
    .min(1)
    .regex(
      /^[a-z0-9-]+$/,
      "slug must be lowercase, alphanumeric, and hyphen-separated (e.g. 'concept-intelligence-platform')"
    ),

  status: projectStatusSchema,

  // Soft length guideline, not a hard validation failure — see
  // Implementation Blueprint 5.1. A warning is logged at build time in
  // lib/content/projects.ts if this exceeds ~120 characters, but the
  // schema itself doesn't reject a longer string, since this is a
  // content-quality nudge, not a structural requirement.
  oneLiner: z.string().min(1, "oneLiner is required"),

  techTags: z
    .array(z.string().min(1))
    .min(1, "every project needs at least one tech tag"),

  links: z
    .object({
      live: z.string().url().optional(),
      code: z.string().url().optional(),
      demo: z.string().url().optional(),
    })
    .default({}),

  startedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "startedDate must be ISO format (YYYY-MM-DD)"),

  lastUpdated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "lastUpdated must be ISO format (YYYY-MM-DD)"),

  // Exactly one project across the whole collection should have
  // featured: true. That cross-file invariant can't be expressed by a
  // single file's schema — it's checked in lib/content/projects.ts'
  // getFlagshipProject(), which throws if it finds zero or multiple.
  featured: z.boolean(),
});

export type ProjectFrontmatter = z.infer<typeof projectFrontmatterSchema>;
export type ProjectStatus = z.infer<typeof projectStatusSchema>;

/**
 * A project's body content, once split by heading per Implementation
 * Blueprint Section 3.2 — each key corresponds to one of the Project
 * Detail page's seven structural sections (Component Library D2–D4).
 * `tradeoffs` is kept as raw markdown rather than further parsed into a
 * numbered array, since the Tradeoffs Block component renders it as a
 * real <ol> directly from markdown list syntax — see Component Library
 * D3's accessibility note on using a genuine ordered list.
 */
export interface ProjectSections {
  problem: string;
  whatItDoes: string;
  howItsBuilt: string;
  tradeoffs: string;
  whatsNext: string;
}

export interface Project {
  frontmatter: ProjectFrontmatter;
  sections: ProjectSections;
}
