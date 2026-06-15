import Link from "next/link";
import type { Metadata } from "next";
import { getAdminUser } from "@/lib/api";
import SignOutButton from "./SignOutButton";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin – Offerter",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getAdminUser();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {user && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-card border border-border bg-surface px-4 py-3">
          <Link href="/admin" className="font-bold text-brand-deep">
            Admin · Offerter
          </Link>
          <div className="flex items-center gap-4 text-sm text-muted">
            <span className="hidden sm:inline">{user.email}</span>
            <SignOutButton />
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
