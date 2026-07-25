import { existsSync, statSync } from "fs";
import path from "path";

export interface ResumeContent {
  name: string;
  statusLine: string;
  currentFocus: string;
  highlights: string[];
}

export const RESUME_CONTENT: ResumeContent = {
  name: "Venugopalam Chukka",
  statusLine: "Student and builder, Computer Science",
  currentFocus:
    "Designing Concept Intelligence Platform, a diagnostic tool that surfaces gaps in DSA understanding by analyzing how you explain concepts, not just whether you can solve problems. Also building Silicon Valley Learning OS, long-term projects exploring AI-assisted learning and developer growth.",
  highlights: [
    "Designed and building two systems: Concept Intelligence Platform (diagnosing DSA understanding gaps) and Silicon Valley Learning OS (context-aware learning).",
    "Comfortable across the stack: Next.js and FastAPI for applications, PostgreSQL and Redis for data, Python for AI integration.",
    "Learning philosophy: build prototypes to find gaps in understanding, then study deeper. Every project on this site is an answer to a question I was curious about.",
  ],
};

const RESUME_PDF_RELATIVE_PATH = "/resume.pdf";

export function getResumePdfStatus(): {
  exists: boolean;
  path: string;
  sizeBytes: number | null;
} {
  const absolutePath = path.join(process.cwd(), "public", "resume.pdf");
  const exists = existsSync(absolutePath);

  let sizeBytes: number | null = null;
  if (exists) {
    try {
      sizeBytes = statSync(absolutePath).size;
    } catch {
      return { exists: false, path: RESUME_PDF_RELATIVE_PATH, sizeBytes: null };
    }
  }

  const effectivelyExists = exists && (sizeBytes ?? 0) > 0;

  if (!effectivelyExists && exists) {
    console.warn(
      `[content warning] public/resume.pdf exists but is 0 bytes, ` +
        `treating as missing. Replace with a real PDF before launch.`
    );
  }

  return {
    exists: effectivelyExists,
    path: RESUME_PDF_RELATIVE_PATH,
    sizeBytes,
  };
}
