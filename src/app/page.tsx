import Link from 'next/link';
import { Nav } from '@/components/nav';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)] selection:bg-[var(--acid)] selection:text-[var(--ink)]">
      <Nav />

      {/* HERO SECTION */}
      <section className="grid lg:grid-cols-[1fr_380px] border-b-2 border-[var(--ink)] min-h-[calc(100vh-56px)]">
        <div className="flex flex-col justify-between p-8 lg:p-12 lg:pl-8 border-r-2 border-[var(--ink)]">
          <div className="mb-12">
            <div className="flex items-center gap-3 font-mono text-[11px] tracking-[2px] uppercase text-[var(--rust)] mb-8 before:content-[''] before:block before:w-8 before:h-[2px] before:bg-[var(--rust)]">
              Build it. Launch everywhere.
            </div>
            <h1 className="font-display text-[clamp(80px,11vw,160px)] leading-[0.88] tracking-widest mb-0 uppercase">
              SHIP TO<br />
              <span className="text-outline uppercase">EVERY</span><br />
              <span className="filled-acid uppercase">PLATFORM.</span>
            </h1>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mt-12">
            <p className="max-w-md font-body text-lg lg:text-xl leading-relaxed text-[#333]">
              Submit your app to 99+ platforms automatically.
              AI launch kit, smart queue, live tracking.
              Built for vibecoders who just want to keep shipping.
            </p>
            <div className="flex flex-col gap-3 shrink-0">
              <Link href="/login" className="btn-big">
                START LAUNCHING →
              </Link>
              <Link href="/demo" className="btn-outline">
                TRY THE DEMO
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col border-t-2 lg:border-t-0 border-[var(--ink)]">
          {[
            { num: '99+', label: 'Platforms covered', accent: true },
            { num: '32m', label: 'Potential reach', accent: false },
            { num: '3h', label: 'Time saved per launch', accent: false },
          ].map((stat, i) => (
            <div key={i} className="flex-1 flex flex-col justify-end p-8 border-b-2 last:border-b-0 border-[var(--ink)] bg-[var(--paper)] hover:bg-[var(--paper2)] transition-colors">
              <div className={`font-display text-7xl leading-[0.9] tracking-widest ${stat.accent ? 'text-[var(--rust)]' : ''}`}>
                {stat.num}
              </div>
              <div className="font-mono text-[11px] tracking-[1.5px] uppercase text-[#666] mt-3">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MARQUEE */}
      <div className="bg-[var(--ink)] py-4 overflow-hidden border-b-2 border-[var(--ink)]">
        <div className="flex whitespace-nowrap animate-marquee">
          {[1, 2, 3].map((set) => (
            <div key={set} className="flex shrink-0">
              {[
                'PRODUCT HUNT', 'UNEED', 'DEVHUNT', 'BETALIST', 'MICROLAUNCH', 'FAZIER',
                'SAASHUB', 'FUTUREPEDIA', 'THERE IS AN AI FOR THAT', 'ALTERNATIVETO'
              ].map((name, i) => (
                <div key={i} className={`font-display text-xl tracking-[2px] px-8 border-r border-white/20 uppercase ${i % 2 === 1 ? 'text-[var(--acid)]' : 'text-[var(--acid)]/30'}`}>
                  {name}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* WHO IS IT FOR */}
      <section className="grid lg:grid-cols-[240px_1fr] border-b-2 border-[var(--ink)]">
        <div className="flex items-center p-10 border-r-2 border-[var(--ink)] bg-[var(--paper2)] lg:bg-transparent">
          <h2 className="font-display text-5xl tracking-[2px] leading-none uppercase">
            WHO IS<br />IT FOR_
          </h2>
        </div>
        <div className="grid md:grid-cols-3">
          {[
            { tag: 'Solo', title: 'VIBECODERS', body: 'You built it with Cursor or v0 in a weekend. Now you want the world to see it without spending 4 hours filling forms.' },
            { tag: 'Growing', title: 'SOLO-FOUNDERS', body: 'Serial shippers who need consistent distribution for every micro-SaaS and tool they drop.' },
            { tag: 'Scale', title: 'AGENCIES', body: 'Launch-as-a-service for your clients. Professional distribution reports and maximum reach.' },
          ].map((item, i) => (
            <div key={i} className="p-10 border-b-2 md:border-b-0 md:border-r-2 last:border-r-0 border-[var(--ink)] hover:bg-[var(--paper2)] transition-colors group">
              <div className="inline-block bg-[var(--ink)] text-[var(--acid)] font-mono text-[10px] px-2 py-1 tracking-widest uppercase mb-6">
                {item.tag}
              </div>
              <h3 className="font-display text-3xl tracking-widest mb-4 uppercase">{item.title}</h3>
              <p className="text-sm text-[#555] leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-b-2 border-[var(--ink)]">
        <div className="flex flex-col md:flex-row md:items-end justify-between p-12 border-b-2 border-[var(--ink)] gap-8">
          <h2 className="font-display text-[clamp(60px,8vw,96px)] leading-[0.9] tracking-[2px] uppercase">
            PROCESS<br />WORKFLOW
          </h2>
          <div className="font-mono text-[12px] text-[#888] tracking-widest uppercase mb-2">
            zero to launched in 300 seconds
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4">
          {[
            { num: '01', title: 'Project Info', body: 'Paste your URL and a basic description. Our engine fetches your meta tags and logo automatically.' },
            { num: '02', title: 'AI Launch Kit', body: 'We generate customPH comments, Reddit posts, HN pitches, and Twitter threads based on your build.' },
            { num: '03', title: 'Select Package', body: 'Choose your reach. From $9 for Tier 1 launch sites to maximum coverage with 99+ platforms.' },
            { num: '04', title: 'Global Launch', body: 'Click launch. Our bots handle the forms while you watch the live tracking dashboard.' },
          ].map((step, i) => (
            <div key={i} className="p-12 border-r-2 last:border-r-0 border-b-2 lg:border-b-0 border-[var(--ink)] hover:bg-[var(--acid)] transition-colors group">
              <div className="font-display text-8xl text-[var(--paper2)] leading-none mb-6 group-hover:text-[var(--ink)] transition-colors">
                {step.num}
              </div>
              <h4 className="font-body font-bold text-lg mb-3 group-hover:text-[var(--ink)]">{step.title}</h4>
              <p className="text-sm text-[#555] leading-relaxed group-hover:text-[var(--ink)]">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PLATFORMS PREVIEW */}
      <section className="grid lg:grid-cols-[360px_1fr] border-b-2 border-[var(--ink)]">
        <div className="flex flex-col justify-between p-12 border-r-2 border-[var(--ink)]">
          <h2 className="font-display text-7xl leading-[0.88] tracking-[2px] uppercase">
            THE LISTING<br />NETWORK
          </h2>
          <div>
            <p className="text-sm text-[#555] leading-relaxed mb-8 max-w-[260px]">
              We maintain a hand-curated list of the highest value platforms for AI tools, SaaS, and indie projects.
            </p>
            <div className="font-display text-[120px] text-[var(--paper2)] leading-none -mb-4 tracking-tighter">99+</div>
          </div>
        </div>
        <div className="p-10 space-y-12 bg-[var(--paper)]">
          {[
            { label: 'TOP LAUNCH SITES', tags: ['Product Hunt', 'Uneed', 'DevHunt', 'BetaList', 'Microlaunch', 'Fazier', 'Peerlist', 'TinyLaunch', 'StartupBase'] },
            { label: 'AI DIRECTORIES', tags: ['Futurepedia', 'There\'s an AI for That', 'AI Scout', 'Toolify', 'AI Valley', 'AI Tool Hunt', 'TopAI.tools', 'ListMyAI'] },
            { label: 'COMMUNITIES', tags: ['r/sideproject', 'r/saas', 'Hacker News', 'Indie Hackers', 'Dev.to', 'Hashnode', 'Makerlog', 'WIP.co'] },
          ].map((cat, i) => (
            <div key={i}>
              <div className="font-mono text-[10px] tracking-[2px] uppercase text-[#999] border-b border-[var(--paper2)] pb-2 mb-4">
                {cat.label}
              </div>
              <div className="flex flex-wrap gap-2">
                {cat.tags.map((tag, j) => (
                  <div key={j} className="font-mono text-[12px] px-3 py-1.5 border-2 border-[var(--ink)] bg-transparent hover:bg-[var(--ink)] hover:text-[var(--acid)] transition-colors cursor-default">
                    {tag}
                  </div>
                ))}
                <div className="font-mono text-[12px] px-3 py-1.5 border-2 border-dashed border-[#999] text-[#999]">
                  + more
                </div>
              </div>
            </div>
          ))}
          <div className="pt-8">
            <Link href="/platforms" className="btn uppercase text-xs">View Full Platform Database →</Link>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="border-b-2 border-[var(--ink)] overflow-hidden">
        <div className="grid md:grid-cols-2 p-12 gap-10 border-b-2 border-[var(--ink)] items-end">
          <h2 className="font-display text-[clamp(60px,8vw,96px)] leading-[0.88] tracking-[2px] uppercase">
            ABSOLUTE<br />POWER.
          </h2>
          <p className="text-lg text-[#555] leading-relaxed max-w-md italic">
            Everything you need to bypass the submission grind and focus on building actually cool stuff.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3">
          {[
            { num: '01', title: 'Autonomous Bots', body: 'Proprietary form-fillers that handle logins and complex data entry across 50+ platforms.' },
            { num: '02', title: 'Guided Handover', body: 'For sites like PH and Reddit, we provide step-by-step guides + pre-written copy to ensure human-first quality.' },
            { num: '03', title: 'Live Dashboard', body: 'Watch your status change from "Queued" to "Live" in real-time. Link generation included.' },
            { num: '04', title: 'Smart Scheduling', body: 'We don\'t dump everything at once. We space submissions over 48 hours for natural SEO backlink growth.' },
            { num: '05', title: 'One-Time Payment', body: 'No subscriptions. Pay only when you have a project ready to launch. Credits never expire.' },
            { num: '06', title: 'SEO Optimized', body: 'We prioritize high DA (Domain Authority) platforms to maximize your project\'s search ranking.' },
          ].map((feat, i) => (
            <div key={i} className="p-10 border-r-2 last:border-r-0 border-b-2 border-[var(--ink)] hover:bg-[#e8e8ff] transition-colors relative">
              <div className="font-mono text-[10px] text-[#999] mb-6 uppercase tracking-widest">{feat.num} / Feature</div>
              <h3 className="font-body font-extrabold text-xl mb-3 tracking-tight uppercase">{feat.title}</h3>
              <p className="text-sm text-[#555] leading-relaxed">{feat.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="grid lg:grid-cols-[1fr_480px] border-b-2 border-[var(--ink)] min-h-[400px]">
        <div className="flex flex-col justify-center p-12 bg-[var(--ink)] border-r-2 border-[var(--ink)]">
          <h2 className="font-display text-[clamp(64px,8vw,104px)] leading-[0.88] tracking-[2px] text-[var(--paper)] uppercase mb-6">
            STOP BUILDING<br />INTO <span className="text-[var(--acid)]">SILENCE.</span>
          </h2>
          <p className="text-lg text-[var(--paper)]/50 max-w-md leading-relaxed">
            You spent weeks building it. Don't spend days launching it. Get your app in front of thousands today.
          </p>
        </div>
        <div className="flex flex-col justify-center p-12 gap-4">
          <div className="font-mono text-[11px] tracking-[2px] uppercase text-[#999]">Join the waitlist or start free</div>
          <div className="flex border-2 border-[var(--ink)]">
            <input
              type="email"
              placeholder="Vibe-coder email..."
              className="flex-1 p-4 font-mono text-sm bg-transparent outline-none"
            />
            <button className="bg-[var(--ink)] text-[var(--acid)] font-display text-lg tracking-widest px-8 hover:bg-[#222] transition-colors">
              JOIN →
            </button>
          </div>
          <p className="font-mono text-[10px] text-[#999] mt-2">
            Already ready? <Link href="/login" className="underline hover:text-[var(--ink)] transition-colors">Create account</Link> and get 3 free platforms.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            {['VITE', 'NEXT.JS', 'SUPABASE', 'OPENAI', 'PLAYWRIGHT'].map(tag => (
              <span key={tag} className="font-mono text-[10px] px-2 py-1 border border-[var(--paper3)] text-[#666]">{tag}</span>
            ))}
          </div>
        </div>
      </section>

      {/* MINI FOOTER */}
      <footer className="grid md:grid-cols-3 p-8 border-b-2 border-[var(--ink)] items-center">
        <div className="font-display text-2xl tracking-widest uppercase">LAUNCHFLOW</div>
        <div className="text-center font-mono text-[10px] text-[#999] tracking-widest uppercase">
          Built for vibecoders — 2025
        </div>
        <div className="flex justify-end gap-10">
          {['Twitter', 'GitHub', 'Blog'].map(link => (
            <Link key={link} href="#" className="font-mono text-[11px] text-[#999] hover:text-[var(--ink)] transition-colors uppercase tracking-widest">
              {link}
            </Link>
          ))}
        </div>
      </footer>
    </div>
  );
}
