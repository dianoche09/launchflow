'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const TERMS_SECTIONS = [
    {
        id: 'terms-intro',
        label: 'Overview',
        heading: 'TERMS OF\nSERVICE',
        tag: 'Terms of Service',
        date: 'Effective March 14, 2025',
        highlight: 'Pay per launch, don\'t abuse the system, we\'re not responsible for platform rejections. Credits never expire. That\'s the gist.',
        body: 'By using LaunchFlow, you agree to these terms. If you don\'t agree, please don\'t use the service. These terms are between you and LaunchFlow ("we", "us", "our").',
    },
    {
        id: 'terms-service',
        label: 'What we do',
        heading: '1. What LaunchFlow Does',
        body: 'LaunchFlow automates the submission of your startup, app, or product to online directories, launch platforms, and communities. We provide:',
        list: [
            'Automated and assisted form submissions to third-party platforms',
            'AI-generated launch copy (taglines, descriptions, posts)',
            'Guided submission instructions for platforms that require human submission',
            'A dashboard to track submission status',
        ],
        footer: 'We are a submission service. We are not affiliated with Product Hunt, Reddit, G2, or any other platform we submit to.',
    },
    {
        id: 'terms-payment',
        label: 'Payment & Credits',
        heading: '2. Payment & Credits',
        body: 'LaunchFlow operates on a pay-per-launch model. You purchase credits or launch packages. There are no subscriptions or recurring charges unless you explicitly set one up.',
        list: [
            'Credits never expire. Once purchased, credits remain in your account indefinitely.',
            'Launch packages are one-time purchases per launch.',
            'Payments are processed securely through Stripe.',
            'All prices are in USD.',
        ],
        highlight: 'We offer refunds on unused credits within 14 days of purchase. Once a launch has started (submissions queued), credits used for that launch are non-refundable. Platform rejections do not qualify for refunds — we can only control our submission process, not platform decisions.',
    },
    {
        id: 'terms-submissions',
        label: 'Submissions',
        heading: '3. Submissions & Platform Rules',
        body: 'When you launch with LaunchFlow, we submit your product to third-party platforms on your behalf. By launching, you confirm that:',
        list: [
            'You own or have the right to submit the product',
            'The product information you provide is accurate and not misleading',
            'Your product does not violate any platform\'s terms of service',
            'You have read and accept the submission guidelines of platforms you\'re submitting to',
        ],
        footer: 'We cannot guarantee acceptance by any platform. Platforms have their own review processes and may reject submissions for any reason. A rejection does not entitle you to a refund.\n\nFor guided platforms (Product Hunt, Reddit, etc.), you are responsible for completing the submission using the copy and instructions we provide. We write the content — you submit.',
    },
    {
        id: 'terms-ai',
        label: 'AI Content',
        heading: '4. AI-Generated Content',
        body: 'LaunchFlow uses OpenAI\'s API to generate launch copy. By using this feature:',
        list: [
            'You retain ownership of the content generated for your product',
            'You are responsible for reviewing the content before submission',
            'We are not liable for inaccurate or inappropriate AI-generated content',
            'You may edit all generated content before submitting',
        ],
    },
    {
        id: 'terms-prohibited',
        label: 'Prohibited use',
        heading: '5. Prohibited Use',
        body: 'You may not use LaunchFlow to:',
        list: [
            'Submit spam, malware, scams, or misleading products',
            'Submit adult content, illegal products, or harmful software',
            'Circumvent platform bans or submit under false identities',
            'Resell or white-label our service without written permission',
            'Use the service in a way that violates applicable laws',
        ],
        footer: 'Violation may result in immediate account termination without refund.',
    },
    {
        id: 'terms-liability',
        label: 'Liability',
        heading: '6. Limitation of Liability',
        body: 'LaunchFlow is provided "as is". We make no guarantees about uptime, submission success rates, or traffic generated from listings.\n\nTo the maximum extent permitted by law, LaunchFlow\'s liability is limited to the amount you paid in the 30 days before the claim. We are not liable for indirect, incidental, or consequential damages.',
    },
    {
        id: 'terms-changes',
        label: 'Changes',
        heading: '7. Changes to Terms',
        body: 'We may update these terms. We\'ll notify you by email for material changes. Continued use after notification constitutes acceptance.',
        footer: 'Questions? Email us at hello@launchflow.io',
    },
];

const PRIVACY_SECTIONS = [
    {
        id: 'privacy-intro',
        label: 'Overview',
        heading: 'PRIVACY\nPOLICY',
        tag: 'Privacy Policy',
        date: 'Effective March 14, 2025',
        highlight: 'We collect only what\'s needed to run the service. We don\'t sell your data. Ever.',
        body: 'We take privacy seriously. This policy explains what data we collect, why, and how we protect it.',
    },
    {
        id: 'privacy-collect',
        label: 'What we collect',
        heading: '1. What We Collect',
        body: 'Account data: Email, name, and OAuth tokens (GitHub/Google) when you sign up.\n\nProject data: Product names, URLs, descriptions, logos, and screenshots you provide for submissions.\n\nPayment data: Processed entirely by Stripe. We never see or store your card details.\n\nUsage data: Submission logs, platform responses, dashboard activity. Used to run the service and debug issues.\n\nBot data: Screenshots taken during automated submissions for verification purposes. Stored temporarily.',
    },
    {
        id: 'privacy-use',
        label: 'How we use it',
        heading: '2. How We Use Your Data',
        list: [
            'To submit your product to platforms you select',
            'To generate AI launch copy using your product information',
            'To send transactional emails (launch started, completed, low credits)',
            'To improve our bot automation and submission success rates',
            'To prevent abuse and enforce our terms',
        ],
        footer: 'We do not use your data for advertising. We do not sell or rent your data to third parties.',
    },
    {
        id: 'privacy-third-party',
        label: 'Third parties',
        heading: '3. Third-Party Services',
        body: 'We use the following third-party services:',
        list: [
            'Supabase — database and authentication (EU/US data centers)',
            'OpenAI — AI content generation (your project data is sent to generate copy)',
            'Stripe — payment processing (subject to Stripe\'s privacy policy)',
            'Upstash — Redis queue for submission jobs',
            'Railway — worker hosting',
            'Vercel — frontend hosting',
        ],
        footer: 'When you use LaunchFlow to submit to third-party platforms, your product data (name, URL, description) is sent to those platforms as part of the submission process.',
    },
    {
        id: 'privacy-retention',
        label: 'Data retention',
        heading: '4. Data Retention',
        list: [
            'Account data: retained while your account is active',
            'Project and submission data: retained indefinitely (your launch history)',
            'Bot screenshots: deleted after 30 days',
            'System logs: deleted after 90 days',
        ],
        footer: 'You can delete your account and all associated data at any time from Settings → Delete Account. This is permanent and cannot be undone.',
    },
    {
        id: 'privacy-rights',
        label: 'Your rights',
        heading: '5. Your Rights',
        body: 'You have the right to:',
        list: [
            'Access all data we hold about you — email us and we\'ll send a full export',
            'Delete your account and all data',
            'Correct inaccurate data via your dashboard',
            'Opt out of non-transactional emails',
        ],
        footer: 'For GDPR requests or privacy concerns: privacy@launchflow.io',
    },
    {
        id: 'privacy-cookies',
        label: 'Cookies',
        heading: '6. Cookies',
        body: 'We use essential cookies only: authentication session cookies (Supabase) and basic analytics. We do not use advertising or tracking cookies.',
    },
    {
        id: 'privacy-contact',
        label: 'Contact',
        heading: '7. Contact',
        body: 'Privacy questions: privacy@launchflow.io\n\nGeneral questions: hello@launchflow.io',
    },
];

export default function LegalPage() {
    const [activeDoc, setActiveDoc] = useState<'terms' | 'privacy'>('terms');
    const [activeSection, setActiveSection] = useState('terms-intro');
    const sectionRefs = useRef<Map<string, HTMLDivElement>>(new Map());

    const sections = activeDoc === 'terms' ? TERMS_SECTIONS : PRIVACY_SECTIONS;

    useEffect(() => {
        const firstId = activeDoc === 'terms' ? 'terms-intro' : 'privacy-intro';
        setActiveSection(firstId);
    }, [activeDoc]);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) setActiveSection(entry.target.id);
            });
        }, { threshold: 0.4 });

        sectionRefs.current.forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, [activeDoc]);

    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">

            {/* NAV */}
            <nav className="border-b-2 border-[var(--ink)] h-14 sticky top-0 bg-[var(--paper)] z-[100] flex items-stretch px-8">
                <Link href="/" className="font-display text-[28px] tracking-widest leading-[56px] pr-8 border-r-2 border-[var(--ink)] no-underline text-[var(--ink)]">
                    LAUNCHFLOW
                </Link>
                <Link href="/" className="flex items-center gap-3 px-6 font-mono text-[12px] text-[#888] no-underline border-r-2 border-[var(--ink)] hover:text-[var(--ink)] transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Home
                </Link>
                <div className="ml-auto flex items-stretch border-l-2 border-[var(--ink)]">
                    {(['terms', 'privacy'] as const).map(doc => (
                        <button
                            key={doc}
                            onClick={() => setActiveDoc(doc)}
                            className={`px-6 font-mono text-[11px] tracking-widest uppercase border-r-2 last:border-r-0 border-[var(--ink)] transition-all ${activeDoc === doc ? 'bg-[var(--ink)] text-[var(--acid)]' : 'text-[#888] hover:bg-[var(--paper2)] hover:text-[var(--ink)]'}`}
                        >
                            {doc === 'terms' ? 'Terms of Service' : 'Privacy Policy'}
                        </button>
                    ))}
                </div>
            </nav>

            {/* HERO */}
            <section className="grid md:grid-cols-2 border-b-2 border-[var(--ink)]">
                <div className="p-10 lg:p-16 border-r-2 border-[var(--ink)]">
                    <div className="flex items-center gap-3 font-mono text-[11px] tracking-[2px] uppercase text-[var(--rust)] mb-8 before:content-[''] before:block before:w-6 before:h-[2px] before:bg-[var(--rust)]">
                        Legal
                    </div>
                    <h1 className="font-display text-[clamp(64px,8vw,108px)] leading-[0.88]">
                        LEGAL<br /><span className="bg-[var(--ink)] text-[var(--acid)] px-2">STUFF.</span>
                    </h1>
                </div>
                <div className="p-10 lg:p-16 flex flex-col justify-between gap-10">
                    <div className="font-mono text-sm text-[#555] leading-loose">
                        <div><span className="text-[#aaa]">Company:</span> <strong className="text-[var(--ink)]">LaunchFlow</strong></div>
                        <div><span className="text-[#aaa]">Email:</span> <strong className="text-[var(--ink)]">hello@launchflow.io</strong></div>
                        <div><span className="text-[#aaa]">Terms last updated:</span> <strong className="text-[var(--ink)]">March 14, 2025</strong></div>
                        <div><span className="text-[#aaa]">Privacy last updated:</span> <strong className="text-[var(--ink)]">March 14, 2025</strong></div>
                    </div>
                    <p className="font-body text-[15px] text-[#777] leading-relaxed max-w-sm">
                        Plain English where possible. We&apos;re a small team and we want to be straightforward about how this works.
                    </p>
                </div>
            </section>

            {/* DOC LAYOUT */}
            <div className="flex border-b-2 border-[var(--ink)]">

                {/* SIDEBAR */}
                <aside className="hidden lg:block w-[240px] shrink-0 border-r-2 border-[var(--ink)] sticky top-14 self-start h-[calc(100vh-56px)] overflow-y-auto">
                    <div className="py-8">
                        <div className="px-6 pb-2 font-mono text-[9px] tracking-[2px] uppercase text-[#bbb]">
                            {activeDoc === 'terms' ? 'Terms of Service' : 'Privacy Policy'}
                        </div>
                        {sections.map(sec => (
                            <button
                                key={sec.id}
                                onClick={() => scrollTo(sec.id)}
                                className={`w-full text-left px-6 py-2 font-mono text-[11px] tracking-[0.3px] transition-all border-l-2 ${activeSection === sec.id
                                    ? 'text-[var(--ink)] border-l-[var(--ink)] bg-[var(--paper2)]'
                                    : 'text-[#888] border-l-transparent hover:bg-[var(--paper2)] hover:text-[var(--ink)]'
                                    }`}
                            >
                                {sec.label}
                            </button>
                        ))}
                    </div>
                </aside>

                {/* CONTENT */}
                <main className="flex-1 px-10 lg:px-16 py-12 max-w-[760px]">
                    {sections.map((sec, i) => (
                        <div
                            key={sec.id}
                            id={sec.id}
                            ref={el => { if (el) sectionRefs.current.set(sec.id, el); }}
                            className="mb-14 scroll-mt-20"
                        >
                            {i > 0 && <div className="h-0.5 bg-[var(--paper3)] mb-8" />}

                            {'tag' in sec && (
                                <>
                                    <div className="inline-block bg-[var(--ink)] text-[var(--acid)] font-mono text-[9px] tracking-[1.5px] uppercase px-2 py-1 mb-3">{sec.tag}</div>
                                    <div className="font-mono text-[11px] text-[#aaa] mb-6">{sec.date}</div>
                                </>
                            )}

                            <h2 className={`font-display tracking-widest leading-[0.9] mb-5 ${i === 0 ? 'text-[52px]' : 'text-[28px]'}`}>
                                {sec.heading}
                            </h2>

                            {'body' in sec && sec.body && (
                                <div className="space-y-4 mb-4">
                                    {sec.body.split('\n\n').map((para, j) => (
                                        <p key={j} className="text-[15px] text-[#444] leading-relaxed">{para}</p>
                                    ))}
                                </div>
                            )}

                            {'list' in sec && sec.list && (
                                <ul className="mb-4">
                                    {sec.list.map((item, j) => (
                                        <li key={j} className="flex items-start gap-3 py-2.5 border-b border-[var(--paper2)] last:border-b-0 text-[14px] text-[#555] leading-relaxed">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--ink)] shrink-0 mt-2" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {'highlight' in sec && sec.highlight && (
                                <div className="bg-[var(--paper2)] border-l-4 border-[var(--ink)] px-5 py-4 text-[14px] text-[#444] leading-relaxed mb-4">
                                    <strong>Short version: </strong>{sec.highlight}
                                </div>
                            )}

                            {'footer' in sec && sec.footer && (
                                <div className="space-y-3 mt-4">
                                    {sec.footer.split('\n\n').map((para, j) => (
                                        <p key={j} className="text-[15px] text-[#444] leading-relaxed">
                                            {para.includes('@') ? (
                                                <>
                                                    {para.split(/([\w.]+@[\w.]+)/g).map((part, k) =>
                                                        part.includes('@') ? (
                                                            <a key={k} href={`mailto:${part}`} className="text-[var(--rust)] hover:underline">{part}</a>
                                                        ) : part
                                                    )}
                                                </>
                                            ) : para}
                                        </p>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </main>
            </div>

            <footer className="p-10 flex flex-col md:flex-row items-center justify-between gap-6 border-t-2 border-[var(--ink)]">
                <div className="font-display text-2xl tracking-widest">LAUNCHFLOW</div>
                <div className="font-mono text-[10px] text-[#aaa] uppercase tracking-widest">Built for vibecoders — 2025</div>
                <div className="flex gap-8">
                    {[['Home', '/'], ['Pricing', '/pricing'], ['Contact', 'mailto:hello@launchflow.io']].map(([label, href]) => (
                        <Link key={label} href={href} className="font-mono text-[11px] text-[#aaa] hover:text-[var(--ink)] transition-colors uppercase tracking-widest">{label}</Link>
                    ))}
                </div>
            </footer>
        </div>
    );
}
