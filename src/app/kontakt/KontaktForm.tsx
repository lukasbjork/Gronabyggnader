"use client";

import { useState } from "react";
import {
  Field,
  TextInput,
  TextArea,
  SelectInput,
  Checkbox,
  primaryButtonClass,
} from "@/components/form/Fields";
import { PROPERTY_TYPES, SERVICE_TYPES } from "@/lib/validation";
import { QUOTE_RESPONSE_DAYS } from "@/lib/constants";

export default function KontaktForm() {
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const data = new FormData(e.currentTarget);
    if (data.get("company")) {
      setDone(true);
      return;
    }
    if (!consent) {
      setError("Du måste godkänna integritetspolicyn för att skicka.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/quote-requests/", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          source: "kontakt",
          customerName: data.get("namn"),
          email: data.get("epost"),
          phone: data.get("telefon"),
          propertyType: data.get("fastighetstyp"),
          serviceType: data.get("serviceType"),
          message: data.get("meddelande"),
          consent,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Något gick fel. Försök igen.");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Något gick fel. Försök igen.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-card border border-border bg-surface p-8 shadow-sm">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-xl">
          ✓
        </div>
        <h3 className="text-xl font-bold text-brand-deep">Tack för din förfrågan!</h3>
        <p className="mt-2 text-muted">
          Vi har tagit emot dina uppgifter och återkommer inom {QUOTE_RESPONSE_DAYS} arbetsdagar. Du
          får en bekräftelse via e-post.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <Field htmlFor="namn" label="Namn" required>
        <TextInput id="namn" name="namn" required autoComplete="name" />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field htmlFor="epost" label="E-post" required>
          <TextInput id="epost" name="epost" type="email" required autoComplete="email" />
        </Field>
        <Field htmlFor="telefon" label="Telefon" required>
          <TextInput id="telefon" name="telefon" type="tel" required autoComplete="tel" />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field htmlFor="fastighetstyp" label="Fastighetstyp">
          <SelectInput id="fastighetstyp" name="fastighetstyp" defaultValue="">
            <option value="">Välj …</option>
            {PROPERTY_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </SelectInput>
        </Field>
        <Field htmlFor="serviceType" label="Typ av arbete">
          <SelectInput id="serviceType" name="serviceType" defaultValue="">
            <option value="">Välj …</option>
            {SERVICE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </SelectInput>
        </Field>
      </div>

      <Field htmlFor="meddelande" label="Berätta om ditt projekt" required>
        <TextArea
          id="meddelande"
          name="meddelande"
          rows={5}
          required
          placeholder="T.ex. höga uppvärmningskostnader, drag från fönster, gammal panna eller en fasad som behöver ses över."
        />
      </Field>

      <Checkbox id="consent" name="consent" checked={consent} onChange={(e) => setConsent(e.target.checked)}>
        Jag godkänner att Gröna Byggnader behandlar mina uppgifter enligt{" "}
        <a className="font-medium text-brand-2 underline underline-offset-2" href="/integritetspolicy/">
          integritetspolicyn
        </a>
        .
      </Checkbox>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">
          {error}
        </p>
      )}

      <button type="submit" className={primaryButtonClass} disabled={submitting}>
        {submitting ? "Skickar…" : "Skicka förfrågan"}
      </button>
    </form>
  );
}
