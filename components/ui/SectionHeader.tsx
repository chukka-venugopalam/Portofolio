import { cn } from "@/lib/utils";

/**
 * SectionHeader
 *
 * The single reusable label pattern opening every content section across
 * the site — Component Library B8. Two modes governed by the same
 * underlying principle (one consistent header pattern, never reinvented
 * per page):
 *
 * - "label" mode: compact mono-sm, uppercase, +0.08em tracking — used
 *   for section openers like FLAGSHIP WORK, LEARNING PULSE, THE PROBLEM,
 *   ALL WORK, SUMMARY.
 * - "page" mode: display-lg H1 + optional body-lg sub-line — used at the
 *   top of Work, Project Detail, Learning Log, Resume, Connect.
 *
 * Accessibility (Component Library B8, important and easy to get wrong):
 * visual size and semantic heading level are independent. "label" mode
 * is visually tiny but MUST still map to a real heading element in the
 * document outline — skipping this because it "looks like a label, not
 * a heading" breaks the page's heading outline for screen reader
 * navigation. The `level` prop controls this explicitly so callers
 * choose the correct level for their position in the page outline
 * (commonly h2 for a homepage section label, h3 if nested under a
 * page-header-mode h1 on a secondary page) rather than this component
 * guessing.
 */

type SectionHeaderMode = "label" | "page";
type HeadingLevel = "h1" | "h2" | "h3";

interface SectionHeaderProps {
  children: React.ReactNode;
  mode?: SectionHeaderMode;
  level?: HeadingLevel;
  /** Sub-line text — only rendered in "page" mode. */
  subline?: string;
  className?: string;
  id?: string;
}

export function SectionHeader({
  children,
  mode = "label",
  level = mode === "page" ? "h1" : "h2",
  subline,
  className,
  id,
}: SectionHeaderProps) {
  const Heading = level;

  if (mode === "label") {
    return (
      <Heading
        id={id}
        className={cn(
          "text-mono-sm uppercase tracking-[0.08em] text-text-tertiary",
          className
        )}
      >
        {children}
      </Heading>
    );
  }

  // mode === "page"
  return (
    <div className={className}>
      <Heading
        id={id}
        className={cn(
          "text-display-lg text-text-primary",
          "mobile:text-[2.5rem] mobile:leading-[1.15]" // mobile override per Visual Design Spec per-page wireframes
        )}
      >
        {children}
      </Heading>
      {subline && (
        <p className="mt-3 max-w-[480px] text-body-lg text-text-secondary">
          {subline}
        </p>
      )}
    </div>
  );
}
