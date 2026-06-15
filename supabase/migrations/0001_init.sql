-- ─────────────────────────────────────────────────────────────────────────────
--  Gröna Byggnader – offert- och signeringsflöde
--  Kör i Supabase SQL Editor (klistra in hela filen) eller via `supabase db push`.
-- ─────────────────────────────────────────────────────────────────────────────

create extension if not exists pgcrypto;

-- ── Enums ────────────────────────────────────────────────────────────────────
do $$ begin
  create type quote_status as enum ('submitted','quoted','sent','viewed','signed','booked');
exception when duplicate_object then null; end $$;

do $$ begin
  create type request_source as enum ('offert','kontakt');
exception when duplicate_object then null; end $$;

do $$ begin
  create type signature_method as enum ('simple','bankid');
exception when duplicate_object then null; end $$;

-- ── 1. Offertförfrågningar ───────────────────────────────────────────────────
create table if not exists public.quote_requests (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  source           request_source not null default 'offert',
  customer_name    text not null,
  email            text not null,
  phone            text,
  property_address text,
  property_type    text,
  service_type     text,
  message          text,
  status           quote_status not null default 'submitted',
  access_token     text not null unique,
  token_expires_at timestamptz not null
);
create index if not exists quote_requests_status_idx  on public.quote_requests (status);
create index if not exists quote_requests_created_idx on public.quote_requests (created_at desc);

-- ── 2. Uppladdade handlingar (referenser till privat Storage-bucket) ──────────
create table if not exists public.documents (
  id               uuid primary key default gen_random_uuid(),
  quote_request_id uuid not null references public.quote_requests(id) on delete cascade,
  storage_path     text not null,
  filename         text not null,
  content_type     text,
  size_bytes       bigint,
  uploaded_at      timestamptz not null default now()
);
create index if not exists documents_request_idx on public.documents (quote_request_id);

-- ── 3. Offerter ──────────────────────────────────────────────────────────────
-- line_items: [{ description, quantity, unit_price, kind: 'arbete' | 'material' }]
create table if not exists public.quotes (
  id               uuid primary key default gen_random_uuid(),
  quote_request_id uuid not null references public.quote_requests(id) on delete cascade,
  line_items       jsonb not null default '[]'::jsonb,
  labor_cost       numeric(12,2) not null default 0,  -- exkl. moms
  material_cost    numeric(12,2) not null default 0,  -- exkl. moms
  vat_amount       numeric(12,2) not null default 0,
  rot_deduction    numeric(12,2) not null default 0,
  rot_persons      int           not null default 1,
  total_incl_vat   numeric(12,2) not null default 0,
  total_to_pay     numeric(12,2) not null default 0,  -- efter ROT-avdrag
  valid_until      date,
  terms_version    text,
  terms_text       text,
  pdf_path         text,
  created_by       text,
  created_at       timestamptz not null default now()
);
create index if not exists quotes_request_idx on public.quotes (quote_request_id);

-- ── 4. Signaturer (audit trail) ──────────────────────────────────────────────
create table if not exists public.signatures (
  id                   uuid primary key default gen_random_uuid(),
  quote_id             uuid not null references public.quotes(id) on delete cascade,
  signed_at            timestamptz not null default now(),
  signer_name          text not null,
  signer_email         text not null,
  ip_address           text,
  user_agent           text,
  document_sha256      text not null,
  signed_pdf_path      text,
  signature_image_path text,
  method               signature_method not null default 'simple',
  bankid_order_ref     text
);
create index if not exists signatures_quote_idx on public.signatures (quote_id);

-- ── 5. Bokningar ─────────────────────────────────────────────────────────────
create table if not exists public.bookings (
  id              uuid primary key default gen_random_uuid(),
  quote_id        uuid not null references public.quotes(id) on delete cascade,
  scheduled_start timestamptz,
  scheduled_end   timestamptz,
  notes           text,
  created_at      timestamptz not null default now()
);
create index if not exists bookings_quote_idx on public.bookings (quote_id);

-- ── updated_at-trigger ───────────────────────────────────────────────────────
create or replace function public.set_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

drop trigger if exists quote_requests_updated_at on public.quote_requests;
create trigger quote_requests_updated_at before update on public.quote_requests
  for each row execute function public.set_updated_at();

-- ── Row Level Security ───────────────────────────────────────────────────────
-- RLS aktiveras på alla tabeller och INGA policyer skapas. Det innebär att
-- anon-/auth-roller från webbläsaren inte kan läsa/skriva något direkt.
-- All åtkomst sker i serverkod med service_role-nyckeln (som kringgår RLS):
--   * Kundens åtkomst gateras av en hemlig access_token (verifieras server-side).
--   * Adminens åtkomst gateras av Supabase Auth-session (verifieras i middleware).
alter table public.quote_requests enable row level security;
alter table public.documents      enable row level security;
alter table public.quotes         enable row level security;
alter table public.signatures     enable row level security;
alter table public.bookings       enable row level security;

-- ── Storage ──────────────────────────────────────────────────────────────────
-- Privat bucket för kundens handlingar och genererade PDF:er. Inga storage-policyer
-- => endast service_role kommer åt. Klienten laddar upp via tidsbegränsade signerade
-- upload-URL:er som serverkoden utfärdar.
insert into storage.buckets (id, name, public)
values ('quote-documents', 'quote-documents', false)
on conflict (id) do nothing;
