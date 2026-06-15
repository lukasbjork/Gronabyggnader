/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  Skatte- och prisregler för offerter (KONFIGURERBARA KONSTANTER)
 * ─────────────────────────────────────────────────────────────────────────────
 *  ⚠️ TODO (juridik/ekonomi): stäm av dessa satser mot Skatteverkets AKTUELLA
 *  regler innan skarp användning. Skattereglerna ändras – håll allt här så att de
 *  enkelt kan uppdateras. ROT-avdraget gäller ARBETSKOSTNAD (inkl. moms), inte
 *  material.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const VAT_RATE = 0.25; // moms 25 %
export const ROT_RATE = 0.3; // ROT = 30 % av arbetskostnaden inkl. moms
export const ROT_CAP_PER_PERSON = 50000; // tak 50 000 kr per person och år
export const DEFAULT_ROT_PERSONS = 1;

export type LineItemKind = "arbete" | "material";

export type LineItem = {
  description: string;
  quantity: number;
  unitPrice: number; // á-pris exkl. moms
  kind: LineItemKind;
};

export type QuoteTotals = {
  laborCost: number; // arbete exkl. moms
  materialCost: number; // material exkl. moms
  netTotal: number; // arbete + material exkl. moms
  vatAmount: number; // moms 25 %
  totalInclVat: number; // att betala före ROT
  laborInclVat: number; // arbete inkl. moms (ROT-underlag)
  rotDeduction: number; // ROT-avdrag
  totalToPay: number; // att betala efter ROT
  rotPersons: number;
};

function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function lineTotal(item: Pick<LineItem, "quantity" | "unitPrice">): number {
  return round2((item.quantity || 0) * (item.unitPrice || 0));
}

/** Räknar fram moms, ROT-avdrag och totalsumma utifrån offertens rader. */
export function calculateTotals(
  items: LineItem[],
  rotPersons: number = DEFAULT_ROT_PERSONS,
): QuoteTotals {
  const laborCost = round2(
    items.filter((i) => i.kind === "arbete").reduce((s, i) => s + lineTotal(i), 0),
  );
  const materialCost = round2(
    items.filter((i) => i.kind === "material").reduce((s, i) => s + lineTotal(i), 0),
  );
  const netTotal = round2(laborCost + materialCost);
  const vatAmount = round2(netTotal * VAT_RATE);
  const totalInclVat = round2(netTotal + vatAmount);

  const laborInclVat = round2(laborCost * (1 + VAT_RATE));
  const persons = Math.max(1, Math.floor(rotPersons || DEFAULT_ROT_PERSONS));
  const rotDeduction = round2(
    Math.min(laborInclVat * ROT_RATE, ROT_CAP_PER_PERSON * persons),
  );
  const totalToPay = round2(totalInclVat - rotDeduction);

  return {
    laborCost,
    materialCost,
    netTotal,
    vatAmount,
    totalInclVat,
    laborInclVat,
    rotDeduction,
    totalToPay,
    rotPersons: persons,
  };
}

const krFormatter = new Intl.NumberFormat("sv-SE", {
  style: "currency",
  currency: "SEK",
  maximumFractionDigits: 0,
});

export function formatKr(n: number): string {
  return krFormatter.format(Math.round(n || 0));
}
