import {
  getLearningEntriesByYear,
  getLearningStats,
} from "@/lib/content/learning";
import { buildMetadata } from "@/lib/seo/metadata";
import { formatFullDate } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { LearningEntry } from "@/components/learning/LearningEntry";
import { YearDivider } from "@/components/learning/YearDivider";

export const metadata = buildMetadata({
  title: "Learning Log",
  description: "A dated, honest record of what I'm learning and when.",
  pathname: "/learning",
});

/**
 * Learning Log page — PRD Part 7, Visual Design Spec Section 4,
 * Component Library B6/B7.
 *
 * Five sections, matching this task's requested structure:
 *   1. Learning Hero                       — SectionHeader page mode
 *   2. Reverse Chronological Learning Feed  — LearningEntry (full
 *      variant) grouped under YearDivider, sorted newest-first
 *   3. Optional Topic Filters                — deliberately NOT built;
 *      see the note below
 *   4. Learning Stats                          — derived, real numbers
 *      only (lib/content/learning.ts's getLearningStats())
 *   5. Empty State Handling                     — handled at both the
 *      feed and stats level, not bolted on separately, since the
 *      current real state of this codebase IS empty (zero entries
 *      exist in content/learning/ as of this page being built)
 *
 * Sort order (this task's explicit requirement): newest-first sorting
 * was ALREADY implemented in getAllLearningEntries() — see that
 * function's final sort() call — so this page doesn't re-sort
 * anything; it relies on the content layer's existing guarantee, which
 * is the correct place for that guarantee to live (any future
 * consumer of learning entries inherits correct ordering for free).
 *
 * On "Optional Topic Filters": this task explicitly marks this item
 * optional, and content/learning/_schema.ts's frontmatter has no
 * topic/tag field to filter by. Both the Component Library (B6) and
 * Visual Design Spec (4.x) repeatedly emphasize that Learning Entry
 * should stay "plain and dated rather than acquiring card-like
 * structure over time" — adding a topic-tagging schema field and
 * filter UI would directly work against that documented design intent
 * for a feature this task itself flags as optional. Deliberately
 * skipped, not silently omitted: if topic filtering becomes a real
 * requirement later, it needs a schema change (an optional `topic`
 * field on learningEntryFrontmatterSchema) before a filter UI has
 * anything to filter on — that's a content-model decision, not a page-
 * level one, and shouldn't be made implicitly inside this file.
 *
 * Layout (Visual Design Spec 4.1): content max-width 760px, matching
 * Project Detail's reading width — this is a sustained-reading page,
 * not a card-grid page.
 *
 * MDX: each LearningEntry's optional 1-3 sentence expansion is the
 * entry's `body` field — already-parsed markdown text from
 * lib/content/learning.ts (gray-matter strips frontmatter; the
 * remaining content is rendered as plain text here since learning
 * entries are intentionally too short to warrant full MDX compilation
 * with custom components, unlike Project Detail's longer prose
 * sections — Visual Design Spec 4.8 calls this content "1-2 sentences,"
 * which doesn't need headings, code blocks, or embedded images).
 */
export default function LearningLogPage() {
  const entriesByYear = getLearningEntriesByYear();
  const stats = getLearningStats();
  const hasEntries = stats.totalEntries > 0;

  return (
    <>
      {/* ── 1. Learning Hero ── */}
      <Section spacing="secondary" className="pt-0">
        <Container className="max-w-[760px]" wide={false}>
          <SectionHeader
            mode="page"
            level="h1"
            subline="A dated, honest record of what I'm learning and when."
          >
            Learning Log
          </SectionHeader>
        </Container>
      </Section>

      {/* ── 2. Reverse Chronological Learning Feed ── */}
      <Section spacing="tight">
        <Container className="max-w-[760px]" wide={false}>
          {hasEntries ? (
            <div className="flex flex-col gap-8">
              {Array.from(entriesByYear.entries()).map(([year, entries]) => (
                <div key={year}>
                  <YearDivider year={year} />
                  <ul className="mt-5 divide-y divide-border-subtle">
                    {entries.map((entry) => (
                      <li key={entry.slug}>
                        <LearningEntry
                          date={entry.frontmatter.date}
                          headline={entry.frontmatter.headline}
                          body={entry.body || undefined}
                          link={entry.frontmatter.link}
                          variant="full"
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <FeedEmptyState />
          )}
        </Container>
      </Section>

      {/* ── 4. Learning Stats ──
          (Numbered to match this task's requested order; rendered after
          the feed, which is also where it reads best — supporting
          evidence below the thing it's summarizing, not above it.)
          Every number here is derived directly from real entry data —
          no invented or aspirational metrics, consistent with the
          PRD's content-honesty model. */}
      <Section spacing="tight" className="pb-0">
        <Container className="max-w-[760px]" wide={false}>
          <SectionHeader mode="label" level="h2">
            Learning Stats
          </SectionHeader>

          {hasEntries ? (
            <dl className="mt-5 grid grid-cols-1 tablet:grid-cols-3 gap-6">
              <StatItem
                label="Total entries"
                value={stats.totalEntries.toString()}
              />
              <StatItem
                label="Last 30 days"
                value={stats.entriesLast30Days.toString()}
              />
              <StatItem
                label="Logging since"
                value={
                  stats.loggingSince
                    ? formatFullDate(stats.loggingSince)
                    : "—"
                }
              />
            </dl>
          ) : (
            <p className="mt-5 text-body-md text-text-secondary">
              Stats will appear here once the first entry is logged.
            </p>
          )}
        </Container>
      </Section>
    </>
  );
}

/**
 * StatItem
 *
 * Page-local to Learning Stats — a single dt/dd pair. Deliberately not
 * a card (no border, no background fill), consistent with Learning
 * Entry's own lowest-ornamentation treatment (Visual Design Spec 4.8):
 * a log's supporting stats shouldn't look more decorated than the log
 * itself.
 */
function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-mono-sm uppercase tracking-[0.04em] text-text-tertiary">
        {label}
      </dt>
      <dd className="mt-1.5 text-heading-md text-text-primary">{value}</dd>
    </div>
  );
}

/**
 * FeedEmptyState
 *
 * 5. Empty State Handling — the feed-level empty state. Plain text, no
 * card chrome, consistent with how this codebase has handled every
 * other genuinely-empty content section (the Work page's empty Projects
 * Grid / Also Building sections use the same restrained, no-card
 * approach). This is also the actual current state of this codebase —
 * content/learning/ has zero .mdx files as of this page being built —
 * so this isn't a defensive edge case, it's what a fresh visitor sees
 * today.
 */
function FeedEmptyState() {
  return (
    <p className="text-body-md text-text-secondary">
      Nothing logged yet — check back soon, or see the{" "}
      <a
        href="/work"
        className="text-accent hover:underline underline-offset-4 focus-visible:outline-none focus-visible:focus-ring rounded-pill"
      >
        Work page
      </a>{" "}
      for what&rsquo;s currently being built.
    </p>
  );
}
