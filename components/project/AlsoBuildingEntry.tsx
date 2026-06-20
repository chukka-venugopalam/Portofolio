import { StatusTag } from "@/components/ui/StatusTag";
import type { AlsoBuildingEntry as AlsoBuildingEntryType } from "@/lib/content/also-building-schema";

/**
 * AlsoBuildingEntry
 *
 * The PRD's content-honesty mechanism for projects real enough to
 * mention but not substantial enough for a full Project Detail page —
 * Component Library D8. Deliberately minimal: status tag + name +
 * description, no card chrome, no tech tags, no links, non-interactive
 * by design (no detail page exists for these by definition).
 *
 * This minimal format must never be confusable with ProjectCard's grid
 * variant, even at a glance — the absence of a border, tech tags, and
 * links is what signals "lighter weight" structurally, not just visually.
 */

export function AlsoBuildingEntry({
  entry,
}: {
  entry: AlsoBuildingEntryType;
}) {
  return (
    <li className="flex flex-col tablet:flex-row tablet:items-baseline gap-1.5 tablet:gap-3 py-2.5">
      <div className="flex items-center gap-2.5 shrink-0">
        <StatusTag status={entry.status} />
        <span className="text-body-md font-medium text-text-primary">
          {entry.name}
        </span>
      </div>
      <span className="text-body-sm text-text-secondary">
        {entry.description}
      </span>
    </li>
  );
}
