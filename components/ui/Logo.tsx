"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { SITE_NAME } from "@/lib/constants";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
  className?: string;
  href?: string;
}

const SIZE_CONFIGS = {
  sm: { iconSize: 22, textSize: "text-body-sm", gap: "gap-2" },
  md: { iconSize: 28, textSize: "text-heading-xs desktop:text-heading-sm", gap: "gap-2.5" },
  lg: { iconSize: 38, textSize: "text-heading-sm desktop:text-heading-md", gap: "gap-3" },
};

export function LogoIcon({
  size = 28,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0 text-accent transition-transform duration-300 group-hover:scale-105", className)}
      role="img"
      aria-label="Venugopalam Chukka Monogram Logo"
    >
      {/* Outer C Arc */}
      <path
        d="M 27 8 A 14.5 14.5 0 1 0 27 32"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        fill="none"
      />
      {/* Receded Tilted Orbit Ring */}
      <ellipse
        cx="20"
        cy="20"
        rx="14.5"
        ry="6"
        transform="rotate(-22 20 20)"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
        opacity="0.45"
      />
      {/* Sharp V Chevron */}
      <path
        d="M 14 15 L 21 28 L 28 15"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Focal Nucleus Core */}
      <circle cx="21" cy="20" r="2.2" fill="currentColor" />
    </svg>
  );
}

export function Logo({
  size = "md",
  showWordmark = true,
  className,
  href = "/",
}: LogoProps) {
  const config = SIZE_CONFIGS[size];

  const content = (
    <div className={cn("group flex items-center", config.gap, className)}>
      <LogoIcon size={config.iconSize} />
      {showWordmark && (
        <span
          className={cn(
            "font-semibold tracking-tight text-text-primary",
            "transition-colors duration-fast ease-standard",
            "group-hover:text-accent font-display",
            config.textSize
          )}
        >
          {SITE_NAME}
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        aria-label={`${SITE_NAME} — Home`}
        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-lg"
      >
        {content}
      </Link>
    );
  }

  return content;
}
