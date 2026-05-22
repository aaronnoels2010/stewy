import { z } from 'zod';

export const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: 'validation.email.invalid' })
    .email({ message: 'validation.email.invalid' }),
  password: z
    .string()
    .min(1, { message: 'signIn.validation.required' }),
});

export type SignInFormData = z.infer<typeof signInSchema>;
