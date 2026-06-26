import { readFileSync, readdirSync } from "fs";
import path from "path";
import matter from "gray-matter";
import {
  learningEntryFrontmatterSchema,
  type LearningEntry,
} from "@/content/learning/_schema";

const LEARNING_DIR = path.join(process.cwd(), "content", "learning");

let cache: LearningEntry[] | null = null;

/**
 * Reads, validates, and parses every learning entry in content/learning/.
 * Expected filename convention: YYYY-MM-DD-slug.mdx (per Implementation
 * Blueprint Section 1.1) — the date in the filename is purely a human
 * sorting convenience; the authoritative date is always the `date`
 * frontmatter field, which is what sorting and the Year Divider grouping
 * actually use.
 */
export function getAllLearningEntries(): LearningEntry[] {
  if (cache) return cache;

  const files = readdirSync(LEARNING_DIR).filter(
    (file) => file.endsWith(".mdx") && !file.startsWith("_")
  );

  const entries = files.map((file) => {
    const raw = readFileSync(path.join(LEARNING_DIR, file), "utf-8");
    const { data, content } = matter(raw);

    const frontmatter = learningEntryFrontmatterSchema.parse(data);

    if (frontmatter.headline.length > 120) {
      console.warn(
        `[content warning] Learning entry "${file}"'s headline is ` +
          `${frontmatter.headline.length} characters — consider trimming ` +
          `toward 120 so it stays scannable in Home's compact preview.`
      );
    }

    return {
      frontmatter,
      body: content.trim(),
      slug: file.replace(/\.mdx$/, ""),
    };
  });

  cache = entries.sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime()
  );

  return cache;
}

/** Used by Home's compact Learning Pulse preview (Component Library B6). */
export function getRecentLearningEntries(n: number): LearningEntry[] {
  return getAllLearningEntries().slice(0, n);
}

/**
 * Groups all entries by calendar year, for the Year Divider component
 * (Component Library B7) on the full Learning Log page. Returns entries
 * grouped in descending year order, matching the page's reverse-
 * chronological design.
 */
export function getLearningEntriesByYear(): Map<number, LearningEntry[]> {
  const grouped = new Map<number, LearningEntry[]>();

  for (const entry of getAllLearningEntries()) {
    const year = new Date(entry.frontmatter.date).getFullYear();
    const existing = grouped.get(year) ?? [];
    existing.push(entry);
    grouped.set(year, existing);
  }

  return new Map([...grouped.entries()].sort((a, b) => b[0] - a[0]));
}

export interface LearningStats {
  totalEntries: number;
  /** Entries dated within the last 30 days — a real, derived pace
   *  signal, not an invented metric. Zero is a legitimate, honestly
   *  rendered value, not treated as an error state. */
  entriesLast30Days: number;
  /** ISO date of the earliest entry, or null if the log is empty. */
  loggingSince: string | null;
}

/**
 * Derives Learning Log stats directly from real entry data — no
 * invented or aspirational numbers. Every value here is something a
 * skeptical visitor could verify by counting the entries below it,
 * consistent with the PRD's content-honesty model (the same standard
 * applied to project status tags and the resume's proof points applies
 * here too: nothing on this site should claim something the visible
 * content doesn't back up).
 */
export function getLearningStats(): LearningStats {
  const entries = getAllLearningEntries();

  if (entries.length === 0) {
    return { totalEntries: 0, entriesLast30Days: 0, loggingSince: null };
  }

  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const entriesLast30Days = entries.filter(
    (e) => new Date(e.frontmatter.date).getTime() >= thirtyDaysAgo
  ).length;

  // entries is sorted newest-first; the earliest is the last element.
  const loggingSince = entries[entries.length - 1]!.frontmatter.date;

  return {
    totalEntries: entries.length,
    entriesLast30Days,
    loggingSince,
  };
}
