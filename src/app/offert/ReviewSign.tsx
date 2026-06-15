"use client";

import { useEffect, useRef, useState } from "react";
import SignaturePad from "signature_pad";
import { Field, TextInput, Checkbox, primaryButtonClass } from "@/components/form/Fields";
import { formatKr } from "@/lib/quote-config";

export type ReviewSignProps = {
  quoteId: string;
  token: string;
  customerName: string;
  email: string;
  pdfUrl: string;
  validUntil: string | null;
  totals: {
    laborCost: number;
    materialCost: number;
    vatAmount: number;
    totalInclVat: number;
    rotDeduction: number;
    totalToPay: number;
  };
};

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div
      className={`flex items-center justify-between py-1.5 ${
        strong ? "border-t border-brand pt-2 text-lg font-bold text-brand" : "text-sm"
      }`}
    >
      <span className={strong ? "text-brand-deep" : "text-muted"}>{label}</span>
      <span className={strong ? "" : "text-foreground"}>{value}</span>
    </div>
  );
}

export default function ReviewSign(props: ReviewSignProps) {
  const { totals } = props;
  const [showSign, setShowSign] = useState(false);
  const [signerName, setSignerName] = useState(props.customerName);
  const [signerEmail, setSignerEmail] = useState(props.email);
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const padRef = useRef<SignaturePad | null>(null);

  useEffect(() => {
    if (!showSign || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas.getContext("2d")?.scale(ratio, ratio);
    const pad = new SignaturePad(canvas, { penColor: "#102a1e", backgroundColor: "rgba(255,255,255,0)" });
    padRef.current = pad;
    return () => pad.off();
  }, [showSign]);

  async function handleSign(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!consent) {
      setError("Du måste godkänna avtalsvillkoren för att signera.");
      return;
    }
    if (signerName.trim().length < 2) {
      setError("Ange ditt namn.");
      return;
    }
    const signatureImage =
      padRef.current && !padRef.current.isEmpty()
        ? padRef.current.toDataURL("image/png")
        : undefined;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/quotes/${props.quoteId}/sign/`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          token: props.token,
          signerName,
          signerEmail,
          consent,
          signatureImage,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Kunde inte signera. Försök igen.");
      setSignedUrl(json.signedPdfUrl ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kunde inte signera. Försök igen.");
    } finally {
      setSubmitting(false);
    }
  }

  if (signedUrl !== null) {
    return (
      <div className="mx-auto max-w-2xl rounded-card border border-border bg-surface p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft text-2xl">
          ✓
        </div>
        <h2 className="text-2xl font-bold text-brand-deep">Tack, avtalet är signerat!</h2>
        <p className="mt-3 text-muted">
          Vi kontaktar dig för att boka in arbetet. En kopia av det signerade avtalet har skickats
          till din e-post.
        </p>
        {signedUrl && (
          <a
            href={signedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-block font-medium text-brand-2 underline underline-offset-2 hover:text-brand-deep"
          >
            Ladda ner signerat avtal (PDF)
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1.4fr_1fr]">
      {/* Inbäddad offert-PDF */}
      <div>
        <h2 className="text-xl font-bold text-brand-deep">Din offert</h2>
        <p className="mt-1 text-sm text-muted">
          Granska hela offerten nedan.{" "}
          <a
            href={props.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-brand-2 underline underline-offset-2"
          >
            Öppna i ny flik
          </a>
        </p>
        <iframe
          src={props.pdfUrl}
          title="Offert (PDF)"
          className="mt-3 h-[60vh] w-full rounded-card border border-border bg-white"
        />
      </div>

      {/* Prisuppställning + signering */}
      <div>
        <div className="rounded-card border border-border bg-surface p-5 shadow-sm">
          <h3 className="text-lg font-bold text-brand-deep">Prisuppställning</h3>
          <div className="mt-3">
            <Row label="Arbetskostnad (exkl. moms)" value={formatKr(totals.laborCost)} />
            <Row label="Materialkostnad (exkl. moms)" value={formatKr(totals.materialCost)} />
            <Row label="Moms 25 %" value={formatKr(totals.vatAmount)} />
            <Row label="Summa inkl. moms" value={formatKr(totals.totalInclVat)} />
            <Row label="ROT-avdrag" value={`−${formatKr(totals.rotDeduction)}`} />
            <Row label="Att betala" value={formatKr(totals.totalToPay)} strong />
          </div>
          {props.validUntil && (
            <p className="mt-3 text-xs text-muted">
              Giltig t.o.m. {new Date(props.validUntil).toLocaleDateString("sv-SE")}
            </p>
          )}
        </div>

        {!showSign ? (
          <button
            type="button"
            onClick={() => setShowSign(true)}
            className={`${primaryButtonClass} mt-5 w-full`}
          >
            Godkänn och signera
          </button>
        ) : (
          <form onSubmit={handleSign} className="mt-5 space-y-4 rounded-card border border-border bg-surface p-5 shadow-sm">
            <h3 className="text-lg font-bold text-brand-deep">Signera avtalet</h3>
            <Field htmlFor="signerName" label="Namn" required>
              <TextInput
                id="signerName"
                value={signerName}
                onChange={(e) => setSignerName(e.target.value)}
                required
              />
            </Field>
            <Field htmlFor="signerEmail" label="E-post" required>
              <TextInput
                id="signerEmail"
                type="email"
                value={signerEmail}
                onChange={(e) => setSignerEmail(e.target.value)}
                required
              />
            </Field>

            <div>
              <span className="block font-medium text-brand-deep">Signatur (valfritt)</span>
              <p className="mt-1 text-sm text-muted">Rita din signatur med mus eller finger.</p>
              <canvas
                ref={canvasRef}
                className="mt-2 h-36 w-full rounded-lg border border-border bg-white"
              />
              <button
                type="button"
                onClick={() => padRef.current?.clear()}
                className="mt-1 text-sm font-medium text-brand-2 underline underline-offset-2"
              >
                Rensa signatur
              </button>
            </div>

            <Checkbox id="signConsent" checked={consent} onChange={(e) => setConsent(e.target.checked)}>
              Jag har läst och godkänner offertens innehåll och avtalsvillkoren, och signerar
              avtalet elektroniskt.
            </Checkbox>

            {error && (
              <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">
                {error}
              </p>
            )}

            <button type="submit" className={`${primaryButtonClass} w-full`} disabled={submitting}>
              {submitting ? "Signerar…" : "Signera avtalet"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
