'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Mail, Lock, User, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { signInWithPassword, signUp, signInWithOtp, forgotPassword } from '@/actions/auth';

type Mode = 'signin' | 'signup' | 'magic' | 'forgot';

export default function LoginPage() {
    const [mode, setMode] = useState<Mode>('magic');
    const [magicSent, setMagicSent] = useState(false);
    const [resetSent, setResetSent] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const router = useRouter();

    const clearError = () => setError('');

    const handleMagicLink = async () => {
        if (!email) return setError('Email is required');
        setLoading(true); clearError();

        const formData = new FormData();
        formData.append('email', email);

        const res = await signInWithOtp(formData);
        setLoading(false);

        if (res?.error) return setError(res.error);
        setMagicSent(true);
    };

    const handleSignIn = async () => {
        if (!email || !password) return setError('Email and password are required');
        setLoading(true); clearError();

        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);

        const res = await signInWithPassword(formData);
        setLoading(false);

        if (res?.error) return setError(res.error);
        // signInWithPassword redirects on success
    };

    const handleSignUp = async () => {
        if (!email || !password) return setError('Email and password are required');
        setLoading(true); clearError();

        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        formData.append('firstName', firstName);
        formData.append('lastName', lastName);

        const res = await signUp(formData);
        setLoading(false);

        if (res?.error) return setError(res.error);
        setMagicSent(true);
    };

    const handleForgotPassword = async () => {
        if (!email) return setError('Email is required');
        setLoading(true); clearError();

        const formData = new FormData();
        formData.append('email', email);

        const res = await forgotPassword(formData);
        setLoading(false);

        if (res?.error) return setError(res.error);
        setResetSent(true);
    };

    const switchMode = (m: Mode) => {
        setMode(m);
        setMagicSent(false);
        setResetSent(false);
        clearError();
    };

    return (
        <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)] font-body flex flex-col selection:bg-[var(--acid)] selection:text-[var(--ink)]">

            {/* NAV */}
            <nav className="border-b-2 border-[var(--ink)] flex items-stretch h-14 bg-[var(--paper)] shrink-0">
                <Link href="/" className="font-display text-[28px] tracking-widest px-8 border-r-2 border-[var(--ink)] flex items-center no-underline text-[var(--ink)] leading-none">
                    LAUNCHFLOW
                </Link>
                <Link href="/" className="flex items-center gap-3 px-6 font-mono text-[12px] text-[#888] no-underline border-r-2 border-[var(--ink)] transition-colors hover:text-[var(--ink)] hover:bg-[var(--paper2)] group">
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    Back
                </Link>
                <div className="ml-auto flex items-center px-6 border-l-2 border-[var(--ink)] font-mono text-[11px] text-[#888] tracking-tight">
                    {mode === 'signup'
                        ? <>Have an account? <button onClick={() => switchMode('magic')} className="text-[var(--rust)] ml-2 hover:underline font-bold">Sign in</button></>
                        : <>No account? <button onClick={() => switchMode('signup')} className="text-[var(--rust)] ml-2 hover:underline font-bold">Sign up free</button></>
                    }
                </div>
            </nav>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_480px_1fr] border-b-2 border-[var(--ink)]">

                {/* LEFT — VALUE PROP */}
                <div className="hidden lg:flex flex-col justify-between p-14 bg-[var(--ink)] text-[var(--paper)] border-r-2 border-[var(--ink)] relative overflow-hidden">
                    <div className="absolute -bottom-8 -left-4 font-display text-[220px] tracking-widest text-white/[0.04] leading-none pointer-events-none select-none">LF</div>
                    <div className="relative z-10">
                        <div className="inline-block bg-[var(--acid)] text-[var(--ink)] font-mono text-[10px] px-3 py-1.5 tracking-widest uppercase mb-10">
                            VIBECODER TOOL
                        </div>
                        <h1 className="font-display text-[clamp(52px,6vw,80px)] tracking-widest leading-[0.9] mb-8">
                            BUILD.<br />SHIP.<br /><span className="text-[var(--acid)]">EVERY-<br />WHERE.</span>
                        </h1>
                        <p className="text-[16px] text-white/50 leading-relaxed max-w-[300px]">
                            One launch. 99+ platforms. AI writes your copy while you keep building.
                        </p>
                    </div>
                    <div className="relative z-10 border-t border-white/10 pt-10">
                        <p className="text-[15px] text-white/60 leading-relaxed italic mb-6">
                            &ldquo;Launched to 60+ platforms in one afternoon. Got my first 200 users without touching a single form.&rdquo;
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="w-9 h-9 rounded-full bg-[var(--acid)] flex items-center justify-center font-display text-[var(--ink)] font-bold text-base">J</div>
                            <div>
                                <div className="font-mono text-[12px] font-bold">JAKE MORRISON</div>
                                <div className="font-mono text-[10px] text-white/30 uppercase tracking-widest">Indie Maker</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CENTER — FORM */}
                <div className="flex flex-col border-r-0 lg:border-r-2 border-[var(--ink)]">
                    <div className="grid grid-cols-3 border-b-2 border-[var(--ink)]">
                        {([['magic', 'MAGIC LINK'], ['signin', 'PASSWORD'], ['signup', 'SIGN UP']] as [Mode, string][]).map(([m, label]) => (
                            <button
                                key={m}
                                onClick={() => switchMode(m)}
                                className={`py-4 font-mono text-[10px] tracking-widest uppercase border-r-2 last:border-r-0 border-[var(--ink)] transition-all ${mode === m ? 'bg-[var(--ink)] text-[var(--acid)]' : 'text-[#888] hover:bg-[var(--paper2)]'}`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    <div className="p-10 lg:p-12 flex-1 flex flex-col">
                        <AnimatePresence mode="wait">

                            {/* MAGIC LINK */}
                            {mode === 'magic' && (
                                <motion.div key="magic" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }} className="flex flex-col flex-1">
                                    {!magicSent ? (
                                        <>
                                            <div className="mb-10">
                                                <h2 className="font-display text-[52px] tracking-widest leading-[0.9] mb-3 italic">MAGIC<br />LINK</h2>
                                                <p className="font-mono text-[11px] text-[#888] uppercase tracking-widest">Enter your email. We send a login link. Done.</p>
                                            </div>
                                            <div className="space-y-6 flex-1">
                                                <div className="space-y-2">
                                                    <label className="font-mono text-[10px] tracking-[2px] uppercase text-[#666] font-bold">EMAIL</label>
                                                    <div className="flex items-center border-2 border-[var(--ink)] bg-[var(--paper)] focus-within:bg-[var(--paper2)] transition-colors">
                                                        <Mail className="w-4 h-4 ml-4 text-[#aaa] shrink-0" />
                                                        <input
                                                            type="email"
                                                            placeholder="you@domain.com"
                                                            value={email}
                                                            onChange={(e) => setEmail(e.target.value)}
                                                            onKeyDown={(e) => e.key === 'Enter' && handleMagicLink()}
                                                            className="flex-1 bg-transparent px-4 py-4 font-mono text-[13px] outline-none placeholder:text-[#ccc]"
                                                        />
                                                    </div>
                                                </div>
                                                {error && <p className="font-mono text-[11px] text-[var(--rust)] border border-[var(--rust)] px-3 py-2">{error}</p>}
                                                <button onClick={handleMagicLink} disabled={loading} className="w-full bg-[var(--ink)] text-[var(--acid)] font-display text-[28px] tracking-widest py-5 border-2 border-[var(--ink)] hover:bg-[#1a1a1a] transition-colors italic disabled:opacity-60 flex items-center justify-center gap-3">
                                                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'SEND LINK →'}
                                                </button>
                                                <p className="font-mono text-[10px] text-[#bbb] text-center uppercase tracking-widest">No password needed. Ever.</p>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center flex-1 text-center">
                                            <div className="w-16 h-16 bg-[var(--acid)] border-2 border-[var(--ink)] flex items-center justify-center mb-8">
                                                <Mail className="w-7 h-7 text-[var(--ink)]" />
                                            </div>
                                            <h2 className="font-display text-[44px] tracking-widest leading-[0.9] mb-4 italic">CHECK<br />YOUR EMAIL.</h2>
                                            <p className="font-mono text-[11px] text-[#888] max-w-[260px] leading-relaxed uppercase tracking-wide mb-8">
                                                Magic link sent to <strong>{email}</strong>. Click it to sign in.
                                            </p>
                                            <button onClick={() => setMagicSent(false)} className="font-mono text-[11px] text-[#888] hover:text-[var(--rust)] uppercase tracking-widest">
                                                ← Try a different email
                                            </button>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* PASSWORD SIGN IN */}
                            {mode === 'signin' && (
                                <motion.div key="signin" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }} className="flex flex-col flex-1">
                                    <div className="mb-10">
                                        <h2 className="font-display text-[52px] tracking-widest leading-[0.9] mb-3 italic">SIGN IN</h2>
                                        <p className="font-mono text-[11px] text-[#888] uppercase tracking-widest">Welcome back. Launch something today.</p>
                                    </div>
                                    <div className="space-y-5 flex-1">
                                        <div className="space-y-2">
                                            <label className="font-mono text-[10px] tracking-[2px] uppercase text-[#666] font-bold">EMAIL</label>
                                            <div className="flex items-center border-2 border-[var(--ink)] bg-[var(--paper)] focus-within:bg-[var(--paper2)] transition-colors">
                                                <Mail className="w-4 h-4 ml-4 text-[#aaa] shrink-0" />
                                                <input type="email" placeholder="you@domain.com" value={email} onChange={(e) => setEmail(e.target.value)} className="flex-1 bg-transparent px-4 py-4 font-mono text-[13px] outline-none placeholder:text-[#ccc]" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="font-mono text-[10px] tracking-[2px] uppercase text-[#666] font-bold">PASSWORD</label>
                                            <div className="flex items-center border-2 border-[var(--ink)] bg-[var(--paper)] focus-within:bg-[var(--paper2)] transition-colors">
                                                <Lock className="w-4 h-4 ml-4 text-[#aaa] shrink-0" />
                                                <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSignIn()} className="flex-1 bg-transparent px-4 py-4 font-mono text-[13px] outline-none" />
                                            </div>
                                        </div>
                                        <div className="flex justify-end">
                                            <button onClick={() => switchMode('forgot')} className="font-mono text-[10px] text-[#888] hover:text-[var(--rust)] uppercase tracking-widest transition-colors">
                                                Forgot password?
                                            </button>
                                        </div>
                                        {error && <p className="font-mono text-[11px] text-[var(--rust)] border border-[var(--rust)] px-3 py-2">{error}</p>}
                                        <button onClick={handleSignIn} disabled={loading} className="w-full bg-[var(--ink)] text-[var(--acid)] font-display text-[28px] tracking-widest py-5 border-2 border-[var(--ink)] hover:bg-[#1a1a1a] transition-colors italic disabled:opacity-60 flex items-center justify-center gap-3">
                                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'SIGN IN →'}
                                        </button>
                                        <div className="flex items-center gap-4">
                                            <div className="flex-1 h-px bg-[var(--paper3)]" />
                                            <span className="font-mono text-[10px] text-[#bbb] uppercase tracking-widest">or use magic link</span>
                                            <div className="flex-1 h-px bg-[var(--paper3)]" />
                                        </div>
                                        <button onClick={() => switchMode('magic')} className="w-full border-2 border-[var(--ink)] py-4 font-mono text-[11px] uppercase tracking-widest hover:bg-[var(--paper2)] transition-colors flex items-center justify-center gap-3">
                                            <Mail className="w-4 h-4" /> Send magic link instead
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* SIGN UP */}
                            {mode === 'signup' && (
                                <motion.div key="signup" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }} className="flex flex-col flex-1">
                                    {!magicSent ? (
                                        <>
                                            <div className="mb-8">
                                                <h2 className="font-display text-[52px] tracking-widest leading-[0.9] mb-3 italic">CREATE<br />ACCOUNT</h2>
                                                <p className="font-mono text-[11px] text-[#888] uppercase tracking-widest">Free to start. No credit card required.</p>
                                            </div>
                                            <div className="space-y-4 flex-1">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <label className="font-mono text-[10px] tracking-[2px] uppercase text-[#666] font-bold">First name</label>
                                                        <div className="flex items-center border-2 border-[var(--ink)] bg-[var(--paper)] focus-within:bg-[var(--paper2)] transition-colors">
                                                            <User className="w-4 h-4 ml-3 text-[#aaa] shrink-0" />
                                                            <input type="text" placeholder="Jake" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="flex-1 bg-transparent px-3 py-3.5 font-mono text-[13px] outline-none placeholder:text-[#ccc]" />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="font-mono text-[10px] tracking-[2px] uppercase text-[#666] font-bold">Last name</label>
                                                        <div className="flex items-center border-2 border-[var(--ink)] bg-[var(--paper)] focus-within:bg-[var(--paper2)] transition-colors">
                                                            <User className="w-4 h-4 ml-3 text-[#aaa] shrink-0" />
                                                            <input type="text" placeholder="Morrison" value={lastName} onChange={(e) => setLastName(e.target.value)} className="flex-1 bg-transparent px-3 py-3.5 font-mono text-[13px] outline-none placeholder:text-[#ccc]" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="font-mono text-[10px] tracking-[2px] uppercase text-[#666] font-bold">Email</label>
                                                    <div className="flex items-center border-2 border-[var(--ink)] bg-[var(--paper)] focus-within:bg-[var(--paper2)] transition-colors">
                                                        <Mail className="w-4 h-4 ml-4 text-[#aaa] shrink-0" />
                                                        <input type="email" placeholder="you@domain.com" value={email} onChange={(e) => setEmail(e.target.value)} className="flex-1 bg-transparent px-4 py-4 font-mono text-[13px] outline-none placeholder:text-[#ccc]" />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="font-mono text-[10px] tracking-[2px] uppercase text-[#666] font-bold">Password</label>
                                                    <div className="flex items-center border-2 border-[var(--ink)] bg-[var(--paper)] focus-within:bg-[var(--paper2)] transition-colors">
                                                        <Lock className="w-4 h-4 ml-4 text-[#aaa] shrink-0" />
                                                        <input type="password" placeholder="min. 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} className="flex-1 bg-transparent px-4 py-4 font-mono text-[13px] outline-none placeholder:text-[#ccc]" />
                                                    </div>
                                                </div>
                                                {error && <p className="font-mono text-[11px] text-[var(--rust)] border border-[var(--rust)] px-3 py-2">{error}</p>}
                                                <button onClick={handleSignUp} disabled={loading} className="w-full bg-[var(--ink)] text-[var(--acid)] font-display text-[28px] tracking-widest py-5 border-2 border-[var(--ink)] hover:bg-[#1a1a1a] transition-colors italic mt-2 disabled:opacity-60 flex items-center justify-center gap-3">
                                                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'CREATE ACCOUNT →'}
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center flex-1 text-center">
                                            <div className="w-16 h-16 bg-[var(--acid)] border-2 border-[var(--ink)] flex items-center justify-center mb-8">
                                                <Mail className="w-7 h-7 text-[var(--ink)]" />
                                            </div>
                                            <h2 className="font-display text-[44px] tracking-widest leading-[0.9] mb-4 italic">CHECK<br />YOUR EMAIL.</h2>
                                            <p className="font-mono text-[11px] text-[#888] max-w-[260px] leading-relaxed uppercase tracking-wide mb-8">
                                                Confirmation sent to <strong>{email}</strong>. Click the link to activate your account.
                                            </p>
                                            <button onClick={() => setMagicSent(false)} className="font-mono text-[11px] text-[#888] hover:text-[var(--rust)] uppercase tracking-widest">← Back</button>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* FORGOT */}
                            {mode === 'forgot' && (
                                <motion.div key="forgot" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }} className="flex flex-col flex-1">
                                    {!resetSent ? (
                                        <>
                                            <div className="mb-10">
                                                <h2 className="font-display text-[52px] tracking-widest leading-[0.9] mb-3 italic">RESET<br />PASSWORD</h2>
                                                <p className="font-mono text-[11px] text-[#888] uppercase tracking-widest">We&apos;ll send a reset link to your email.</p>
                                            </div>
                                            <div className="space-y-5 flex-1">
                                                <div className="space-y-2">
                                                    <label className="font-mono text-[10px] tracking-[2px] uppercase text-[#666] font-bold">EMAIL</label>
                                                    <div className="flex items-center border-2 border-[var(--ink)] bg-[var(--paper)] focus-within:bg-[var(--paper2)] transition-colors">
                                                        <Mail className="w-4 h-4 ml-4 text-[#aaa] shrink-0" />
                                                        <input type="email" placeholder="you@domain.com" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleForgotPassword()} className="flex-1 bg-transparent px-4 py-4 font-mono text-[13px] outline-none placeholder:text-[#ccc]" />
                                                    </div>
                                                </div>
                                                {error && <p className="font-mono text-[11px] text-[var(--rust)] border border-[var(--rust)] px-3 py-2">{error}</p>}
                                                <button onClick={handleForgotPassword} disabled={loading} className="w-full bg-[var(--ink)] text-[var(--acid)] font-display text-[28px] tracking-widest py-5 border-2 border-[var(--ink)] hover:bg-[#1a1a1a] transition-colors italic disabled:opacity-60 flex items-center justify-center gap-3">
                                                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'SEND RESET LINK →'}
                                                </button>
                                                <button onClick={() => switchMode('signin')} className="w-full font-mono text-[11px] text-[#888] hover:text-[var(--rust)] uppercase tracking-widest transition-colors">← Back to sign in</button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center flex-1 text-center">
                                            <div className="w-16 h-16 bg-[var(--acid)] border-2 border-[var(--ink)] flex items-center justify-center mb-8">
                                                <Mail className="w-7 h-7 text-[var(--ink)]" />
                                            </div>
                                            <h2 className="font-display text-[44px] tracking-widest leading-[0.9] mb-4 italic">RESET LINK<br />SENT.</h2>
                                            <p className="font-mono text-[11px] text-[#888] max-w-[260px] leading-relaxed uppercase tracking-wide mb-8">
                                                Check your inbox at <strong>{email}</strong> and follow the link.
                                            </p>
                                            <button onClick={() => switchMode('signin')} className="font-mono text-[11px] text-[#888] hover:text-[var(--rust)] uppercase tracking-widest">← Back to sign in</button>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                        </AnimatePresence>

                        <p className="text-[10px] text-[#bbb] text-center mt-8 font-mono tracking-widest uppercase leading-loose">
                            By continuing you agree to our{' '}
                            <Link href="/legal" className="text-[var(--rust)] hover:underline">Terms</Link>
                            {' & '}
                            <Link href="/legal#privacy" className="text-[var(--rust)] hover:underline">Privacy</Link>.
                        </p>
                    </div>
                </div>

                {/* RIGHT — STATS */}
                <div className="hidden lg:flex flex-col p-14 gap-12 justify-center">
                    {[
                        { n: '99+', label: 'Platforms covered', sub: 'Product Hunt, Uneed, G2, SaaSHub, Reddit & more', color: 'text-[var(--rust)]' },
                        { n: '2min', label: 'Average setup time', sub: 'Fill your project once. Launch everywhere.', color: 'text-[var(--ink)]' },
                        { n: 'FREE', label: 'To start', sub: '3 platforms included. No credit card.', color: 'text-[var(--acid-dark)]' },
                    ].map((s, i) => (
                        <div key={i}>
                            <div className={`font-display text-[56px] tracking-widest leading-[0.9] mb-2 italic ${s.color}`}>{s.n}</div>
                            <div className="font-mono text-[10px] tracking-[2px] uppercase text-[#888] font-bold mb-2">{s.label}</div>
                            <p className="text-[13px] text-[#777] leading-relaxed">{s.sub}</p>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
