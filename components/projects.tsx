"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, Github, Plus, Sparkles } from "lucide-react";
import { useState } from "react";
import { RippleDissolveCard } from "@/components/ripple-dissolve-card";
import { SectionHeading } from "@/components/section-heading";
import { asset, siteConfig } from "@/lib/config";
import { projects } from "@/lib/knowledge";

const ease = [0.22, 1, 0.36, 1] as const;

export function ProjectsSection() {
  const [openId, setOpenId] = useState<string | null>(projects[0]?.id ?? null);

  return (
    <section id="projects" aria-labelledby="projects-title" className="relative py-20 sm:py-28">
      <div className="container-page">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="• Selected work"
            id="projects-title"
            title="FEATURED PROJECTS"
            accentWord="PROJECTS"
            description="Four builds where data, reporting, and grounded AI meet. Open a card for the reasoning, the impact, and the stack."
          />
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="hidden shrink-0 items-center gap-3 rounded-2xl border border-line bg-surface/70 px-4 py-3 backdrop-blur-md lg:flex powershell:rounded-[2px]"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-accent/20 bg-accent/10 font-mono text-[10px] font-bold text-accent powershell:rounded-[2px]">
              {String(projects.length).padStart(2, "0")}
            </span>
            <div>
              <p className="text-xs font-semibold text-ink">Selected builds</p>
              <p className="font-mono text-[9px] tracking-[0.12em] text-muted uppercase">2024 — 2026</p>
            </div>
          </motion.div>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:mt-12 sm:gap-4">
          {projects.map((project) => {
            const open = openId === project.id;
            const panelId = `project-panel-${project.id}`;
            const buttonId = `project-button-${project.id}`;

            return (
              <motion.article
                layout
                key={project.id}
                transition={{ layout: { duration: 0.45, ease } }}
                className={`relative ${
                  open
                    ? "rounded-[28px] bg-gradient-to-br from-accent/70 via-accent-2/45 to-accent-3/60 p-[1.5px] shadow-[var(--shadow-lift)] powershell:rounded-[3px]"
                    : "rounded-[24px] border-b border-line powershell:rounded-[2px]"
                }`}
              >
                <div
                  className={`overflow-hidden ${
                    open
                      ? "rounded-[26.5px] bg-surface-solid powershell:rounded-[2px]"
                      : "rounded-[24px] powershell:rounded-[2px]"
                  }`}
                >
                  <motion.button
                    layout="position"
                    type="button"
                    id={buttonId}
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenId(open ? null : project.id)}
                    className="group w-full cursor-pointer px-3 py-5 text-left sm:px-5 sm:py-6"
                  >
                    <div className="flex items-start gap-3 sm:gap-5">
                      <span
                        className={`mt-0.5 shrink-0 font-mono text-[11px] font-semibold tracking-tight transition-colors sm:mt-1 sm:text-xs ${
                          open ? "text-accent" : "text-muted group-hover:text-accent"
                        }`}
                      >
                        {project.number}
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <h3 className="text-[clamp(1.2rem,2.4vw,1.65rem)] leading-tight font-bold tracking-tight text-ink">
                            {project.title}
                          </h3>
                          <span className="inline-flex items-center gap-1 rounded-full border border-line bg-surface px-2 py-0.5 font-mono text-[8.5px] tracking-[0.12em] text-muted uppercase powershell:rounded-[2px]">
                            {project.year}
                          </span>
                        </div>
                        <p className="mt-1.5 max-w-2xl text-[13px] leading-relaxed text-muted sm:text-sm">
                          {project.tagline}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {project.tech.map((tech, techIndex) => (
                            <span
                              key={tech}
                              className={`inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[9px] font-medium tracking-wide transition-colors powershell:rounded-[2px] ${
                                open
                                  ? "border-accent/25 bg-accent/10 text-accent"
                                  : "border-line bg-surface text-ink-soft"
                              }`}
                            >
                              {tech}
                              {techIndex === project.tech.length - 1 ? null : (
                                <span aria-hidden className="ml-1 opacity-30">
                                  /
                                </span>
                              )}
                            </span>
                          ))}
                        </div>
                      </div>

                      <span
                        aria-hidden
                        className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300 powershell:rounded-[2px] ${
                          open
                            ? "rotate-45 border-accent bg-accent text-accent-ink"
                            : "border-line bg-surface text-ink-soft group-hover:border-accent/50 group-hover:text-accent"
                        }`}
                      >
                        <Plus className="h-4 w-4" />
                      </span>
                    </div>
                  </motion.button>

                  <AnimatePresence initial={false}>
                    {open ? (
                      <motion.div
                        key="panel"
                        id={panelId}
                        role="region"
                        aria-labelledby={buttonId}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.42, ease }}
                        className="overflow-hidden"
                      >
                        <div className="px-3 pb-6 sm:px-5 sm:pb-7">
                          <div className="h-px w-full bg-line" />
                          <div className="grid gap-7 pt-6 lg:grid-cols-[1.02fr_0.98fr] lg:gap-9">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-[9px] tracking-[0.14em] text-muted uppercase">
                                <span>
                                  <span className="text-accent">Role</span> · {project.role}
                                </span>
                                <span>
                                  <span className="text-accent">Build</span> · {project.year}
                                </span>
                              </div>

                              <p className="mt-3 text-[13.5px] leading-relaxed text-ink-soft sm:text-sm">
                                {project.description}
                              </p>

                              <div className="mt-5 grid grid-cols-3 gap-2">
                                {project.impact.map((item) => (
                                  <div
                                    key={item.label}
                                    className="rounded-xl border border-line bg-surface px-2.5 py-2.5 powershell:rounded-[2px]"
                                  >
                                    <p className="font-mono text-sm font-bold text-ink sm:text-base">{item.value}</p>
                                    <p className="mt-0.5 text-[9px] leading-tight text-muted">{item.label}</p>
                                  </div>
                                ))}
                              </div>

                              <div className="mt-5">
                                <p className="mb-2.5 flex items-center gap-1.5 font-mono text-[9px] tracking-[0.16em] text-accent uppercase">
                                  <Sparkles className="h-3 w-3" aria-hidden />
                                  Key features
                                </p>
                                <ul className="grid gap-2">
                                  {project.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-2.5">
                                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-accent powershell:rounded-[1px]">
                                        <Check className="h-2.5 w-2.5" aria-hidden />
                                      </span>
                                      <span className="text-[12.5px] leading-relaxed text-ink-soft">{feature}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div className="mt-6 flex flex-wrap items-center gap-2">
                                <a
                                  href={project.links.live}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2.5 text-xs font-semibold text-accent-ink transition-all hover:brightness-110 hover:shadow-[0_12px_30px_-12px_var(--glow)] powershell:rounded-[2px]"
                                >
                                  Live Showcase
                                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                                </a>
                                <a
                                  href={project.links.source}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface px-4 py-2.5 text-xs font-semibold text-ink-soft transition-colors hover:border-accent/40 hover:text-accent powershell:rounded-[2px]"
                                >
                                  <Github className="h-3.5 w-3.5" aria-hidden />
                                  Source Code
                                </a>
                              </div>
                            </div>

                            <div className="min-w-0">
                              {project.imageLink ? (
                                <RippleDissolveCard
                                  imageSrc={asset(project.image)}
                                  caption={`${project.title} — ${project.tagline.split(".")[0]}`}
                                  linkUrl={project.imageLink}
                                  badge="Screenshot"
                                />
                              ) : (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={asset(project.image)}
                                  alt={project.imageAlt}
                                  className="aspect-[16/10] w-full rounded-2xl border border-line object-cover"
                                  loading="lazy"
                                />
                              )}
                              <p className="mt-2.5 flex items-center justify-center gap-1.5 text-center font-mono text-[9px] tracking-[0.08em] text-muted uppercase">
                                <span className="h-1 w-1 rounded-full bg-accent" aria-hidden />
                                Move across the preview for ripples · linger to dissolve
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>

              </motion.article>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mt-8 flex flex-col items-center justify-between gap-3 rounded-2xl border border-dashed border-line px-4 py-4 sm:flex-row powershell:rounded-[2px]"
        >
          <p className="text-center font-mono text-[10px] tracking-[0.1em] text-muted uppercase sm:text-left">
            More experiments, notes, and half-finished ideas live on GitHub.
          </p>
          <a
            href={siteConfig.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="link-sweep shrink-0 text-xs font-semibold text-accent"
          >
            Browse the repositories
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
