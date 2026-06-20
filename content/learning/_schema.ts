import { z } from "zod";

/**
 * Validates a single Learning Log entry's MDX frontmatter.
 * Deliberately minimal — see Component Library B6 and Visual Design
 * Spec 4.x, which both emphasize that this content type should stay
 * plain and dated rather than acquiring card-like structure over time.
 */
export const learningEntryFrontmatterSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be ISO format (YYYY-MM-DD)"),

  // Soft length guideline (~120 chars), enforced as a build-time warning
  // in lib/content/learning.ts, not a hard schema failure — this needs
  // to stay scannable in Home's compact preview variant (Component
  // Library B6).
  headline: z.string().min(1, "headline is required"),

  link: z.string().url().optional(),
});

export type LearningEntryFrontmatter = z.infer<typeof learningEntryFrontmatterSchema>;

export interface LearningEntry {
  frontmatter: LearningEntryFrontmatter;
  // The optional 1-3 sentence expansion, rendered as-is (no section
  // splitting needed here, unlike projects — see Implementation
  // Blueprint 3.4).
  body: string;
  slug: string;
}
