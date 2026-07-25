"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ProjectFrontmatter } from "@/content/projects/_schema";

interface ProjectActionButtonsProps {
  project: ProjectFrontmatter;
  currentSlug?: string;
  variant?: "card" | "header" | "footer";
  className?: string;
}

export function ProjectActionButtons({
  project,
  currentSlug,
  className,
}: ProjectActionButtonsProps) {
  const detailHref = `/work/${project.slug}`;
  const isCurrentPage = currentSlug === project.slug;

  const hasCodeLink = Boolean(project.links?.code);
  const hasLiveLink = Boolean(project.links?.live);
  const codeUrl = project.links?.code;
  const liveUrl = project.links?.live;

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {/* Button 1: Case Study (Filled / Primary Teal Pill) */}
      {isCurrentPage ? (
        <Link
          href="/work"
          className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-1.5 text-[12px] font-semibold text-slate-950 transition-all duration-200 hover:bg-accent-light shadow-[0_0_12px_rgba(20,184,166,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          All Projects
        </Link>
      ) : (
        <Link
          href={detailHref}
          className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-1.5 text-[12px] font-semibold text-slate-950 transition-all duration-200 hover:bg-accent-light shadow-[0_0_12px_rgba(20,184,166,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {/* Book / Document Icon */}
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          Case Study
        </Link>
      )}

      {/* Button 2: Code (GitHub Mark + Code, Outlined Pill) */}
      {hasCodeLink && codeUrl ? (
        <a
          href={codeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-border-subtle bg-bg-tertiary/60 px-3.5 py-1.5 text-[12px] font-medium text-text-primary transition-all duration-200 hover:border-accent/40 hover:text-accent hover:bg-bg-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {/* GitHub Mark Icon */}
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
          Code
        </a>
      ) : (
        <span
          title="Not public yet"
          className="inline-flex items-center gap-1.5 rounded-full border border-border-subtle/40 bg-bg-tertiary/20 px-3.5 py-1.5 text-[12px] font-medium text-text-quaternary opacity-50 cursor-not-allowed"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="opacity-60">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
          Code
        </span>
      )}

      {/* Button 3: Live Demo (Arrow Icon + Live Demo, Outlined Pill) */}
      {hasLiveLink && liveUrl ? (
        <a
          href={liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-border-subtle bg-bg-tertiary/60 px-3.5 py-1.5 text-[12px] font-medium text-text-primary transition-all duration-200 hover:border-accent/40 hover:text-accent hover:bg-bg-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {/* Arrow Icon */}
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          Live Demo
        </a>
      ) : (
        <span
          title="No live demo"
          className="inline-flex items-center gap-1.5 rounded-full border border-border-subtle/40 bg-bg-tertiary/20 px-3.5 py-1.5 text-[12px] font-medium text-text-quaternary opacity-50 cursor-not-allowed"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="opacity-60">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          Live Demo
        </span>
      )}
    </div>
  );
}
