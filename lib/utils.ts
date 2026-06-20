import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";

/**
 * Merges Tailwind class names safely — clsx handles conditional
 * classes, twMerge resolves conflicting utilities (e.g. two different
 * padding classes) by keeping only the last one, rather than letting
 * both apply and silently fighting in the cascade.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats an ISO date string ("2026-06-14") into the compact display
 * format used by Learning Entry and Status Footer ("Jun 14") — per
 * Component Library B6/D4, the underlying <time dateTime="..."> should
 * always carry the raw ISO string; this helper is only for the visible
 * label.
 */
export function formatCompactDate(isoDate: string): string {
  return format(parseISO(isoDate), "MMM d");
}

/** Full format ("June 14, 2026") for contexts needing more precision,
 * e.g. the Resume page's "Last updated" stamp. */
export function formatFullDate(isoDate: string): string {
  return format(parseISO(isoDate), "MMMM d, yyyy");
}
