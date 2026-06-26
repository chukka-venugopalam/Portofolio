"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { NAV_ITEMS, SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * MobileNavOverlay
 *
 * Full-height overlay panel that slides down from the nav bar when the
 * hamburger menu is tapped on mobile. Controlled by the Navbar via the
 * `isOpen` / `onClose` props.
 *
 * Design spec (Component Library A1, Visual Design Spec 1.7):
 * - Top-down overlay (not a sidebar) — anchored to the trigger icon's position
 * - Slides down + fades in over motion-base (250ms) on open
 * - Reverses on close
 * - Traps focus while open (keyboard: tab cycles within the overlay only)
 * - Returns focus to the hamburger button on close
 * - Closes on route change, Escape key, and overlay backdrop tap
 * - bg-bg-secondary background, full viewport height minus nav height (72px)
 *
 * Accessibility (Component Library A1):
 * - Panel role="dialog" with aria-modal="true" and aria-label
 * - Each nav link carries aria-current="page" on the active route
 * - Focus is trapped inside the open dialog
 */

interface MobileNavOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  /** Ref to the hamburger button — focus returns here on close */
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

export function MobileNavOverlay({
  isOpen,
  onClose,
  triggerRef,
}: MobileNavOverlayProps) {
  const pathname = usePathname();
  const shouldReduce = useReducedMotion();
  const overlayRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLAnchorElement>(null);

  // ── Close on route change ──
  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // ── Close on Escape ──
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // ── Focus management: trap focus + move focus in on open, return on close ──
  useEffect(() => {
    if (isOpen) {
      // Small delay so the animation starts before we pull focus in —
      // avoids a layout flash from focus moving before the panel is visible.
      const timer = setTimeout(() => {
        firstFocusableRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    } else {
      // Return focus to the hamburger button that opened the overlay.
      triggerRef.current?.focus();
    }
  }, [isOpen, triggerRef]);

  // ── Prevent body scroll while open ──
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // ── Tab trap ──
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab") return;
    const focusable = overlayRef.current?.querySelectorAll<HTMLElement>(
      "a[href], button, [tabindex]:not([tabindex='-1'])"
    );
    if (!focusable || focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    }
  };

  const motionVariants = {
    hidden: { opacity: 0, y: shouldReduce ? 0 : -8 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop — closes the overlay when tapped */}
          <motion.div
            key="mobile-backdrop"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduce ? 0 : 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 top-[72px] z-40 bg-bg-primary/60 backdrop-blur-sm desktop:hidden"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            key="mobile-panel"
            ref={overlayRef}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            onKeyDown={handleKeyDown}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={motionVariants}
            transition={{
              duration: shouldReduce ? 0 : 0.25,
              ease: [0.4, 0, 0.2, 1],
            }}
            className={cn(
              "fixed left-0 right-0 top-[72px] z-50",
              "bg-bg-secondary border-b border-border-subtle",
              "desktop:hidden",
              // Height: fills the screen below the nav
              "max-h-[calc(100dvh-72px)] overflow-y-auto"
            )}
          >
            <nav aria-label="Mobile navigation">
              <ul className="flex flex-col px-5 py-6 gap-1" role="list">
                {NAV_ITEMS.map((item, index) => {
                  const isActive = pathname === item.href ||
                    pathname.startsWith(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        ref={index === 0 ? firstFocusableRef : undefined}
                        aria-current={isActive ? "page" : undefined}
                        onClick={onClose}
                        className={cn(
                          "flex items-center h-12 px-4 rounded-card",
                          "text-heading-sm font-semibold",
                          "transition-colors duration-fast ease-standard",
                          "focus-visible:outline-none focus-visible:focus-ring",
                          isActive
                            ? "text-accent bg-accent/8"
                            : "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary"
                        )}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {/* Divider + site name — gives the overlay a closed, purposeful feel */}
              <div className="px-5 pb-8 pt-2 border-t border-border-subtle">
                <span className="text-mono-sm text-text-tertiary">
                  {SITE_NAME}
                </span>
              </div>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
