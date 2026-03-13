'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Rocket, Plus, Terminal } from 'lucide-react';
import Link from 'next/link';

export default function NewProjectPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        website: '',
        tagline: '',
        description: '',
        category: '',
        pricing_model: '',
        founder_name: '',
        twitter: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const res = await fetch('/api/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        if (res.ok) {
            router.push('/dashboard');
        } else {
            alert('Failed to register project in terminal.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background p-4 md:p-8 font-sans">
            <div className="max-w-4xl mx-auto">
                {/* TOP NAV BREADCRUMB */}
                <div className="mb-12 flex items-center gap-4 text-[10px] font-black tracking-[0.3em] text-muted-foreground uppercase">
                    <Link href="/dashboard" className="hover:text-primary flex items-center gap-1 transition-colors">
                        <ArrowLeft className="w-3 h-3" /> CONTROL_TERMINAL
                    </Link>
                    <span>/</span>
                    <span className="text-foreground">NEW_REGISTRATION_SEQ</span>
                </div>

                <header className="mb-16 pb-8 border-b-2 border-primary">
                    <div className="text-[10px] font-black tracking-[0.3em] text-primary uppercase mb-2 italic">PHASE_01_INITIALIZATION</div>
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-6">
                        Register <br /><span className="text-primary italic">Deployment</span>
                    </h1>
                    <p className="text-xl text-muted-foreground font-medium uppercase tracking-tight max-w-xl border-l-2 border-primary pl-6">
                        Input the core metadata for your startup node. This information will be used by AI logic to formulate unique launch assets.
                    </p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-12">
                    {/* CORE IDENTITY */}
                    <section>
                        <div className="flex items-center gap-2 mb-8 text-xs font-black tracking-widest uppercase text-muted-foreground">
                            <Terminal className="w-4 h-4 text-primary" /> CORE_IDENTITY
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest">Project_Name *</label>
                                <input
                                    required
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-background border-2 border-border p-4 text-xl font-black uppercase tracking-tighter focus:border-primary outline-none transition-colors placeholder:text-muted/30"
                                    placeholder="LAUNCHFLOW"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest">Website_URL *</label>
                                <input
                                    required
                                    name="website"
                                    type="url"
                                    value={formData.website}
                                    onChange={handleChange}
                                    className="w-full bg-background border-2 border-border p-4 text-xl font-black uppercase tracking-tighter focus:border-primary outline-none transition-colors placeholder:text-muted/30 font-mono"
                                    placeholder="HTTPS://LAUNCHFLOW.AI"
                                />
                            </div>
                        </div>
                    </section>

                    {/* PROJECT DESCRIPTION */}
                    <section>
                        <div className="flex items-center gap-2 mb-8 text-xs font-black tracking-widest uppercase text-muted-foreground">
                            <Terminal className="w-4 h-4 text-primary" /> CONTENT_STRATEGY
                        </div>
                        <div className="space-y-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest">One_Line_Tagline</label>
                                <input
                                    name="tagline"
                                    value={formData.tagline}
                                    onChange={handleChange}
                                    className="w-full bg-background border-2 border-border p-4 text-xl font-black uppercase tracking-tighter focus:border-primary outline-none transition-colors placeholder:text-muted/30"
                                    placeholder="ENGINEERED FOR ABSOLUTE DISTRIBUTION."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest">Deep_Description</label>
                                <textarea
                                    name="description"
                                    rows={4}
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full bg-background border-2 border-border p-4 text-xl font-black uppercase tracking-tighter focus:border-primary outline-none transition-colors placeholder:text-muted/30 resize-none"
                                    placeholder="SUBMIT TO 100+ DIRECTORIES IN A SINGLE DEPLOYMENT CYCLE..."
                                />
                            </div>
                        </div>
                    </section>

                    {/* CLASSIFICATION */}
                    <section>
                        <div className="flex items-center gap-2 mb-8 text-xs font-black tracking-widest uppercase text-muted-foreground">
                            <Terminal className="w-4 h-4 text-primary" /> CLASSIFICATION_NODES
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest">Category_Tag</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full bg-background border-2 border-border p-4 text-lg font-black uppercase tracking-tighter focus:border-primary outline-none transition-colors appearance-none cursor-pointer"
                                >
                                    <option value="">SELECT_CATEGORY</option>
                                    <option value="saas">SAAS_PLATFORM</option>
                                    <option value="ai">AI_ENGINE</option>
                                    <option value="devtool">DEVELOPER_TOOL</option>
                                    <option value="productivity">PRODUCTIVITY_PROTOCOL</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest">Pricing_Model</label>
                                <select
                                    name="pricing_model"
                                    value={formData.pricing_model}
                                    onChange={handleChange}
                                    className="w-full bg-background border-2 border-border p-4 text-lg font-black uppercase tracking-tighter focus:border-primary outline-none transition-colors appearance-none cursor-pointer"
                                >
                                    <option value="">SELECT_PRICING</option>
                                    <option value="free">OPEN_SOURCE</option>
                                    <option value="freemium">FREEMIUM_TIER</option>
                                    <option value="paid">LICENSED_ACCESS</option>
                                    <option value="one-time">ONE_TIME_PURCHASE</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* FORM ACTIONS */}
                    <div className="pt-12 flex flex-col md:flex-row gap-4 justify-end border-t border-border">
                        <Link
                            href="/dashboard"
                            className="px-8 py-4 text-sm font-black uppercase tracking-widest hover:text-primary transition-colors text-center"
                        >
                            Abort_Registration
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-primary text-primary-foreground px-12 py-6 text-2xl font-black uppercase tracking-tighter hover:bg-foreground hover:text-background transition-all flex items-center justify-center gap-4 shadow-[8px_8px_0px_0px_rgba(191,255,0,0.2)]"
                        >
                            {loading ? 'Initializing...' : 'Commit_Registration'} <Plus />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
