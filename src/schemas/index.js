import { z } from 'zod';

/**
 * Auth schemas — login & register forms
 */
export const loginSchema = z.object({
  email: z.string().email('validation.emailInvalid').min(1, 'validation.required'),
  password: z.string().min(6, 'validation.passwordMin'),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, 'validation.nameMin'),
    email: z.string().email('validation.emailInvalid').min(1, 'validation.required'),
    password: z.string().min(6, 'validation.passwordMin'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'validation.passwordMismatch',
    path: ['confirmPassword'],
  });

export const reviewSchema = z.object({
  text: z.string().min(10, 'validation.reviewMin'),
});

export const contactSchema = z.object({
  name: z.string().min(2, 'validation.nameMin'),
  email: z.string().email('validation.emailInvalid'),
  message: z.string().min(10, 'validation.reviewMin'),
});
