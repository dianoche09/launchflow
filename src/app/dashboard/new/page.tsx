'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewProjectPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        website: '',
        tagline: '',
        description: '',
        category: '',
        pricing_model: '',
        founder_name: '',
        twitter: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const res = await fetch('/api/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        })

        if (res.ok) {
            router.push('/dashboard')
        } else {
            alert('Failed to create project')
            setLoading(false)
        }
    }

    return (
        <div className="p-8 max-w-3xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Add New Project</h1>
                <p className="text-gray-500 mt-2">Enter your startup details to prepare for launch.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Project Name *</label>
                        <input required name="name" value={formData.name} onChange={handleChange} className="w-full border rounded-md px-3 py-2" placeholder="LaunchFlow" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Website URL *</label>
                        <input required name="website" type="url" value={formData.website} onChange={handleChange} className="w-full border rounded-md px-3 py-2" placeholder="https://launchflow.ai" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Tagline</label>
                    <input name="tagline" value={formData.tagline} onChange={handleChange} className="w-full border rounded-md px-3 py-2" placeholder="Build once. Launch everywhere." />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea name="description" rows={4} value={formData.description} onChange={handleChange} className="w-full border rounded-md px-3 py-2" placeholder="A single platform that submits your startup to 100+ launch sites automatically." />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Category</label>
                        <select name="category" value={formData.category} onChange={handleChange} className="w-full border rounded-md px-3 py-2 bg-white">
                            <option value="">Select Category</option>
                            <option value="saas">SaaS</option>
                            <option value="ai">AI</option>
                            <option value="devtool">Developer Tool</option>
                            <option value="productivity">Productivity</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Pricing Model</label>
                        <select name="pricing_model" value={formData.pricing_model} onChange={handleChange} className="w-full border rounded-md px-3 py-2 bg-white">
                            <option value="">Select Pricing</option>
                            <option value="free">Free</option>
                            <option value="freemium">Freemium</option>
                            <option value="paid">Paid</option>
                            <option value="one-time">One-time Payment</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Founder Name</label>
                        <input name="founder_name" value={formData.founder_name} onChange={handleChange} className="w-full border rounded-md px-3 py-2" placeholder="John Doe" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Twitter Handle</label>
                        <input name="twitter" value={formData.twitter} onChange={handleChange} className="w-full border rounded-md px-3 py-2" placeholder="@launchflow" />
                    </div>
                </div>

                <div className="pt-4 flex justify-end gap-4">
                    <button type="button" onClick={() => router.back()} className="px-4 py-2 hover:bg-gray-100 rounded-md">Cancel</button>
                    <button type="submit" disabled={loading} className="px-6 py-2 bg-black text-white hover:bg-zinc-800 disabled:opacity-50 rounded-md font-medium">
                        {loading ? 'Creating...' : 'Create Project'}
                    </button>
                </div>
            </form>
        </div>
    )
}
