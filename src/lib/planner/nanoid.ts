// Minimal nanoid substitute — no extra dependency needed.
// Generates a collision-resistant 10-char alphanumeric ID.
export function nanoid(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  const bytes: number[] =
    typeof crypto !== "undefined"
      ? Array.from(crypto.getRandomValues(new Uint8Array(10)))
      : Array.from({ length: 10 }, () => Math.floor(Math.random() * 36));
  for (const byte of bytes) {
    id += chars[byte % chars.length];
  }
  return id;
}
