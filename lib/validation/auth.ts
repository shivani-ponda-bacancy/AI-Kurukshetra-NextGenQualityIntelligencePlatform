import { z } from "zod";

export const roleSchema = z.enum(["admin", "quality_manager", "auditor", "employee"]);

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const signUpSchema = signInSchema.extend({
  fullName: z.string().min(2),
  organizationName: z.string().min(2),
  role: roleSchema,
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });
