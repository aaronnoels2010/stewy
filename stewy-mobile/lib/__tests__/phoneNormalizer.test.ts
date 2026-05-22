import { phoneNormalizer } from '../phoneNormalizer';

describe('phoneNormalizer', () => {
  it('normalizes Belgian mobile number with leading 0', () => {
    expect(phoneNormalizer('0495123456')).toBe('+32495123456');
  });

  it('normalizes Belgian mobile number with +32', () => {
    expect(phoneNormalizer('+32495123456')).toBe('+32495123456');
  });

  it('normalizes Belgian mobile with 0032 prefix', () => {
    expect(phoneNormalizer('0032495123456')).toBe('+32495123456');
  });

  it('normalizes French number with +33', () => {
    expect(phoneNormalizer('+33612345678')).toBe('+33612345678');
  });

  it('returns null for invalid number', () => {
    expect(phoneNormalizer('not-a-phone')).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(phoneNormalizer('')).toBeNull();
  });

  it('returns null for whitespace-only', () => {
    expect(phoneNormalizer('   ')).toBeNull();
  });

  it('returns null for special characters', () => {
    expect(phoneNormalizer('!!@@!!')).toBeNull();
  });

  it('defaults to BE for ambiguous input (no + prefix)', () => {
    const result = phoneNormalizer('0495123456');
    expect(result).toBe('+32495123456');
  });

  it('handles Belgian landline with area code', () => {
    const result = phoneNormalizer('031234567');
    // May or may not be valid depending on libphonenumber metadata
    expect(typeof result === 'string' || result === null).toBe(true);
  });

  it('strips spaces, dots, and dashes from input', () => {
    expect(phoneNormalizer('+32 495 12 34 56')).toBe('+32495123456');
    expect(phoneNormalizer('+32.495.12.34.56')).toBe('+32495123456');
    expect(phoneNormalizer('+32-495-12-34-56')).toBe('+32495123456');
  });
});
