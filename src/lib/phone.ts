// Normalizes US phone numbers to E.164 format (+1XXXXXXXXXX).
// Strips all non-digit characters, handles numbers with or without a
// leading "1" country code. Returns null if the result isn't a valid
// 10-digit US number, so callers can detect and handle bad input.
export function normalizePhone(input: string): string | null {
  const digits = input.replace(/\D/g, "");

  if (digits.length === 10) {
    return `+1${digits}`;
  }

  if (digits.length === 11 && digits.startsWith("1")) {
    return `+${digits}`;
  }

  return null;
}
