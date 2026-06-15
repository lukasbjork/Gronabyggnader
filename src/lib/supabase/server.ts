import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/**
 * Supabase-klient bunden till förfrågans cookies (för Supabase Auth-sessioner i
 * adminflödet). Använder anon-nyckeln + RLS. Skapa per request.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Anropas från en Server Component – kan ignoreras eftersom
            // middleware uppdaterar sessionscookies på varje request.
          }
        },
      },
    },
  );
}
