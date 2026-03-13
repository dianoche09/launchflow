import { createServer } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Rocket, Plus, Activity, CheckCircle, Clock } from 'lucide-react';
import * as motion from 'framer-motion/client';

export default async function DashboardPage() {
    const supabase = createServer();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { data: projects } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    const stats = [
        { label: 'ACTIVE_PROJECTS', value: projects?.length || 0, icon: <Rocket className="w-4 h-4" /> },
        { label: 'TOTAL_SUBMISSIONS', value: 0, icon: <Activity className="w-4 h-4" /> },
        { label: 'STATUS_APPROVED', value: 0, icon: <CheckCircle className="w-4 h-4" /> },
        { label: 'PENDING_DEPLOY', value: 0, icon: <Clock className="w-4 h-4" /> },
    ];

    return (
        <div className="min-h-screen bg-background p-4 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto">
                {/* DASHBOARD HEADER */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b-2 border-primary pb-8">
                    <div>
                        <div className="text-[10px] font-black tracking-[0.3em] text-primary uppercase mb-2">SYSTEM_OVERVIEW</div>
                        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
                            Control <br /><span className="text-primary italic">Terminal</span>
                        </h1>
                    </div>
                    <Link
                        href="/dashboard/new"
                        className="group flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 text-xl font-black uppercase tracking-tighter hover:bg-foreground hover:text-background transition-all"
                    >
                        Create_Project <Plus className="group-hover:rotate-90 transition-transform" />
                    </Link>
                </header>

                {/* STATS GRID */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border border border-border mb-12">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-background p-6">
                            <div className="flex items-center gap-2 text-muted-foreground mb-4">
                                {stat.icon}
                                <span className="text-[10px] font-bold tracking-widest uppercase">{stat.label}</span>
                            </div>
                            <div className="text-4xl font-black font-mono">
                                {stat.value.toString().padStart(2, '0')}
                            </div>
                        </div>
                    ))}
                </div>

                {/* PROJECTS SECTION */}
                <div>
                    <h2 className="text-xs font-black tracking-[0.4em] uppercase mb-6 flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary animate-pulse" />
                        Deployment_Registry
                    </h2>

                    {(!projects || projects.length === 0) ? (
                        <div className="border-2 border-dashed border-border p-24 text-center">
                            <p className="text-muted-foreground uppercase font-bold tracking-widest mb-8">No active deployments found in registry</p>
                            <Link href="/dashboard/new" className="text-primary underline underline-offset-4 font-black uppercase tracking-tighter text-xl">
                                Register First Project _
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
                            {projects.map((project, i) => (
                                <Link key={project.id} href={`/dashboard/${project.id}`} className="group relative bg-background p-8 hover:bg-primary/5 transition-colors">
                                    <div className="flex justify-between items-start mb-12">
                                        <div className="text-[10px] font-mono text-muted-foreground">ID_{project.id.slice(0, 8)}</div>
                                        <div className="px-2 py-0.5 border border-primary text-[10px] font-bold uppercase tracking-widest text-primary">
                                            {project.status.toUpperCase()}
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-black uppercase tracking-tighter mb-2 group-hover:text-primary transition-colors">
                                        {project.name}
                                    </h3>
                                    <div className="text-xs font-mono text-muted-foreground mb-6 truncate">{project.website}</div>
                                    <p className="text-sm text-muted-foreground line-clamp-2 uppercase tracking-tight font-medium opacity-70">
                                        {project.description}
                                    </p>

                                    <div className="mt-8 flex items-center gap-1 text-primary opacity-0 group-hover:opacity-100 transition-opacity font-black text-xs uppercase tracking-widest">
                                        Access_Records <Plus className="w-3 h-3" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
