import { z } from "zod";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE, MAX_FILES } from "./constants";

/** Tjänstetyper – speglar sajtens tjänster (src/lib/content.ts) + ett "annat". */
export const SERVICE_TYPES = [
  "Energieffektivisering",
  "Tilläggsisolering",
  "Fönsterbyte",
  "Fasadrenovering",
  "Takrenovering",
  "Värmesystem & värmepump",
  "ROT-renovering",
  "Annat / vet inte",
] as const;

/** Fastighetstyper – samma lista som dagens kontaktformulär. */
export const PROPERTY_TYPES = [
  "Villa / radhus",
  "Bostadsrätt",
  "Bostadsrättsförening (BRF)",
  "Flerbostadshus / hyresfastighet",
  "Kommersiell fastighet",
  "Annat / vet inte",
] as const;

const optionalText = (max: number) => z.string().trim().max(max).optional().or(z.literal(""));

const uploadedFileSchema = z.object({
  storagePath: z.string().min(1).max(512),
  filename: z.string().min(1).max(255),
  contentType: z.string().max(120).optional(),
  sizeBytes: z.number().int().nonnegative().max(MAX_FILE_SIZE).optional(),
});

/** Steg 1 – kundens offert-/kontaktförfrågan. */
export const quoteRequestSchema = z.object({
  source: z.enum(["offert", "kontakt"]).default("offert"),
  customerName: z.string().trim().min(2, "Ange ditt namn").max(120),
  email: z.email("Ange en giltig e-postadress").max(160),
  phone: z.string().trim().min(4, "Ange ett telefonnummer").max(40),
  propertyAddress: optionalText(200),
  propertyType: optionalText(80),
  serviceType: optionalText(80),
  message: optionalText(4000),
  consent: z
    .boolean()
    .refine((v) => v === true, { message: "Du måste godkänna integritetspolicyn" }),
  files: z.array(uploadedFileSchema).max(MAX_FILES).default([]),
  // Knyter uppladdade filer till rätt submission-mapp (server-verifiering).
  submissionId: z.uuid().optional(),
  // Honeypot – måste vara tomt (bottar fyller ofta i dolda fält).
  company: z.string().max(0).optional(),
});
export type QuoteRequestInput = z.infer<typeof quoteRequestSchema>;

/** Begäran om en signerad upload-URL (en per fil). */
export const signUploadSchema = z.object({
  submissionId: z.uuid(),
  filename: z.string().min(1).max(255),
  contentType: z
    .string()
    .refine((t) => (ALLOWED_FILE_TYPES as readonly string[]).includes(t), {
      message: "Otillåten filtyp (tillåtet: PDF, JPG, PNG)",
    }),
  sizeBytes: z.number().int().positive().max(MAX_FILE_SIZE),
});

const lineItemSchema = z.object({
  description: z.string().trim().min(1, "Beskrivning krävs").max(300),
  quantity: z.number().positive("Antal måste vara > 0"),
  unitPrice: z.number().nonnegative("Á-pris kan inte vara negativt"),
  kind: z.enum(["arbete", "material"]),
});

/** Admin skapar/uppdaterar en offert. */
export const createQuoteSchema = z.object({
  quoteRequestId: z.uuid(),
  lineItems: z.array(lineItemSchema).min(1, "Lägg till minst en rad"),
  rotPersons: z.number().int().min(1).max(10).default(1),
  validUntil: z.string().optional(), // ISO-datum (YYYY-MM-DD)
  termsText: z.string().max(20000).optional(),
});
export type CreateQuoteInput = z.infer<typeof createQuoteSchema>;

/** Kundens signering. */
export const signSchema = z.object({
  token: z.string().min(10),
  signerName: z.string().trim().min(2, "Ange ditt namn").max(120),
  signerEmail: z.email("Ange en giltig e-postadress").max(160),
  consent: z
    .boolean()
    .refine((v) => v === true, { message: "Du måste godkänna avtalsvillkoren" }),
  signatureImage: z.string().max(2_000_000).optional(), // dataURL (valfri ritad signatur)
});
export type SignInput = z.infer<typeof signSchema>;
