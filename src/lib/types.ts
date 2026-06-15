import type { LineItem } from "./quote-config";

export type QuoteStatus =
  | "submitted"
  | "quoted"
  | "sent"
  | "viewed"
  | "signed"
  | "booked";

export type RequestSource = "offert" | "kontakt";
export type SignatureMethod = "simple" | "bankid";

export type QuoteRequest = {
  id: string;
  created_at: string;
  updated_at: string;
  source: RequestSource;
  customer_name: string;
  email: string;
  phone: string | null;
  property_address: string | null;
  property_type: string | null;
  service_type: string | null;
  message: string | null;
  status: QuoteStatus;
  access_token: string;
  token_expires_at: string;
};

export type DocumentRow = {
  id: string;
  quote_request_id: string;
  storage_path: string;
  filename: string;
  content_type: string | null;
  size_bytes: number | null;
  uploaded_at: string;
};

export type Quote = {
  id: string;
  quote_request_id: string;
  line_items: LineItem[];
  labor_cost: number;
  material_cost: number;
  vat_amount: number;
  rot_deduction: number;
  rot_persons: number;
  total_incl_vat: number;
  total_to_pay: number;
  valid_until: string | null;
  terms_version: string | null;
  terms_text: string | null;
  pdf_path: string | null;
  created_by: string | null;
  created_at: string;
};

export type Signature = {
  id: string;
  quote_id: string;
  signed_at: string;
  signer_name: string;
  signer_email: string;
  ip_address: string | null;
  user_agent: string | null;
  document_sha256: string;
  signed_pdf_path: string | null;
  signature_image_path: string | null;
  method: SignatureMethod;
  bankid_order_ref: string | null;
};

export type Booking = {
  id: string;
  quote_id: string;
  scheduled_start: string | null;
  scheduled_end: string | null;
  notes: string | null;
  created_at: string;
};
