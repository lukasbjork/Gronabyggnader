"use client";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function SignOutButton() {
  const router = useRouter();
  async function signOut() {
    await createSupabaseBrowserClient().auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }
  return (
    <button
      onClick={signOut}
      className="font-medium text-brand-2 underline underline-offset-2 hover:text-brand-deep"
    >
      Logga ut
    </button>
  );
}
