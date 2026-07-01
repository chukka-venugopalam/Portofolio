import { readFileSync } from "fs";
import path from "path";
import { z } from "zod";

const ENGINEERING_PROJECTS_PATH = path.join(process.cwd(), "content", "engineering-projects.json");

export const engineeringProjectSchema = z.object({
  name: z.string().min(1),
  status: z.string().min(1),
  motivation: z.string().min(1),
  whatIUnderstood: z.string().min(1),
  coreFeatures: z.array(z.string().min(1)).min(1),
  engineeringConcepts: z.array(z.string().min(1)).min(1),
  technologies: z.array(z.string().min(1)).min(1),
  github: z.string().url(),
  liveDemo: z.string().url(),
  whatILearned: z.string().min(1),
});

export const engineeringProjectsSchema = z.array(engineeringProjectSchema);

export type EngineeringProject = z.infer<typeof engineeringProjectSchema>;

let cache: EngineeringProject[] | null = null;

export function getEngineeringProjects(): EngineeringProject[] {
  if (cache) return cache;

  let raw: string;
  try {
    raw = readFileSync(ENGINEERING_PROJECTS_PATH, "utf-8");
  } catch {
    cache = [];
    return cache;
  }

  const parsed = JSON.parse(raw);
  cache = engineeringProjectsSchema.parse(parsed);
  return cache;
}
