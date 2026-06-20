import { cn } from "@/lib/utils";

/**
 * YearDivider
 *
 * Groups Learning Log entries by calendar year — Component Library B7.
 * Functionally inert at V1 launch (the log only spans one year), but
 * specified now so the page scales cleanly into future years without
 * rework, per the PRD's instruction to design content models so they
 * "scale as projects grow."
 *
 * Visual treatment (Visual Design Spec 4.3): mono-md, text-tertiary,
 * uppercase, with a border-subtle 1px rule extending to the right of
 * the year text, filling the remaining row width — a section-divider-
 * with-rule pattern that signals structure without adding visual weight.
 *
 * Accessibility (Component Library B7): a genuine heading element
 * (h2, nested under the page's h1) rather than styled plain text, so a
 * screen reader user navigating by heading can jump directly to a given
 * year's entries once the log spans multiple years.
 */

export function YearDivider({
  year,
  className,
}: {
  year: number;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "flex items-center gap-3",
        "text-mono-md uppercase tracking-[0.04em] text-text-tertiary",
        className
      )}
    >
      {year}
      <span aria-hidden="true" className="h-px flex-1 bg-border-subtle" />
    </h2>
  );
}
