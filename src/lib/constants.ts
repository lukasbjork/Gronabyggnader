/**
 * Delade konstanter för offert-/signeringsflödet.
 */

/** Privat Supabase Storage-bucket för kundens handlingar och genererade PDF:er. */
export const STORAGE_BUCKET = "quote-documents";

/** Hur länge en signeringslänk (access_token) är giltig. */
export const TOKEN_TTL_DAYS = 30;

/** Filuppladdning – gränser och tillåtna typer. */
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB per fil
export const MAX_FILES = 10;
export const ALLOWED_FILE_TYPES = ["application/pdf", "image/jpeg", "image/png"] as const;
export const ALLOWED_FILE_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png"] as const;

/** Visas i bekräftelsen: "Vi återkommer med en offert inom X arbetsdagar." */
export const QUOTE_RESPONSE_DAYS = 3;

/** Aktuell version av avtalsvillkoren (loggas på varje offert). */
export const TERMS_VERSION = "2026-06-placeholder";

/**
 * ⚠️ PLACEHOLDER-avtalsvillkor. TODO: låt någon JURIDISKT KUNNIG ta fram/granska de
 * riktiga villkoren (t.ex. baserat på Hantverkarformuläret 17 / ABS 18) innan skarp
 * användning. Texten nedan är ett utkast – INTE färdiga juridiska villkor.
 */
export const PLACEHOLDER_TERMS = `1. Giltighet
Offerten gäller till och med angivet datum. Priser anges i svenska kronor inklusive moms där så framgår.

2. ROT-avdrag
Angivet ROT-avdrag förutsätter att beställaren har rätt till avdraget enligt Skatteverkets regler. Medges inte avdraget faktureras motsvarande belopp.

3. Betalning
Betalning sker mot faktura enligt överenskommen betalningsplan. Dröjsmålsränta enligt räntelagen.

4. Ändringar och tilläggsarbeten
Tillkommande arbeten som inte ingår i specifikationen avtalas separat och kan påverka pris och tidplan.

5. Ansvar och garanti
Arbetet utförs fackmannamässigt. Garanti lämnas enligt gällande konsumenttjänstlag/branschpraxis.

⚠️ PLACEHOLDER: Dessa villkor är ett utkast och ska granskas av juridiskt kunnig person (t.ex. mot Hantverkarformuläret 17 / ABS 18) innan de används skarpt.`;

/** Statusetiketter (svenska) för admin och kundvy. */
export const STATUS_LABELS: Record<string, string> = {
  submitted: "Inkommen",
  quoted: "Offert skapad",
  sent: "Offert skickad",
  viewed: "Granskad av kund",
  signed: "Signerad",
  booked: "Bokningsbar",
};
