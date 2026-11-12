"use client";

import { motion } from "framer-motion";
import { ArrowDown, MapPin, Sparkles } from "lucide-react";
import { ChatBar } from "@/components/chat-bar";
import { IridescentCanvas } from "@/components/iridescent-canvas";
import { asset, siteConfig } from "@/lib/config";

const entrance = {
  hidden: { opacity: 0, y: 26 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden pt-28 pb-14 sm:pt-32 sm:pb-16"
    >
      <IridescentCanvas />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-5 text-center sm:px-8">
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={entrance}
          className="relative mb-7 sm:mb-8"
        >
          <span
            aria-hidden
            className="absolute inset-1/2 -z-10 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/25 blur-3xl sm:h-48 sm:w-48"
          />
          <div className="relative animate-float-soft">
            <div className="relative h-[112px] w-[112px] rounded-full border border-white/60 bg-white/30 p-1.5 shadow-[0_20px_60px_-20px_rgba(76,29,149,0.55)] backdrop-blur-md sm:h-[128px] sm:w-[128px] powershell:rounded-[6px] powershell:border-line-strong powershell:bg-surface/40 powershell:p-1">
              <img
                src={asset("/avatar.svg")}
                alt="Illustrated avatar of Aditya wearing round glasses"
                width={128}
                height={128}
                className="h-full w-full rounded-full object-contain powershell:rounded-[4px]"
              />
            </div>
            <span className="absolute right-1 bottom-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-canvas bg-emerald-500 sm:h-7 sm:w-7 powershell:rounded-[2px] powershell:border-[#012456]">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40 powershell:rounded-[2px]" />
              <span className="sr-only">Available for opportunities</span>
            </span>
            <span className="absolute -top-1 -left-6 hidden rotate-[-8deg] rounded-full border border-line bg-surface-strong px-2.5 py-1 font-mono text-[9px] font-semibold tracking-[0.14em] text-accent shadow-sm backdrop-blur-md sm:block powershell:rounded-[2px]">
              RAG
            </span>
            <span className="absolute -right-8 top-7 hidden rotate-[7deg] rounded-full border border-line bg-surface-strong px-2.5 py-1 font-mono text-[9px] font-semibold tracking-[0.14em] text-accent-2 shadow-sm backdrop-blur-md sm:block powershell:rounded-[2px]">
              POWER BI
            </span>
            <span className="absolute -bottom-2 -left-10 hidden rotate-[5deg] rounded-full border border-line bg-surface-strong px-2.5 py-1 font-mono text-[9px] font-semibold tracking-[0.14em] text-gold shadow-sm backdrop-blur-md sm:block powershell:rounded-[2px]">
              PYTHON
            </span>
          </div>
        </motion.div>

        <motion.div custom={0.08} initial="hidden" animate="visible" variants={entrance}>
          <span className="eyebrow mb-4 powershell:mb-5">
            <Sparkles className="h-3 w-3 text-accent" aria-hidden />
            Portfolio · {new Date().getFullYear()}
          </span>
        </motion.div>

        <motion.h1
          custom={0.14}
          initial="hidden"
          animate="visible"
          variants={entrance}
          id="hero-title"
          className="max-w-4xl text-[clamp(2.45rem,7.4vw,5.3rem)] leading-[0.94] font-extrabold tracking-[-0.055em] text-ink powershell:tracking-[-0.03em]"
        >
          Hey, I&apos;m Aditya <span className="inline-block origin-bottom-right animate-[wave_2.4s_ease-in-out_infinite]">👋</span>
        </motion.h1>

        <motion.div
          custom={0.2}
          initial="hidden"
          animate="visible"
          variants={entrance}
          className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 sm:mt-5"
        >
          <p className="gradient-text text-[clamp(1.25rem,2.6vw,1.75rem)] font-bold tracking-tight">
            {siteConfig.role}
          </p>
          <span aria-hidden className="hidden h-1 w-1 rounded-full bg-muted/60 sm:block" />
          <p className="font-mono text-[10px] tracking-[0.18em] text-muted uppercase sm:text-[11px]">
            Data × AI × Operations
          </p>
        </motion.div>

        <motion.p
          custom={0.26}
          initial="hidden"
          animate="visible"
          variants={entrance}
          className="mt-5 max-w-xl text-[14.5px] leading-relaxed text-muted sm:text-base"
        >
          {siteConfig.intro}
        </motion.p>

        <motion.div
          custom={0.32}
          initial="hidden"
          animate="visible"
          variants={entrance}
          className="mt-5 flex flex-wrap items-center justify-center gap-2"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface/70 px-3 py-1.5 text-[11px] font-medium text-ink-soft backdrop-blur-md powershell:rounded-[2px]">
            <MapPin className="h-3 w-3 text-accent" aria-hidden />
            Hyderabad, India
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface/70 px-3 py-1.5 text-[11px] font-medium text-ink-soft backdrop-blur-md powershell:rounded-[2px]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
            4+ years experience
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface/70 px-3 py-1.5 text-[11px] font-medium text-ink-soft backdrop-blur-md powershell:rounded-[2px]">
            Open to remote &amp; relocation
          </span>
        </motion.div>

        <motion.div
          custom={0.4}
          initial="hidden"
          animate="visible"
          variants={entrance}
          className="mt-8 w-full sm:mt-9"
        >
          <ChatBar />
        </motion.div>
      </div>

      <motion.a
        href="#skills"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="relative z-10 mx-auto mt-10 hidden items-center gap-2 font-mono text-[9.5px] tracking-[0.22em] text-muted uppercase transition-colors hover:text-accent sm:mt-12 sm:flex"
      >
        Scroll to explore
        <motion.span
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="h-3.5 w-3.5" aria-hidden />
        </motion.span>
      </motion.a>

      <style>{`
        @keyframes wave {
          0%, 60%, 100% { transform: rotate(0deg); }
          10% { transform: rotate(16deg); }
          20% { transform: rotate(-8deg); }
          30% { transform: rotate(16deg); }
          40% { transform: rotate(-4deg); }
          50% { transform: rotate(10deg); }
        }
      `}</style>
    </section>
  );
}
