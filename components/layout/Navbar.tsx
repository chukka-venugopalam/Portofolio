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

export function Navbar() {
  const pathname = usePathname();
  const shouldReduce = useReducedMotion();

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [menuOpen, setMenuOpen] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const toggleMenu = useCallback(() => setMenuOpen((prev) => !prev), []);

  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  return (
    <>
      <a
        href="#main-content"
        className={cn(
          "sr-only focus:not-sr-only",
          "fixed left-4 top-4 z-[200]",
          "rounded-lg bg-accent px-4 py-2",
          "text-body-sm font-medium text-white",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bg-primary focus-visible:ring-offset-2"
        )}
      >
        Skip to content
      </a>

      <header
        className={cn(
          "fixed left-0 right-0 top-0 z-[100]",
          "h-16 desktop:h-[72px]",
          !shouldReduce && "transition-all duration-base ease-standard",
          scrolled
            ? "border-b border-border-subtle bg-bg-primary/80 backdrop-blur-[20px]"
            : "bg-transparent"
        )}
      >
        <Container className="flex h-full items-center justify-between">
          {/* Wordmark */}
          <Link
            href="/"
            aria-label={`${SITE_NAME} — home`}
            className={cn(
              "relative text-heading-sm font-semibold tracking-tight",
              "text-text-primary",
              "hover:text-accent",
              "transition-colors duration-fast ease-standard",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-md"
            )}
          >
            {SITE_NAME}
            <span
              aria-hidden="true"
              className={cn(
                "absolute -bottom-1 left-0 h-[2px] w-0 bg-accent rounded-full",
                "transition-all duration-slow ease-out-expo",
                "group-hover:w-full"
              )}
            />
          </Link>

          {/* Desktop + Tablet nav */}
          <nav
            aria-label="Primary"
            className="hidden tablet:flex items-center gap-2"
          >
            <ul className="flex items-center gap-1" role="list">
              {NAV_ITEMS.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(item.href);

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "group relative flex items-center h-9 px-3.5 rounded-md",
                        "text-body-sm",
                        "transition-all duration-fast ease-standard",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
                        isActive
                          ? "text-accent font-medium"
                          : "text-text-secondary hover:text-text-primary"
                      )}
                    >
                      {item.label}
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute bottom-0 left-2 right-2 h-[2px] rounded-full bg-accent",
                          "transition-all duration-fast ease-standard",
                          isActive
                            ? "opacity-100 scale-x-100"
                            : "opacity-0 scale-x-0 group-hover:opacity-40 group-hover:scale-x-100"
                        )}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mx-2 h-5 w-px bg-border-subtle" aria-hidden="true" />
            <ThemeToggle className="ml-1" />
          </nav>

          {/* Mobile */}
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
                "flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-lg",
                "text-text-secondary",
                "hover:bg-bg-tertiary hover:text-text-primary",
                "transition-colors duration-fast ease-standard",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              )}
            >
              <span
                className={cn(
                  "block h-[1.5px] w-[20px] rounded-full bg-current",
                  !shouldReduce && "transition-transform duration-base ease-standard origin-center",
                  menuOpen && "translate-y-[6.5px] rotate-45"
                )}
              />
              <span
                className={cn(
                  "block h-[1.5px] w-[20px] rounded-full bg-current",
                  !shouldReduce && "transition-opacity duration-fast ease-standard",
                  menuOpen && "opacity-0"
                )}
              />
              <span
                className={cn(
                  "block h-[1.5px] w-[20px] rounded-full bg-current",
                  !shouldReduce && "transition-transform duration-base ease-standard origin-center",
                  menuOpen && "-translate-y-[6.5px] -rotate-45"
                )}
              />
            </button>
          </div>
        </Container>
      </header>

      <MobileNavOverlay
        isOpen={menuOpen}
        onClose={closeMenu}
        triggerRef={hamburgerRef}
      />

      <div className="h-16 desktop:h-[72px]" aria-hidden="true" />
    </>
  );
}
