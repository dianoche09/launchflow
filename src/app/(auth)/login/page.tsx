'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Rocket, Terminal, Shield, Lock } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            alert(error.message);
            setLoading(false);
        } else {
            router.push('/dashboard');
        }
    };

    const handleSignUp = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) {
            alert(error.message);
            setLoading(false);
        } else {
            alert('Signup successful! Access granted to terminal.');
            router.push('/dashboard');
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 font-sans overflow-hidden relative">
            {/* DECORATIVE BRUTALIST ELEMENT */}
            <div className="absolute top-0 left-0 w-full h-1 bg-primary animate-pulse" />
            <div className="absolute bottom-0 right-0 p-12 opacity-5 pointer-events-none">
                <Rocket className="w-96 h-96 text-primary rotate-12" />
            </div>

            <div className="w-full max-w-lg">
                <div className="border-4 border-foreground bg-background p-8 md:p-12 relative shadow-[16px_16px_0px_0px_rgba(191,255,0,1)]">
                    <div className="absolute -top-6 left-8 bg-primary text-primary-foreground px-4 py-1 text-xs font-black uppercase tracking-[0.3em]">
                        SECURE_ACCESS_GATE
                    </div>

                    <div className="mb-12">
                        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-4">
                            Access <br /><span className="text-primary italic">Terminal</span>
                        </h2>
                        <p className="text-xs font-black tracking-widest text-muted-foreground uppercase flex items-center gap-2">
                            <Shield className="w-3 h-3 text-primary" /> Authorization Required for Deployment
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-1">
                                <Terminal className="w-3 h-3" /> USER_IDENTIFIER
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-background border-2 border-border p-4 text-xl font-black uppercase tracking-tighter focus:border-primary outline-none transition-colors"
                                placeholder="EMAIL_ADDRESS"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-1">
                                <Lock className="w-3 h-3" /> ACCESS_CREDENTIAL
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-background border-2 border-border p-4 text-xl font-black uppercase tracking-tighter focus:border-primary outline-none transition-colors font-mono"
                                placeholder="********"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-foreground text-background py-6 text-2xl font-black uppercase tracking-tighter hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center gap-4"
                            >
                                {loading ? 'Verifying...' : 'Authenticate'} <Rocket className="w-6 h-6" />
                            </button>
                            <button
                                type="button"
                                onClick={handleSignUp}
                                disabled={loading}
                                className="w-full text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-colors text-center py-2"
                            >
                                No registry found? Initialize_Account _
                            </button>
                        </div>
                    </form>

                    {/* SYSTEM INFO FOOTER */}
                    <div className="mt-12 pt-8 border-t border-border flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-muted-foreground/50">
                        <span>v1.0.4_STABLE</span>
                        <span>0x7F_ENCRYPTION_ACTIVE</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
