import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Button — Premium Redesign
 *
 * Two variants inspired by premium product landing pages:
 *
 * Primary: filled teal bg with subtle glow, dark text
 * Secondary: bordered with elegant hover transition
 */

type ButtonVariant = "primary" | "secondary";

interface ButtonBaseProps {
  variant?: ButtonVariant;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

interface ButtonAsButton extends ButtonBaseProps {
  href?: never;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  external?: never;
  "aria-describedby"?: string;
}

interface ButtonAsLink extends ButtonBaseProps {
  href: string;
  external?: boolean;
  disabled?: never;
  onClick?: never;
  type?: never;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

function isLinkProps(props: ButtonProps): props is ButtonAsLink {
  return typeof props.href === "string";
}

const baseClasses = cn(
  "inline-flex items-center justify-center gap-2",
  "h-10 desktop:h-11",
  "rounded-lg px-5",
  "text-body-sm font-medium",
  "transition-all duration-fast ease-standard",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary",
  "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:shadow-none"
);

const variantClasses: Record<ButtonVariant, string> = {
  primary: cn(
    "bg-accent text-white",
    "hover:bg-accent-dim hover:-translate-y-0.5",
    "shadow-[0_1px_2px_rgba(0,0,0,0.2)]",
    "hover:shadow-[0_4px_14px_rgba(20,184,166,0.25)]",
    "active:translate-y-0 active:shadow-[0_1px_2px_rgba(0,0,0,0.2)]",
    "font-medium"
  ),
  secondary: cn(
    "bg-transparent text-text-primary",
    "border border-border-default",
    "hover:bg-bg-tertiary hover:-translate-y-0.5",
    "hover:border-text-quaternary",
    "hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]",
    "active:translate-y-0",
    "font-normal"
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
