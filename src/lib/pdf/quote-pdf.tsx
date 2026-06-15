import type { ReactElement } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
  type DocumentProps,
} from "@react-pdf/renderer";
import { site, fullAddress } from "@/config/site";
import { formatKr, type LineItem, type QuoteTotals } from "@/lib/quote-config";

export type QuotePdfData = {
  quoteId: string;
  createdAt: string;
  customerName: string;
  email: string;
  phone?: string | null;
  propertyAddress?: string | null;
  serviceType?: string | null;
  lineItems: LineItem[];
  totals: QuoteTotals;
  validUntil?: string | null;
  termsText: string;
  termsVersion: string;
};

const C = {
  brand: "#1b4332",
  deep: "#102a1e",
  brand2: "#2d6a4f",
  soft: "#e9f5ee",
  border: "#e3ede7",
  muted: "#5c6b64",
  ink: "#1a2421",
};

const s = StyleSheet.create({
  page: { paddingTop: 40, paddingBottom: 56, paddingHorizontal: 44, fontSize: 10, color: C.ink, fontFamily: "Helvetica" },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 },
  brandName: { fontSize: 18, fontFamily: "Helvetica-Bold", color: C.brand },
  brandSub: { fontSize: 8, color: C.muted, marginTop: 2 },
  docTitle: { fontSize: 24, fontFamily: "Helvetica-Bold", color: C.deep, textAlign: "right" },
  metaRight: { fontSize: 8, color: C.muted, textAlign: "right", marginTop: 4 },
  divider: { borderBottomWidth: 1, borderBottomColor: C.border, marginVertical: 12 },
  twoCol: { flexDirection: "row", justifyContent: "space-between", gap: 16 },
  col: { flex: 1 },
  label: { fontSize: 8, color: C.muted, fontFamily: "Helvetica-Bold", marginBottom: 3, textTransform: "uppercase" },
  value: { fontSize: 10, color: C.ink, marginBottom: 1 },
  sectionTitle: { fontSize: 12, fontFamily: "Helvetica-Bold", color: C.brand, marginTop: 18, marginBottom: 8 },
  tHead: { flexDirection: "row", backgroundColor: C.soft, paddingVertical: 6, paddingHorizontal: 6, borderRadius: 4 },
  tRow: { flexDirection: "row", paddingVertical: 6, paddingHorizontal: 6, borderBottomWidth: 1, borderBottomColor: C.border },
  th: { fontSize: 8, fontFamily: "Helvetica-Bold", color: C.deep },
  td: { fontSize: 9, color: C.ink },
  cDesc: { flex: 3.2 },
  cKind: { flex: 1.1 },
  cQty: { flex: 0.9, textAlign: "right" },
  cUnit: { flex: 1.2, textAlign: "right" },
  cSum: { flex: 1.3, textAlign: "right" },
  sumWrap: { marginTop: 14, alignSelf: "flex-end", width: 250 },
  sumRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 3 },
  sumLabel: { fontSize: 9, color: C.muted },
  sumValue: { fontSize: 9, color: C.ink },
  rotRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 3 },
  rotLabel: { fontSize: 9, color: C.brand2, fontFamily: "Helvetica-Bold" },
  rotValue: { fontSize: 9, color: C.brand2, fontFamily: "Helvetica-Bold" },
  totalRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6, marginTop: 4, borderTopWidth: 1.5, borderTopColor: C.brand },
  totalLabel: { fontSize: 11, fontFamily: "Helvetica-Bold", color: C.deep },
  totalValue: { fontSize: 12, fontFamily: "Helvetica-Bold", color: C.brand },
  note: { fontSize: 8, color: C.muted, marginTop: 6 },
  terms: { fontSize: 8, color: C.ink, lineHeight: 1.5, marginTop: 4 },
  footer: { position: "absolute", bottom: 28, left: 44, right: 44, borderTopWidth: 1, borderTopColor: C.border, paddingTop: 8, flexDirection: "row", justifyContent: "space-between" },
  footerText: { fontSize: 7, color: C.muted },
});

function kindLabel(k: LineItem["kind"]): string {
  return k === "arbete" ? "Arbete" : "Material";
}

function QuoteDocument({ data }: { data: QuotePdfData }) {
  const { totals } = data;
  const offerNo = data.quoteId.slice(0, 8).toUpperCase();
  return (
    <Document title={`Offert ${offerNo} – ${site.name}`} author={site.name}>
      <Page size="A4" style={s.page}>
        <View style={s.headerRow}>
          <View>
            <Text style={s.brandName}>{site.name}</Text>
            <Text style={s.brandSub}>{fullAddress()}</Text>
            <Text style={s.brandSub}>
              {site.phone} · {site.email}
            </Text>
            <Text style={s.brandSub}>Org.nr {site.orgNumber}</Text>
          </View>
          <View>
            <Text style={s.docTitle}>OFFERT</Text>
            <Text style={s.metaRight}>Offertnr: {offerNo}</Text>
            <Text style={s.metaRight}>
              Datum: {new Date(data.createdAt).toLocaleDateString("sv-SE")}
            </Text>
            {data.validUntil ? (
              <Text style={s.metaRight}>
                Giltig t.o.m.: {new Date(data.validUntil).toLocaleDateString("sv-SE")}
              </Text>
            ) : null}
          </View>
        </View>

        <View style={s.divider} />

        <View style={s.twoCol}>
          <View style={s.col}>
            <Text style={s.label}>Kund</Text>
            <Text style={s.value}>{data.customerName}</Text>
            <Text style={s.value}>{data.email}</Text>
            {data.phone ? <Text style={s.value}>{data.phone}</Text> : null}
          </View>
          <View style={s.col}>
            <Text style={s.label}>Fastighet / projekt</Text>
            {data.propertyAddress ? <Text style={s.value}>{data.propertyAddress}</Text> : null}
            {data.serviceType ? <Text style={s.value}>{data.serviceType}</Text> : null}
          </View>
        </View>

        <Text style={s.sectionTitle}>Specifikation</Text>
        <View style={s.tHead}>
          <Text style={[s.th, s.cDesc]}>Beskrivning</Text>
          <Text style={[s.th, s.cKind]}>Typ</Text>
          <Text style={[s.th, s.cQty]}>Antal</Text>
          <Text style={[s.th, s.cUnit]}>Á-pris</Text>
          <Text style={[s.th, s.cSum]}>Summa</Text>
        </View>
        {data.lineItems.map((item, i) => (
          <View style={s.tRow} key={i}>
            <Text style={[s.td, s.cDesc]}>{item.description}</Text>
            <Text style={[s.td, s.cKind]}>{kindLabel(item.kind)}</Text>
            <Text style={[s.td, s.cQty]}>{item.quantity}</Text>
            <Text style={[s.td, s.cUnit]}>{formatKr(item.unitPrice)}</Text>
            <Text style={[s.td, s.cSum]}>{formatKr(item.quantity * item.unitPrice)}</Text>
          </View>
        ))}

        <View style={s.sumWrap}>
          <View style={s.sumRow}>
            <Text style={s.sumLabel}>Arbetskostnad (exkl. moms)</Text>
            <Text style={s.sumValue}>{formatKr(totals.laborCost)}</Text>
          </View>
          <View style={s.sumRow}>
            <Text style={s.sumLabel}>Materialkostnad (exkl. moms)</Text>
            <Text style={s.sumValue}>{formatKr(totals.materialCost)}</Text>
          </View>
          <View style={s.sumRow}>
            <Text style={s.sumLabel}>Moms 25 %</Text>
            <Text style={s.sumValue}>{formatKr(totals.vatAmount)}</Text>
          </View>
          <View style={s.sumRow}>
            <Text style={s.sumLabel}>Summa inkl. moms</Text>
            <Text style={s.sumValue}>{formatKr(totals.totalInclVat)}</Text>
          </View>
          <View style={s.rotRow}>
            <Text style={s.rotLabel}>ROT-avdrag (30 % av arbete)</Text>
            <Text style={s.rotValue}>−{formatKr(totals.rotDeduction)}</Text>
          </View>
          <View style={s.totalRow}>
            <Text style={s.totalLabel}>Att betala</Text>
            <Text style={s.totalValue}>{formatKr(totals.totalToPay)}</Text>
          </View>
        </View>
        <Text style={s.note}>
          ROT-avdraget förutsätter att du har rätt till avdrag (tak {formatKr(50000)}/person
          och år). Avdrag på {totals.rotPersons} person(er) tillämpat. Slutligt avdrag avgörs av
          Skatteverket.
        </Text>

        <Text style={s.sectionTitle}>Avtalsvillkor</Text>
        <Text style={s.terms}>{data.termsText}</Text>

        <View style={s.footer} fixed>
          <Text style={s.footerText}>
            {site.name} · {fullAddress()} · Org.nr {site.orgNumber}
          </Text>
          <Text
            style={s.footerText}
            render={({ pageNumber, totalPages }) => `Sida ${pageNumber}/${totalPages}`}
          />
        </View>
      </Page>
    </Document>
  );
}

/** Renderar offert-PDF:en till en Buffer (server-side, Node-runtime). */
export async function renderQuotePdf(data: QuotePdfData): Promise<Buffer> {
  const doc = (<QuoteDocument data={data} />) as unknown as ReactElement<DocumentProps>;
  return renderToBuffer(doc);
}
