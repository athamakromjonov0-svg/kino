import { z } from 'zod';

/**
 * Register validation schema
 * Fields: Full Name, Email, Password, Confirm Password
 */
export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Ism kamida 2 ta belgidan iborat bo'lishi kerak")
    .max(50, "Ism 50 ta belgidan oshmasligi kerak"),
  email: z
    .string()
    .min(1, "Email kiritish shart")
    .email("Email formati noto'g'ri (masalan: ali@example.com)"),
  password: z
    .string()
    .min(6, "Parol kamida 6 ta belgidan iborat bo'lishi kerak")
    .max(50, "Parol 50 ta belgidan oshmasligi kerak"),
  confirmPassword: z
    .string()
    .min(1, "Parolni tasdiqlash shart")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Parollar bir-biriga mos kelmadi",
  path: ["confirmPassword"],
});

/**
 * Login validation schema
 * Fields: Email, Password
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email kiritish shart")
    .email("Email formati noto'g'ri (masalan: ali@example.com)"),
  password: z
    .string()
    .min(1, "Parol kiritish shart"),
  rememberMe: z.boolean().optional(),
});
