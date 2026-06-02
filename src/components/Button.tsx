import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "accent" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-semibold transition-colors focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2";

const variants: Record<Variant, string> = {
  // Primär: mörkgrön med vit text (hög kontrast, WCAG AA).
  primary: "bg-brand text-white hover:bg-brand-deep focus-visible:outline-brand-deep",
  // Sekundär: ljus grön yta med mörk text.
  secondary:
    "bg-brand-soft text-brand-deep hover:bg-white border border-border focus-visible:outline-brand-2",
  // Accent: frisk grön bakgrund med mörk text (accentfärgen som yta, ej text).
  accent:
    "bg-accent text-brand-deep hover:bg-accent-light focus-visible:outline-brand-deep",
  // Ghost: textlänk med understrykning.
  ghost:
    "bg-transparent text-brand-2 underline underline-offset-4 hover:text-brand-deep px-2 py-1",
};

type ButtonProps = {
  /** Renderas som <Link> om href anges, annars som <button>. */
  href?: string;
  variant?: Variant;
  className?: string;
  children: ReactNode;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  /** Sätt till true för externa länkar (öppnar i ny flik på ett säkert sätt). */
  external?: boolean;
  "aria-label"?: string;
};

/** Återanvändbar knapp/länk med konsekvent stil. */
export default function Button({
  href,
  variant = "primary",
  className = "",
  children,
  type = "button",
  onClick,
  external = false,
  ...aria
}: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${className}`.trim();

  if (href) {
    if (external) {
      return (
        <a href={href} className={classes} target="_blank" rel="noopener noreferrer" {...aria}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} onClick={onClick} {...aria}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick} {...aria}>
      {children}
    </button>
  );
}
