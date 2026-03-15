'use client';

import React from 'react';

const BOTS = [
    { name: 'worker-01 · Microlaunch', status: 'Running', dot: 'dot-ok', jobs: 42, last: '2m ago' },
    { name: 'worker-02 · Uneed', status: 'Running', dot: 'dot-ok', jobs: 38, last: '5m ago' },
    { name: 'worker-03 · Fazier', status: 'CAPTCHA error', dot: 'dot-err', jobs: 31, last: '12m ago', error: true },
    { name: 'worker-04 · DevHunt', status: 'Running', dot: 'dot-ok', jobs: 28, last: '1m ago' },
    { name: 'worker-05 · StartupBase', status: 'Slow response', dot: 'dot-warn', jobs: 19, last: '8m ago', warn: true },
    { name: 'worker-06 · SaaSHub', status: 'Running', dot: 'dot-ok', jobs: 44, last: '3m ago' },
];

export default function AdminBots() {
    return (
        <div className="pb-12">
            <header className="px-8 pt-7 pb-6 flex flex-col lg:flex-row items-end justify-between gap-4 mb-6">
                <div>
                    <h1 className="font-display text-[44px] tracking-widest leading-[0.9] uppercase">BOT STATUS</h1>
                    <p className="font-mono text-[11px] text-[#888] tracking-widest mt-1.5 uppercase">Playwright automation workers — real-time.</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-5 py-2.5 border-2 border-[var(--ink)] bg-transparent font-mono text-[11px] tracking-widest hover:bg-[var(--ink)] hover:text-[var(--acid)] transition-all uppercase">
                        Restart all
                    </button>
                    <button className="px-5 py-2.5 border-2 border-[var(--ink)] bg-[var(--ink)] text-[var(--acid)] font-mono text-[11px] tracking-widest hover:bg-[#222] transition-colors uppercase">
                        Deploy update
                    </button>
                </div>
            </header>

            <section className="px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-2 border-[var(--ink)] mx-8 mb-6 bg-[var(--ink)] gap-[2px]">
                {[
                    { num: '6', label: 'Active Bots', color: 'text-[var(--green)]' },
                    { num: '1', label: 'Errors', color: 'text-[var(--rust)]' },
                    { num: '247', label: 'Jobs Today' },
                    { num: '98%', label: 'Success Rate' }
                ].map((kpi, i) => (
                    <div key={i} className="bg-[var(--paper)] p-6 px-6 flex flex-col justify-end min-h-[100px]">
                        <div className={`font-display text-[44px] tracking-widest leading-[0.9] mb-1 ${kpi.color || ''}`}>{kpi.num}</div>
                        <div className="font-mono text-[9px] tracking-[1.5px] uppercase text-[#888] font-bold">{kpi.label}</div>
                    </div>
                ))}
            </section>

            <section className="mx-8 border-2 border-[var(--ink)] bg-[var(--paper)] overflow-hidden">
                <div className="border-b-2 border-[var(--ink)] p-3 px-5 flex items-center justify-between">
                    <h2 className="font-display text-[20px] tracking-widest uppercase">WORKER GRID</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-[var(--ink)] gap-0 border-b-0 border-[var(--ink)]">
                    {BOTS.map((bot, i) => (
                        <div key={i} className={`bg-[var(--paper)] p-6 border-r-2 border-b-2 border-[var(--ink)] last:border-r-0 ${i % 3 === 2 ? 'lg:border-r-0' : ''} ${i >= 3 ? 'lg:border-b-0' : ''}`}>
                            <div className="font-mono text-[11px] font-medium mb-2.5 tracking-widest">{bot.name}</div>
                            <div className="flex items-center gap-2 font-mono text-[10px] text-[#888] mb-3">
                                <div className={`w-2 h-2 rounded-full ${bot.dot === 'dot-ok' ? 'bg-[var(--green)] animate-pulse' : (bot.dot === 'dot-err' ? 'bg-[var(--rust)]' : 'bg-[#d4b800]')}`}></div>
                                <span className={`${bot.error ? 'text-[var(--rust)]' : (bot.warn ? 'text-[#d4b800]' : '')}`}>{bot.status}</span>
                            </div>
                            <div className="font-mono text-[10px] text-[#aaa]">
                                Jobs: <span className="text-[var(--ink)] font-semibold">{bot.jobs}</span> · Last: <span className="text-[var(--ink)] font-semibold">{bot.last}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
