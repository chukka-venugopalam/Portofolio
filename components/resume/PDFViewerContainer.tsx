import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/**
 * PDFViewerContainer
 *
 * Embeds the resume PDF inline via native browser PDF rendering — an
 * <iframe>, not a custom-built viewer, per Component Library D7 and
 * Visual Design Spec 5.8: building a custom PDF rendering UI is
 * unnecessary engineering cost for a one-week build when the browser-
 * native embed already does the job.
 *
 * Missing-PDF handling (this task's explicit requirement, and a real
 * current state of this codebase — public/resume.pdf does not exist
 * yet): rather than rendering a broken <iframe> pointed at a 404, this
 * component renders an honest, recruiter-appropriate fallback message
 * in the exact same container position the embed would otherwise
 * occupy. This keeps the page's layout and spacing identical whether or
 * not the PDF exists — Visual Design Spec 5.5's spacing rhythm doesn't
 * collapse or shift just because content is missing, which matters
 * since "Resume" is the single page where a layout glitch would be most
 * damaging to the recruiter-facing first impression.
 *
 * Accessibility: the <iframe>'s title attribute describes its content
 * (Component Library D7) so screen reader users understand what the
 * embedded region contains before interacting with it. The fallback
 * state is plain, readable text — not an empty box — so it's equally
 * accessible whether or not the PDF is present.
 */

interface PDFViewerContainerProps {
  exists: boolean;
  pdfPath: string;
  className?: string;
}

export function PDFViewerContainer({
  exists,
  pdfPath,
  className,
}: PDFViewerContainerProps) {
  return (
    <div
      className={cn(
        "rounded-card border border-border-default overflow-hidden",
        // 8.5:11 aspect ratio — Visual Design Spec 5.5
        "aspect-[8.5/11]",
        "bg-bg-secondary",
        className
      )}
    >
      {exists ? (
        <iframe
          src={pdfPath}
          title="Resume PDF preview"
          className="h-full w-full"
        />
      ) : (
        <PDFMissingFallback />
      )}
    </div>
  );
}

/**
 * Rendered in place of the embed when public/resume.pdf doesn't exist
 * (or is a 0-byte file — see lib/resume.ts's getResumePdfStatus()).
 * Deliberately calm and factual, not an error-styled red box: a missing
 * resume during early development isn't a system failure, and treating
 * it like one would be a worse signal to anyone who happens to preview
 * the site before the file is added.
 */
function PDFMissingFallback() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
      <DocIcon />
      <p className="text-body-md text-text-secondary">
        The resume preview isn&rsquo;t available right now.
      </p>
      <p className="text-body-sm text-text-tertiary">
        Reach out directly via the Connect page in the meantime.
      </p>
    </div>
  );
}

function DocIcon() {
  return (
    <svg
      width="32" height="32" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round"
      className="text-text-tertiary"
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M10 13l2 2 4-4" />
    </svg>
  );
}

/**
 * DownloadButton
 *
 * The Download PDF CTA — exported separately from the container itself
 * since the page places it between the Summary content and the embed
 * (Visual Design Spec 5.1's layout order), not inside the embed's own
 * box. When the PDF is missing, this renders as a disabled button with
 * an honest label rather than a live link to a 404 — a broken download
 * link is exactly the kind of small trust failure the PRD's content-
 * honesty model exists to prevent, and it's cheap to avoid here.
 */
export function ResumeDownloadButton({
  exists,
  pdfPath,
  className,
}: {
  exists: boolean;
  pdfPath: string;
  className?: string;
}) {
  if (!exists) {
    return (
      <div className="inline-flex flex-col items-start gap-2">
        <Button disabled aria-describedby="resume-unavailable-note" className={className}>
          Download PDF
        </Button>
        <p id="resume-unavailable-note" className="text-body-sm text-text-tertiary">
          The PDF isn&rsquo;t available yet — see the note below, or reach out via Connect.
        </p>
      </div>
    );
  }

  return (
    <Button href={pdfPath} className={className}>
      Download PDF
    </Button>
  );
}
