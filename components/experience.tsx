"use client";

import { motion } from "framer-motion";
import {
  Award,
  BadgeCheck,
  Building2,
  CalendarDays,
  GraduationCap,
  MapPin,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { credentials, experienceRoles } from "@/lib/knowledge";

const ease = [0.22, 1, 0.36, 1] as const;

export function ExperienceSection() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="relative py-20 sm:py-28">
      <div className="container-page">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="• Career log"
            id="experience-title"
            title="EXPERIENCE"
            accentWord="EXPERIENCE"
            description="Four years of turning support floor reality into reporting, process fixes, and AI-assisted decisions — one role at a time."
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="grid shrink-0 grid-cols-3 gap-2 lg:pb-2"
          >
            {[
              { value: "4+", label: "Years" },
              { value: String(experienceRoles.length).padStart(2, "0"), label: "Roles" },
              { value: String(credentials.certifications.length).padStart(2, "0"), label: "Certs" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-line bg-surface/70 px-3 py-2.5 text-center backdrop-blur-md powershell:rounded-[2px]"
              >
                <p className="font-mono text-lg font-bold text-gold">{stat.value}</p>
                <p className="mt-0.5 font-mono text-[8.5px] tracking-[0.14em] text-muted uppercase">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="relative mt-12 sm:mt-14">
          <div
            aria-hidden
            className="timeline-spine absolute top-3 bottom-3 left-[11px] w-px md:left-1/2 md:-translate-x-px"
          />

          <div className="flex flex-col gap-7 md:gap-9">
            {experienceRoles.map((role, index) => {
              const isLeft = index % 2 === 0;

              return (
                <motion.article
                  key={role.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-70px" }}
                  transition={{ duration: 0.62, delay: index * 0.05, ease }}
                  className="relative pl-9 md:grid md:grid-cols-[minmax(0,1fr)_76px_minmax(0,1fr)] md:items-start md:pl-0"
                >
                  <span
                    aria-hidden
                    className="absolute top-8 left-0 flex h-[23px] w-[23px] items-center justify-center rounded-full border border-line-strong bg-surface-solid shadow-[0_0_0_5px_var(--canvas)] md:top-10 md:left-1/2 md:-translate-x-1/2"
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        role.current ? "bg-gold shadow-[0_0_12px_var(--gold)]" : "bg-accent"
                      }`}
                    />
                    {role.current ? (
                      <span
                        aria-hidden
                        className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-gold opacity-70"
                      />
                    ) : null}
                  </span>

                  <div
                    className={`md:row-start-1 ${
                      isLeft ? "md:col-start-1 md:pr-2" : "md:col-start-3 md:pl-2"
                    }`}
                  >
                    <motion.div
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.25, ease }}
                      className={`group relative overflow-hidden rounded-[24px] border bg-surface p-5 backdrop-blur-md transition-shadow duration-300 hover:shadow-[var(--shadow-lift)] sm:p-6 powershell:rounded-[3px] ${
                        role.current ? "border-gold/40" : "border-line hover:border-line-strong"
                      }`}
                    >
                      {role.current ? (
                        <span
                          aria-hidden
                          className="pointer-events-none absolute -top-16 -right-12 h-40 w-40 rounded-full bg-gold/15 blur-3xl"
                        />
                      ) : null}

                      <div className="relative">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[9px] font-semibold tracking-[0.12em] uppercase powershell:rounded-[2px] ${
                              role.current
                                ? "border-gold/40 bg-gold-soft text-gold"
                                : "border-line bg-surface-strong text-muted"
                            }`}
                          >
                            <CalendarDays className="h-3 w-3" aria-hidden />
                            {role.dateLabel}
                          </span>
                          {role.current ? (
                            <span className="inline-flex items-center gap-1.5 font-mono text-[9px] font-semibold tracking-[0.14em] text-gold uppercase">
                              <span className="relative flex h-1.5 w-1.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-60" />
                                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
                              </span>
                              Current
                            </span>
                          ) : null}
                        </div>

                        <h3 className="mt-4 text-lg leading-tight font-bold tracking-tight text-ink sm:text-xl">
                          {role.title}
                        </h3>

                        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11.5px]">
                          <span className="inline-flex items-center gap-1.5 font-semibold text-ink-soft">
                            <Building2 className="h-3.5 w-3.5 text-gold" aria-hidden />
                            {role.company}
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-muted">
                            <MapPin className="h-3 w-3" aria-hidden />
                            {role.location}
                          </span>
                        </div>

                        <p className="mt-1.5 font-mono text-[9px] tracking-[0.14em] text-accent uppercase">
                          {role.track}
                        </p>

                        <p className="mt-3.5 text-[13px] leading-relaxed text-ink-soft sm:text-[13.5px]">
                          {role.summary}
                        </p>

                        <ul className="mt-4 grid gap-2.5">
                          {role.bullets.map((bullet) => (
                            <li key={bullet} className="flex items-start gap-2.5">
                              <span
                                aria-hidden
                                className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-gold/80"
                              />
                              <span className="text-[12.5px] leading-relaxed text-muted">{bullet}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {role.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center rounded-full border border-line bg-surface-strong px-2.5 py-1 font-mono text-[8.5px] font-medium tracking-wide text-ink-soft powershell:rounded-[2px]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>

        {/* Education and certifications */}
        <div className="mt-16 sm:mt-20">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-70px" }}
            transition={{ duration: 0.55, ease }}
            className="flex flex-wrap items-end justify-between gap-3"
          >
            <div>
              <span className="eyebrow">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_10px_var(--gold)]"
                  aria-hidden
                />
                Foundation
              </span>
              <h3 className="mt-4 text-[clamp(1.5rem,3vw,2.15rem)] leading-tight font-extrabold tracking-tight text-ink">
                Education &amp; <span className="gradient-text">certifications</span>
              </h3>
            </div>
            <p className="max-w-sm text-[12px] leading-relaxed text-muted">
              Formal study in computer applications and mechanical engineering, backed by
              analytics, BI, and AI certifications.
            </p>
          </motion.div>

          <div className="mt-7 grid gap-3 lg:grid-cols-[1.05fr_0.95fr]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, ease }}
              className="glass rounded-[24px] p-5 sm:p-6 powershell:rounded-[3px]"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 font-mono text-[9px] tracking-[0.16em] text-gold uppercase">
                  <GraduationCap className="h-4 w-4" aria-hidden />
                  Education
                </span>
                <span className="font-mono text-[9px] text-muted">
                  {String(credentials.education.length).padStart(2, "0")} records
                </span>
              </div>

              <div className="mt-4 grid gap-2.5">
                {credentials.education.map((item, index) => (
                  <motion.div
                    key={item.degree}
                    initial={{ opacity: 0, x: -14 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.45, delay: index * 0.06, ease }}
                    className="group rounded-2xl border border-line bg-surface/70 px-4 py-3.5 transition-colors hover:border-gold/35 hover:bg-surface-strong powershell:rounded-[2px]"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1.5">
                      <p className="text-[13px] leading-snug font-semibold text-ink">{item.degree}</p>
                      <span
                        className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[8px] font-semibold tracking-[0.1em] uppercase powershell:rounded-[2px] ${
                          item.status === "In progress"
                            ? "bg-gold-soft text-gold"
                            : "bg-accent/10 text-accent"
                        }`}
                      >
                        {item.status === "In progress" ? (
                          <TrendingUp className="h-2.5 w-2.5" aria-hidden />
                        ) : (
                          <BadgeCheck className="h-2.5 w-2.5" aria-hidden />
                        )}
                        {item.status}
                      </span>
                    </div>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted">
                      <span>{item.school}</span>
                      <span aria-hidden className="h-1 w-1 rounded-full bg-line-strong" />
                      <span className="font-mono text-[9.5px] tracking-wide">{item.period}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: 0.08, ease }}
              className="relative overflow-hidden rounded-[24px] border border-line bg-surface-solid p-5 sm:p-6 powershell:rounded-[3px]"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -top-20 -right-16 h-48 w-48 rounded-full bg-accent/10 blur-3xl"
              />
              <div className="relative">
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 font-mono text-[9px] tracking-[0.16em] text-accent uppercase">
                    <Award className="h-4 w-4" aria-hidden />
                    Certifications
                  </span>
                  <span className="inline-flex items-center gap-1 font-mono text-[9px] text-muted">
                    <Sparkles className="h-3 w-3 text-gold" aria-hidden />
                    {credentials.certifications.length} earned
                  </span>
                </div>

                <ul className="mt-4 grid gap-1.5 sm:grid-cols-2">
                  {credentials.certifications.map((certification, index) => (
                    <motion.li
                      key={certification}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-30px" }}
                      transition={{ duration: 0.35, delay: index * 0.03 }}
                      className="flex items-start gap-2 rounded-xl border border-transparent px-2 py-1.5 transition-colors hover:border-line hover:bg-surface powershell:rounded-[2px]"
                    >
                      <BadgeCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" aria-hidden />
                      <span className="text-[11.5px] leading-snug text-ink-soft">{certification}</span>
                    </motion.li>
                  ))}
                </ul>

                <div className="mt-4 flex items-center gap-2 rounded-xl border border-dashed border-line px-3 py-2.5 powershell:rounded-[2px]">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden />
                  <p className="font-mono text-[8.5px] leading-relaxed tracking-[0.08em] text-muted uppercase">
                    Always adding one more — currently exploring retrieval evaluation and AI
                    product design.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
