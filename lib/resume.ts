import { existsSync, statSync } from "fs";
import path from "path";

/**
 * Resume content + PDF-availability check.
 *
 * Per the PRD's Part 10 Resume Hub Strategy: name, current status (year/
 * program), a 3-4 line "currently focused on" statement, and a short
 * list of the strongest proof points. This task's six-section structure
 * splits that single PRD "Summary block" into two visually distinct
 * page sections — Quick Snapshot (identity + focus) and Key Highlights
 * (proof points) — which is a finer-grained breakdown of the same
 * content model, not a different one. Both read from this one source.
 */

export interface ResumeContent {
  name: string;
  /** e.g. "3rd-year student, Computer Science" */
  statusLine: string;
  /** 3-4 sentences, per PRD Part 10. */
  currentFocus: string;
  /** Short list of specific, real proof points — never a generic skills list. */
  highlights: string[];
  /** ISO date string — drives both the page's Last Updated stamp and a
   *  build-time staleness warning, operationalizing the PRD's "dated
   *  resume signals active maintenance" trust signal. */
  lastUpdated: string;
}

// TODO before launch: replace with real content. Kept here, not
// hardcoded inline in the page component, so updating the resume's
// on-page summary is a one-file edit — consistent with this codebase's
// "content lives in one obvious place" pattern (lib/constants.ts,
// content/*.json) rather than buried inside JSX.
export const RESUME_CONTENT: ResumeContent = {
  name: "[Your Name]",
  statusLine: "Student & builder — Computer Science",
  currentFocus:
    "Currently designing Concept Intelligence Platform, a diagnostic tool that surfaces gaps in DSA understanding rather than just checking whether a solution passes. The architecture and data model are fully designed; implementation starts next. Comfortable across the stack, from backend logic and data modeling through to the interface someone actually reads.",
  highlights: [
    "Designed a full diagnostic system end-to-end — Concept Intelligence Platform — before writing a line of code: 15 architecture steps including a hand-curated 80-node concept graph, an 18-endpoint API, and a 6-week build plan. See the Work page for the full writeup, including the tradeoffs.",
    "Comfortable with Next.js, FastAPI/Python, and PostgreSQL across full-stack and applied-AI contexts.",
    "Learns in public — the Learning Log is a dated, falsifiable record of what's actually been picked up recently, not a static skills list.",
  ],
  lastUpdated: "2026-06-01",
};

const RESUME_PDF_RELATIVE_PATH = "/resume.pdf";

/**
 * Build-time check for whether the resume PDF actually exists in
 * /public. This runs during static generation (this function is only
 * ever called from a page component, which executes at build time for
 * a fully statically-generated route — Implementation Blueprint 6.1),
 * not at request time, since there is no request time for a static
 * site. A missing PDF should never crash the build (the rest of the
 * site is real and shippable even if the resume file hasn't been added
 * yet) — instead the Resume page renders an honest fallback in its
 * place. See PDFViewerContainer for the rendered fallback state.
 */
export function getResumePdfStatus(): {
  exists: boolean;
  path: string;
  /** Sanity check: catches an accidentally-committed empty/corrupt file,
   *  not just a missing one. */
  sizeBytes: number | null;
} {
  const absolutePath = path.join(process.cwd(), "public", "resume.pdf");
  const exists = existsSync(absolutePath);

  let sizeBytes: number | null = null;
  if (exists) {
    try {
      sizeBytes = statSync(absolutePath).size;
    } catch {
      // Extremely unlikely race (file removed between existsSync and
      // statSync) — treat as if it doesn't exist rather than throwing,
      // since this is a presentational fallback decision, not a
      // build-correctness one.
      return { exists: false, path: RESUME_PDF_RELATIVE_PATH, sizeBytes: null };
    }
  }

  // A 0-byte file is functionally "missing" from a visitor's
  // perspective — treat it the same as not existing rather than
  // rendering a broken embed pointed at an empty file.
  const effectivelyExists = exists && (sizeBytes ?? 0) > 0;

  if (!effectivelyExists && exists) {
    console.warn(
      `[content warning] public/resume.pdf exists but is 0 bytes — ` +
        `treating as missing. Replace with a real PDF before launch.`
    );
  }

  return {
    exists: effectivelyExists,
    path: RESUME_PDF_RELATIVE_PATH,
    sizeBytes,
  };
}
