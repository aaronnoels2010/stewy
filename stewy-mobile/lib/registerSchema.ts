import { z } from 'zod';

export const registerSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, { message: 'register.validation.required' }),
  lastName: z
    .string()
    .trim()
    .min(1, { message: 'register.validation.required' }),
  email: z
    .string()
    .trim()
    .min(1, { message: 'validation.email.invalid' })
    .email({ message: 'validation.email.invalid' }),
  password: z
    .string()
    .min(8, { message: 'validation.password.minLength' })
    .regex(/[A-Z]/, { message: 'validation.password.uppercase' })
    .regex(/[a-z]/, { message: 'validation.password.lowercase' })
    .regex(/[0-9]/, { message: 'validation.password.digit' }),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
