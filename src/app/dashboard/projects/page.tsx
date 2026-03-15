import { Plus } from 'lucide-react';
import Link from 'next/link';
import { createServer } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardProjects() {
    const supabase = createServer();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Fetch projects with submission counts
    const { data: projectsData } = await supabase
        .from('projects')
        .select('id, name, website, status, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (!projectsData) return null;

    // Fetch submission counts per project
    const projects = await Promise.all(
        projectsData.map(async (p: any) => {
            const { count } = await supabase
                .from('submissions')
                .select('*', { count: 'exact', head: true })
                .eq('project_id', p.id);

            return {
                ...p,
                submission_count: count ?? 0
            };
        })
    );

    return (
        <div className="pb-12 text-sm">
            <header className="px-8 pt-8 pb-6 flex flex-col md:flex-row items-end justify-between gap-6 mb-6">
                <div>
                    <h1 className="font-display text-[48px] tracking-widest leading-[0.9] uppercase">PROJECTS</h1>
                    <p className="font-mono text-[11px] text-[#888] tracking-widest mt-1.5 uppercase">All your vibe-coded apps in one place.</p>
                </div>
                <Link href="/dashboard/new" className="px-[18px] py-[9px] border-[1.5px] border-[var(--ink)] bg-[var(--ink)] text-[var(--acid)] font-mono text-[11px] tracking-widest hover:bg-[#222] transition-colors flex items-center gap-2 uppercase">
                    <Plus className="w-4 h-4" /> NEW PROJECT
                </Link>
            </header>

            <section className="mx-8 border-2 border-[var(--ink)] bg-[var(--paper)]">
                <div className="border-b-2 border-[var(--ink)] p-[14px] px-5 flex items-center justify-between">
                    <h2 className="font-display text-[22px] tracking-widest uppercase">ALL PROJECTS</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                {['Name', 'URL', 'Status', 'Submissions', 'Created', 'Actions'].map((h) => (
                                    <th key={h} className="font-mono text-[9px] tracking-[1.5px] uppercase text-[#999] p-[10px] px-5 text-left bg-[var(--paper3)] border-b border-[var(--paper3)]">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {projects.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-10 text-center font-mono text-[11px] text-[#888] tracking-widest lowercase">
                                        No projects yet. <Link href="/dashboard/new" className="text-[var(--rust)] hover:underline">Create one →</Link>
                                    </td>
                                </tr>
                            ) : (
                                projects.map((p) => (
                                    <tr key={p.id} className="hover:bg-[var(--paper2)] group transition-colors">
                                        <td className="p-[13px] px-5 border-b border-[var(--paper3)] font-semibold text-[13px] uppercase">{p.name}</td>
                                        <td className="p-[13px] px-5 border-b border-[var(--paper3)] font-mono text-[11px] text-[#888]">{p.website}</td>
                                        <td className="p-[13px] px-5 border-b border-[var(--paper3)]">
                                            <span className={`font-mono text-[9px] tracking-widest uppercase px-2 py-1 border-[1.5px] ${p.status === 'live' ? 'bg-[var(--green-dim)] text-[var(--green)] border-[var(--green)]' : (p.status === 'launching' ? 'bg-[var(--blue-dim)] text-[var(--blue)] border-[var(--blue)]' : 'bg-[var(--paper3)] text-[#888] border-[#ccc]')}`}>
                                                {p.status || 'draft'}
                                            </span>
                                        </td>
                                        <td className="p-[13px] px-5 border-b border-[var(--paper3)] font-mono text-[12px]">
                                            {p.submission_count ?? 0}
                                        </td>
                                        <td className="p-[13px] px-5 border-b border-[var(--paper3)] font-mono text-[11px] text-[#888]">
                                            {new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
                                        </td>
                                        <td className="p-[13px] px-5 border-b border-[var(--paper3)]">
                                            <div className="flex gap-1.5 shadow-[0_0_10px_rgba(0,0,0,0.05)]">
                                                <Link href={`/dashboard/${p.id}`} className="px-2.5 py-1 border-[1.5px] border-[var(--ink)] font-mono text-[10px] tracking-widest hover:bg-[var(--ink)] hover:text-[var(--acid)] transition-all uppercase">Detail</Link>
                                                <Link href={`/dashboard/launch`} className="px-2.5 py-1 border-[1.5px] border-[var(--ink)] font-mono text-[10px] tracking-widest hover:bg-[var(--ink)] hover:text-[var(--acid)] transition-all uppercase">Status</Link>
                                                <Link href={`/dashboard/kit`} className="px-2.5 py-1 border-[1.5px] border-[var(--ink)] font-mono text-[10px] tracking-widest hover:bg-[var(--ink)] hover:text-[var(--acid)] transition-all uppercase">Kit</Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
