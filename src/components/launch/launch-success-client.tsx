'use client';

import Link from 'next/link';
import { Nav } from '@/components/nav';
import { useState, useEffect } from 'react';

interface Project {
    id: string;
    name: string;
}

interface Submission {
    id: string;
    status: string;
    created_at: string;
    result_url: string | null;
    platform: { name: string; category: string; automation_type: string; website: string } | null;
}

const STATUS_COLORS: Record<string, string> = {
    approved: 'bg-[var(--green-dim)] text-[var(--green)] border-[var(--green)]',
    submitted: 'bg-[var(--green-dim)] text-[var(--green)] border-[var(--green)]',
    pending: 'bg-[#fffbe6] text-[#8a6600] border-[#d4b800]',
    manual_pending: 'bg-[#fffbe6] text-[#8a6600] border-[#d4b800]',
    queued: 'bg-[var(--blue-dim)] text-[var(--blue)] border-[var(--blue)]',
    failed: 'bg-[var(--rust-dim)] text-[var(--rust)] border-[var(--rust)]',
    rejected: 'bg-[var(--rust-dim)] text-[var(--rust)] border-[var(--rust)]',
    skipped: 'bg-[var(--paper3)] text-[#888] border-[#ccc]',
};

export function LaunchSuccessClient({
    project,
    initialSubmissions,
}: {
    project: Project;
    initialSubmissions: Submission[];
}) {
    const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions);
    const [guidedCompleted, setGuidedCompleted] = useState<string[]>([]); // Storing submission IDs for guided tasks

    useEffect(() => {
        // Simple polling to update submission statuses periodically
        const interval = setInterval(async () => {
            try {
                const res = await fetch(`/api/submissions/${project.id}`);
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data)) setSubmissions(data);
                }
            } catch (err) {
                console.error('Failed to poll submissions', err);
            }
        }, 10000); // 10 seconds polling

        return () => clearInterval(interval);
    }, [project.id]);

    const statQueued = submissions.filter((s) => s.status === 'queued').length;
    const statApproved = submissions.filter((s) => ['approved', 'submitted'].includes(s.status)).length;

    // Separate Auto vs Guided submissions
    const autoSubs = submissions.filter((s) => s.platform?.automation_type === 'auto');
    const guidedSubs = submissions.filter((s) => s.platform?.automation_type === 'guided');

    const activeAutoSubs = autoSubs.length;
    const activeGuidedSubs = guidedSubs.length;

    const statSubmitted = submissions.filter((s) => s.status === 'pending' || s.status === 'manual_pending').length;

    // Calculate guided pendings: not marked done and status is manual_pending or empty
    const statGuidedPending = guidedSubs.filter((s) => !guidedCompleted.includes(s.id) && s.status !== 'approved').length;

    const handleCopyTweet = () => {
        navigator.clipboard.writeText(`Just launched to ${submissions.length} platforms with @LaunchFlow 🚀\n\nAuto-submitted to directories and communities in one click.\n\nTook 2 minutes. Would've taken hours manually.\n\n#buildinpublic #indiemaker #saas`).catch(() => { });
    };

    const handleShareTwitter = () => {
        const text = encodeURIComponent(`Just launched to ${submissions.length} platforms with @LaunchFlow 🚀\n\nAuto-submitted to directories and communities in one click.\n\nTook 2 minutes. Would've taken hours manually.\n\n#buildinpublic #indiemaker #saas`);
        window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
    };

    const markGuidedComplete = (subId: string) => {
        if (!guidedCompleted.includes(subId)) {
            setGuidedCompleted([...guidedCompleted, subId]);
            // In a real scenario, we might also call an API to update the status to "submitted" or "manual_pending"
        }
    };

    return (
        <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)] flex flex-col">
            <Nav />

            {/* HERO */}
            <section className="grid lg:grid-cols-2 border-b-2 border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]">
                <div className="p-10 lg:p-16 border-r-2 border-[var(--ink)] border-r-white/10">
                    <div className="flex items-center gap-3 font-mono text-[10px] tracking-[2px] uppercase text-[var(--acid)] mb-8 before:content-[''] before:block before:w-6 before:h-[2px] before:bg-[var(--acid)]">
                        Launch started
                    </div>
                    <h1 className="font-display text-[clamp(64px,8vw,104px)] leading-[0.88] mb-8 text-[var(--paper)]">
                        YOU&apos;RE<br /><span className="text-[var(--acid)]">LIVE.</span>
                    </h1>
                    <p className="font-body text-[15px] text-[var(--paper)]/50 leading-relaxed max-w-[380px] mb-10">
                        Submissions are queuing up. Auto platforms are running now. Guided platforms are waiting for you below.
                    </p>
                    <div className="font-mono text-[13px] text-[var(--paper)]/60 px-4 py-3 border border-white/10 inline-block">
                        Launching: <strong className="text-[var(--paper)]">{project.name}</strong> &nbsp;·&nbsp; Full Launch — {submissions.length} platforms
                    </div>
                </div>
                <div className="flex flex-col border-t-2 lg:border-t-0 border-white/10">
                    <div className="flex-1 border-b-2 border-white/10 p-8 lg:p-12 flex flex-col justify-end">
                        <div className="font-display text-[52px] leading-[0.9] tracking-widest text-[var(--acid)] mb-2">{submissions.length}</div>
                        <div className="font-mono text-[9px] tracking-[1.5px] uppercase text-[var(--paper)]/30">Platforms Total</div>
                    </div>
                    <div className="flex-1 border-b-2 border-white/10 p-8 lg:p-12 flex flex-col justify-end">
                        <div className="font-display text-[52px] leading-[0.9] tracking-widest text-[var(--paper)] mb-2">{activeAutoSubs}</div>
                        <div className="font-mono text-[9px] tracking-[1.5px] uppercase text-[var(--paper)]/30">Auto-submitting</div>
                    </div>
                    <div className="flex-1 p-8 lg:p-12 flex flex-col justify-end">
                        <div className="font-display text-[52px] leading-[0.9] tracking-widest text-[var(--paper)] mb-2">{activeGuidedSubs}</div>
                        <div className="font-mono text-[9px] tracking-[1.5px] uppercase text-[var(--paper)]/30">Awaiting your action</div>
                    </div>
                </div>
            </section>

            {/* LIVE STATUS */}
            <section className="border-b-2 border-[var(--ink)]">
                <div className="p-8 lg:px-10 border-b-2 border-[var(--ink)] flex items-center justify-between">
                    <h2 className="font-display text-[32px] tracking-widest">LIVE STATUS</h2>
                    <div className="font-mono text-[11px] text-[#888] tracking-widest uppercase flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)] animate-pulse" />
                        Fetching updates
                    </div>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 bg-[var(--ink)] gap-[2px]">
                    <div className="bg-[var(--paper)] p-6 lg:p-8 flex flex-col justify-end">
                        <div className="font-display text-[44px] leading-[0.9] text-[var(--blue)] mb-2">{statQueued}</div>
                        <div className="font-mono text-[9px] tracking-[1.5px] uppercase text-[#888]">Queued</div>
                    </div>
                    <div className="bg-[var(--paper)] p-6 lg:p-8 flex flex-col justify-end">
                        <div className="font-display text-[44px] leading-[0.9] text-[#8a6600] mb-2">{statSubmitted}</div>
                        <div className="font-mono text-[9px] tracking-[1.5px] uppercase text-[#888]">Submitted</div>
                    </div>
                    <div className="bg-[var(--paper)] p-6 lg:p-8 flex flex-col justify-end">
                        <div className="font-display text-[44px] leading-[0.9] text-[var(--green)] mb-2">{statApproved}</div>
                        <div className="font-mono text-[9px] tracking-[1.5px] uppercase text-[#888]">Approved</div>
                    </div>
                    <div className="bg-[var(--paper)] p-6 lg:p-8 flex flex-col justify-end">
                        <div className="font-display text-[44px] leading-[0.9] text-[var(--rust)] mb-2">{statGuidedPending}</div>
                        <div className="font-mono text-[9px] tracking-[1.5px] uppercase text-[#888]">Guided pending</div>
                    </div>
                </div>
            </section>

            {/* PLATFORM LIST */}
            <section className="border-b-2 border-[var(--ink)]">
                <div className="p-6 lg:px-8 border-b-2 border-[var(--ink)] flex items-center justify-between">
                    <h2 className="font-display text-2xl tracking-widest">SUBMISSION LOG</h2>
                    <Link href="/dashboard/launch" className="font-mono text-[11px] text-[#888] hover:text-[var(--ink)] uppercase tracking-widest">
                        View full tracking →
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[var(--paper3)]">
                                <th className="font-mono text-[9px] tracking-[1.5px] uppercase text-[#999] p-3 px-5 border-b border-r border-[var(--paper3)]">Platform</th>
                                <th className="font-mono text-[9px] tracking-[1.5px] uppercase text-[#999] p-3 px-5 border-b border-r border-[var(--paper3)] hidden md:table-cell">Category</th>
                                <th className="font-mono text-[9px] tracking-[1.5px] uppercase text-[#999] p-3 px-5 border-b border-r border-[var(--paper3)] hidden md:table-cell">Method</th>
                                <th className="font-mono text-[9px] tracking-[1.5px] uppercase text-[#999] p-3 px-5 border-b border-r border-[var(--paper3)]">Status</th>
                                <th className="font-mono text-[9px] tracking-[1.5px] uppercase text-[#999] p-3 px-5 border-b border-[var(--paper3)]">Result</th>
                            </tr>
                        </thead>
                        <tbody>
                            {submissions.map((s, i) => {
                                const pName = s.platform?.name ?? '—';
                                const pCat = s.platform?.category ?? '—';
                                const pMethod = s.platform?.automation_type ?? 'auto';
                                return (
                                    <tr key={s.id} className="hover:bg-[var(--paper2)] transition-colors border-b border-[var(--paper2)] last:border-b-0">
                                        <td className="p-4 px-5 font-bold text-[13px] border-r border-[var(--paper2)]">{pName}</td>
                                        <td className="p-4 px-5 font-mono text-[10px] text-[#888] border-r border-[var(--paper2)] hidden md:table-cell uppercase">{pCat}</td>
                                        <td className="p-4 px-5 font-mono text-[9px] text-[#aaa] uppercase tracking-widest border-r border-[var(--paper2)] hidden md:table-cell">{pMethod}</td>
                                        <td className="p-4 px-5 border-r border-[var(--paper2)]">
                                            <span className={`font-mono text-[9px] tracking-widest uppercase px-2 py-1 border-[1.5px] ${STATUS_COLORS[s.status] ?? STATUS_COLORS.skipped}`}>
                                                {pMethod === 'guided' && s.status === 'queued' ? 'Your action' : s.status}
                                            </span>
                                        </td>
                                        <td className="p-4 px-5 font-mono text-[10px]">
                                            {s.result_url ? (
                                                <a href={s.result_url} target="_blank" rel="noreferrer" className="text-[var(--blue)] hover:underline">
                                                    VIEW →
                                                </a>
                                            ) : (
                                                <span className="text-[#aaa]">—</span>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* GUIDED TASKS */}
            {guidedSubs.length > 0 && (
                <section className="border-b-2 border-[var(--ink)]">
                    <div className="p-6 lg:px-8 border-b-2 border-[var(--ink)] flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h2 className="font-display text-2xl tracking-widest">YOUR ACTION REQUIRED</h2>
                        <p className="font-mono text-[11px] text-[#888]">These platforms require human submission. Just follow the steps.</p>
                    </div>
                    <div className="flex flex-col">
                        {guidedSubs.map((s, i) => {
                            const isDone = guidedCompleted.includes(s.id) || s.status === 'manual_pending' || s.status === 'approved';
                            const pName = s.platform?.name ?? 'Platform';
                            const pUrl = s.platform?.website ?? '';
                            return (
                                <div key={s.id} className="p-8 lg:px-10 border-b-2 border-[var(--ink)] last:border-b-0 grid grid-cols-[auto_1fr] md:grid-cols-[auto_1fr_auto] gap-6 lg:gap-10 hover:bg-[var(--paper2)] transition-colors items-start">
                                    <div className="font-display text-[32px] text-[var(--paper3)] leading-none pt-1">{(i + 1).toString().padStart(2, '0')}</div>
                                    <div>
                                        <h3 className="font-bold text-base mb-2">{pName}</h3>
                                        <div className="font-body text-[13px] text-[#666] leading-relaxed mb-4 whitespace-pre-wrap">
                                            We have prepared your pitch. Copy your kit from the dashboard and submit manually.
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <div className="font-mono text-[11px] text-[#888] flex items-center gap-2">
                                                <span className="w-1 h-1 rounded-full bg-[#ccc] shrink-0" />
                                                Go to <a href={pUrl?.startsWith('http') ? pUrl : `https://${pUrl}`} target="_blank" rel="noreferrer" className="text-[var(--blue)] hover:underline ml-1">{pName}</a>
                                            </div>
                                            <div className="font-mono text-[11px] text-[#888] flex items-center gap-2">
                                                <span className="w-1 h-1 rounded-full bg-[#ccc] shrink-0" />
                                                Submit your product using your AI Kit details
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => markGuidedComplete(s.id)}
                                        className={`px-6 py-3 border-[1.5px] border-[var(--ink)] font-mono text-[11px] tracking-widest uppercase transition-all col-span-2 md:col-span-1 ${isDone ? 'bg-[var(--green)] text-white border-[var(--green)] hover:bg-[var(--green)]' : 'bg-[var(--ink)] text-[var(--acid)] hover:bg-[#222]'}`}
                                    >
                                        {isDone ? '✓ DONE' : 'MARK AS DONE'}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* SHARE SECTION */}
            <section className="p-10 lg:p-16 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                <div>
                    <h2 className="font-display text-[44px] leading-[0.9] tracking-widest mb-4">SHARE YOUR LAUNCH</h2>
                    <p className="text-[15px] text-[#666] mb-8 max-w-sm">Tell the world. Your build-in-public audience is waiting.</p>
                    <div className="flex flex-wrap gap-4">
                        <button onClick={handleShareTwitter} className="px-6 py-3 border-[1.5px] border-[var(--ink)] bg-[var(--ink)] text-[var(--acid)] font-mono text-[11px] tracking-widest hover:bg-[#222] transition-all uppercase">SHARE ON TWITTER →</button>
                        <Link href="/dashboard" className="px-6 py-3 border-[1.5px] border-[var(--ink)] text-[var(--ink)] font-mono text-[11px] tracking-widest hover:bg-[var(--paper2)] transition-all uppercase">VIEW DASHBOARD</Link>
                    </div>
                </div>
                <div>
                    <div className="bg-[var(--paper2)] border-2 border-[var(--ink)] p-6">
                        <div className="font-mono text-[10px] uppercase tracking-[1.5px] text-[#888] mb-4">Ready-to-post tweet</div>
                        <div className="text-[14px] leading-[1.7] text-[#444] mb-6">
                            Just launched to {submissions.length} platforms with @LaunchFlow 🚀<br /><br />
                            Auto-submitted to directories and communities in one click.<br /><br />
                            Took 2 minutes. Would've taken hours manually.<br /><br />
                            #buildinpublic #indiemaker #saas
                        </div>
                        <button onClick={handleCopyTweet} className="px-6 py-2 border-[1.5px] border-[var(--ink)] bg-transparent text-[var(--ink)] font-mono text-[11px] tracking-widest hover:bg-[var(--ink)] hover:text-[var(--acid)] transition-all uppercase">COPY TWEET</button>
                    </div>
                </div>
            </section>
        </div>
    );
}
