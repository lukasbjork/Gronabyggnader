import { PDFDocument, StandardFonts, rgb, type PDFFont } from "pdf-lib";

/**
 * Tar den exakta offert-PDF som kunden granskade och lägger till en sista
 * audit-sida (vem, när, IP, user-agent, metod, dokument-hash). SHA-256 ska räknas
 * på ORIGINALET innan denna funktion anropas, så att hashen matchar det signerade.
 */
export type AuditInfo = {
  quoteId: string;
  signerName: string;
  signerEmail: string;
  signedAt: string;
  ipAddress: string;
  userAgent: string;
  documentSha256: string;
  method: string;
  signatureImagePng?: Uint8Array; // valfri ritad signatur (PNG)
};

const BRAND = rgb(0.106, 0.263, 0.196); // #1b4332
const DEEP = rgb(0.063, 0.165, 0.118); // #102a1e
const MUTED = rgb(0.36, 0.42, 0.39);
const INK = rgb(0.1, 0.14, 0.13);

/** WinAnsi-säker text: mappa vanliga typografiska tecken till ASCII, strippa resten
 *  (pdf-lib:s standardfonter klarar bara WinAnsi/CP1252). */
function safe(s: string): string {
  return (s || "")
    .replace(/[–—]/g, "-") // – — → -
    .replace(/[‘’‚]/g, "'") // ' ' ‚ → '
    .replace(/[“”„]/g, '"') // " " „ → "
    .replace(/…/g, "...") // … → ...
    .replace(/[^\x00-\xff]/g, "?"); // övrigt utanför Latin-1
}

function wrap(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = safe(text).split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const w of words) {
    const test = current ? `${current} ${w}` : w;
    if (font.widthOfTextAtSize(test, size) > maxWidth && current) {
      lines.push(current);
      current = w;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  // Hårdbryt extremt långa tokens (hash, user-agent).
  return lines.flatMap((line) => hardBreak(line, font, size, maxWidth));
}

function hardBreak(line: string, font: PDFFont, size: number, maxWidth: number): string[] {
  if (font.widthOfTextAtSize(line, size) <= maxWidth) return [line];
  const out: string[] = [];
  let cur = "";
  for (const ch of line) {
    if (cur && font.widthOfTextAtSize(cur + ch, size) > maxWidth) {
      out.push(cur);
      cur = ch;
    } else {
      cur += ch;
    }
  }
  if (cur) out.push(cur);
  return out;
}

export async function appendAuditPage(
  original: Uint8Array,
  audit: AuditInfo,
): Promise<Uint8Array> {
  const pdf = await PDFDocument.load(original);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const page = pdf.addPage([595.28, 841.89]); // A4
  const left = 50;
  const labelW = 175;
  const valueW = 320;

  let y = 790;
  page.drawText(safe("Signeringsverifikat"), { x: left, y, size: 22, font: bold, color: BRAND });
  y -= 18;
  page.drawText(safe("Elektronisk signering – Gröna Byggnader"), {
    x: left,
    y,
    size: 10,
    font,
    color: MUTED,
  });
  y -= 16;
  page.drawLine({ start: { x: left, y }, end: { x: 545, y }, thickness: 1, color: rgb(0.89, 0.93, 0.91) });
  y -= 30;

  const rows: [string, string][] = [
    ["Offert-ID", audit.quoteId],
    ["Signerad av", audit.signerName],
    ["E-post", audit.signerEmail],
    ["Tidpunkt", new Date(audit.signedAt).toLocaleString("sv-SE")],
    ["IP-adress", audit.ipAddress],
    ["Enhet (user-agent)", audit.userAgent],
    [
      "Signeringsmetod",
      audit.method === "simple" ? "Enkel elektronisk signering" : audit.method,
    ],
    ["Dokument-hash (SHA-256)", audit.documentSha256],
  ];

  for (const [label, value] of rows) {
    page.drawText(safe(label), { x: left, y, size: 9, font: bold, color: MUTED });
    const valueLines = wrap(value, font, 10, valueW);
    let vy = y;
    for (const line of valueLines) {
      page.drawText(line, { x: left + labelW, y: vy, size: 10, font, color: INK });
      vy -= 13;
    }
    y = Math.min(y - 18, vy - 5);
  }

  if (audit.signatureImagePng) {
    try {
      const png = await pdf.embedPng(audit.signatureImagePng);
      const maxW = 220;
      const scale = Math.min(1, maxW / png.width);
      const w = png.width * scale;
      const h = png.height * scale;
      y -= 14;
      page.drawText(safe("Signatur:"), { x: left, y, size: 9, font: bold, color: MUTED });
      page.drawImage(png, { x: left + labelW, y: y - h + 8, width: w, height: Math.min(h, 100) });
      y -= Math.min(h, 100) + 10;
    } catch {
      // Ogiltig bild – hoppa över utan att fälla signeringen.
    }
  }

  page.drawText(
    safe(
      "Detta verifikat styrker att avtalet godkänts elektroniskt via en personlig, " +
        "tidsbegränsad länk. Dokument-hashen identifierar exakt den offert som signerades.",
    ),
    { x: left, y: 70, size: 8, font, color: MUTED, maxWidth: 495, lineHeight: 11 },
  );
  page.drawText(safe(`Genererad ${new Date().toLocaleString("sv-SE")}`), {
    x: left,
    y: 50,
    size: 8,
    font,
    color: DEEP,
  });

  return pdf.save();
}
