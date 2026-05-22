import { apiErrorMapper, mapZodErrors } from '../apiErrorMapper';
import { z } from 'zod';

describe('apiErrorMapper', () => {
  it('maps field errors from API response', () => {
    const apiResponse = {
      errors: {
        email: 'Invalid email format',
        password: 'Password is required',
      },
    };

    const result = apiErrorMapper(apiResponse);
    expect(result).toEqual({
      email: 'Invalid email format',
      password: 'Password is required',
    });
  });

  it('returns empty object for response without errors', () => {
    const apiResponse: Record<string, unknown> = { error: 'Something went wrong' };
    const result = apiErrorMapper(apiResponse as any);
    expect(result).toEqual({});
  });

  it('returns empty object for empty errors', () => {
    const apiResponse = { errors: {} };
    const result = apiErrorMapper(apiResponse);
    expect(result).toEqual({});
  });

  it('handles null/undefined errors', () => {
    expect(apiErrorMapper(null)).toEqual({});
    expect(apiErrorMapper(undefined)).toEqual({});
    expect(apiErrorMapper({})).toEqual({});
  });
});

describe('mapZodErrors', () => {
  it('converts Zod formatted errors to field-error map', () => {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(1),
    });
    const result = schema.safeParse({ email: 'bad', password: '' });
    if (!result.success) {
      const mapped = mapZodErrors(result.error);
      expect(mapped.email).toBeDefined();
      expect(mapped.password).toBeDefined();
    }
  });

  it('returns empty object for no errors', () => {
    expect(mapZodErrors(null)).toEqual({});
    expect(mapZodErrors(undefined)).toEqual({});
  });

  it('translates error codes when translate function is provided', () => {
    const schema = z.object({ email: z.string().email({ message: 'validation.email.invalid' }) });
    const result = schema.safeParse({ email: 'bad' });
    if (!result.success) {
      const translate = (key: string) => `TRANSLATED:${key}`;
      const mapped = mapZodErrors(result.error, translate);
      expect(mapped.email).toBe('TRANSLATED:validation.email.invalid');
    }
  });
});
