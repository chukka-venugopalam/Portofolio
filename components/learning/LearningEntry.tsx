import Link from "next/link";
import { formatCompactDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

/**
 * LearningEntry
 *
 * The atomic unit of the Learning Log — Component Library B6. Deliberately
 * the lowest-ornamentation component on the site: no card border at all,
 * just a date + headline, since it should read as a log, not marketing
 * copy (per the PRD's positioning work — this is what makes "this person
 * learns quickly" a demonstrated fact rather than an asserted trait).
 *
 * Variants:
 * - "preview" (Home): compact, no expansion text shown even if present,
 *   used for the 3-4 most recent entries only.
 * - "full" (Learning Log page): includes the optional 1-2 sentence
 *   expansion if present, always visible — never an accordion, since
 *   click-to-expand adds friction without benefit at this content volume.
 *
 * Accessibility (Component Library B6):
 * - Date uses a real <time dateTime="..."> element carrying the raw ISO
 *   value, even though the visible label is the compact "Jun 14" format.
 * - Linked entries: the full entry (date + headline) is the clickable
 *   area, not a tiny separate "read more" affix.
 * - Entries without a link have no hover state at all (Component Library
 *   B6) — handled here by simply not wrapping in a <Link> when no link
 *   exists, which means no hover styles apply by default.
 *
 * Responsive (Component Library B6 / Visual Design Spec 4.7):
 * - Desktop/tablet: date in a fixed-width left column, same row as headline
 * - Mobile: stacks to two lines (date alone, then headline) — a fixed
 *   date column plus wrapped headline on one line produces uneven,
 *   hard-to-scan wrapping at 390px
 */

interface LearningEntryProps {
  date: string; // ISO format
  headline: string;
  body?: string;
  link?: string;
  variant?: "preview" | "full";
  className?: string;
}

export function LearningEntry({
  date,
  headline,
  body,
  link,
  variant = "full",
  className,
}: LearningEntryProps) {
  const content = (
    <>
      <time
        dateTime={date}
        className={cn(
          "shrink-0",
          "text-mono-sm text-text-tertiary",
          // Desktop/tablet: fixed-width column for vertical date alignment
          "tablet:w-14"
        )}
      >
        {formatCompactDate(date)}
      </time>

      <div className="min-w-0">
        <span className="text-body-md text-text-primary">{headline}</span>
        {variant === "full" && body && (
          <p className="mt-1 text-body-sm text-text-secondary">{body}</p>
        )}
      </div>
    </>
  );

  const wrapperClasses = cn(
    "flex flex-col tablet:flex-row gap-1 tablet:gap-3",
    "py-3",
    className
  );

  if (link) {
    return (
      <Link
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          wrapperClasses,
          "group -mx-2 rounded-card px-2",
          "transition-colors duration-fast ease-standard",
          "hover:bg-bg-secondary",
          "focus-visible:outline-none focus-visible:focus-ring"
        )}
      >
        {content}
      </Link>
    );
  }

  // No link: plain, non-interactive — no hover state, by design
  return <div className={wrapperClasses}>{content}</div>;
}
