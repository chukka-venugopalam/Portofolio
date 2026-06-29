import { readFileSync } from "fs";
import path from "path";
import {
  alsoBuildingFileSchema,
  type AlsoBuildingEntry,
} from "@/lib/content/also-building-schema";

const ALSO_BUILDING_PATH = path.join(process.cwd(), "content", "also-building.json");

let cache: AlsoBuildingEntry[] | null = null;

/**
 * Reads and validates content/also-building.json — see Component
 * Library D8 for why these entries are deliberately route-less,
 * link-less, and minimal (status + name + one sentence, nothing more).
 */
export function getAlsoBuildingEntries(): AlsoBuildingEntry[] {
  if (cache) return cache;

  let raw: string;
  try {
    raw = readFileSync(ALSO_BUILDING_PATH, "utf-8");
  } catch {
    // File doesn't exist — e.g. on Vercel's serverless runtime where
    // content/ is not bundled. Return empty rather than crashing; every
    // caller already handles the zero-entries case gracefully.
    cache = [];
    return cache;
  }

  const parsed = JSON.parse(raw);

  cache = alsoBuildingFileSchema.parse(parsed);
  return cache;
}
