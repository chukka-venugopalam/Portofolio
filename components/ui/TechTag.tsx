import { cn } from "@/lib/utils";

/**
 * TechTag
 *
 * Communicates real, specific technologies used in a project —
 * Component Library B5. Specificity here (naming "Postgres," not "a
 * database") is part of what makes the site read as built by someone
 * with real hands-on experience.
 *
 * Single variant, no tiering between "primary" and "secondary" tech —
 * every tag carries equal visual weight (Component Library B5).
 * Non-interactive plain informational pill.
 *
 * Used standalone (TechTag) or as a labeled group (TechTagList) — the
 * list wrapper renders a real <ul>/<li> structure so screen reader
 * users get an accurate count and can navigate tag-by-tag, per
 * Component Library B5's accessibility requirement, rather than hearing
 * one long run-on string of technology names.
 */

interface TechTagProps {
  children: React.ReactNode;
  className?: string;
}

export function TechTag({ children, className }: TechTagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center",
        "rounded-pill bg-bg-tertiary",
        "px-2 py-0.75",
        "text-mono-sm text-text-tertiary",
        className
      )}
    >
      {children}
    </span>
  );
}

interface TechTagListProps {
  tags: string[];
  className?: string;
}

/**
 * Renders a project's full tech stack as a real list — wraps to
 * multiple lines at any breakpoint, never truncates, never scrolls
 * (Component Library B5 Responsive behavior: hiding tags behind a
 * "+2 more" affordance would hide exactly the specificity that makes
 * a project card credible).
 */
export function TechTagList({ tags, className }: TechTagListProps) {
  return (
    <ul
      className={cn("flex flex-wrap items-center gap-1.5", className)}
      aria-label="Technologies used"
    >
      {tags.map((tag) => (
        <li key={tag}>
          <TechTag>{tag}</TechTag>
        </li>
      ))}
    </ul>
  );
}