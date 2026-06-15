import { supabaseAdmin } from "./supabase/admin";
import { STORAGE_BUCKET } from "./constants";

/** Tidsbegränsad URL som klienten laddar upp EN fil till (privat bucket). */
export async function createSignedUploadUrl(path: string) {
  const { data, error } = await supabaseAdmin()
    .storage.from(STORAGE_BUCKET)
    .createSignedUploadUrl(path);
  if (error || !data) throw new Error(error?.message || "Kunde inte skapa upload-URL");
  return data; // { signedUrl, token, path }
}

/** Tidsbegränsad nedladdnings-URL (default 10 min). */
export async function createSignedDownloadUrl(path: string, expiresInSeconds = 600) {
  const { data, error } = await supabaseAdmin()
    .storage.from(STORAGE_BUCKET)
    .createSignedUrl(path, expiresInSeconds);
  if (error || !data) throw new Error(error?.message || "Kunde inte skapa nedladdnings-URL");
  return data.signedUrl;
}

/** Laddar upp en buffer (server-side), t.ex. genererad PDF. */
export async function uploadBuffer(path: string, content: Buffer, contentType: string) {
  const { error } = await supabaseAdmin()
    .storage.from(STORAGE_BUCKET)
    .upload(path, content, { contentType, upsert: true });
  if (error) throw new Error(error.message);
  return path;
}

/** Hämtar en fil som Buffer (server-side). */
export async function downloadBuffer(path: string): Promise<Buffer> {
  const { data, error } = await supabaseAdmin()
    .storage.from(STORAGE_BUCKET)
    .download(path);
  if (error || !data) throw new Error(error?.message || "Kunde inte hämta fil");
  return Buffer.from(await data.arrayBuffer());
}

/** Listar innehållet i en mapp (för att verifiera klientuppladdningar). */
export async function listFolder(prefix: string) {
  const { data, error } = await supabaseAdmin()
    .storage.from(STORAGE_BUCKET)
    .list(prefix, { limit: 100 });
  if (error) throw new Error(error.message);
  return data ?? [];
}
