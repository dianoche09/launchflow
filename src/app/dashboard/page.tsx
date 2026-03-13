import { createServer } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardPage() {
    const supabase = createServer()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch projects
    const { data: projects } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-gray-500">Welcome, {user.email}</p>
                </div>
                <Link
                    href="/dashboard/new"
                    className="bg-black text-white px-4 py-2 rounded-md font-medium hover:bg-zinc-800"
                >
                    Create Project
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="border rounded-lg p-6 flex flex-col items-start gap-2 shadow-sm">
                    <span className="text-sm font-medium text-gray-500">Total Projects</span>
                    <span className="text-3xl font-bold">{projects?.length || 0}</span>
                </div>
                <div className="border rounded-lg p-6 flex flex-col items-start gap-2 shadow-sm">
                    <span className="text-sm font-medium text-gray-500">Submissions</span>
                    <span className="text-3xl font-bold">0</span>
                </div>
                <div className="border rounded-lg p-6 flex flex-col items-start gap-2 shadow-sm">
                    <span className="text-sm font-medium text-gray-500">Approved</span>
                    <span className="text-3xl font-bold">0</span>
                </div>
                <div className="border rounded-lg p-6 flex flex-col items-start gap-2 shadow-sm">
                    <span className="text-sm font-medium text-gray-500">Pending</span>
                    <span className="text-3xl font-bold">0</span>
                </div>
            </div>

            <div>
                <h2 className="text-xl font-bold mb-4">Your Projects</h2>
                {(!projects || projects.length === 0) ? (
                    <div className="border rounded-lg p-12 text-center text-gray-500">
                        No projects found. Create one to get started!
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <Link key={project.id} href={`/dashboard/${project.id}`}>
                                <div className="border rounded-lg p-6 shadow-sm hover:border-zinc-400 cursor-pointer h-full transition bg-white block">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="font-semibold text-lg">{project.name}</h3>
                                        <span className="text-xs font-semibold bg-gray-100 px-2 py-1 rounded">
                                            {project.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-2 truncate">{project.website}</p>
                                    <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
