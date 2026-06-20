import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * BackLink
 *
 * A small, consistent escape hatch on every Project Detail page back to
 * the Work page's full list — Component Library D5. Present mainly
 * because a visitor who arrives directly via a shared link (the PRD's
 * "secondary journey") has no other obvious way back into the rest of
 * the site's content.
 *
 * Accessibility (Component Library D5): a genuine <a> element (via
 * next/link) pointing explicitly to /work — never a JS-only
 * router.back(), which breaks if the visitor landed on this page
 * directly rather than via in-site navigation. Accessible text reads
 * "Back to Work," not a bare chevron icon with no text.
 */

export function BackLink({ className }: { className?: string }) {
  return (
    <Link
      href="/work"
      className={cn(
        "inline-flex items-center gap-1.5",
        "text-body-sm text-text-secondary",
        "hover:text-text-primary",
        "transition-colors duration-fast ease-standard",
        "focus-visible:outline-none focus-visible:focus-ring rounded-pill",
        className
      )}
    >
      <ChevronLeftIcon />
      Back to Work
    </Link>
  );
}

function ChevronLeftIcon() {
  return (
    <svg
      width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
