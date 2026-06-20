import { formatFullDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

/**
 * StatusFooter
 *
 * The small metadata line ("Started [date], Last updated [date]")
 * closing out every Project Detail page — Component Library D4. Per the
 * PRD's Part 9, this is what makes the Project Header's status tag
 * falsifiable rather than just an assertion: a visible start date lets
 * any visitor judge development pace for themselves.
 *
 * Accessibility (Component Library D4): both dates use real
 * <time dateTime="..."> elements with machine-readable ISO values,
 * matching the same pattern as Learning Entry (B6).
 *
 * Deliberately the quietest entrance and the quietest visual treatment
 * on the page (Visual Design Spec 3.2/3.4) — text-tertiary throughout,
 * no color accent, separated from content above by a 1px border-subtle
 * top rule.
 */

interface StatusFooterProps {
  startedDate: string; // ISO format
  lastUpdated: string; // ISO format
  className?: string;
}

export function StatusFooter({
  startedDate,
  lastUpdated,
  className,
}: StatusFooterProps) {
  return (
    <div
      className={cn(
        "border-t border-border-subtle pt-5",
        "flex flex-col tablet:flex-row tablet:items-center gap-1.5 tablet:gap-2",
        "text-mono-sm text-text-tertiary",
        className
      )}
    >
      <span>
        Started <time dateTime={startedDate}>{formatFullDate(startedDate)}</time>
      </span>
      <span className="hidden tablet:inline" aria-hidden="true">
        ·
      </span>
      <span>
        Last updated <time dateTime={lastUpdated}>{formatFullDate(lastUpdated)}</time>
      </span>
    </div>
  );
}
