import { site } from "@/config/site";
import { formatKr } from "@/lib/quote-config";
import { QUOTE_RESPONSE_DAYS } from "@/lib/constants";
import type { QuoteRequest } from "@/lib/types";

const BRAND = "#1b4332";
const DEEP = "#102a1e";
const SOFT = "#e9f5ee";
const MUTED = "#5c6b64";

function layout(title: string, body: string): string {
  return `<!doctype html><html lang="sv"><body style="margin:0;background:#f6faf7;padding:24px 0;font-family:Segoe UI,Helvetica,Arial,sans-serif;color:#1a2421;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
    <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #e3ede7;border-radius:14px;overflow:hidden;">
      <tr><td style="background:${BRAND};padding:20px 28px;">
        <span style="color:#fff;font-size:18px;font-weight:700;">${site.name}</span>
      </td></tr>
      <tr><td style="padding:28px;">
        <h1 style="margin:0 0 14px;font-size:20px;color:${DEEP};">${title}</h1>
        ${body}
      </td></tr>
      <tr><td style="padding:18px 28px;background:${SOFT};color:${MUTED};font-size:12px;">
        ${site.name} · ${site.phone} · ${site.email}<br/>
        Du får detta mejl eftersom du varit i kontakt med oss om en offert.
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`;
}

function button(href: string, label: string): string {
  return `<a href="${href}" style="display:inline-block;background:${BRAND};color:#fff;text-decoration:none;padding:12px 22px;border-radius:999px;font-weight:600;font-size:15px;">${label}</a>`;
}

const p = (text: string) =>
  `<p style="margin:0 0 14px;font-size:15px;line-height:1.6;">${text}</p>`;

/** Steg 1 – bekräftelse till kunden (offertförfrågan). */
export function customerConfirmationEmail(args: { name: string }) {
  return {
    subject: `Tack för din förfrågan – ${site.name}`,
    html: layout(
      "Tack, vi har tagit emot dina handlingar!",
      p(`Hej ${args.name},`) +
        p(
          `Tack för att du kontaktade ${site.name}. Vi går igenom dina uppgifter och ` +
            `återkommer med en offert inom <strong>${QUOTE_RESPONSE_DAYS} arbetsdagar</strong>.`,
        ) +
        p("Har du frågor under tiden är du välkommen att svara på detta mejl eller ringa oss.") +
        p("Vänliga hälsningar,<br/>Teamet på " + site.name),
    ),
  };
}

/** Steg 1 – notis till admin om ny förfrågan. */
export function adminNotificationEmail(args: {
  request: Pick<
    QuoteRequest,
    "customer_name" | "email" | "phone" | "property_address" | "property_type" | "service_type" | "message" | "source"
  >;
  fileCount: number;
  adminUrl: string;
}) {
  const r = args.request;
  const row = (k: string, v?: string | null) =>
    v ? `<tr><td style="padding:4px 12px 4px 0;color:${MUTED};font-size:13px;">${k}</td><td style="padding:4px 0;font-size:13px;">${v}</td></tr>` : "";
  return {
    subject: `Ny ${r.source === "kontakt" ? "kontaktförfrågan" : "offertförfrågan"}: ${r.customer_name}`,
    html: layout(
      "Ny förfrågan inkommen",
      `<table role="presentation" cellpadding="0" cellspacing="0">${
        row("Namn", r.customer_name) +
        row("E-post", r.email) +
        row("Telefon", r.phone) +
        row("Fastighet", r.property_address) +
        row("Fastighetstyp", r.property_type) +
        row("Typ av arbete", r.service_type) +
        row("Bifogade filer", String(args.fileCount)) +
        row("Meddelande", r.message)
      }</table>` +
        `<div style="margin-top:20px;">${button(args.adminUrl, "Öppna i admin")}</div>`,
    ),
  };
}

/** Steg 2/3 – offert klar, länk till signering. */
export function quoteReadyEmail(args: {
  name: string;
  signUrl: string;
  validUntil?: string | null;
  totalToPay: number;
}) {
  const validity = args.validUntil
    ? p(`Offerten är giltig till och med <strong>${new Date(args.validUntil).toLocaleDateString("sv-SE")}</strong>.`)
    : "";
  return {
    subject: `Din offert från ${site.name} är klar att granska`,
    html: layout(
      "Din offert är klar",
      p(`Hej ${args.name},`) +
        p(
          `Vi har tagit fram en offert för ditt projekt. Summa att betala efter ROT-avdrag: ` +
            `<strong>${formatKr(args.totalToPay)}</strong>.`,
        ) +
        p("Klicka nedan för att granska hela offerten och signera digitalt:") +
        `<div style="margin:18px 0;">${button(args.signUrl, "Granska och signera")}</div>` +
        validity +
        p(
          `<span style="color:${MUTED};font-size:13px;">Länken är personlig – dela den inte vidare. ` +
            `Fungerar inte knappen? Kopiera denna adress till webbläsaren:<br/>${args.signUrl}</span>`,
        ),
    ),
  };
}

/** Steg 4 – signerat avtal (med PDF som bilaga) till kund och admin. */
export function signedConfirmationEmail(args: { name: string; forAdmin?: boolean }) {
  if (args.forAdmin) {
    return {
      subject: `Avtal signerat: ${args.name}`,
      html: layout(
        "Ett avtal har signerats",
        p(`${args.name} har signerat sin offert. Det signerade avtalet bifogas (med audit-sida).`) +
          p("Status är nu satt till <strong>bokningsbar</strong> – dags att planera in arbetet."),
      ),
    };
  }
  return {
    subject: `Tack – ditt avtal med ${site.name} är signerat`,
    html: layout(
      "Avtalet är signerat – tack!",
      p(`Hej ${args.name},`) +
        p("Tack för att du signerade avtalet. Det signerade dokumentet bifogas detta mejl för din referens.") +
        p(`Vi kontaktar dig inom kort för att boka in arbetet. Hör gärna av dig om du har frågor.`) +
        p("Vänliga hälsningar,<br/>Teamet på " + site.name),
    ),
  };
}
