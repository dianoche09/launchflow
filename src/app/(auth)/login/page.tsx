'use client';
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
            alert(error.message)
            setLoading(false)
        } else {
            router.push('/dashboard')
        }
    }

    const handleSignUp = async () => {
        setLoading(true)
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) {
            alert(error.message)
            setLoading(false)
        } else {
            alert('Signup successful! Start using LaunchFlow.')
            router.push('/dashboard')
        }
    }

    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-50/50">
            <div className="w-full max-w-sm rounded-lg border bg-white p-6 shadow-sm">
                <h2 className="mb-6 text-center text-2xl font-bold">Login to LaunchFlow</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="mb-2 block text-sm font-medium">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-md border px-3 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-md border px-3 py-2"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2 pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-md bg-black px-4 py-2 text-white hover:bg-zinc-800 disabled:opacity-50"
                        >
                            Sign In
                        </button>
                        <button
                            type="button"
                            onClick={handleSignUp}
                            disabled={loading}
                            className="w-full tracking-wide text-sm underline text-center"
                        >
                            Don't have an account? Sign Up
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
