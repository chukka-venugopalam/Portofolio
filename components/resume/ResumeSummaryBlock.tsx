import { cn } from "@/lib/utils";
import type { ResumeContent } from "@/lib/resume";

/**
 * ResumeSummaryBlock
 *
 * Per the PRD's Part 10: what makes the Resume page usable for a
 * recruiter in under 15 seconds without opening or scrolling the
 * embedded PDF — Component Library D6. Renders the "Quick Snapshot"
 * portion of the content model (name, status, current focus) — Key
 * Highlights is a separate sibling component below it, per this task's
 * six-section structure.
 *
 * Visual treatment (Visual Design Spec 5.4/5.8): bg-secondary fill,
 * border-default (1px) — the same elevated treatment as the flagship
 * project card, since both are "read this first" components and share
 * that visual language deliberately.
 *
 * Accessibility (Component Library D6): reading order in the markup
 * matches visual top-to-bottom order exactly (name/status, then focus
 * statement) — this block exists specifically to be fast to scan, and
 * a screen reader user should get that same fast, linear experience.
 */

interface ResumeSummaryBlockProps {
  content: Pick<ResumeContent, "name" | "statusLine" | "currentFocus">;
  className?: string;
}

export function ResumeSummaryBlock({
  content,
  className,
}: ResumeSummaryBlockProps) {
  return (
    <div
      className={cn(
        "rounded-card bg-bg-secondary border border-border-default",
        "p-6 desktop:p-8",
        className
      )}
    >
      <span className="text-mono-sm uppercase tracking-[0.08em] text-text-tertiary">
        Quick Snapshot
      </span>

      <h2 className="mt-3 text-heading-md text-text-primary">
        {content.name}
      </h2>
      <p className="mt-1 text-body-md text-text-secondary">
        {content.statusLine}
      </p>

      <p className="mt-4 text-body-md leading-[1.7] text-text-primary">
        {content.currentFocus}
      </p>
    </div>
  );
}
