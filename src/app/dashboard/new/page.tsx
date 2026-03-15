'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Rocket, Search, Check, Save, Loader2, PlusSquare } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NewProjectPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        website: '',
        description: '',
        category: 'B2B SaaS'
    });

    const categories = [
        'B2B SaaS', 'AI Tool', 'Developer Tool', 'Consumer App',
        'Community', 'Marketplace', 'E-commerce', 'Crypto/Web3'
    ];

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/projects', {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: { 'Content-Type': 'application/json' }
            });
            if (!res.ok) throw new Error('Ingestion failed');
            router.push('/dashboard');
        } catch (err) {
            alert('Transmission Error: Deployment aborted.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-16 py-12">
            <div className="flex items-center gap-6">
                <Link href="/dashboard" className="w-14 h-14 border-2 border-[var(--ink)] flex items-center justify-center hover:bg-[var(--paper2)] transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <div className="font-mono text-[10px] font-bold tracking-[3px] uppercase text-[#666]">ABORT_SEQUENCE</div>
            </div>

            <div className="flex flex-col lg:grid lg:grid-cols-[1fr_2px_1.5fr] gap-16 items-start">
                <div className="space-y-12 shrink-0">
                    <div>
                        <div className="font-mono text-[11px] font-bold uppercase tracking-[4px] text-[var(--rust)] mb-6 flex items-center gap-3">
                            <PlusSquare className="w-5 h-5" /> PROJECT_INGESTION
                        </div>
                        <h1 className="font-display text-8xl italic uppercase tracking-widest leading-none mb-8">NODE <br /> <span className="text-outline">METADATA.</span></h1>
                        <p className="text-[17px] text-[#555] font-medium leading-relaxed max-w-sm">Supply the core DNA of your startup to enable mass distribution protocols.</p>
                    </div>

                    <div className="space-y-8">
                        {[
                            { n: 1, l: 'CORE IDENTITY', a: step >= 1 },
                            { n: 2, l: 'CATEGORIZATION', a: step >= 2 },
                            { n: 3, l: 'FINAL REVIEW', a: step >= 3 }
                        ].map((s) => (
                            <div key={s.n} className={`flex items-center gap-8 ${s.a ? 'opacity-100' : 'opacity-30'}`}>
                                <div className={`w-12 h-12 flex items-center justify-center font-display text-2xl border-2 uppercase ${s.a ? 'bg-[var(--ink)] text-[var(--acid)] border-[var(--ink)]' : 'bg-transparent text-[#888] border-[#ddd]'}`}>
                                    {step > s.n ? 'OK' : `0${s.n}`}
                                </div>
                                <span className="font-mono text-[11px] font-bold uppercase tracking-widest leading-none text-[var(--ink)]">{s.l}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="hidden lg:block w-[2px] bg-[var(--ink)] self-stretch h-full opacity-10"></div>

                <div className="w-full space-y-12">
                    {step === 1 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
                            <div className="border-b-2 border-[var(--ink)] pb-8 mb-12">
                                <h2 className="font-display text-4xl italic uppercase tracking-widest mb-2">01::CORE IDENTITY</h2>
                                <p className="font-mono text-[10px] text-[#888] tracking-widest uppercase">The primary identifiers of your application node.</p>
                            </div>

                            <div className="space-y-3">
                                <label className="font-mono text-[10px] font-bold text-[var(--ink)] uppercase tracking-widest">
                                    SAAS_NAME
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="ink-input text-2xl font-display tracking-widest"
                                    placeholder="e.g. LAUNCHFLOW"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="font-mono text-[10px] font-bold text-[var(--ink)] uppercase tracking-widest">
                                    PRIMARY_DOMAIN
                                </label>
                                <div className="relative flex items-center">
                                    <span className="absolute left-6 font-mono text-[11px] text-[var(--rust)] font-bold uppercase tracking-widest">HTTPS://</span>
                                    <input
                                        type="url"
                                        value={formData.website}
                                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                        className="ink-input text-xl pl-28"
                                        placeholder="launchflow.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="font-mono text-[10px] font-bold text-[var(--ink)] uppercase tracking-widest">
                                    DESCRIPTION_BRIEF
                                </label>
                                <textarea
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="ink-input text-lg tracking-tight h-40 resize-none"
                                    placeholder="Submit your startup to 100+ platforms in one click."
                                />
                            </div>

                            <button
                                disabled={!formData.name || !formData.website}
                                onClick={() => setStep(2)}
                                className="btn-big w-full mt-8 uppercase"
                            >
                                PROCEED_DATA_MAPPING
                            </button>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
                            <div className="border-b-2 border-[var(--ink)] pb-8 mb-12 flex justify-between items-end">
                                <div>
                                    <h2 className="font-display text-4xl italic uppercase tracking-widest mb-2">02::CATEGORIZATION</h2>
                                    <p className="font-mono text-[10px] text-[#888] tracking-widest uppercase">Define sector for intelligent distribution routing.</p>
                                </div>
                                <button onClick={() => setStep(1)} className="font-mono text-[10px] text-[var(--rust)] font-bold underline mb-1 uppercase tracking-widest">Go Back</button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {categories.map(cat => (
                                    <div
                                        key={cat}
                                        onClick={() => setFormData({ ...formData, category: cat })}
                                        className={`p-6 border-2 transition-all flex items-center justify-between cursor-pointer ${formData.category === cat ? 'bg-[var(--ink)] border-[var(--ink)] text-[var(--acid)]' : 'bg-transparent border-[var(--ink)] text-[var(--ink)] hover:bg-[var(--paper2)]'}`}
                                    >
                                        <span className="font-mono text-[11px] font-bold uppercase tracking-widest">{cat}</span>
                                        <div className={`w-3 h-3 border-2 ${formData.category === cat ? 'bg-[var(--acid)] border-[var(--acid)]' : 'bg-transparent border-[var(--ink)]'}`} />
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="btn-big w-full mt-8 uppercase flex items-center justify-center gap-4 bg-[var(--rust)] border-[var(--rust)] text-[var(--paper)] hover:bg-[var(--ink)] hover:text-[var(--acid)]"
                            >
                                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>COMMENCE_INGESTION <Save className="w-6 h-6" /></>}
                            </button>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
