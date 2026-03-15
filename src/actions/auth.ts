'use server';

import { createServer } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { SignInSchema, SignUpSchema, MagicLinkSchema, ForgotPasswordSchema } from '@/types/auth';

export async function signInWithPassword(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const validated = SignInSchema.safeParse({ email, password });
    if (!validated.success) {
        return { error: validated.error.errors[0].message };
    }

    const supabase = createServer();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        return { error: error.message };
    }

    revalidatePath('/', 'layout');
    redirect('/dashboard');
}

export async function signUp(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;

    const validated = SignUpSchema.safeParse({ email, password, firstName, lastName });
    if (!validated.success) {
        return { error: validated.error.errors[0].message };
    }

    const supabase = createServer();
    const fullName = `${firstName ?? ''} ${lastName ?? ''}`.trim() || email.split('@')[0];

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { full_name: fullName },
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
        },
    });

    if (error) {
        return { error: error.message };
    }

    return { success: true, message: 'Check your email to confirm your account.' };
}

export async function signInWithOtp(formData: FormData) {
    const email = formData.get('email') as string;

    const validated = MagicLinkSchema.safeParse({ email });
    if (!validated.success) {
        return { error: validated.error.errors[0].message };
    }

    const supabase = createServer();
    const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
        },
    });

    if (error) {
        return { error: error.message };
    }

    return { success: true, message: 'Magic link sent. Check your email.' };
}

export async function forgotPassword(formData: FormData) {
    const email = formData.get('email') as string;

    const validated = ForgotPasswordSchema.safeParse({ email });
    if (!validated.success) {
        return { error: validated.error.errors[0].message };
    }

    const supabase = createServer();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/settings`,
    });

    if (error) {
        return { error: error.message };
    }

    return { success: true, message: 'Reset link sent. Check your email.' };
}

export async function signOut() {
    const supabase = createServer();
    await supabase.auth.signOut();
    revalidatePath('/', 'layout');
    redirect('/login');
}
