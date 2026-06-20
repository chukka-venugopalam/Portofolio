"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "motion/react";
import { NAV_ITEMS, SITE_NAME } from "@/lib/constants";
import { Container } from "@/components/ui/Container";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { MobileNavOverlay } from "@/components/layout/MobileNavOverlay";
import { cn } from "@/lib/utils";

/**
 * Navbar
 *
 * Persistent, sticky top navigation bar. Appears identically across all
 * six page templates.
 *
 * Design spec (Component Library A1, Visual Design Spec 1.5):
 * - Height: 72px desktop/tablet, 64px mobile
 * - Position: sticky top-0, z-index above page content
 * - Default: bg-bg-primary at full opacity, no border
 * - Scrolled (past 8px): bg-bg-primary at 92% opacity + backdrop-blur(12px)
 *   + 1px border-subtle bottom border — Visual Design Spec 1.5 exact values
 * - Active route: accent color + permanent 2px underline (not hover-only)
 * - Nav link hover: text-secondary → text-primary, 150ms, center-out underline
 * - Desktop/tablet (≥600px): all five links inline + ThemeToggle
 * - Mobile (<600px): hamburger opens MobileNavOverlay, ThemeToggle stays inline
 *
 * Accessibility (Component Library A1):
 * - <nav> landmark with aria-label="Primary"
 * - Active route link: aria-current="page"
 * - Hamburger: aria-expanded, aria-controls pointing to overlay id
 * - ThemeToggle: aria-label per Component Library A2
 * - Skip-nav link at the very top for keyboard users (see below)
 */

export function Navbar() {
  const pathname = usePathname();
  const shouldReduce = useReducedMotion();

  // ── Scroll-blur state ──
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    // Set initial state (page may have been loaded mid-scroll)
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ── Mobile menu state ──
  const [menuOpen, setMenuOpen] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const toggleMenu = useCallback(() => setMenuOpen((prev) => !prev), []);

  // Close menu on route change
  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  return (
    <>
      {/* ── Skip-navigation link ──
          Visually hidden until focused by a keyboard user, per WCAG 2.4.1.
          Jumps directly to the main content, bypassing the nav on every page. */}
      
        href="#main-content"
        className={cn(
          "sr-only focus:not-sr-only",
          "fixed left-4 top-4 z-[200]",
          "rounded-card bg-accent px-4 py-2",
          "text-body-sm font-medium text-bg-primary",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bg-primary focus-visible:ring-offset-2"
        )}
      >
        Skip to content
      </a>

      {/* ── Navbar bar ── */}
      <header
        className={cn(
          "fixed left-0 right-0 top-0 z-[100]",
          // Height
          "h-16 desktop:h-[72px]",
          // Transition — Visual Design Spec 1.5: continuous property change
          // on scroll crossing the 8px threshold, not a sudden snap
          !shouldReduce && "transition-[background-color,border-color,backdrop-filter] duration-base ease-standard",
          // Scrolled state
          scrolled
            ? "border-b border-border-subtle bg-bg-primary/[0.92] backdrop-blur-[12px]"
            : "bg-bg-primary"
        )}
      >
        <Container className="flex h-full items-center justify-between">

          {/* ── Wordmark / Home link ── */}
          <Link
            href="/"
            aria-label={`${SITE_NAME} — home`}
            className={cn(
              "text-heading-sm font-semibold text-text-primary",
              "transition-colors duration-fast ease-standard",
              "hover:text-accent",
              "focus-visible:outline-none focus-visible:focus-ring rounded-pill"
            )}
          >
            {SITE_NAME}
          </Link>

          {/* ── Desktop + Tablet navigation links ── */}
          <nav
            aria-label="Primary"
            className="hidden tablet:flex items-center gap-1"
          >
            <ul className="flex items-center gap-1" role="list">
              {NAV_ITEMS.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "group relative flex items-center h-9 px-3 rounded-pill",
                        "text-heading-sm",
                        "transition-colors duration-fast ease-standard",
                        "focus-visible:outline-none focus-visible:focus-ring",
                        isActive
                          ? "text-accent"
                          : "text-text-secondary hover:text-text-primary"
                      )}
                    >
                      {item.label}

                      {/* Underline: permanent on active, grows center-out on hover */}
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute bottom-0 left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-accent",
                          !shouldReduce && "transition-[width] duration-fast ease-standard",
                          isActive
                            ? "w-4"                                  // permanent active indicator
                            : "w-0 group-hover:w-4"                  // hover reveal
                        )}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="ml-2 h-5 w-px bg-border-subtle" aria-hidden="true" />
            <ThemeToggle className="ml-1" />
          </nav>

          {/* ── Mobile: ThemeToggle + Hamburger ── */}
          <div className="flex items-center gap-1 tablet:hidden">
            <ThemeToggle />

            <button
              ref={hamburgerRef}
              type="button"
              onClick={toggleMenu}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav-overlay"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              className={cn(
                "flex h-9 w-9 flex-col items-center justify-center gap-[5px] rounded-pill",
                "text-text-secondary",
                "hover:bg-bg-tertiary hover:text-text-primary",
                !shouldReduce && "transition-colors duration-fast ease-standard",
                "focus-visible:outline-none focus-visible:focus-ring"
              )}
            >
              {/* Hamburger / X morphing lines */}
              <span
                className={cn(
                  "block h-[1.5px] w-[18px] rounded-full bg-current",
                  !shouldReduce && "transition-transform duration-base ease-standard origin-center",
                  menuOpen && "translate-y-[6.5px] rotate-45"
                )}
              />
              <span
                className={cn(
                  "block h-[1.5px] w-[18px] rounded-full bg-current",
                  !shouldReduce && "transition-opacity duration-fast ease-standard",
                  menuOpen && "opacity-0"
                )}
              />
              <span
                className={cn(
                  "block h-[1.5px] w-[18px] rounded-full bg-current",
                  !shouldReduce && "transition-transform duration-base ease-standard origin-center",
                  menuOpen && "-translate-y-[6.5px] -rotate-45"
                )}
              />
            </button>
          </div>

        </Container>
      </header>

      {/* ── Mobile overlay panel (separate component for focus-trap logic) ── */}
      <MobileNavOverlay
        isOpen={menuOpen}
        onClose={closeMenu}
        triggerRef={hamburgerRef}
      />

      {/* ── Spacer: pushes page content below the fixed navbar ── */}
      <div className="h-16 desktop:h-[72px]" aria-hidden="true" />
    </>
  );
}