'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { SubmissionStatusBadge } from '@/components/dashboard/submission-status-badge';
import { ArrowLeft, Rocket, ExternalLink, Activity, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProjectDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [project, setProject] = useState<any>(null);
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [launching, setLaunching] = useState(false);

    const fetchData = async () => {
        try {
            const subRes = await fetch(`/api/submissions/${id}`);
            if (subRes.ok) {
                setSubmissions(await subRes.json());
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleLaunch = async () => {
        setLaunching(true);
        const res = await fetch(`/api/projects/${id}/launch`, { method: 'POST' });
        if (res.ok) {
            alert('LAUNCH_INITIALIZED // BOTS_QUEUED_FOR_DEPLOYMENT');
            fetchData();
        } else {
            alert('DEPLOYMENT_ERROR // CHECK_TERMINAL');
        }
        setLaunching(false);
    };

    return (
        <div className="min-h-screen bg-background p-4 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto">
                {/* TOP NAV BREADCRUMB */}
                <div className="mb-12 flex items-center gap-4 text-[10px] font-black tracking-[0.3em] text-muted-foreground uppercase">
                    <Link href="/dashboard" className="hover:text-primary flex items-center gap-1 transition-colors">
                        <ArrowLeft className="w-3 h-3" /> CONTROL_TERMINAL
                    </Link>
                    <span>/</span>
                    <span className="text-foreground">REGISTRY_ID_{id.toString().slice(0, 8)}</span>
                </div>

                {/* PROJECT HEADER */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 mb-16 pb-8 border-b-2 border-border">
                    <div className="md:w-[70%]">
                        <div className="bg-primary text-primary-foreground text-[10px] font-black tracking-[0.3em] uppercase w-fit px-2 mb-4">
                            DEPLOYMENT_TARGET
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-6">
                            Launch <br /><span className="text-primary italic">Protocol</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground font-medium uppercase tracking-tight max-w-2xl border-l-2 border-primary pl-6">
                            Monitor real-time submission status across the global directory network and community clusters.
                        </p>
                    </div>

                    <div className="md:w-[30%] flex flex-col gap-4 w-full">
                        <button
                            onClick={handleLaunch}
                            disabled={launching}
                            className="w-full bg-primary text-primary-foreground py-6 text-2xl font-black uppercase tracking-tighter hover:bg-foreground hover:text-background transition-all flex items-center justify-center gap-4 shadow-[8px_8px_0px_0px_rgba(191,255,0,0.2)]"
                        >
                            {launching ? 'Deploying...' : 'Initiate_Launch'} <Rocket className={launching ? 'animate-bounce' : ''} />
                        </button>
                        <div className="p-4 bg-muted border border-border">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">ENGINE_STATUS</span>
                                <span className="flex items-center gap-1 text-[10px] font-black text-primary uppercase">
                                    <Activity className="w-3 h-3" /> Operational
                                </span>
                            </div>
                            <div className="h-1 bg-border w-full">
                                <div className="h-1 bg-primary w-full animate-pulse" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* SUBMISSIONS TABLE SECTION */}
                <div>
                    <h2 className="text-xs font-black tracking-[0.4em] uppercase mb-8 flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-primary" />
                        LIVE_SUBMISSION_RECORDS
                    </h2>

                    <div className="border border-border bg-background">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b-2 border-border bg-muted/50">
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Platform_Node</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Category</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Deployment_Status</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Result_Link</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {submissions.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-16 text-center">
                                                <p className="text-muted-foreground uppercase font-black tracking-widest text-sm opacity-50 italic">
                                                    waiting for launch initiation...
                                                </p>
                                            </td>
                                        </tr>
                                    ) : (
                                        submissions.map((sub, i) => (
                                            <motion.tr
                                                key={sub.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.05 }}
                                                className="hover:bg-primary/5 transition-colors group"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="font-black uppercase tracking-tighter text-lg group-hover:text-primary transition-colors">
                                                        {sub.platform?.name || 'NODE_UNKNOWN'}
                                                    </div>
                                                    <div className="text-[10px] font-mono text-muted-foreground truncate max-w-[200px]">
                                                        {sub.platform?.website}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-xs font-mono uppercase tracking-widest bg-muted px-2 py-0.5">
                                                        {sub.platform?.category}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <SubmissionStatusBadge status={sub.status} />
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    {sub.result_url ? (
                                                        <a
                                                            href={sub.result_url}
                                                            target="_blank"
                                                            className="inline-flex items-center gap-1 text-primary hover:underline font-black text-xs uppercase tracking-tighter"
                                                        >
                                                            Verification <ExternalLink className="w-3 h-3" />
                                                        </a>
                                                    ) : (
                                                        <span className="text-[10px] font-black opacity-20 uppercase tracking-widest">N/A</span>
                                                    )}
                                                </td>
                                            </motion.tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
