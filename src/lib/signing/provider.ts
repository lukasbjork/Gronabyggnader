/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  SignatureProvider-abstraktion
 * ─────────────────────────────────────────────────────────────────────────────
 *  "Enkel elektronisk signering" är implementerad nu. BankID (Criipto/Scrive) kan
 *  läggas till senare genom att implementera samma interface – resten av flödet
 *  (sign-route, PDF, audit trail, mejl) behöver då inte skrivas om.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import type { SignatureMethod } from "@/lib/types";

export type SignContext = {
  signerName: string;
  signerEmail: string;
  ipAddress: string;
  userAgent: string;
  documentSha256: string;
  signatureImageDataUrl?: string;
};

export type SignResult = {
  method: SignatureMethod;
  signedAt: string;
  bankidOrderRef?: string;
};

export interface SignatureProvider {
  readonly method: SignatureMethod;
  sign(ctx: SignContext): Promise<SignResult>;
}

/**
 * Enkel signering: avtalet anses signerat när kunden bekräftat namn + villkor via
 * den hemliga token-länken. Bevisvärdet ligger i audit trail (namn, e-post, tid,
 * IP, user-agent, dokument-hash) som sparas i `signatures` och i PDF:ens audit-sida.
 */
export class SimpleSignatureProvider implements SignatureProvider {
  readonly method: SignatureMethod = "simple";

  // ctx (namn, e-post, IP, hash …) sparas av anroparen i audit trail; den enkla
  // providern behöver den inte själv. BankID-providern kommer att använda ctx.
  async sign(): Promise<SignResult> {
    return { method: "simple", signedAt: new Date().toISOString() };
  }
}

// TODO (framtid): BankIdSignatureProvider via Criipto/Scrive.
//   class BankIdSignatureProvider implements SignatureProvider {
//     readonly method = "bankid";
//     async sign(ctx) { /* starta order, polla, returnera bankidOrderRef */ }
//   }

export function getSignatureProvider(
  method: SignatureMethod = "simple",
): SignatureProvider {
  // När BankID finns: switch (method) { case "bankid": return new BankIdSignatureProvider(); }
  void method;
  return new SimpleSignatureProvider();
}
