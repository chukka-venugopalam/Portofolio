import { cn } from "@/lib/utils";
import type { ProjectStatus } from "@/content/projects/_schema";

/**
 * StatusTag
 *
 * Makes a project's current state (Shipped / Building / Exploring)
 * instantly scannable — Component Library B4. One of the load-bearing
 * components for the PRD's "without appearing dishonest or inflated"
 * content model: an honest, consistently-applied status system is what
 * lets in-progress work sit next to finished work without misleading
 * anyone.
 *
 * Critical accessibility rule (Component Library B4, non-negotiable):
 * the colored dot is purely reinforcing. The text label is what actually
 * carries meaning for colorblind visitors and screen readers — this
 * component must NEVER be built as a color-only dot with no text, under
 * any circumstance, including a hypothetical compact variant.
 *
 * Non-interactive by design: not a <button>, no tabindex, no hover state
 * — this is a label, not a control (Component Library B4 Accessibility).
 *
 * Same size everywhere it's used (project cards, project page headers) —
 * no size variants, reinforcing that "status" carries equal weight
 * regardless of context.
 */

const STATUS_LABEL: Record<ProjectStatus, string> = {
  shipped: "Shipped",
  building: "Building",
  exploring: "Exploring",
  designing: "Designing",
  "architecture-complete": "Architecture Complete",
  "mvp-development": "MVP Development",
  "in-progress": "In Progress",
  "production-ready": "Production Ready",
};

const STATUS_COLOR_CLASSES: Record<ProjectStatus, string> = {
  shipped: "text-status-shipped",
  building: "text-status-building",
  exploring: "text-status-exploring",
  designing: "text-status-exploring",
  "architecture-complete": "text-status-building",
  "mvp-development": "text-status-building",
  "in-progress": "text-status-building",
  "production-ready": "text-status-shipped",
};

const STATUS_DOT_CLASSES: Record<ProjectStatus, string> = {
  shipped: "bg-status-shipped",
  building: "bg-status-building",
  exploring: "bg-status-exploring",
  designing: "bg-status-exploring",
  "architecture-complete": "bg-status-building",
  "mvp-development": "bg-status-building",
  "in-progress": "bg-status-building",
  "production-ready": "bg-status-shipped",
};

interface StatusTagProps {
  status: ProjectStatus;
  className?: string;
}

export function StatusTag({ status, className }: StatusTagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5",
        "rounded-pill bg-bg-tertiary",
        "px-2.5 py-1",
        "text-mono-md",
        STATUS_COLOR_CLASSES[status],
        className
      )}
    >
      <span
        aria-hidden="true"
        className={cn("h-1.5 w-1.5 rounded-full", STATUS_DOT_CLASSES[status])}
      />
      {STATUS_LABEL[status]}
    </span>
  );
}
