import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Skyddar /admin med Supabase Auth (Next 16 "proxy"-konvention, tidigare middleware).
 * Oinloggade skickas till /admin/login, redan inloggade som besöker login skickas
 * vidare till dashboarden.
 */
export async function proxy(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  const isLogin = pathname.startsWith("/admin/login");

  if (!isLogin && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = `?next=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(url);
  }

  if (isLogin && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  // Kör endast på admin-rutter. Resten av sajten (och /api) påverkas inte.
  matcher: ["/admin/:path*"],
};
