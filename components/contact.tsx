"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Check,
  Clock,
  Copy,
  Github,
  Linkedin,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import { SectionHeading } from "@/components/section-heading";
import { siteConfig } from "@/lib/config";

const ease = [0.22, 1, 0.36, 1] as const;

type Status = "idle" | "sending" | "success" | "error";

const socials = [
  {
    label: "GitHub",
    handle: "@boywithdragons",
    href: siteConfig.socials.github,
    icon: Github,
    color: "var(--ink)",
    wide: false,
  },
  {
    label: "LinkedIn",
    handle: "in/boywithdragons",
    href: siteConfig.socials.linkedin,
    icon: Linkedin,
    color: "#0a66c2",
    wide: false,
  },
  {
    label: "WhatsApp",
    handle: siteConfig.phone,
    href: siteConfig.whatsapp,
    icon: MessageCircle,
    color: "#25d366",
    wide: true,
  },
];

export function ContactSection() {
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState("");

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(siteConfig.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    if (!name || !email || !message) {
      setStatus("error");
      setFeedback("Please fill in your name, email, and a short message.");
      return;
    }

    if (!siteConfig.web3formsKey) {
      const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
      const body = encodeURIComponent(`${message}\n\n— ${name}\n${email}`);
      window.location.href = `mailto:${siteConfig.email}?subject=${subject}&body=${body}`;
      setStatus("success");
      setFeedback("Your mail app should open with the message ready to send.");
      form.reset();
      return;
    }

    setStatus("sending");
    setFeedback("");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: siteConfig.web3formsKey,
          name,
          email,
          message,
          subject: `Portfolio enquiry from ${name}`,
          from_name: "Aditya's Portfolio",
        }),
      });

      if (!response.ok) throw new Error("Request failed");

      setStatus("success");
      setFeedback("Message sent. Aditya will get back to you within a business day.");
      form.reset();
    } catch {
      setStatus("error");
      setFeedback(
        `Something went wrong. Email ${siteConfig.email} directly and it will still land.`,
      );
    }
  };

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow="• Contact"
          id="contact-title"
          title="LET'S TALK"
          accentWord="TALK"
          description="The assistant answers from the knowledge base. For everything else — roles, collaborations, or a second opinion on a dashboard — this is the direct line."
        />

        <div className="mt-10 grid gap-4 lg:grid-cols-[0.92fr_1.08fr] sm:mt-12">
          {/* Left: direct channels */}
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-70px" }}
            transition={{ duration: 0.6, ease }}
            className="relative overflow-hidden rounded-[26px] border border-line bg-surface-solid p-5 sm:p-7 powershell:rounded-[3px]"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute -top-24 -left-16 h-64 w-64 rounded-full bg-accent/15 blur-3xl"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute -right-20 -bottom-24 h-56 w-56 rounded-full bg-accent-2/10 blur-3xl"
            />

            <div className="relative">
              <div className="ps-window-bar">contact.exe</div>

              <div className="flex items-center justify-between gap-3">
                <span className="eyebrow">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </span>
                  Open to work
                </span>
                <span className="font-mono text-[9px] tracking-[0.12em] text-muted uppercase">
                  {siteConfig.timezone}
                </span>
              </div>

              <h3 className="mt-6 text-[clamp(1.7rem,3.4vw,2.5rem)] leading-[1.02] font-extrabold tracking-tight text-ink">
                Good questions
                <br />
                deserve a <span className="gradient-text">human.</span>
              </h3>
              <p className="mt-3 max-w-sm text-[13px] leading-relaxed text-muted">
                Open to AI engineering, data analytics, business intelligence, and operations
                analytics roles. Remote, hybrid, or relocation — flexible start dates.
              </p>

              <div className="mt-6 grid gap-2">
                <button
                  type="button"
                  onClick={copyEmail}
                  className="group flex w-full items-center gap-3 rounded-2xl border border-line bg-surface px-3.5 py-3 text-left transition-colors hover:border-accent/45 hover:bg-accent/[0.04] powershell:rounded-[2px]"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-accent powershell:rounded-[2px]">
                    <Mail className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-mono text-[9px] tracking-[0.14em] text-muted uppercase">
                      Email · click to copy
                    </span>
                    <span className="block truncate text-[13px] font-semibold text-ink">
                      {siteConfig.email}
                    </span>
                  </span>
                  <AnimatePresence mode="wait" initial={false}>
                    {copied ? (
                      <motion.span
                        key="copied"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="inline-flex items-center gap-1 rounded-full bg-emerald-500/12 px-2 py-1 font-mono text-[8.5px] font-semibold tracking-[0.1em] text-emerald-600 uppercase powershell:rounded-[2px] powershell:text-emerald-300"
                      >
                        <Check className="h-2.5 w-2.5" aria-hidden />
                        Copied
                      </motion.span>
                    ) : (
                      <motion.span
                        key="copy"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-surface-strong text-muted transition-colors group-hover:text-accent powershell:rounded-[2px]"
                      >
                        <Copy className="h-3.5 w-3.5" aria-hidden />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>

                <div className="grid gap-2 sm:grid-cols-2">
                  <a
                    href={`tel:${siteConfig.phoneHref}`}
                    className="group flex items-center gap-2.5 rounded-2xl border border-line bg-surface px-3.5 py-3 transition-colors hover:border-accent/45 hover:bg-accent/[0.04] powershell:rounded-[2px]"
                  >
                    <Phone className="h-4 w-4 shrink-0 text-accent" aria-hidden />
                    <span className="min-w-0">
                      <span className="block font-mono text-[8.5px] tracking-[0.14em] text-muted uppercase">
                        Phone
                      </span>
                      <span className="block truncate text-[12px] font-semibold text-ink">
                        {siteConfig.phone}
                      </span>
                    </span>
                  </a>
                  <div className="flex items-center gap-2.5 rounded-2xl border border-line bg-surface px-3.5 py-3 powershell:rounded-[2px]">
                    <MapPin className="h-4 w-4 shrink-0 text-gold" aria-hidden />
                    <span className="min-w-0">
                      <span className="block font-mono text-[8.5px] tracking-[0.14em] text-muted uppercase">
                        Based in
                      </span>
                      <span className="block truncate text-[12px] font-semibold text-ink">
                        Hyderabad, India
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group flex items-center gap-2.5 rounded-2xl border border-line bg-surface px-3.5 py-3 transition-colors hover:border-accent/45 hover:bg-accent/[0.04] powershell:rounded-[2px] ${
                      social.wide ? "col-span-2" : ""
                    }`}
                  >
                    <social.icon
                      className="h-4 w-4 shrink-0"
                      style={{ color: social.color }}
                      aria-hidden
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[12px] font-semibold text-ink">{social.label}</span>
                      <span className="block truncate font-mono text-[8.5px] text-muted">
                        {social.handle}
                      </span>
                    </span>
                    <ArrowUpRight className="h-3 w-3 shrink-0 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                ))}
              </div>

              <div className="mt-5 flex items-center gap-2 rounded-xl border border-dashed border-line px-3 py-2.5 powershell:rounded-[2px]">
                <Clock className="h-3.5 w-3.5 shrink-0 text-gold" aria-hidden />
                <p className="font-mono text-[8.5px] tracking-[0.08em] text-muted uppercase">
                  Replies within one business day · IST working hours
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right: form */}
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-70px" }}
            transition={{ duration: 0.6, delay: 0.08, ease }}
            className="relative overflow-hidden rounded-[26px] border border-line bg-surface p-5 backdrop-blur-md sm:p-7 powershell:rounded-[3px]"
          >
            <div className="ps-window-bar">send-message.ps1</div>

            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.16em] text-accent uppercase">
                  <Sparkles className="h-3 w-3" aria-hidden />
                  Send a message
                </p>
                <h3 className="mt-2 text-xl font-bold tracking-tight text-ink sm:text-2xl">
                  Tell me what you&apos;re building.
                </h3>
              </div>
              <span className="hidden rounded-full border border-line bg-surface-strong px-2.5 py-1 font-mono text-[8.5px] tracking-[0.1em] text-muted uppercase sm:inline-flex powershell:rounded-[2px]">
                {siteConfig.web3formsKey ? "Secure relay" : "mailto mode"}
              </span>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 grid gap-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block font-mono text-[9px] font-semibold tracking-[0.14em] text-muted uppercase">
                    Your name
                  </span>
                  <input
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    placeholder="Ada Lovelace"
                    className="w-full rounded-xl border border-line bg-surface-solid px-3.5 py-2.5 text-[13px] text-ink placeholder:text-muted/55 transition-colors focus:border-accent/60 focus:outline-none powershell:rounded-[2px]"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block font-mono text-[9px] font-semibold tracking-[0.14em] text-muted uppercase">
                    Email
                  </span>
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="you@company.com"
                    className="w-full rounded-xl border border-line bg-surface-solid px-3.5 py-2.5 text-[13px] text-ink placeholder:text-muted/55 transition-colors focus:border-accent/60 focus:outline-none powershell:rounded-[2px]"
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-1.5 block font-mono text-[9px] font-semibold tracking-[0.14em] text-muted uppercase">
                  Message
                </span>
                <textarea
                  name="message"
                  required
                  rows={6}
                  placeholder="A role, a project, a dataset that refuses to behave..."
                  className="w-full resize-y rounded-xl border border-line bg-surface-solid px-3.5 py-2.5 text-[13px] leading-relaxed text-ink placeholder:text-muted/55 transition-colors focus:border-accent/60 focus:outline-none powershell:rounded-[2px]"
                />
              </label>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-mono text-[8.5px] leading-relaxed tracking-[0.06em] text-muted uppercase">
                  {siteConfig.web3formsKey
                    ? "Delivered through Web3Forms — no data stored here."
                    : "Opens your mail app with the message pre-filled."}
                </p>
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-accent px-5 py-2.5 text-[12.5px] font-semibold text-accent-ink transition-all hover:brightness-110 hover:shadow-[0_14px_34px_-14px_var(--glow)] disabled:cursor-not-allowed disabled:opacity-70 powershell:rounded-[2px]"
                >
                  {status === "sending" ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                      Sending
                    </>
                  ) : (
                    <>
                      Send message
                      <Send className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
                    </>
                  )}
                </button>
              </div>

              <AnimatePresence>
                {feedback ? (
                  <motion.p
                    key={feedback}
                    initial={{ opacity: 0, y: -6, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -6, height: 0 }}
                    role="status"
                    className={`flex items-start gap-2 rounded-xl border px-3 py-2.5 text-[11.5px] leading-relaxed powershell:rounded-[2px] ${
                      status === "error"
                        ? "border-red-400/30 bg-red-500/5 text-red-600 powershell:text-red-300"
                        : "border-emerald-400/30 bg-emerald-500/5 text-emerald-700 powershell:text-emerald-300"
                    }`}
                  >
                    {status === "error" ? (
                      <span aria-hidden className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-current" />
                    ) : (
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                    )}
                    {feedback}
                  </motion.p>
                ) : null}
              </AnimatePresence>
            </form>

            <div className="mt-5 flex items-center gap-2 border-t border-line pt-4">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" aria-hidden />
              <p className="font-mono text-[8.5px] tracking-[0.08em] text-muted uppercase">
                Prefer email? {siteConfig.email}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
