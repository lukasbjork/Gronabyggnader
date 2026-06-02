"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";

/**
 * Diskret cookie-/integritetsnotis. Sajten sätter inga spårningscookies som
 * standard – notisen informerar och länkar till integritetspolicyn. Valet
 * sparas i localStorage så att den inte visas igen.
 *
 * Implementerad med useSyncExternalStore (synkar mot localStorage utan att
 * sätta state i en effekt). Lägger ni till analytics (t.ex. GA4) bör detta
 * utökas till ett riktigt samtyckesval innan spårning laddas.
 */
const STORAGE_KEY = "gb-cookie-notis";
const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) callback();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", onStorage);
  };
}

// true = notisen är avfärdad (eller kan inte/ska inte visas).
function getSnapshot(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return true;
  }
}

// På servern: behandla som avfärdad så att inget renderas i SSR-HTML:en.
function getServerSnapshot(): boolean {
  return true;
}

function dismiss() {
  try {
    localStorage.setItem(STORAGE_KEY, "1");
  } catch {
    /* localStorage kan vara blockerat – ignorera */
  }
  listeners.forEach((l) => l());
}

export default function CookieBanner() {
  const dismissed = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (dismissed) return null;

  return (
    <div
      role="dialog"
      aria-label="Information om cookies"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-3xl rounded-card border border-border bg-surface p-4 shadow-lg sm:inset-x-6 sm:p-5"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          Vi värnar om din integritet. Sajten använder endast nödvändiga
          funktioner och inga spårningscookies som standard. Läs mer i vår{" "}
          <Link href="/integritetspolicy/" className="font-medium text-brand-2 underline underline-offset-2">
            integritetspolicy
          </Link>
          .
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-deep focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand-deep"
        >
          Jag förstår
        </button>
      </div>
    </div>
  );
}
