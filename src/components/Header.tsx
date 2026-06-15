"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { nav, site } from "@/config/site";
import Button from "./Button";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-lg font-bold text-brand-deep"
          onClick={() => setOpen(false)}
        >
          <span
            aria-hidden="true"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white"
          >
            {/* Enkel "blad/byggnad"-logotyp – byt mot er riktiga logga i /public/images/. */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M3 21h18" strokeLinecap="round" />
              <path d="M6 21V9l6-5 6 5v12" strokeLinejoin="round" />
              <path d="M12 21c0-3 1.2-5 3.5-6" strokeLinecap="round" />
            </svg>
          </span>
          {site.name}
        </Link>

        {/* Desktop-navigation */}
        <nav aria-label="Huvudmeny" className="hidden xl:block">
          <ul className="flex items-center gap-0.5">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`rounded-full px-3 py-2 text-sm font-medium transition-colors hover:bg-brand-soft ${
                    isActive(item.href) ? "bg-brand-soft text-brand-deep" : "text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden xl:block">
          <Button href="/offert/">Få offert</Button>
        </div>

        {/* Mobil meny-knapp */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-brand-deep xl:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? "Stäng meny" : "Öppna meny"}</span>
          <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobil-navigation */}
      {open && (
        <nav
          id="mobile-menu"
          aria-label="Huvudmeny (mobil)"
          className="border-t border-border bg-surface xl:hidden"
        >
          <ul className="flex flex-col px-4 py-2 sm:px-6">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={`block rounded-md px-3 py-3 text-base font-medium ${
                    isActive(item.href) ? "bg-brand-soft text-brand-deep" : "text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="py-2">
              <Button href="/kontakt/" className="w-full" onClick={() => setOpen(false)}>
                Få offert
              </Button>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
