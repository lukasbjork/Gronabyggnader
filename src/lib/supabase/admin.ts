import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  Supabase service-role-klient (kringgår RLS)
 * ─────────────────────────────────────────────────────────────────────────────
 *  FÅR ENDAST importeras i serverkod (Route Handlers, Server Components,
 *  middleware). Importeras den i en klientkomponent läcker service_role-nyckeln.
 *  Runtime-guarden nedan kastar fel om koden av misstag körs i webbläsaren.
 * ─────────────────────────────────────────────────────────────────────────────
 */

let cached: SupabaseClient | null = null;

export function supabaseAdmin(): SupabaseClient {
  if (typeof window !== "undefined") {
    throw new Error("supabaseAdmin() får aldrig anropas i webbläsaren.");
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "Saknar NEXT_PUBLIC_SUPABASE_URL eller SUPABASE_SERVICE_ROLE_KEY i miljön.",
    );
  }
  if (!cached) {
    cached = createClient(url, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return cached;
}
