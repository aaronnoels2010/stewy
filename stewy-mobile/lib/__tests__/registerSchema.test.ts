import { registerSchema } from '../registerSchema';

describe('registerSchema', () => {
  const validData = {
    address: '456 Football Rd',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@test.com',
    phone: '+32 495 12 34 56',
    password: 'Password1',
    confirmPassword: 'Password1',
    termsAgreed: true,
  };

  it('accepts valid registration data', () => {
    const result = registerSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('accepts valid data with optional phone', () => {
    const result = registerSchema.safeParse({ ...validData, phone: '+32 495 12 34 56' });
    expect(result.success).toBe(true);
  });

  it('rejects blank firstName', () => {
    const result = registerSchema.safeParse({ ...validData, firstName: '' });
    expect(result.success).toBe(false);
  });

  it('rejects blank lastName', () => {
    const result = registerSchema.safeParse({ ...validData, lastName: '' });
    expect(result.success).toBe(false);
  });

  it('trims whitespace from firstName and lastName', () => {
    const result = registerSchema.safeParse({
      ...validData,
      firstName: '  John  ',
      lastName: '  Doe  ',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = registerSchema.safeParse({ ...validData, email: 'not-an-email' });
    expect(result.success).toBe(false);
  });

  it('rejects password shorter than 8 characters', () => {
    const result = registerSchema.safeParse({ ...validData, password: 'Ab1', confirmPassword: 'Ab1' });
    expect(result.success).toBe(false);
  });

  it('rejects password without uppercase letter', () => {
    const result = registerSchema.safeParse({ ...validData, password: 'password1', confirmPassword: 'password1' });
    expect(result.success).toBe(false);
  });

  it('rejects password without lowercase letter', () => {
    const result = registerSchema.safeParse({ ...validData, password: 'PASSWORD1', confirmPassword: 'PASSWORD1' });
    expect(result.success).toBe(false);
  });

  it('rejects password without digit', () => {
    const result = registerSchema.safeParse({ ...validData, password: 'Password', confirmPassword: 'Password' });
    expect(result.success).toBe(false);
  });

  it('rejects whitespace-only names after trim', () => {
    const result = registerSchema.safeParse({
      ...validData,
      firstName: '   ',
      lastName: '   ',
    });
    expect(result.success).toBe(false);
  });

  it('rejects mismatched confirmPassword', () => {
    const result = registerSchema.safeParse({ ...validData, confirmPassword: 'Different1' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('confirmPassword');
    }
  });

  it('rejects empty phone', () => {
    const result = registerSchema.safeParse({ ...validData, phone: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('phone');
    }
  });

  it('rejects invalid phone number', () => {
    const result = registerSchema.safeParse({ ...validData, phone: 'not-a-phone' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('phone');
    }
  });

  it('accepts valid Belgian phone number', () => {
    const result = registerSchema.safeParse({ ...validData, phone: '+32 495 12 34 56' });
    expect(result.success).toBe(true);
  });
});
