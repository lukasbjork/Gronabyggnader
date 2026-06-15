import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { STATUS_LABELS } from "@/lib/constants";
import StatusBadge from "@/components/StatusBadge";
import { inputClass } from "@/components/form/Fields";
import type { QuoteRequest } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminListPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; source?: string }>;
}) {
  const { q, status, source } = await searchParams;

  let query = supabaseAdmin()
    .from("quote_requests")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);
  if (status) query = query.eq("status", status);
  if (source) query = query.eq("source", source);

  const { data } = await query;
  let rows = (data ?? []) as QuoteRequest[];
  if (q) {
    const term = q.toLowerCase();
    rows = rows.filter((r) =>
      [r.customer_name, r.email, r.property_address, r.service_type].some((v) =>
        v?.toLowerCase().includes(term),
      ),
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-deep">Offertförfrågningar</h1>

      <form method="GET" className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto_auto_auto]">
        <input
          name="q"
          defaultValue={q ?? ""}
          placeholder="Sök namn, e-post, adress…"
          className={inputClass}
        />
        <select name="status" defaultValue={status ?? ""} className={inputClass}>
          <option value="">Alla statusar</option>
          {Object.entries(STATUS_LABELS).map(([k, label]) => (
            <option key={k} value={k}>
              {label}
            </option>
          ))}
        </select>
        <select name="source" defaultValue={source ?? ""} className={inputClass}>
          <option value="">Alla källor</option>
          <option value="offert">Offert</option>
          <option value="kontakt">Kontakt</option>
        </select>
        <button
          type="submit"
          className="rounded-lg bg-brand px-5 py-3 font-semibold text-white hover:bg-brand-deep"
        >
          Filtrera
        </button>
      </form>

      <div className="mt-6 overflow-x-auto rounded-card border border-border">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-brand-soft text-left text-brand-deep">
              <th className="px-4 py-3 font-semibold">Datum</th>
              <th className="px-4 py-3 font-semibold">Kund</th>
              <th className="px-4 py-3 font-semibold">Typ av arbete</th>
              <th className="px-4 py-3 font-semibold">Källa</th>
              <th className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted">
                  Inga förfrågningar matchar.
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-border hover:bg-brand-soft/40">
                <td className="px-4 py-3 text-muted">
                  {new Date(r.created_at).toLocaleDateString("sv-SE")}
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/${r.id}`} className="font-medium text-brand-2 hover:underline">
                    {r.customer_name}
                  </Link>
                  <div className="text-xs text-muted">{r.email}</div>
                </td>
                <td className="px-4 py-3 text-foreground">{r.service_type ?? "—"}</td>
                <td className="px-4 py-3 capitalize text-muted">{r.source}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={r.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
