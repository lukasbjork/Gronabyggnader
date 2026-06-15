"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { inputClass, primaryButtonClass } from "@/components/form/Fields";
import { calculateTotals, formatKr, type LineItem, type LineItemKind } from "@/lib/quote-config";

type EItem = { description: string; quantity: string; unitPrice: string; kind: LineItemKind };

type Props = {
  quoteRequestId: string;
  requestStatus: string;
  existingQuoteId: string | null;
  hasPdf: boolean;
  initialItems: LineItem[];
  initialRotPersons: number;
  initialValidUntil: string;
  initialTerms: string;
};

export default function QuoteForm(props: Props) {
  const router = useRouter();
  const [items, setItems] = useState<EItem[]>(
    props.initialItems.map((i) => ({
      description: i.description,
      quantity: String(i.quantity),
      unitPrice: String(i.unitPrice),
      kind: i.kind,
    })),
  );
  const [rotPersons, setRotPersons] = useState(props.initialRotPersons);
  const [validUntil, setValidUntil] = useState(props.initialValidUntil);
  const [terms, setTerms] = useState(props.initialTerms);
  const [quoteId, setQuoteId] = useState<string | null>(props.existingQuoteId);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [signUrl, setSignUrl] = useState<string | null>(null);

  const lineItems: LineItem[] = useMemo(
    () =>
      items.map((i) => ({
        description: i.description,
        quantity: Number(i.quantity) || 0,
        unitPrice: Number(i.unitPrice) || 0,
        kind: i.kind,
      })),
    [items],
  );
  const totals = useMemo(() => calculateTotals(lineItems, rotPersons), [lineItems, rotPersons]);

  function updateRow(idx: number, patch: Partial<EItem>) {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  }
  function addRow() {
    setItems((prev) => [...prev, { description: "", quantity: "1", unitPrice: "0", kind: "arbete" }]);
  }
  function removeRow(idx: number) {
    setItems((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev));
  }

  async function save() {
    setError(null);
    setInfo(null);
    const valid = lineItems.filter((i) => i.description.trim() && i.quantity > 0);
    if (valid.length === 0) {
      setError("Lägg till minst en rad med beskrivning och antal > 0.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/quotes/", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          quoteRequestId: props.quoteRequestId,
          lineItems: valid,
          rotPersons,
          validUntil: validUntil || undefined,
          termsText: terms,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Kunde inte spara offerten.");
      setQuoteId(json.quoteId);
      setPreviewUrl(json.previewUrl ?? null);
      setInfo("Offerten är sparad. Granska PDF:en nedan och skicka den sedan till kunden.");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Kunde inte spara offerten.");
    } finally {
      setSaving(false);
    }
  }

  async function send() {
    if (!quoteId) return;
    setError(null);
    setInfo(null);
    setSending(true);
    try {
      const res = await fetch(`/api/quotes/${quoteId}/send/`, { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Kunde inte skicka offerten.");
      setSignUrl(json.signUrl ?? null);
      setInfo(
        json.emailSkipped
          ? "Offerten är markerad som skickad. OBS: e-post hoppades över (RESEND_API_KEY saknas). Använd länken nedan för att testa signeringen."
          : "Offerten är skickad till kunden med en signeringslänk.",
      );
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Kunde inte skicka offerten.");
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="rounded-card border border-border bg-surface p-5">
      <h2 className="text-lg font-bold text-brand-deep">Skapa offert</h2>

      <div className="mt-4 space-y-2">
        {items.map((it, idx) => (
          <div key={idx} className="grid grid-cols-12 gap-2">
            <input
              className={`${inputClass} col-span-12 sm:col-span-5`}
              placeholder="Beskrivning"
              value={it.description}
              onChange={(e) => updateRow(idx, { description: e.target.value })}
            />
            <select
              className={`${inputClass} col-span-4 sm:col-span-2`}
              value={it.kind}
              onChange={(e) => updateRow(idx, { kind: e.target.value as LineItemKind })}
            >
              <option value="arbete">Arbete</option>
              <option value="material">Material</option>
            </select>
            <input
              className={`${inputClass} col-span-3 sm:col-span-2`}
              type="number"
              min="0"
              step="any"
              placeholder="Antal"
              value={it.quantity}
              onChange={(e) => updateRow(idx, { quantity: e.target.value })}
            />
            <input
              className={`${inputClass} col-span-3 sm:col-span-2`}
              type="number"
              min="0"
              step="any"
              placeholder="Á-pris"
              value={it.unitPrice}
              onChange={(e) => updateRow(idx, { unitPrice: e.target.value })}
            />
            <button
              type="button"
              onClick={() => removeRow(idx)}
              aria-label="Ta bort rad"
              className="col-span-2 rounded-lg border border-border text-muted hover:bg-brand-soft sm:col-span-1"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addRow}
        className="mt-2 text-sm font-medium text-brand-2 underline underline-offset-2"
      >
        + Lägg till rad
      </button>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="font-medium text-brand-deep">Antal personer (ROT)</span>
          <input
            className={inputClass}
            type="number"
            min="1"
            max="10"
            value={rotPersons}
            onChange={(e) => setRotPersons(Math.max(1, Number(e.target.value) || 1))}
          />
        </label>
        <label className="block">
          <span className="font-medium text-brand-deep">Giltig t.o.m.</span>
          <input
            className={inputClass}
            type="date"
            value={validUntil}
            onChange={(e) => setValidUntil(e.target.value)}
          />
        </label>
      </div>

      <label className="mt-4 block">
        <span className="font-medium text-brand-deep">Avtalsvillkor</span>
        <textarea
          className={inputClass}
          rows={6}
          value={terms}
          onChange={(e) => setTerms(e.target.value)}
        />
      </label>

      {/* Live-summering */}
      <div className="mt-5 rounded-lg bg-brand-soft p-4 text-sm">
        <Row label="Arbetskostnad (exkl. moms)" value={formatKr(totals.laborCost)} />
        <Row label="Materialkostnad (exkl. moms)" value={formatKr(totals.materialCost)} />
        <Row label="Moms 25 %" value={formatKr(totals.vatAmount)} />
        <Row label="Summa inkl. moms" value={formatKr(totals.totalInclVat)} />
        <Row label={`ROT-avdrag (${totals.rotPersons} pers)`} value={`−${formatKr(totals.rotDeduction)}`} />
        <div className="mt-1 flex justify-between border-t border-brand pt-2 text-base font-bold text-brand">
          <span>Att betala</span>
          <span>{formatKr(totals.totalToPay)}</span>
        </div>
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">
          {error}
        </p>
      )}
      {info && (
        <p className="mt-4 rounded-lg bg-brand-soft px-4 py-3 text-sm text-brand-deep">{info}</p>
      )}

      <div className="mt-5 flex flex-wrap gap-3">
        <button type="button" onClick={save} className={primaryButtonClass} disabled={saving}>
          {saving ? "Sparar…" : "Spara & förhandsgranska"}
        </button>
        <button
          type="button"
          onClick={send}
          disabled={!quoteId || sending}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-brand bg-white px-6 py-3 text-base font-semibold text-brand transition-colors hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-50"
        >
          {sending ? "Skickar…" : "Skicka offert till kund"}
        </button>
      </div>

      {signUrl && (
        <p className="mt-4 break-all text-sm text-muted">
          Signeringslänk (för test):{" "}
          <a href={signUrl} className="font-medium text-brand-2 underline underline-offset-2">
            {signUrl}
          </a>
        </p>
      )}

      {previewUrl && (
        <div className="mt-5">
          <h3 className="font-semibold text-brand-deep">Förhandsgranskning</h3>
          <iframe
            src={previewUrl}
            title="Förhandsvisning av offert"
            className="mt-2 h-[60vh] w-full rounded-card border border-border bg-white"
          />
        </div>
      )}
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-0.5">
      <span className="text-muted">{label}</span>
      <span className="text-foreground">{value}</span>
    </div>
  );
}
