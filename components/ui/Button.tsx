import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Button
 *
 * The universal call-to-action component — Component Library C1.
 * Exactly two variants, never a third, per the PRD's explicit instruction
 * to limit button variants to two ("this is the one thing I most want
 * you to do" vs. "this is also available").
 *
 * Renders as a real <button> for in-page actions (onClick) or a real
 * <a> (via next/link, or a plain anchor for external/mailto links) for
 * navigational actions — never a styled <div>, per Component Library
 * C1's accessibility requirement.
 *
 * Spec values (Component Library C1, Visual Design Spec 1.8):
 * - Height: 48px desktop, 44px mobile
 * - Radius: 10px (rounded-card token)
 * - Padding: space-3 vertical (12px) / space-5 horizontal (24px)
 * - Primary: bg-accent fill, near-black label text
 * - Secondary: transparent fill, 1px border-default, text-primary label
 * - Hover: background shift + 1px upward translateY, motion-fast (150ms)
 *   — never a scale transform (reads "bouncy," not "precise")
 * - Active/pressed: translateY returns to 0 (visual "press down")
 * - Focus: visible 2px accent outline, 2px offset (focus-ring utility)
 * - Disabled: native `disabled` attribute, greyed fill, cursor-not-allowed
 *
 * One documented exception (Component Library C1): on mobile, the Hero's
 * secondary CTA loses its button chrome and renders as a plain text link
 * instead. That's handled by the Hero component choosing not to render
 * <Button variant="secondary"> on mobile at all — not by a prop on this
 * component. This component always renders full button chrome; it has
 * no "looks like a link" mode, by design, so that exception can't
 * accidentally spread to other secondary buttons across the site.
 */

type ButtonVariant = "primary" | "secondary";

interface ButtonBaseProps {
  variant?: ButtonVariant;
  children: React.ReactNode;
  className?: string;
  /** Renders a leading icon (e.g. an arrow) before the label. */
  icon?: React.ReactNode;
}

interface ButtonAsButton extends ButtonBaseProps {
  href?: never;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  external?: never;
  /** For a disabled button whose reason isn't obvious from its label
   *  alone (e.g. "Download PDF" when no PDF exists yet) — points to an
   *  element id with the explanatory text, per WCAG's recommendation to
   *  associate disabled-state context with the control itself rather
   *  than leaving it to visually-adjacent text alone. */
  "aria-describedby"?: string;
}

interface ButtonAsLink extends ButtonBaseProps {
  href: string;
  /** Set for external links — adds target="_blank" + rel safety attrs. */
  external?: boolean;
  disabled?: never;
  onClick?: never;
  type?: never;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

/** True discriminant check — `href` is `never` on the button variant and
 *  a real `string` on the link variant, so this narrows cleanly. */
function isLinkProps(props: ButtonProps): props is ButtonAsLink {
  return typeof props.href === "string";
}

const baseClasses = cn(
  "inline-flex items-center justify-center gap-2",
  "h-11 desktop:h-12", // 44px mobile, 48px desktop
  "rounded-card px-space-5",
  "text-body-md font-medium",
  "transition-[background-color,border-color,transform] duration-fast ease-standard",
  "focus-visible:outline-none focus-visible:focus-ring",
  "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
);

const variantClasses: Record<ButtonVariant, string> = {
  primary: cn(
    "bg-accent text-bg-primary",
    "hover:bg-accent-dim hover:-translate-y-px",
    "active:translate-y-0"
  ),
  secondary: cn(
    "bg-transparent text-text-primary border border-border-default",
    "hover:bg-bg-tertiary hover:-translate-y-px",
    "active:translate-y-0"
  ),
};

export function Button(props: ButtonProps) {
  const { variant = "primary", children, className, icon } = props;
  const classes = cn(baseClasses, variantClasses[variant], className);

  if (isLinkProps(props)) {
    const { href, external } = props;
    return (
      <Link
        href={href}
        className={classes}
        {...(external
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {icon}
        {children}
      </Link>
    );
  }

  // Button variant — in-page action. TypeScript has now narrowed `props`
  // to ButtonAsButton via the isLinkProps() guard above returning false.
  const { onClick, type = "button", disabled, "aria-describedby": describedBy } = props;
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-describedby={describedBy}
      className={classes}
    >
      {icon}
      {children}
    </button>
  );
}
