import { z } from "zod";
import { projectStatusSchema } from "@/content/projects/_schema";

/**
 * Validates content/also-building.json — the thin-project one-liner
 * mechanism from the PRD's content model and Component Library D8.
 *
 * Deliberately no `slug` field: the absence of a slug is what the rest
 * of the system uses to know "this project doesn't get a route." Adding
 * a slug here would silently invite a future page to wire it into
 * `/work/[slug]`, undermining the honesty rule this content type exists
 * to enforce (Implementation Blueprint Section 5.1).
 */
export const alsoBuildingEntrySchema = z.object({
  name: z.string().min(1),
  status: projectStatusSchema,
  description: z.string().min(1),
});

export const alsoBuildingFileSchema = z.array(alsoBuildingEntrySchema);

export type AlsoBuildingEntry = z.infer<typeof alsoBuildingEntrySchema>;
