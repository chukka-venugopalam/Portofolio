import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SITE_NAME, SOCIAL_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * Footer
 *
 * The site's closing element — appears identically on every page.
 * Static Server Component (no client-side state needed).
 *
 * Design spec (Component Library A3, Visual Design Spec 1.5):
 * - space-6 (48px) vertical padding
 * - 1px border-subtle top border — marks it as a distinct utility tier,
 *   not just more page content
 * - Desktop: single row — name left, copyright + built-with center-right,
 *   contact icons far right
 * - Mobile: stacked vertically — name, copyright, then icon row, all centered
 * - No fade-in animation (Component Library A3): renders immediately,
 *   no entrance delay for content the visitor has already scrolled through
 * - All icon links carry aria-label text (Component Library A3
 *   accessibility requirement — icon-only links without an accessible
 *   name are a common, easily-avoided failure)
 *
 * Accessibility:
 * - <footer> landmark
 * - All links have visible or aria-label text
 */

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className={cn(
        "border-t border-border-subtle",
        "py-space-6"
      )}
    >
      <Container>
        {/* Desktop: single row */}
        <div className="hidden tablet:flex items-center justify-between gap-4">
          {/* Left: wordmark */}
          <span className="text-mono-sm text-text-tertiary font-medium">
            {SITE_NAME}
          </span>

          {/* Center: copyright */}
          <span className="text-mono-sm text-text-tertiary">
            © {year}
          </span>

          {/* Right: contact icons */}
          <FooterIconLinks />
        </div>

        {/* Mobile: stacked + centered */}
        <div className="flex tablet:hidden flex-col items-center gap-4">
          <span className="text-mono-sm text-text-tertiary font-medium">
            {SITE_NAME}
          </span>
          <span className="text-mono-sm text-text-tertiary">
            © {year}
          </span>
          <FooterIconLinks />
        </div>
      </Container>
    </footer>
  );
}

function FooterIconLinks() {
  return (
    <div className="flex items-center gap-3">
      <FooterIconLink
        href={`mailto:${SOCIAL_LINKS.email}`}
        label="Email"
        icon={<EmailIcon />}
      />
      <FooterIconLink
        href={SOCIAL_LINKS.github}
        label="GitHub"
        icon={<GitHubIcon />}
        external
      />
      <FooterIconLink
        href={SOCIAL_LINKS.linkedin}
        label="LinkedIn"
        icon={<LinkedInIcon />}
        external
      />
    </div>
  );
}

function FooterIconLink({
  href,
  label,
  icon,
  external = false,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  external?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-pill",
        "text-text-tertiary",
        "hover:text-text-primary",
        "transition-colors duration-fast ease-standard",
        "focus-visible:outline-none focus-visible:focus-ring"
      )}
    >
      {icon}
    </Link>
  );
}

/* ── Inline SVG icons — no external dependency ── */

function EmailIcon() {
  return (
    <svg
      width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg
      width="16" height="16" viewBox="0 0 24 24"
      fill="currentColor" aria-hidden="true"
    >
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg
      width="16" height="16" viewBox="0 0 24 24"
      fill="currentColor" aria-hidden="true"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}
