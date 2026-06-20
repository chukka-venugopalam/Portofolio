"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { SOCIAL_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * ConnectStrip
 *
 * The site's primary conversion mechanism — Component Library D1.
 * Two variants:
 * - "home": compact, availability tags + a single row of icon-linked
 *   contact buttons, used as Home's closing section.
 * - "page": fuller, each contact method gets its own labeled row,
 *   used as the Connect page's full content.
 *
 * Availability tags (Component Library C3) are non-interactive — same
 * pill shape language as Filter Chip, but with no hover/cursor-pointer,
 * since a false clickable affordance wastes a visitor's click and
 * erodes trust elsewhere on the site.
 *
 * The email row's Copy button implements Component Library C4's
 * success-state: label crossfades "Copy" → "Copied" with the success
 * color token for 1.5s, announced via aria-live for screen reader users
 * who can't see the visual swap (Component Library C4 Accessibility —
 * this is the part most likely to be skipped under time pressure, so
 * it's implemented in full here, not stubbed).
 *
 * resumePdfExists (page variant only): whether public/resume.pdf
 * actually exists, per lib/resume.ts's build-time check. The resume
 * contact row's Download button respects this rather than hardcoding a
 * link straight to /resume.pdf — a hardcoded link would silently 404
 * if the PDF hasn't been added yet (the actual current state of this
 * codebase), which is exactly the kind of broken-link trust failure the
 * PRD's content-honesty model exists to prevent. Defaults to true so
 * existing call sites (Home's compact icon row doesn't use this prop at
 * all; only the page variant's resume row reads it) don't silently
 * break if a caller doesn't pass it — though any "page" variant usage
 * should pass the real value, see app/connect/page.tsx.
 */

const AVAILABILITY = ["Internships", "Hackathons", "Collaboration"] as const;

interface ConnectStripProps {
  variant?: "home" | "page";
  /** Page variant only — see doc comment above. */
  resumePdfExists?: boolean;
  className?: string;
}

export function ConnectStrip({
  variant = "home",
  resumePdfExists = true,
  className,
}: ConnectStripProps) {
  return (
    <div className={className}>
      <AvailabilityTags />

      {variant === "home" ? (
        <IconRow className="mt-6" />
      ) : (
        <ContactRows
          resumePdfExists={resumePdfExists}
          className="mt-12 desktop:mt-16"
        />
      )}
    </div>
  );
}

/* ── Availability tags — non-interactive, shared shape with Filter Chip ── */

function AvailabilityTags() {
  return (
    <ul className="flex flex-wrap items-center gap-2" aria-label="Open to">
      {AVAILABILITY.map((label) => (
        <li key={label}>
          <span
            className={cn(
              "inline-flex items-center rounded-pill",
              "border border-border-subtle bg-bg-tertiary",
              "px-3.5 py-1.5",
              "text-mono-md text-text-secondary"
              // Deliberately no hover state, no cursor-pointer — this is a
              // statement, not a control (Component Library D1 / C3).
            )}
          >
            {label}
          </span>
        </li>
      ))}
    </ul>
  );
}

/* ── Home variant: compact icon row ── */

function IconRow({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <IconLink
        href={`mailto:${SOCIAL_LINKS.email}`}
        label="Email"
        children={<EmailIcon />}
      />
      <IconLink
        href={SOCIAL_LINKS.github}
        label="GitHub"
        external
        children={<GitHubIcon />}
      />
      <IconLink
        href={SOCIAL_LINKS.linkedin}
        label="LinkedIn"
        external
        children={<LinkedInIcon />}
      />
      <IconLink
        href="/resume"
        label="Resume PDF"
        children={<DocIcon />}
      />
    </div>
  );
}

function IconLink({
  href,
  label,
  children,
  external = false,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(
        "flex h-11 w-11 items-center justify-center rounded-card",
        "border border-border-subtle text-text-secondary",
        "hover:border-border-default hover:text-text-primary",
        "transition-colors duration-fast ease-standard",
        "focus-visible:outline-none focus-visible:focus-ring"
      )}
    >
      {children}
    </Link>
  );
}

/* ── Connect-page variant: full labeled rows ── */

function ContactRows({
  resumePdfExists,
  className,
}: {
  resumePdfExists: boolean;
  className?: string;
}) {
  const shouldReduce = useReducedMotion();

  const rows = [
    { key: "email", label: "Email", value: SOCIAL_LINKS.email },
    { key: "github", label: "GitHub", value: SOCIAL_LINKS.github.replace("https://", "") },
    { key: "linkedin", label: "LinkedIn", value: SOCIAL_LINKS.linkedin.replace("https://", "") },
    {
      key: "resume",
      label: "Resume",
      value: resumePdfExists
        ? "Download the PDF directly"
        : "Not available yet — reach out via email instead",
    },
  ];

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {rows.map((row, index) => (
        <motion.div
          key={row.key}
          initial={shouldReduce ? false : { opacity: 0, y: 16 }}
          whileInView={shouldReduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.25,
            delay: shouldReduce ? 0 : index * 0.06,
            ease: [0.4, 0, 0.2, 1],
          }}
        >
          <ContactRow
            type={row.key}
            label={row.label}
            value={row.value}
            resumePdfExists={resumePdfExists}
          />
        </motion.div>
      ))}
    </div>
  );
}

function ContactRow({
  type,
  label,
  value,
  resumePdfExists,
}: {
  type: string;
  label: string;
  value: string;
  resumePdfExists: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-card border border-border-subtle",
        "p-6",
        "flex flex-col tablet:flex-row tablet:items-center tablet:justify-between gap-4"
      )}
    >
      <div>
        <span className="block text-mono-sm uppercase tracking-[0.08em] text-text-tertiary">
          {label}
        </span>
        <span className="mt-1 block text-body-md text-text-primary">
          {value}
        </span>
      </div>

      {type === "email" ? (
        <CopyButton value={SOCIAL_LINKS.email} />
      ) : type === "github" ? (
        <Button variant="secondary" href={SOCIAL_LINKS.github} external className="shrink-0">
          Visit
        </Button>
      ) : type === "linkedin" ? (
        <Button variant="secondary" href={SOCIAL_LINKS.linkedin} external className="shrink-0">
          Visit
        </Button>
      ) : resumePdfExists ? (
        <Button variant="secondary" href="/resume.pdf" className="shrink-0">
          Download
        </Button>
      ) : (
        <div className="flex flex-col items-start tablet:items-end gap-1.5 shrink-0">
          <Button variant="secondary" disabled aria-describedby="connect-resume-unavailable-note">
            Download
          </Button>
          <p id="connect-resume-unavailable-note" className="text-body-sm text-text-tertiary">
            Not uploaded yet
          </p>
        </div>
      )}
    </div>
  );
}

/* ── Copy Button — Component Library C4 ── */

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shouldReduce = useReducedMotion();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Clipboard API unavailable (e.g. insecure context) — fail silently;
      // the email address is still visible as plain text in the row.
      return;
    }

    setCopied(true);

    // Reset the timer cleanly on repeat clicks rather than letting two
    // timers race (Component Library C4: "if the visitor clicks again
    // before the revert completes, the timer should reset cleanly").
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Button
      variant="secondary"
      onClick={handleCopy}
      className={cn("shrink-0", copied && "text-success border-success/40")}
    >
      <span
        className={cn(!shouldReduce && "transition-opacity duration-fast ease-standard")}
      >
        {copied ? "Copied" : "Copy"}
      </span>

      {/* Announces the success state to assistive technology — the
          visual "Copied" swap above is invisible to screen reader users
          without this (Component Library C4 Accessibility). */}
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? "Email address copied to clipboard" : ""}
      </span>
    </Button>
  );
}

/* ── Inline SVG icons ── */

function EmailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function DocIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
    </svg>
  );
}
