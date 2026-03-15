import { z } from 'zod';

export const SignInSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const SignUpSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    firstName: z.string().min(1, 'First name is required').optional(),
    lastName: z.string().min(1, 'Last name is required').optional(),
});

export const MagicLinkSchema = z.object({
    email: z.string().email('Invalid email address'),
});

export const ForgotPasswordSchema = z.object({
    email: z.string().email('Invalid email address'),
});

export type SignInInput = z.infer<typeof SignInSchema>;
export type SignUpInput = z.infer<typeof SignUpSchema>;
export type MagicLinkInput = z.infer<typeof MagicLinkSchema>;
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;
