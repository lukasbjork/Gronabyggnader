"use client";

import { useRef, useState } from "react";
import {
  Field,
  TextInput,
  TextArea,
  SelectInput,
  Checkbox,
  primaryButtonClass,
} from "@/components/form/Fields";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import {
  ALLOWED_FILE_EXTENSIONS,
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE,
  MAX_FILES,
  QUOTE_RESPONSE_DAYS,
  STORAGE_BUCKET,
} from "@/lib/constants";
import { PROPERTY_TYPES, SERVICE_TYPES } from "@/lib/validation";

type Picked = { file: File; id: string };

const EXT_TO_TYPE: Record<string, string> = {
  pdf: "application/pdf",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
};

function guessType(file: File): string {
  if (file.type) return file.type;
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  return EXT_TO_TYPE[ext] ?? "";
}

function fileIsAllowed(file: File): boolean {
  const type = guessType(file);
  const ext = "." + (file.name.split(".").pop()?.toLowerCase() ?? "");
  return (
    (ALLOWED_FILE_TYPES as readonly string[]).includes(type) ||
    (ALLOWED_FILE_EXTENSIONS as readonly string[]).includes(ext)
  );
}

function prettySize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} kB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function Step1Form() {
  const [submissionId] = useState(() => crypto.randomUUID());
  const [files, setFiles] = useState<Picked[]>([]);
  const [consent, setConsent] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function addFiles(list: FileList | null) {
    if (!list) return;
    setFormError(null);
    const incoming = Array.from(list);
    const accepted: Picked[] = [];
    for (const file of incoming) {
      if (!fileIsAllowed(file)) {
        setFormError(`"${file.name}" har en otillåten filtyp. Tillåtet: PDF, JPG, PNG.`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        setFormError(`"${file.name}" är för stor (max ${prettySize(MAX_FILE_SIZE)}).`);
        continue;
      }
      accepted.push({ file, id: crypto.randomUUID() });
    }
    setFiles((prev) => {
      const merged = [...prev, ...accepted];
      if (merged.length > MAX_FILES) {
        setFormError(`Du kan ladda upp högst ${MAX_FILES} filer.`);
        return merged.slice(0, MAX_FILES);
      }
      return merged;
    });
  }

  function removeFile(id: string) {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    const form = e.currentTarget;
    const data = new FormData(form);

    if (data.get("company")) {
      // Honeypot ifyllt – låtsas att det gick bra utan att skicka.
      setDone(true);
      return;
    }
    if (!consent) {
      setFormError("Du måste godkänna integritetspolicyn för att skicka.");
      return;
    }

    setSubmitting(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const uploaded: {
        storagePath: string;
        filename: string;
        contentType?: string;
        sizeBytes?: number;
      }[] = [];

      for (let i = 0; i < files.length; i++) {
        const { file } = files[i];
        setProgress(`Laddar upp fil ${i + 1} av ${files.length}…`);
        const contentType = guessType(file) || "application/octet-stream";
        const signRes = await fetch("/api/uploads/sign/", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            submissionId,
            filename: file.name,
            contentType,
            sizeBytes: file.size,
          }),
        });
        const signJson = await signRes.json();
        if (!signRes.ok) throw new Error(signJson.error || "Kunde inte förbereda uppladdning.");

        const { error: upErr } = await supabase.storage
          .from(STORAGE_BUCKET)
          .uploadToSignedUrl(signJson.path, signJson.token, file, { contentType });
        if (upErr) throw new Error(`Kunde inte ladda upp "${file.name}".`);

        uploaded.push({
          storagePath: signJson.path,
          filename: file.name,
          contentType,
          sizeBytes: file.size,
        });
      }

      setProgress("Skickar din förfrågan…");
      const res = await fetch("/api/quote-requests/", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          source: "offert",
          customerName: data.get("customerName"),
          email: data.get("email"),
          phone: data.get("phone"),
          propertyAddress: data.get("propertyAddress"),
          propertyType: data.get("propertyType"),
          serviceType: data.get("serviceType"),
          message: data.get("message"),
          consent,
          submissionId,
          files: uploaded,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Något gick fel. Försök igen.");
      setDone(true);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Något gick fel. Försök igen.");
    } finally {
      setSubmitting(false);
      setProgress("");
    }
  }

  if (done) {
    return (
      <div className="mx-auto max-w-2xl rounded-card border border-border bg-surface p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft text-2xl">
          ✓
        </div>
        <h2 className="text-2xl font-bold text-brand-deep">Tack! Vi har tagit emot dina handlingar</h2>
        <p className="mt-3 text-muted">
          Vi går igenom dina uppgifter och återkommer med en offert inom{" "}
          <strong>{QUOTE_RESPONSE_DAYS} arbetsdagar</strong>. Du får en bekräftelse via e-post.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-5" noValidate>
      {/* Honeypot */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <Field htmlFor="customerName" label="Namn" required>
        <TextInput id="customerName" name="customerName" required autoComplete="name" />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field htmlFor="email" label="E-post" required>
          <TextInput id="email" name="email" type="email" required autoComplete="email" />
        </Field>
        <Field htmlFor="phone" label="Telefon" required>
          <TextInput id="phone" name="phone" type="tel" required autoComplete="tel" />
        </Field>
      </div>

      <Field htmlFor="propertyAddress" label="Fastighetsadress">
        <TextInput id="propertyAddress" name="propertyAddress" autoComplete="street-address" />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
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
        <Field htmlFor="propertyType" label="Fastighetstyp">
          <SelectInput id="propertyType" name="propertyType" defaultValue="">
            <option value="">Välj …</option>
            {PROPERTY_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </SelectInput>
        </Field>
      </div>

      <Field htmlFor="message" label="Beskriv ditt projekt">
        <TextArea
          id="message"
          name="message"
          rows={5}
          placeholder="T.ex. höga uppvärmningskostnader, drag från fönster, gammal panna eller en fasad som behöver ses över."
        />
      </Field>

      {/* Filuppladdning */}
      <div>
        <span className="block font-medium text-brand-deep">Bifoga handlingar</span>
        <p className="mt-1 text-sm text-muted">
          PDF, JPG eller PNG. Max {MAX_FILES} filer, {prettySize(MAX_FILE_SIZE)} per fil. T.ex.
          ritningar, energideklaration eller foton.
        </p>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            addFiles(e.dataTransfer.files);
          }}
          onClick={() => inputRef.current?.click()}
          className={`mt-2 flex cursor-pointer flex-col items-center justify-center rounded-card border-2 border-dashed px-6 py-8 text-center transition-colors ${
            dragOver ? "border-brand bg-brand-soft" : "border-border bg-surface hover:bg-brand-soft/50"
          }`}
        >
          <span className="text-2xl" aria-hidden="true">
            📎
          </span>
          <span className="mt-2 text-sm font-medium text-brand-deep">
            Dra och släpp filer här, eller klicka för att välja
          </span>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
            className="hidden"
            onChange={(e) => {
              addFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </div>

        {files.length > 0 && (
          <ul className="mt-3 space-y-2">
            {files.map(({ file, id }) => (
              <li
                key={id}
                className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface px-3 py-2 text-sm"
              >
                <span className="truncate text-foreground">{file.name}</span>
                <span className="flex shrink-0 items-center gap-3">
                  <span className="text-muted">{prettySize(file.size)}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(id)}
                    className="font-medium text-brand-2 underline underline-offset-2 hover:text-brand-deep"
                  >
                    Ta bort
                  </button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Checkbox
        id="consent"
        name="consent"
        checked={consent}
        onChange={(e) => setConsent(e.target.checked)}
      >
        Jag godkänner att Gröna Byggnader behandlar mina uppgifter enligt{" "}
        <a className="font-medium text-brand-2 underline underline-offset-2" href="/integritetspolicy/">
          integritetspolicyn
        </a>
        .
      </Checkbox>

      {formError && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">
          {formError}
        </p>
      )}

      <button type="submit" className={primaryButtonClass} disabled={submitting}>
        {submitting ? progress || "Skickar…" : "Skicka förfrågan"}
      </button>
    </form>
  );
}
