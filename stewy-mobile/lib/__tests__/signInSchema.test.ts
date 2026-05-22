import { signInSchema } from '../signInSchema';

describe('signInSchema', () => {
  it('accepts valid email and password', () => {
    const result = signInSchema.safeParse({ email: 'test@test.com', password: 'password' });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email format', () => {
    const result = signInSchema.safeParse({ email: 'not-an-email', password: 'password' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('email');
    }
  });

  it('rejects empty email', () => {
    const result = signInSchema.safeParse({ email: '', password: 'password' });
    expect(result.success).toBe(false);
  });

  it('rejects empty password', () => {
    const result = signInSchema.safeParse({ email: 'test@test.com', password: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('password');
    }
  });

  it('rejects whitespace-only email after trim', () => {
    const result = signInSchema.safeParse({ email: '   ', password: 'password' });
    expect(result.success).toBe(false);
  });

  it('trims email before validation', () => {
    const result = signInSchema.safeParse({ email: '  test@test.com  ', password: 'password' });
    expect(result.success).toBe(true);
  });
});
