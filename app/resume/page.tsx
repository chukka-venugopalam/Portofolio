import { buildMetadata } from "@/lib/seo/metadata";
import { RESUME_CONTENT, getResumePdfStatus } from "@/lib/resume";
import { formatFullDate } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ResumeSummaryBlock } from "@/components/resume/ResumeSummaryBlock";
import {
  PDFViewerContainer,
  ResumeDownloadButton,
} from "@/components/resume/PDFViewerContainer";

export const metadata = buildMetadata({
  title: "Resume",
  description: "Education, current focus, and proof points at a glance.",
  pathname: "/resume",
});

/**
 * Resume page — PRD Part 10, Visual Design Spec Section 5, Component
 * Library D6/D7.
 *
 * Six sections, matching this task's requested structure:
 *   1. Resume Hero               — SectionHeader page mode (H1 only —
 *                                   no sub-line; the Last Updated stamp
 *                                   sits directly below it instead,
 *                                   per Visual Design Spec 5.3/5.5)
 *   2. Quick Snapshot              — ResumeSummaryBlock (name, status,
 *                                     current focus)
 *   3. Key Highlights                — proof points, same content
 *                                       source as Quick Snapshot — see
 *                                       lib/resume.ts's doc comment on
 *                                       why this is one content model
 *                                       split into two page sections
 *   4. Resume Download CTA             — ResumeDownloadButton, handles
 *                                         the missing-PDF case
 *   5. Embedded Resume Viewer            — PDFViewerContainer, same
 *                                           missing-PDF handling
 *   6. Last Updated Footer                — restates the date from the
 *                                            hero stamp at the bottom,
 *                                            since a visitor who scrolls
 *                                            the whole page and is about
 *                                            to leave benefits from the
 *                                            same trust signal again
 *                                            without scrolling back up
 *
 * Layout (Visual Design Spec 5.1): content max-width 760px, the same
 * reading-width column as Project Detail and Learning Log — this page
 * is prose-and-document-heavy, not card-grid heavy.
 *
 * Recruiter focus (this task's explicit requirement, PRD Part 4/10):
 * the Quick Snapshot + Key Highlights sections are designed to be
 * readable in under 15 seconds without ever touching the PDF embed —
 * that's the actual point of splitting the PRD's single Summary block
 * into two clearly-labeled sections rather than one dense block.
 *
 * Missing-PDF handling (this task's explicit requirement, and the
 * actual current state of this codebase — public/resume.pdf doesn't
 * exist yet): getResumePdfStatus() runs once, at the top of this build-
 * time-rendered page, and its result flows into both
 * ResumeDownloadButton and PDFViewerContainer so the two stay in sync —
 * there's no scenario where the button claims a PDF exists while the
 * embed says otherwise, or vice versa.
 */
export default function ResumePage() {
  const pdfStatus = getResumePdfStatus();

  return (
    <>
      {/* ── 1. Resume Hero ──
          Visual Design Spec 5.3: H1 only, no sub-line — the Last
          Updated stamp takes that visual slot directly below the H1
          instead, per 5.5's spacing rhythm. */}
      <Section spacing="secondary" className="pt-0">
        <Container className="max-w-[760px]" wide={false}>
          <SectionHeader mode="page" level="h1">
            Resume
          </SectionHeader>
          <p className="mt-3 text-mono-sm text-text-tertiary">
            Last updated{" "}
            <time dateTime={RESUME_CONTENT.lastUpdated}>
              {formatFullDate(RESUME_CONTENT.lastUpdated)}
            </time>
          </p>
        </Container>
      </Section>

      {/* ── 2. Quick Snapshot ── */}
      <Section spacing="tight">
        <Container className="max-w-[760px]" wide={false}>
          <ResumeSummaryBlock content={RESUME_CONTENT} />
        </Container>
      </Section>

      {/* ── 3. Key Highlights ──
          Same content source as Quick Snapshot (RESUME_CONTENT) — a
          short list of specific, real proof points, never a generic
          skills list (PRD Part 10). Dash markers, not numerals — these
          are parallel highlights, not sequential reasoned decisions
          (unlike the Project Detail Tradeoffs Block's numbered <ol>),
          per Visual Design Spec 5.3. */}
      <Section spacing="tight">
        <Container className="max-w-[760px]" wide={false}>
          <SectionHeader mode="label" level="h2">
            Key Highlights
          </SectionHeader>
          <ul className="mt-5 flex flex-col gap-3">
            {RESUME_CONTENT.highlights.map((highlight) => (
              <li key={highlight} className="flex gap-3">
                <span aria-hidden="true" className="text-accent">
                  —
                </span>
                <span className="text-body-md text-text-primary">
                  {highlight}
                </span>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* ── 4. Resume Download CTA ──
          Prominent, immediately below the content a recruiter has just
          scanned — Visual Design Spec 5.2's stated hierarchy. */}
      <Section spacing="tight">
        <Container className="max-w-[760px]" wide={false}>
          <ResumeDownloadButton
            exists={pdfStatus.exists}
            pdfPath={pdfStatus.path}
          />
        </Container>
      </Section>

      {/* ── 5. Embedded Resume Viewer ──
          Fallback/detail view, not the primary content of the page —
          Visual Design Spec 5.2: "visually the least dominant element
          relative to its space." */}
      <Section spacing="tight" className="pb-0">
        <Container className="max-w-[760px]" wide={false}>
          <PDFViewerContainer
            exists={pdfStatus.exists}
            pdfPath={pdfStatus.path}
          />
        </Container>
      </Section>

      {/* ── 6. Last Updated Footer ──
          Restates the same date shown in the hero — a visitor who's
          scrolled the full page and is now deciding whether to leave
          benefits from seeing this trust signal again without
          scrolling back to the top. */}
      <Section spacing="tight">
        <Container className="max-w-[760px]" wide={false}>
          <div className="border-t border-border-subtle pt-5">
            <p className="text-mono-sm text-text-tertiary">
              This resume was last updated on{" "}
              <time dateTime={RESUME_CONTENT.lastUpdated}>
                {formatFullDate(RESUME_CONTENT.lastUpdated)}
              </time>
              .
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
