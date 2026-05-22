import { registerSchema } from '../registerSchema';

describe('registerSchema', () => {
  it('accepts valid registration data', () => {
    const result = registerSchema.safeParse({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@test.com',
      password: 'Password1',
    });
    expect(result.success).toBe(true);
  });

  it('rejects blank firstName', () => {
    const result = registerSchema.safeParse({
      firstName: '',
      lastName: 'Doe',
      email: 'john@test.com',
      password: 'Password1',
    });
    expect(result.success).toBe(false);
  });

  it('rejects blank lastName', () => {
    const result = registerSchema.safeParse({
      firstName: 'John',
      lastName: '',
      email: 'john@test.com',
      password: 'Password1',
    });
    expect(result.success).toBe(false);
  });

  it('trims whitespace from firstName and lastName', () => {
    const result = registerSchema.safeParse({
      firstName: '  John  ',
      lastName: '  Doe  ',
      email: 'john@test.com',
      password: 'Password1',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = registerSchema.safeParse({
      firstName: 'John',
      lastName: 'Doe',
      email: 'not-an-email',
      password: 'Password1',
    });
    expect(result.success).toBe(false);
  });

  it('rejects password shorter than 8 characters', () => {
    const result = registerSchema.safeParse({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@test.com',
      password: 'Ab1',
    });
    expect(result.success).toBe(false);
  });

  it('rejects password without uppercase letter', () => {
    const result = registerSchema.safeParse({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@test.com',
      password: 'password1',
    });
    expect(result.success).toBe(false);
  });

  it('rejects password without lowercase letter', () => {
    const result = registerSchema.safeParse({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@test.com',
      password: 'PASSWORD1',
    });
    expect(result.success).toBe(false);
  });

  it('rejects password without digit', () => {
    const result = registerSchema.safeParse({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@test.com',
      password: 'Password',
    });
    expect(result.success).toBe(false);
  });

  it('rejects whitespace-only names after trim', () => {
    const result = registerSchema.safeParse({
      firstName: '   ',
      lastName: '   ',
      email: 'john@test.com',
      password: 'Password1',
    });
    expect(result.success).toBe(false);
  });
});
