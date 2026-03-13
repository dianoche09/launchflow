'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { SubmissionStatusBadge } from '@/components/dashboard/submission-status-badge'

export default function ProjectDetailPage() {
    const { id } = useParams()
    const router = useRouter()
    const [project, setProject] = useState<any>(null)
    const [submissions, setSubmissions] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [launching, setLaunching] = useState(false)

    const fetchData = async () => {
        // 1. Fetch project logic via generic API
        // 2. Fetch submissions
        const [subRes] = await Promise.all([
            fetch(`/api/submissions/${id}`)
        ])

        // Simplification for the blueprint MVP demonstration, normally you have a GET project API endpoint
        if (subRes.ok) {
            setSubmissions(await subRes.json())
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchData()
    }, [id])

    const handleLaunch = async () => {
        setLaunching(true)
        const res = await fetch(`/api/projects/${id}/launch`, { method: 'POST' })
        if (res.ok) {
            alert('Launch initiated! Bots have queued your project.')
            fetchData()
        } else {
            alert('Launch failed. Please try again.')
        }
        setLaunching(false)
    }

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="mb-6 flex gap-2 text-sm text-gray-500">
                <Link href="/dashboard" className="hover:underline">Dashboard</Link>
                <span>/</span>
                <span>Project Detail</span>
            </div>

            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Project Dashboard</h1>
                    <p className="text-gray-500">Generate copy and queue submissions for your startup.</p>
                </div>
                <button
                    onClick={handleLaunch}
                    disabled={launching}
                    className="bg-black text-white px-6 py-3 rounded-md font-bold disabled:opacity-50 hover:bg-zinc-800 transition"
                >
                    {launching ? 'Queuing launch...' : 'Launch Now 🚀'}
                </button>
            </div>

            <div className="mb-12">
                <h2 className="text-xl font-bold mb-4">Launch Submissions</h2>
                <div className="border rounded-md overflow-hidden bg-white">
                    <table className="w-full text-left bg-white text-sm">
                        <thead className="bg-gray-50 border-b text-gray-700">
                            <tr>
                                <th className="px-6 py-3 font-medium">Platform</th>
                                <th className="px-6 py-3 font-medium">Category</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                                <th className="px-6 py-3 font-medium text-right">Added On</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {submissions.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                        No submissions yet. Click "Launch Now" to start routing to 100+ sites.
                                    </td>
                                </tr>
                            ) : (
                                submissions.map((sub) => (
                                    <tr key={sub.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium">{sub.platform?.name || 'Unknown'}</td>
                                        <td className="px-6 py-4 text-gray-500">{sub.platform?.category}</td>
                                        <td className="px-6 py-4">
                                            <SubmissionStatusBadge status={sub.status} />
                                        </td>
                                        <td className="px-6 py-4 text-right text-gray-500">
                                            {new Date(sub.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
