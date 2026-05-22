import { type ZodError } from 'zod';

export interface ApiErrorResponse {
  errors?: Record<string, string>;
}

export interface FieldErrors {
  [field: string]: string;
}

export function apiErrorMapper(response: ApiErrorResponse | null | undefined): FieldErrors {
  if (!response || !response.errors) {
    return {};
  }
  return { ...response.errors };
}

export function mapZodErrors(
  error: ZodError | null | undefined,
  translate?: (key: string) => string,
): FieldErrors {
  if (!error) {
    return {};
  }
  const fieldErrors: FieldErrors = {};
  for (const issue of error.issues) {
    const field = issue.path[0]?.toString();
    if (field && !fieldErrors[field]) {
      fieldErrors[field] = translate ? translate(issue.message) : issue.message;
    }
  }
  return fieldErrors;
}
