"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Github, Linkedin, Mail, MessageCircle, Phone, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { siteConfig } from "@/lib/config";

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
  onGoToContact: () => void;
}

export function ContactModal({ open, onClose, onGoToContact }: ContactModalProps) {
  const [mounted, setMounted] = useState(false);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;

    previousFocus.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timer = window.setTimeout(() => closeRef.current?.focus(), 60);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      previousFocus.current?.focus?.();
    };
  }, [open]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[110] flex items-end justify-center p-4 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.button
            type="button"
            aria-label="Close contact options"
            onClick={onClose}
            className="absolute inset-0 bg-[#14102e]/45 backdrop-blur-[6px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-modal-title"
            aria-describedby="contact-modal-copy"
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-line-strong bg-surface-solid p-6 shadow-[0_40px_120px_-30px_rgba(30,27,75,0.55)] sm:p-7 powershell:rounded-[3px]"
          >
            <div className="ps-window-bar">contact-options.exe</div>
            <div
              aria-hidden
              className="pointer-events-none absolute -top-24 -right-20 h-56 w-56 rounded-full bg-accent/20 blur-3xl"
            />

            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-line bg-surface text-muted transition-colors hover:border-line-strong hover:text-ink powershell:rounded-[2px]"
            >
              <X className="h-3.5 w-3.5" />
            </button>

            <div className="relative">
              <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-accent/25 bg-accent/10 text-accent powershell:rounded-[3px]">
                <Mail className="h-5 w-5" aria-hidden />
              </span>

              <p className="mb-2 font-mono text-[10px] tracking-[0.2em] text-accent uppercase">
                Direct line
              </p>
              <h2 id="contact-modal-title" className="text-2xl font-bold tracking-tight text-ink">
                Let&apos;s talk directly.
              </h2>
              <p id="contact-modal-copy" className="mt-2.5 text-sm leading-relaxed text-muted">
                The assistant only answers from the published knowledge base, so this one needs a
                human. Pick whichever route is easiest.
              </p>

              <div className="mt-5 grid gap-2">
                <a
                  href={`mailto:${siteConfig.email}?subject=Hello%20Aditya`}
                  className="group flex items-center gap-3 rounded-2xl border border-line bg-surface px-3.5 py-3 transition-colors hover:border-accent/50 hover:bg-accent/5 powershell:rounded-[2px]"
                >
                  <Mail className="h-4 w-4 shrink-0 text-accent" aria-hidden />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[10px] font-mono tracking-[0.14em] text-muted uppercase">
                      Email
                    </span>
                    <span className="block truncate text-sm font-medium text-ink">{siteConfig.email}</span>
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted transition-transform group-hover:translate-x-0.5" />
                </a>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={siteConfig.socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2.5 rounded-2xl border border-line bg-surface px-3.5 py-3 transition-colors hover:border-accent/50 hover:bg-accent/5 powershell:rounded-[2px]"
                  >
                    <Linkedin className="h-4 w-4 text-[#0a66c2] powershell:text-accent-2" aria-hidden />
                    <span className="text-sm font-medium text-ink">LinkedIn</span>
                  </a>
                  <a
                    href={siteConfig.socials.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2.5 rounded-2xl border border-line bg-surface px-3.5 py-3 transition-colors hover:border-accent/50 hover:bg-accent/5 powershell:rounded-[2px]"
                  >
                    <Github className="h-4 w-4 text-ink" aria-hidden />
                    <span className="text-sm font-medium text-ink">GitHub</span>
                  </a>
                </div>

                <a
                  href={`tel:${siteConfig.phoneHref}`}
                  className="group flex items-center gap-3 rounded-2xl border border-line bg-surface px-3.5 py-3 transition-colors hover:border-accent/50 hover:bg-accent/5 powershell:rounded-[2px]"
                >
                  <Phone className="h-4 w-4 shrink-0 text-accent" aria-hidden />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[10px] font-mono tracking-[0.14em] text-muted uppercase">
                      Phone
                    </span>
                    <span className="block text-sm font-medium text-ink">{siteConfig.phone}</span>
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted transition-transform group-hover:translate-x-0.5" />
                </a>

                <a
                  href={siteConfig.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 rounded-2xl border border-line bg-surface px-3.5 py-3 transition-colors hover:border-[#25d366]/50 hover:bg-[#25d366]/5 powershell:rounded-[2px]"
                >
                  <MessageCircle className="h-4 w-4 shrink-0 text-[#25d366]" aria-hidden />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[10px] font-mono tracking-[0.14em] text-muted uppercase">
                      WhatsApp
                    </span>
                    <span className="block text-sm font-medium text-ink">{siteConfig.phone}</span>
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted transition-transform group-hover:translate-x-0.5" />
                </a>
              </div>

              <button
                type="button"
                onClick={onGoToContact}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-accent px-4 py-3 text-sm font-semibold text-accent-ink transition-all hover:brightness-110 hover:shadow-[0_14px_40px_-16px_var(--glow)] powershell:rounded-[2px]"
              >
                Go to the Contact section
                <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
              <p className="mt-3 text-center font-mono text-[10px] tracking-wide text-muted">
                Usually replies within one business day.
              </p>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
