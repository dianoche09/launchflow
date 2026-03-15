import { createBrowserClient } from '@supabase/ssr'

export const createClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.warn('Supabase credentials missing. Check .env.local');
    // Return a mock or handle gracefully to prevent crash during UI development
    return {
      auth: {
        signInWithOtp: async () => ({ error: { message: 'Supabase URL not configured' } }),
      },
      from: () => ({
        select: () => ({ order: () => ({ data: [], error: null }) }),
        eq: () => ({ single: () => ({ data: null, error: null }) }),
      })
    } as any;
  }

  return createBrowserClient(url, key);
}
