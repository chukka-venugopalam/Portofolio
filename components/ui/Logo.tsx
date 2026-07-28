"use client";

import { useId } from "react";
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
  sm: { iconSize: 24, textSize: "text-body-sm", gap: "gap-2" },
  md: { iconSize: 32, textSize: "text-heading-xs desktop:text-heading-sm", gap: "gap-2.5" },
  lg: { iconSize: 42, textSize: "text-heading-sm desktop:text-heading-md", gap: "gap-3" },
};

export function LogoIcon({
  size = 32,
  className,
}: {
  size?: number;
  className?: string;
}) {
  const id = useId();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0 transition-transform duration-300 group-hover:scale-105", className)}
      role="img"
      aria-label="Quantum Orbit Core Logo"
    >
      <defs>
        {/* Primary gradient: Teal -> Cyan -> Indigo */}
        <linearGradient id={`logo-grad1-${id}`} x1="4" y1="4" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#14b8a6" />
          <stop offset="50%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>

        {/* Secondary gradient: Violet -> Coral */}
        <linearGradient id={`logo-grad2-${id}`} x1="40" y1="4" x2="4" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="60%" stopColor="#f43f5e" />
          <stop offset="100%" stopColor="#f5a623" />
        </linearGradient>

        {/* Core Glow Filter */}
        <filter id={`logo-glow-${id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer ambient glow ring */}
      <circle
        cx="22"
        cy="22"
        r="19"
        stroke={`url(#logo-grad1-${id})`}
        strokeWidth="1"
        strokeDasharray="4 3"
        opacity="0.25"
        className="animate-[spin_20s_linear_infinite]"
      />

      {/* Orbit Loop 1 — Stylized "C" curve */}
      <path
        d="M 22 7 C 32 7, 37 14, 37 22 C 37 30, 28 37, 18 35 C 10 33, 7 25, 11 17 C 14 11, 20 7, 22 7 Z"
        stroke={`url(#logo-grad1-${id})`}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        filter={`url(#logo-glow-${id})`}
        className="transition-all duration-300 group-hover:opacity-100 opacity-90"
      />

      {/* Orbit Loop 2 — Stylized "V" loop */}
      <path
        d="M 12 12 L 22 35 L 32 12"
        stroke={`url(#logo-grad2-${id})`}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.85"
      />

      {/* Core Nucleus ("Self") Node */}
      <circle
        cx="22"
        cy="22"
        r="3.5"
        fill="#ffffff"
        className="transition-all duration-300 group-hover:r-4"
      />
      <circle
        cx="22"
        cy="22"
        r="7"
        fill="#14b8a6"
        opacity="0.35"
        filter={`url(#logo-glow-${id})`}
      />
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
