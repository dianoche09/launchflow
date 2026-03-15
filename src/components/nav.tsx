'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Nav() {
    const pathname = usePathname();

    const links = [
        { label: 'PROCESS', href: '/#how' },
        { label: 'PLATFORMS', href: '/platforms' },
        { label: 'PRICING', href: '/pricing' },
        { label: 'DEMO', href: '/demo' },
    ];

    return (
        <nav className="sticky top-0 z-[100] h-14 border-b-2 border-[var(--ink)] bg-[var(--paper)] flex items-stretch px-4 lg:px-8">
            <Link
                href="/"
                className="font-display text-2xl lg:text-3xl tracking-widest flex items-center pr-8 border-r-2 border-[var(--ink)] hover:text-[var(--rust)] transition-colors"
            >
                LAUNCHFLOW
            </Link>

            <ul className="hidden md:flex flex-1 list-none">
                {links.map((link) => (
                    <li key={link.label} className="border-r-2 border-[var(--ink)] last:border-r-0">
                        <Link
                            href={link.href}
                            className={`flex items-center px-6 h-full font-mono text-[11px] tracking-widest transition-colors hover:bg-[var(--paper2)] ${pathname === link.href ? 'bg-[var(--ink)] text-[var(--acid)]' : 'text-[var(--ink)]'
                                }`}
                        >
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>

            <div className="ml-auto flex items-center border-l-2 border-[var(--ink)] pl-0">
                <Link
                    href="/login"
                    className="flex items-center px-6 lg:px-8 h-full bg-[var(--acid)] text-[var(--ink)] font-mono text-[11px] font-bold tracking-widest hover:bg-[var(--acid-dark)] transition-colors uppercase whitespace-nowrap"
                >
                    GET STARTED →
                </Link>
            </div>
        </nav>
    );
}
