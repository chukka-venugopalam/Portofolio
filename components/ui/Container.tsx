import { cn } from "@/lib/utils";

/**
 * Container
 *
 * The single source of truth for the site's horizontal rhythm:
 * max-width 1200px centered, with responsive horizontal padding that
 * matches the Visual Design Spec's grid definition exactly —
 *   Desktop:  40px each side (1280px frame → 1200px content)
 *   Tablet:   32px each side
 *   Mobile:   20px each side
 *
 * Every page section that needs horizontal containment renders its
 * content inside this component rather than applying padding directly,
 * which is what keeps horizontal alignment consistent across all six
 * pages without per-page margin management.
 *
 * The `wide` prop extends the content area to full viewport width for
 * any future full-bleed section that still needs the consistent
 * horizontal padding without the 1200px cap (not used in V1, included
 * for forward-compatibility with V2's System Map).
 */

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  /** Removes the max-width cap for full-bleed sections. */
  wide?: boolean;
  as?: React.ElementType;
}

export function Container({
  children,
  className,
  wide = false,
  as: Tag = "div",
}: ContainerProps) {
  return (
    <Tag
      className={cn(
        // Horizontal padding — responsive per Visual Design Spec 0.4
        "px-5 tablet:px-8 desktop:px-10",
        // Max-width + centering — 1200px content column inside 1280px frame
        !wide && "mx-auto w-full max-w-[1200px]",
        className
      )}
    >
      {children}
    </Tag>
  );
}
