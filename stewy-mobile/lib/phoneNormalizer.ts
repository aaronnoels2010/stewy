import { parsePhoneNumber, type CountryCode } from 'libphonenumber-js/max';

export function phoneNormalizer(input: string, defaultCountry: CountryCode = 'BE'): string | null {
  if (!input || !input.trim()) {
    return null;
  }

  const cleaned = input.trim();

  try {
    const phoneNumber = parsePhoneNumber(cleaned, defaultCountry);
    if (phoneNumber && phoneNumber.isValid()) {
      return phoneNumber.number; // E.164 format
    }
  } catch {
    // Invalid input
  }

  return null;
}
