import { z } from "zod";
import { phoneNormalizer } from "./phoneNormalizer";

export const registerSchema = z
  .object({
    address: z
      .string()
      .trim()
      .min(1, { message: "register.validation.required" }),
    firstName: z
      .string()
      .trim()
      .min(1, { message: "register.validation.required" }),
    lastName: z
      .string()
      .trim()
      .min(1, { message: "register.validation.required" }),
    email: z
      .string()
      .trim()
      .min(1, { message: "validation.email.invalid" })
      .regex(/[@]/, { message: "validation.email.invalid" }),
    phone: z.string().min(1, { message: "register.validation.required" }),
    password: z
      .string()
      .min(8, { message: "validation.password.minLength" })
      .regex(/[A-Z]/, { message: "validation.password.uppercase" })
      .regex(/[a-z]/, { message: "validation.password.lowercase" })
      .regex(/[0-9]/, { message: "validation.password.digit" }),
    confirmPassword: z.string(),
    termsAgreed: z.literal(true, { message: "register.validation.terms" }),
  })
  .refine(
    (data) => {
      return data.password === data.confirmPassword;
    },
    {
      message: "register.validation.confirmPassword",
      path: ["confirmPassword"],
    },
  )
  .refine(
    (data) => {
      return phoneNormalizer(data.phone) !== null;
    },
    {
      message: "validation.phone.invalid",
      path: ["phone"],
    },
  );

export type RegisterFormData = z.infer<typeof registerSchema>;
