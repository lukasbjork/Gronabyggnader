"use client";
import { createBrowserClient } from "@supabase/ssr";

/** Supabase-klient för webbläsaren (anon-nyckel + RLS). Används för admin-login
 *  och för att ladda upp filer via signerade upload-URL:er. */
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
