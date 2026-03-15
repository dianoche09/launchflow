'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

export function AdminUsersSearch() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [search, setSearch] = useState(searchParams.get('search') || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams.toString());
        if (search) {
            params.set('search', search);
        } else {
            params.delete('search');
        }
        router.push(`/admin/users?${params.toString()}`);
    };

    return (
        <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#aaa]" />
                <input
                    className="pl-9 pr-4 py-2 border-[1.5px] border-[var(--ink)] bg-[var(--paper)] font-mono text-[11px] outline-none w-[220px]"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <button type="submit" className="px-4 py-2 border-[1.5px] border-[var(--ink)] bg-[var(--ink)] text-[var(--acid)] font-mono text-[11px] tracking-widest hover:bg-[#222] transition-all uppercase">
                Search
            </button>
        </form>
    );
}
