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

  const raw = readFileSync(ALSO_BUILDING_PATH, "utf-8");
  const parsed = JSON.parse(raw);

  cache = alsoBuildingFileSchema.parse(parsed);
  return cache;
}
