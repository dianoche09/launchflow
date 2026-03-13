'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, Cpu, Globe, Rocket, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* 90/10 ASYMMETRIC HEADER */}
      <header className="fixed top-0 left-0 w-full border-b border-border z-50 bg-background/80 backdrop-blur-sm">
        <div className="flex justify-between items-center px-4 md:px-8 py-4">
          <div className="text-xl font-black tracking-tighter flex items-center gap-1 uppercase">
            <Rocket className="w-5 h-5 text-primary" />
            Launch<span className="text-primary italic">Flow</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors">
              Access Terminal
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-24 md:pt-32">
        {/* HERO: 90/10 ASYMMETRIC TENSION */}
        <section className="px-4 md:px-8 mb-24 md:mb-40">
          <div className="flex flex-col md:flex-row gap-8">
            {/* 90% SIDE: MASSIVE TYPOGRAPHY */}
            <div className="md:w-[90%]">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "circOut" }}
              >
                <h1 className="text-[12vw] leading-[0.85] font-black uppercase tracking-tighter text-balance">
                  Engineered for <br />
                  <span className="text-primary italic">Absolute</span> <br />
                  Distribution.
                </h1>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: "circOut" }}
                className="mt-12 max-w-3xl"
              >
                <div className="flex gap-4 items-start border-l-2 border-primary pl-6 py-2">
                  <p className="text-xl md:text-2xl text-muted-foreground font-medium uppercase tracking-tight">
                    Submit to 100+ directories, communities, and review platforms in a single deployment cycle.
                    No manual forms. No repetition. Just high-velocity growth.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* 10% SIDE: VERTICAL CTA & STATS */}
            <div className="md:w-[10%] flex flex-col justify-end gap-12 border-l border-border pl-8 pt-4">
              <div className="rotate-0 md:-rotate-90 origin-bottom-left md:whitespace-nowrap flex flex-col md:flex-row gap-8 items-start md:items-center">
                <Link
                  href="/login"
                  className="group flex items-center gap-2 text-2xl font-black uppercase tracking-tighter hover:text-primary transition-all underline underline-offset-8 decoration-4"
                >
                  Initiate Launch <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Link>
                <div className="uppercase text-[10px] font-bold tracking-[0.2em] text-muted-foreground flex gap-4">
                  <span>PHASE_01</span>
                  <span>BUILD_V1.0</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FRAGMENTED FEATURES: CONTINUOUS STREAM */}
        <section className="px-4 md:px-8 mb-40">
          <div className="grid grid-cols-1 md:grid-cols-4 border-t border-border">
            {[
              { icon: <Zap />, label: "AUTO_GENERATION", desc: "AI-driven metadata formulation across 8 variants." },
              { icon: <Globe />, label: "GLOBAL_QUEUE", desc: "Playwright bots simulating human submission flows." },
              { icon: <Cpu />, label: "GROWTH_LOGIC", desc: "Automated tracking for backlinks and SEO velocity." },
              { icon: <Rocket />, label: "TERMINAL_STATS", desc: "Real-time deployment logs for every submission." }
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="p-8 border-b md:border-b-0 md:border-r border-border hover:bg-primary/5 transition-colors group relative overflow-hidden"
              >
                <div className="text-primary mb-12 transform group-hover:scale-110 transition-transform origin-left">{f.icon}</div>
                <h3 className="text-xs font-black tracking-[0.3em] uppercase mb-4">{f.label}</h3>
                <p className="text-sm text-muted-foreground font-mono leading-relaxed">{f.desc}</p>
                <div className="absolute top-0 right-0 p-4 text-[10px] font-mono text-border group-hover:text-primary/30 transition-colors">
                  0x0{i + 1}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* BRUTALIST CALL TO ACTION */}
        <section className="bg-primary text-primary-foreground py-24 px-4 md:px-8 overflow-hidden relative">
          <div className="absolute inset-0 opacity-10 pointer-events-none select-none font-black text-[30vw] flex items-center justify-center leading-none">
            ENGINE
          </div>
          <div className="relative z-10 flex flex-col items-center text-center">
            <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-12 max-w-4xl leading-none">
              Ready to <br /> Breach the Market?
            </h2>
            <Link
              href="/login"
              className="bg-primary-foreground text-primary px-12 py-6 text-2xl font-black uppercase tracking-tighter hover:bg-background hover:text-foreground transition-all flex items-center gap-4"
            >
              Start Deployment <Rocket />
            </Link>
          </div>
        </section>
      </main>

      <footer className="p-8 md:p-12 border-t border-border flex flex-col md:flex-row justify-between items-center gap-8 bg-background">
        <div className="text-sm font-bold uppercase tracking-tighter">
          LAUNCHFLOW © 2026 // ALL SYSTEMS OPERATIONAL
        </div>
        <div className="flex gap-12 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          <Link href="#" className="hover:text-primary transition-colors">Privacy_Protocol</Link>
          <Link href="#" className="hover:text-primary transition-colors">Terms_of_Service</Link>
          <Link href="#" className="hover:text-primary transition-colors">Global_Network</Link>
        </div>
      </footer>
    </div>
  );
}
