import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "./supabase/server";

/** Kort hjälpare för JSON-svar med statuskod. */
export function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

/** Returnerar inloggad admin-användare (Supabase Auth) eller null. */
export async function getAdminUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
