import { createHash } from "node:crypto";

/** SHA-256 (hex) av PDF-bytes – sparas som bevis på vad kunden signerade. */
export function sha256Hex(data: Uint8Array | Buffer): string {
  return createHash("sha256").update(data).digest("hex");
}
