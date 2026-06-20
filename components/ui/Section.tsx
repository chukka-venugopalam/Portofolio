import { cn } from "@/lib/utils";

/**
 * Section
 *
 * Wraps each major content block with the correct vertical padding from
 * the Visual Design Spec's section-rhythm rules (Section 0.4 + 1.5):
 *
 *   "home"      — space-9 (128px) vertical padding, for homepage sections
 *   "secondary" — space-8 (96px), for secondary page sections
 *   "tight"     — space-7 (64px), for subsections (e.g. between a
 *                 page header and its first content block)
 *   "none"      — no padding, for sections that manage their own spacing
 *
 * Desktop values tighten ~40% on tablet and ~50% on mobile per the spec.
 * These reductions are baked into the responsive class variants below
 * rather than left to individual pages to manage.
 *
 * This component is a layout primitive only — it adds no visual chrome
 * (no background, no border) beyond vertical space. Visual differentiation
 * between sections is achieved by the section's content and background
 * color, not by this wrapper.
 */

type SectionSpacing = "home" | "secondary" | "tight" | "none";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  spacing?: SectionSpacing;
  as?: React.ElementType;
  id?: string;
}

const spacingClasses: Record<SectionSpacing, string> = {
  // space-9 (128px) desktop → space-7 (~76px) tablet → space-6 (~64px) mobile
  // Approximated with Tailwind's default scale where custom tokens don't divide evenly
  home: "py-space-9 tablet:py-20 mobile:py-16",

  // space-8 (96px) desktop → ~58px tablet → ~48px mobile
  secondary: "py-space-8 tablet:py-16 mobile:py-12",

  // space-7 (64px) desktop → ~40px tablet → ~32px mobile
  tight: "py-space-7 tablet:py-10 mobile:py-8",

  none: "",
};

export function Section({
  children,
  className,
  spacing = "secondary",
  as: Tag = "section",
  id,
}: SectionProps) {
  return (
    <Tag
      id={id}
      className={cn(spacingClasses[spacing], className)}
    >
      {children}
    </Tag>
  );
}
