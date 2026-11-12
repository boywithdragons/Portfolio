"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Cpu,
  FolderGit2,
  Loader2,
  Mail,
  PartyPopper,
  Send,
  ShieldCheck,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ContactModal } from "@/components/contact-modal";
import { getKnowledgeStats, RAG_FALLBACK, searchKnowledgeBase } from "@/lib/rag";
import type { KnowledgeEntry } from "@/lib/types";

type QuickAction =
  | { label: string; icon: React.ElementType; kind: "ask"; query: string }
  | { label: string; icon: React.ElementType; kind: "scroll"; target: string };

const QUICK_ACTIONS: QuickAction[] = [
  { label: "Me", icon: UserRound, kind: "ask", query: "Who is Aditya?" },
  { label: "Projects", icon: FolderGit2, kind: "scroll", target: "projects" },
  { label: "Skills", icon: Cpu, kind: "scroll", target: "skills" },
  { label: "Fun", icon: PartyPopper, kind: "ask", query: "Tell me something fun about Aditya." },
  { label: "Contact", icon: Mail, kind: "scroll", target: "contact" },
];

type ChatResult =
  | { kind: "answer"; query: string; entry: KnowledgeEntry; score: number }
  | { kind: "fallback"; query: string };

const stats = getKnowledgeStats();

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function ChatBar() {
  const [query, setQuery] = useState("");
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<ChatResult | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if (event.key === "/" && !typing && !event.metaKey && !event.ctrlKey) {
        event.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      if (event.key === "Escape" && !typing) {
        setResult(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const ask = useCallback((raw: string) => {
    const question = raw.trim();
    if (!question) return;

    setQuery(question);
    setPending(true);
    setResult(null);

    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      const match = searchKnowledgeBase(question);
      if (match) {
        setResult({ kind: "answer", query: question, entry: match.entry, score: match.score });
      } else {
        setResult({ kind: "fallback", query: question });
      }
      setPending(false);
    }, 380);
  }, []);

  const handleQuickAction = (action: QuickAction) => {
    if (action.kind === "ask") {
      ask(action.query);
      return;
    }
    scrollToSection(action.target);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    ask(query);
  };

  const goToContact = () => {
    setModalOpen(false);
    window.setTimeout(() => scrollToSection("contact"), 180);
  };

  return (
    <>
      <div className="mx-auto w-full max-w-2xl">
        <form
          onSubmit={handleSubmit}
          className="group glass relative flex items-center gap-2 rounded-[26px] p-2 pl-4 shadow-[var(--shadow-soft)] transition-all duration-300 focus-within:border-accent/50 focus-within:shadow-[0_24px_70px_-30px_var(--glow)] powershell:rounded-[3px]"
        >
          <span
            aria-hidden
            className="hidden h-7 w-7 shrink-0 items-center justify-center rounded-full border border-accent/20 bg-accent/10 text-accent sm:flex"
          >
            <Sparkles className="h-3.5 w-3.5" />
          </span>

          <label htmlFor="ai-search" className="sr-only">
            Ask about Aditya&apos;s background, projects, skills, or contact details
          </label>
          <input
            ref={inputRef}
            id="ai-search"
            name="question"
            type="text"
            autoComplete="off"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ask me anything..."
            className="min-w-0 flex-1 bg-transparent py-2.5 text-[15px] text-ink outline-none placeholder:text-muted/80"
          />

          <kbd
            aria-hidden
            className="mr-1 hidden rounded-md border border-line bg-surface px-1.5 py-1 font-mono text-[10px] text-muted sm:inline-block"
          >
            /
          </kbd>

          <button
            type="submit"
            disabled={pending || !query.trim()}
            aria-label="Send question"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-ink transition-all duration-300 hover:brightness-110 hover:shadow-[0_10px_30px_-8px_var(--glow)] disabled:cursor-not-allowed disabled:opacity-40 powershell:rounded-[2px]"
          >
            {pending ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <Send className="h-4 w-4 -translate-x-px" aria-hidden />
            )}
          </button>
        </form>

        <div className="mt-3.5 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                type="button"
                onClick={() => handleQuickAction(action)}
                className="group inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-[11px] font-semibold tracking-wide text-ink-soft backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:text-accent hover:shadow-sm powershell:rounded-[2px] powershell:text-[10px] powershell:uppercase powershell:tracking-[0.12em]"
              >
                <Icon className="h-3 w-3 text-accent" aria-hidden />
                {action.label}
              </button>
            );
          })}
        </div>

        <p className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-center font-mono text-[10px] leading-relaxed tracking-wide text-muted">
          <ShieldCheck className="h-3 w-3 text-accent" aria-hidden />
          Grounded in {stats.entries} curated entries
          <span aria-hidden className="opacity-50">
            ·
          </span>
          answers only from the knowledge base
        </p>

        <AnimatePresence initial={false} mode="wait">
          {pending ? (
            <motion.div
              key="pending"
              initial={{ opacity: 0, y: 8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -6, height: 0 }}
              transition={{ duration: 0.22 }}
              className="overflow-hidden"
            >
              <div className="mt-4 flex items-center justify-center gap-2.5 rounded-2xl border border-line bg-surface/70 px-4 py-3 text-left backdrop-blur-md powershell:rounded-[2px]">
                <span className="flex gap-1" aria-hidden>
                  {[0, 1, 2].map((dot) => (
                    <motion.span
                      key={dot}
                      animate={{ opacity: [0.25, 1, 0.25], y: [0, -2, 0] }}
                      transition={{ duration: 1, repeat: Infinity, delay: dot * 0.16 }}
                      className="h-1.5 w-1.5 rounded-full bg-accent"
                    />
                  ))}
                </span>
                <span className="font-mono text-[11px] tracking-wide text-muted">
                  Searching the knowledge base…
                </span>
              </div>
            </motion.div>
          ) : null}

          {!pending && result ? (
            <motion.div
              key={`${result.kind}-${result.query}`}
              initial={{ opacity: 0, y: 12, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="glass-strong mt-4 rounded-[24px] p-4 text-left shadow-[var(--shadow-lift)] sm:p-5 powershell:rounded-[3px]">
                <div className="ps-window-bar">rag-answer.txt</div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-accent/25 bg-accent/10 text-accent powershell:rounded-[2px]">
                      <Sparkles className="h-3 w-3" aria-hidden />
                    </span>
                    <span className="truncate font-mono text-[10px] font-semibold tracking-[0.14em] text-accent uppercase">
                      {result.kind === "answer" ? "Found in the knowledge base" : "No grounded match"}
                    </span>
                    {result.kind === "answer" ? (
                      <span className="hidden shrink-0 rounded-full border border-line bg-surface px-2 py-0.5 font-mono text-[9px] text-muted sm:inline-block powershell:rounded-[2px]">
                        {result.entry.source}
                      </span>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => setResult(null)}
                    aria-label="Dismiss answer"
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-accent/10 hover:text-ink powershell:rounded-[2px]"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>

                {result.kind === "answer" ? (
                  <div aria-live="polite" className="mt-3">
                    <p className="whitespace-pre-line text-[13.5px] leading-relaxed text-ink-soft sm:text-sm">
                      {result.entry.answer}
                    </p>
                    {result.entry.href === "#contact" ? (
                      <button
                        type="button"
                        onClick={goToContact}
                        className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-accent transition-colors hover:text-accent-bright"
                      >
                        Go to the Contact section
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                      </button>
                    ) : null}
                    <p className="mt-3 border-t border-line pt-2.5 font-mono text-[9.5px] text-muted">
                      Retrieved from {result.entry.source} · no generated guesses
                    </p>
                  </div>
                ) : (
                  <div aria-live="polite" className="mt-3">
                    <p className="text-[13.5px] leading-relaxed text-ink-soft sm:text-sm">{RAG_FALLBACK}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setModalOpen(true)}
                        className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2.5 text-xs font-semibold text-accent-ink transition-all hover:brightness-110 hover:shadow-[0_12px_30px_-12px_var(--glow)] powershell:rounded-[2px]"
                      >
                        <Mail className="h-3.5 w-3.5" aria-hidden />
                        Contact options
                      </button>
                      <button
                        type="button"
                        onClick={goToContact}
                        className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface px-4 py-2.5 text-xs font-semibold text-ink-soft transition-colors hover:border-accent/40 hover:text-accent powershell:rounded-[2px]"
                      >
                        Scroll to contact
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <ContactModal open={modalOpen} onClose={() => setModalOpen(false)} onGoToContact={goToContact} />
    </>
  );
}
