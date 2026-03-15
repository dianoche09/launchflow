'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Check, ArrowLeft, ArrowRight, Upload, Info, ExternalLink } from 'lucide-react';

const STEPS = [
    { id: 1, label: 'Project Info' },
    { id: 2, label: 'AI Launch Kit' },
    { id: 3, label: 'Choose Package' },
    { id: 4, label: 'Launch' }
];

const PACKAGES = [
    { slug: 'starter', name: 'Starter', price: '$9', credits: 19, platforms: 19, feats: ['Tier 1 launch sites', 'Basic AI kit', 'Dashboard + report'] },
    { slug: 'launch', name: 'Full Launch', price: '$19', credits: 49, platforms: 49, featured: true, feats: ['Tier 1 + 2 platforms', 'AI dirs + SaaS hubs', 'G2 + Capterra guided', 'Full AI kit'] },
    { slug: 'pro', name: 'Launch Pro', price: '$29', credits: 99, platforms: 99, feats: ['All tiers included', 'Reddit copy (5 subs)', 'Deal platforms', 'Priority queue'] }
];

export default function WizardPage() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        url: '',
        tagline: '',
        desc: '',
        category: '',
        pricing: '',
        founder: '',
        twitter: '',
        email: ''
    });
    const [selectedPkg, setSelectedPkg] = useState(PACKAGES[1]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [genProgress, setGenProgress] = useState(0);
    const [isLaunching, setIsLaunching] = useState(false);
    const [launchProgress, setLaunchProgress] = useState(0);

    const handleNext = () => {
        if (step === 1) {
            setStep(2);
            startGenerating();
        } else if (step < 4) {
            setStep(step + 1);
        }
    };

    const startGenerating = () => {
        setIsGenerating(true);
        setGenProgress(0);
        const interval = setInterval(() => {
            setGenProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setIsGenerating(false), 500);
                    return 100;
                }
                return prev + 5;
            });
        }, 150);
    };

    const startLaunch = () => {
        setIsLaunching(true);
        setLaunchProgress(0);
        const interval = setInterval(() => {
            setLaunchProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 2;
            });
        }, 100);
    };

    return (
        <div className="h-screen flex flex-col bg-[var(--paper)] text-[var(--ink)] overflow-hidden">
            {/* TOPBAR */}
            <header className="h-[56px] border-b-2 border-[var(--ink)] flex items-stretch shrink-0 bg-[var(--paper)] z-50">
                <Link href="/dashboard" className="font-display text-[28px] tracking-widest leading-[56px] px-8 border-r-2 border-[var(--ink)] no-underline text-[var(--ink)]">
                    LAUNCHFLOW
                </Link>
                <div className="flex items-center px-6 gap-3 font-mono text-[11px] text-[#888] tracking-widest uppercase">
                    <span className="text-[var(--ink)/30]">Dashboard</span>
                    <span className="text-[var(--paper3)]">/</span>
                    <span className="text-[var(--ink)]">New Launch</span>
                </div>
                <div className="ml-auto flex items-center px-8 border-l-2 border-[var(--ink)] gap-4">
                    <span className="font-display text-[24px] tracking-widest text-[var(--rust)]">32</span>
                    <span className="font-mono text-[10px] text-[#888] uppercase tracking-widest">credits remaining</span>
                </div>
            </header>

            {/* STEP BAR */}
            <div className="flex border-b-2 border-[var(--ink)] bg-[var(--paper2)] shrink-0">
                {STEPS.map((s) => (
                    <div key={s.id} className={`flex-1 h-[44px] flex items-center gap-4 px-8 border-r-2 last:border-r-0 border-[var(--ink)] font-mono text-[10px] tracking-widest uppercase transition-colors ${step === s.id ? 'bg-[var(--paper)] text-[var(--ink)]' : step > s.id ? 'bg-[var(--ink)] text-[var(--acid)]' : 'text-[#aaa]'}`}>
                        <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[9px] ${step >= s.id ? 'border-current' : 'border-[#ccc]'}`}>
                            {step > s.id ? <Check size={10} /> : s.id}
                        </span>
                        {s.label}
                    </div>
                ))}
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* LEFT FORM */}
                <aside className="w-[400px] border-r-2 border-[var(--ink)] overflow-y-auto scrollbar-none bg-[var(--paper)]">
                    <div className="p-8 border-b-2 border-[var(--ink)]">
                        <div className="font-mono text-[10px] tracking-[2px] uppercase text-[#888] mb-8">Project Config</div>
                        <div className="space-y-6">
                            <div>
                                <label className="field-label">Project Name <span>required</span></label>
                                <input type="text" className="field-input" placeholder="ShipStack" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div>
                                <label className="field-label">Website URL <span>required</span></label>
                                <input type="url" className="field-input" placeholder="https://shipstack.io" value={formData.url} onChange={e => setFormData({ ...formData, url: e.target.value })} />
                            </div>
                            <div>
                                <label className="field-label">Tagline <span>max 60 chars</span></label>
                                <input type="text" className="field-input" placeholder="Automate your launch in one click" maxLength={60} value={formData.tagline} onChange={e => setFormData({ ...formData, tagline: e.target.value })} />
                            </div>
                            <div>
                                <label className="field-label">Description <span>required</span></label>
                                <textarea className="field-input min-h-[100px] py-3 resize-none" placeholder="What does your app do?" value={formData.desc} onChange={e => setFormData({ ...formData, desc: e.target.value })} />
                            </div>
                        </div>
                    </div>
                    <div className="p-8 border-b-2 border-[var(--ink)]">
                        <div className="font-mono text-[10px] tracking-[2px] uppercase text-[#888] mb-8">Founder & Category</div>
                        <div className="space-y-6">
                            <select className="field-input" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                <option value="">Select category...</option>
                                <option>SaaS</option>
                                <option>AI Tool</option>
                                <option>Developer Tool</option>
                            </select>
                            <input type="text" className="field-input" placeholder="Founder Name" value={formData.founder} onChange={e => setFormData({ ...formData, founder: e.target.value })} />
                            <input type="text" className="field-input" placeholder="Twitter @handle" value={formData.twitter} onChange={e => setFormData({ ...formData, twitter: e.target.value })} />
                        </div>
                    </div>
                    <div className="p-8">
                        <div className="font-mono text-[10px] tracking-[2px] uppercase text-[#888] mb-6">Assets</div>
                        <div className="border-2 border-dashed border-[var(--paper3)] p-6 text-center group hover:border-[var(--ink)] hover:bg-[var(--paper2)] cursor-pointer transition-all">
                            <Upload className="mx-auto mb-3 text-[#aaa] group-hover:text-[var(--ink)]" size={20} />
                            <div className="font-mono text-[10px] text-[#aaa] group-hover:text-[var(--ink)]">CLICK TO UPLOAD LOGO</div>
                        </div>
                    </div>
                </aside>

                {/* RIGHT PREVIEW / CONTENT */}
                <main className="flex-1 overflow-y-auto bg-[var(--paper2)] scrollbar-thin">
                    {step === 1 && (
                        <div className="p-12 max-w-[900px]">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                <div>
                                    <div className="font-mono text-[10px] tracking-[2px] uppercase text-[#888] mb-6">Distribution Preview</div>
                                    <div className="border-2 border-[var(--ink)] bg-[var(--paper)] p-8">
                                        <h3 className="font-display text-[44px] leading-none mb-1">{formData.name || 'YOUR_PROJECT'}</h3>
                                        <div className="font-mono text-[11px] text-[var(--blue)] mb-6 flex items-center gap-1">
                                            {formData.url || 'domain.com'} <ExternalLink size={10} />
                                        </div>
                                        <p className="font-body text-[15px] text-[#555] leading-relaxed mb-8">
                                            {formData.desc || 'Fill in the project details on the left to see how your submission will appear across 99+ platforms.'}
                                        </p>
                                        <div className="flex gap-2">
                                            <span className="badge badge-blue">{formData.category || 'CATEGORY'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="font-mono text-[10px] tracking-[2px] uppercase text-[#888] mb-6">Initial Queue (Tier 1)</div>
                                    <div className="space-y-2">
                                        {['Product Hunt', 'Uneed', 'DevHunt', 'BetaList', 'Indie Hackers'].map(p => (
                                            <div key={p} className="bg-[var(--paper)] border-2 border-[var(--ink)] border-opacity-5 p-4 flex justify-between items-center">
                                                <span className="font-bold text-[14px]">{p}</span>
                                                <span className="badge badge-auto">Queued</span>
                                            </div>
                                        ))}
                                        <div className="text-center font-mono text-[10px] text-[#aaa] py-4">+ {selectedPkg.platforms - 5} more platforms</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="h-full flex flex-col">
                            {isGenerating ? (
                                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                                    <div className="font-display text-[84px] leading-[0.88] mb-8">WRITING<br />YOUR KIT</div>
                                    <div className="w-[400px] h-[4px] bg-[var(--paper3)] mb-4 overflow-hidden">
                                        <div className="h-full bg-[var(--acid-dark)] transition-all duration-300" style={{ width: `${genProgress}%` }}></div>
                                    </div>
                                    <div className="font-mono text-[11px] text-[var(--rust)] tracking-widest uppercase animate-pulse">
                                        {genProgress < 30 ? 'Analyzing Project Context...' : genProgress < 60 ? 'Generating Platform Hooks...' : 'Finalizing Launch Scripts...'}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1 p-12">
                                    <div className="font-mono text-[11px] tracking-[4px] uppercase text-[var(--rust)] mb-12 flex items-center gap-4">
                                        <span className="w-12 h-0.5 bg-[var(--rust)]"></span> AI Kit Ready
                                    </div>
                                    <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] border-2 border-[var(--ink)] bg-[var(--paper)]">
                                        <div className="border-r-2 border-[var(--ink)] bg-[var(--paper2)]">
                                            {['Product Hunt', 'Reddit', 'Hacker News', 'Twitter'].map((p, i) => (
                                                <button key={p} className={`w-full text-left p-6 font-mono text-[11px] tracking-widest uppercase border-b-2 last:border-b-0 border-[var(--ink)] transition-colors ${i === 0 ? 'bg-[var(--ink)] text-[var(--acid)]' : 'hover:bg-[var(--paper3)]'}`}>
                                                    {p}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="p-10">
                                            <div className="font-mono text-[10px] text-[#888] uppercase mb-6">Generated Pitch & Maker Comment</div>
                                            <textarea className="w-full min-h-[300px] bg-transparent font-body text-[16px] leading-relaxed resize-none outline-none" defaultValue={`Hi Product Hunt! 👋\n\nI built ${formData.name || 'this app'} because I was tired of manual submissions.\n\n${formData.desc || 'It helps you ship faster.'}\n\nBuilt with modern tools. Would love feedback!`} />
                                            <div className="mt-8 flex justify-end">
                                                <button className="btn btn-primary">Copy Copy</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {step === 3 && (
                        <div className="p-12">
                            <div className="font-mono text-[11px] tracking-[4px] uppercase text-[var(--rust)] mb-12 flex items-center gap-4">
                                <span className="w-12 h-0.5 bg-[var(--rust)]"></span> Select Distribution
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-3 bg-[var(--ink)] gap-[2px] border-2 border-[var(--ink)]">
                                {PACKAGES.map((pkg) => (
                                    <div key={pkg.slug} onClick={() => setSelectedPkg(pkg)} className={`pkg cursor-pointer group hover:bg-[var(--paper2)] ${selectedPkg.slug === pkg.slug ? 'featured' : 'bg-[var(--paper)]'}`}>
                                        {pkg.featured && <div className="pkg-popular">Most Popular</div>}
                                        <div className="pkg-tier">{pkg.name}</div>
                                        <div className="pkg-price">{pkg.price}</div>
                                        <div className="pkg-period">{pkg.credits} credits · {pkg.platforms} sites</div>
                                        <div className="pkg-divider"></div>
                                        <div className="pkg-features">
                                            {pkg.feats.map(f => (
                                                <div key={f} className="pkg-feat">
                                                    <span className="pkg-feat-dot"></span> {f}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-10 bg-[var(--paper)] border-2 border-[var(--ink)] p-8 flex items-center justify-between">
                                <div className="font-mono text-[12px] text-[#888]">
                                    Balance: <span className="text-[var(--ink)]">32 credits</span> — Package: <span className="text-[var(--rust)]">{selectedPkg.credits} credits</span>
                                </div>
                                <div className="font-display text-[28px] tracking-widest uppercase">
                                    Remaining: <span className="text-[var(--green)]">{32 - selectedPkg.credits} credits</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="p-12 h-full flex flex-col justify-center items-center">
                            {isLaunching ? (
                                <div className="w-full max-w-[600px]">
                                    <div className="font-display text-[84px] leading-[0.88] mb-12 text-center uppercase tracking-widest">TRANSMITTING...</div>
                                    <div className="space-y-3 mb-12">
                                        {['Preparing submission nodes...', 'Auth handshake for PH...', 'Uploading assets to Uneed...', 'Verifying DevHunt listing...'].map((s, i) => (
                                            <div key={i} className={`font-mono text-[11px] p-4 border-2 border-[var(--ink)] flex justify-between items-center ${launchProgress > (i + 1) * 20 ? 'bg-[var(--acid-dim)] text-[var(--acid-dark)] border-[var(--acid-dark)]' : 'bg-[var(--paper)] opacity-40'}`}>
                                                {s} {launchProgress > (i + 1) * 20 && <Check size={14} />}
                                            </div>
                                        ))}
                                    </div>
                                    <Link href="/dashboard" className="btn btn-big w-full">View Progress in Dashboard</Link>
                                </div>
                            ) : (
                                <div className="w-full max-w-[600px] bg-[var(--paper)] border-2 border-[var(--ink)] p-12 text-center">
                                    <Info size={48} className="mx-auto mb-8 text-[var(--rust)]" />
                                    <h2 className="font-display text-[48px] leading-none mb-8">CONFIRM LAUNCH</h2>
                                    <p className="font-body text-[16px] text-[#666] leading-relaxed mb-12">
                                        You are about to launch <span className="font-bold text-[var(--ink)]">{formData.name || 'YOUR_PROJECT'}</span> to <span className="font-bold text-[var(--ink)]">{selectedPkg.platforms} platforms</span>.
                                        This will deduct <span className="font-bold text-[var(--rust)]">{selectedPkg.credits} credits</span> from your account.
                                    </p>
                                    <button onClick={startLaunch} className="btn btn-big w-full text-[var(--acid)]">TRANSMIT NOW</button>
                                    <div className="mt-6 font-mono text-[10px] text-[#aaa] uppercase tracking-widest">Guided platforms included (Product Hunt, Reddit)</div>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>

            {/* BOTTOM NAV */}
            <footer className="h-[72px] border-t-2 border-[var(--ink)] bg-[var(--paper)] flex items-center justify-between px-8 shrink-0">
                <button className="btn" onClick={() => setStep(prev => Math.max(1, prev - 1))} disabled={step === 1 || isLaunching}>
                    <ArrowLeft size={16} /> BACK
                </button>
                <div className="font-mono text-[11px] text-[#aaa] tracking-widest uppercase">
                    Step {step} of 4 — {STEPS[step - 1].label}
                </div>
                {step < 4 ? (
                    <button className="btn btn-primary" onClick={handleNext} disabled={isGenerating}>
                        {step === 1 ? 'Generate AI Kit' : step === 2 ? 'Choose Package' : 'Review & Launch'} <ArrowRight size={16} />
                    </button>
                ) : (
                    <div className="w-[120px]"></div>
                )}
            </footer>
        </div>
    );
}
