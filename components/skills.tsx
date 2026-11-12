"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  Bot,
  BrainCircuit,
  ChartColumnIncreasing,
  ChartSpline,
  Code,
  Database,
  FileSpreadsheet,
  Gauge,
  Laptop,
  Monitor,
  MonitorCog,
  Presentation,
  ShieldCheck,
  Sigma,
  Sparkles,
  SquareTerminal,
  Table2,
  TableProperties,
  TrendingUp,
  Waves,
  Workflow,
} from "lucide-react";
import type { CSSProperties, ComponentType } from "react";
import { useEffect, useRef, useState } from "react";
import {
  SiC,
  SiCplusplus,
  SiCss,
  SiGithub,
  SiGithubcopilot,
  SiGit,
  SiGooglesheets,
  SiHtml5,
  SiJavascript,
  SiJupyter,
  SiNextdotjs,
  SiNumpy,
  SiPandas,
  SiPlotly,
  SiPython,
  SiR,
  SiReact,
  SiScikitlearn,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";
import { SectionHeading } from "@/components/section-heading";
import { skillCategories } from "@/lib/knowledge";
import type { Skill } from "@/lib/types";

type IconComponent = ComponentType<{ className?: string }>;

const ICONS: Record<string, IconComponent> = {
  python: SiPython,
  r: SiR,
  javascript: SiJavascript,
  typescript: SiTypescript,
  html5: SiHtml5,
  css3: SiCss,
  c: SiC,
  cpp: SiCplusplus,
  pandas: SiPandas,
  numpy: SiNumpy,
  scikitlearn: SiScikitlearn,
  plotly: SiPlotly,
  googlesheets: SiGooglesheets,
  git: SiGit,
  github: SiGithub,
  jupyter: SiJupyter,
  nextjs: SiNextdotjs,
  react: SiReact,
  tailwind: SiTailwindcss,
  copilot: SiGithubcopilot,
  database: Database,
  powerbi: ChartColumnIncreasing,
  tableau: ChartSpline,
  excel: FileSpreadsheet,
  chart: Sigma,
  powerquery: Table2,
  gauge: Gauge,
  sparkles: Sparkles,
  openai: BrainCircuit,
  brain: BrainCircuit,
  bot: Bot,
  shieldcheck: ShieldCheck,
  monitor: Monitor,
  tables: TableProperties,
  workflow: Workflow,
  trendingup: TrendingUp,
  presentation: Presentation,
  vscode: Code,
  powershell: SquareTerminal,
  windows: MonitorCog,
  laptop: Laptop,
  waves: Waves,
};

const CATEGORY_COLOR: Record<string, string> = {
  languages: "var(--accent)",
  data: "var(--accent-3)",
  bi: "var(--gold)",
  ai: "var(--accent-2)",
  ops: "#0ea5e9",
  tools: "#8b5cf6",
};

const CATEGORY_SHORT: Record<string, string> = {
  languages: "LANG",
  data: "DATA",
  bi: "BI",
  ai: "AI",
  ops: "OPS",
  tools: "TOOLS",
};

interface FlatSkill extends Skill {
  categoryId: string;
  categoryIndex: number;
  categoryLabel: string;
  color: string;
}

const ALL_SKILLS: FlatSkill[] = skillCategories.flatMap((category, categoryIndex) =>
  category.skills.map((skill) => ({
    ...skill,
    categoryId: category.id,
    categoryIndex,
    categoryLabel: category.label,
    color: CATEGORY_COLOR[category.id] ?? "var(--accent)",
  })),
);

const ROWS = [ALL_SKILLS.filter((_, index) => index % 2 === 0), ALL_SKILLS.filter((_, index) => index % 2 === 1)];

function SkillCard({
  skill,
  active,
  onActivate,
  interactive = true,
}: {
  skill: FlatSkill;
  active: boolean;
  onActivate?: () => void;
  interactive?: boolean;
}) {
  const Icon = ICONS[skill.icon] ?? Sparkles;

  const content = (
    <>
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:scale-105 powershell:rounded-[2px]"
        style={{
          color: skill.color,
          borderColor: `color-mix(in srgb, ${skill.color} 24%, transparent)`,
          backgroundColor: `color-mix(in srgb, ${skill.color} 10%, transparent)`,
        }}
      >
        <Icon className="h-[18px] w-[18px]" />
      </span>
      <span className="min-w-0 text-left">
        <span className="block truncate text-[12.5px] font-semibold text-ink">{skill.name}</span>
        <span className="mt-0.5 flex items-center gap-1 font-mono text-[8.5px] tracking-[0.1em] text-muted uppercase">
          <span
            className="inline-block h-1 w-1 rounded-full"
            style={{ backgroundColor: skill.color }}
            aria-hidden
          />
          {CATEGORY_SHORT[skill.categoryId] ?? skill.categoryLabel}
          <span aria-hidden className="opacity-40">
            /
          </span>
          {skill.level}
        </span>
      </span>
    </>
  );

  const className = `group flex w-[164px] shrink-0 items-center gap-3 rounded-2xl border px-3 py-2.5 backdrop-blur-md transition-all duration-300 powershell:rounded-[2px] sm:w-[178px] ${
    active
      ? "border-accent/40 bg-surface-strong shadow-[0_16px_36px_-24px_var(--glow)]"
      : "border-line bg-surface/80 hover:-translate-y-0.5 hover:border-line-strong hover:bg-surface-strong"
  }`;

  const style = active
    ? ({
        borderColor: `color-mix(in srgb, ${skill.color} 46%, transparent)`,
        boxShadow: `0 0 0 1px color-mix(in srgb, ${skill.color} 18%, transparent), 0 16px 34px -26px ${skill.color}`,
      } as CSSProperties)
    : undefined;

  if (!interactive) {
    return (
      <div aria-hidden className={className} style={style}>
        {content}
      </div>
    );
  }

  return (
    <button type="button" onClick={onActivate} onFocus={onActivate} className={className} style={style}>
      {content}
      <span className="sr-only">Highlight {skill.categoryLabel}</span>
    </button>
  );
}

export function SkillsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const inView = useInView(sectionRef, { amount: 0.2, once: false });
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const active = skillCategories[activeIndex] ?? skillCategories[0];
  const activeColor = CATEGORY_COLOR[active.id] ?? "var(--accent)";

  useEffect(() => {
    if (!inView || paused) return;
    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % skillCategories.length);
    }, 3400);
    return () => window.clearInterval(timer);
  }, [inView, paused]);

  return (
    <section
      id="skills"
      ref={sectionRef}
      aria-labelledby="skills-title"
      className="relative py-20 sm:py-28"
    >
      <div className="container-page">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="• Toolkit"
            id="skills-title"
            title="TECHNICAL SKILLS"
            accentWord="SKILLS"
            description="The technologies and frameworks I use to build and deploy multiple projects."
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="grid shrink-0 grid-cols-3 gap-2 lg:pb-2"
          >
            {[
              { value: String(skillCategories.length), label: "Domains" },
              { value: String(ALL_SKILLS.length), label: "Tools" },
              { value: "4+", label: "Years" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-line bg-surface/70 px-3 py-2.5 text-center backdrop-blur-md powershell:rounded-[2px]"
              >
                <p className="font-mono text-lg font-bold text-ink">{stat.value}</p>
                <p className="mt-0.5 font-mono text-[8.5px] tracking-[0.14em] text-muted uppercase">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="relative mt-10 sm:mt-12">
          {/* Floating active-category badge */}
          <div className="sticky top-24 z-20 mx-auto mb-7 flex w-fit">
            <div
              className="glass-strong flex items-center gap-3 rounded-full px-4 py-2.5 transition-shadow duration-300 powershell:rounded-[2px]"
              style={{ boxShadow: `0 18px 46px -30px ${activeColor}` }}
            >
              <span className="relative flex h-2 w-2" aria-hidden>
                <span
                  className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-50"
                  style={{ backgroundColor: activeColor }}
                />
                <span
                  className="relative inline-flex h-2 w-2 rounded-full"
                  style={{ backgroundColor: activeColor }}
                />
              </span>
              <span className="font-mono text-[9px] tracking-[0.16em] text-muted uppercase">Exploring</span>
              <span className="h-3.5 w-px bg-line-strong" aria-hidden />
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={active.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className="min-w-[110px] text-xs font-semibold text-ink sm:min-w-[128px]"
                >
                  {active.label}
                </motion.span>
              </AnimatePresence>
              <span
                className="rounded-full px-2 py-0.5 font-mono text-[9px] font-semibold powershell:rounded-[2px]"
                style={{
                  color: activeColor,
                  backgroundColor: `color-mix(in srgb, ${activeColor} 12%, transparent)`,
                }}
              >
                {active.skills.length}
              </span>
            </div>
          </div>

          <div
            className="marquee-mask -mx-2 space-y-2.5 px-2 py-1 sm:space-y-3"
            aria-label="Technical skills marquee"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {ROWS.map((row, rowIndex) => (
              <div key={rowIndex} className="marquee-track reverse" style={{ "--marquee-duration": rowIndex === 0 ? "72s" : "86s" } as CSSProperties}>
                {[0, 1].map((copy) => (
                  <div key={copy} className="flex shrink-0 gap-2.5 pr-2.5 sm:gap-3 sm:pr-3" aria-hidden={copy === 1}>
                    {row.map((skill) => (
                      <SkillCard
                        key={`${copy}-${skill.name}`}
                        skill={skill}
                        interactive={copy === 0}
                        active={skill.categoryIndex === activeIndex}
                        onActivate={() => {
                          setActiveIndex(skill.categoryIndex);
                          setPaused(true);
                        }}
                      />
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            {skillCategories.map((category, index) => {
              const isActive = index === activeIndex;
              const color = CATEGORY_COLOR[category.id] ?? "var(--accent)";
              return (
                <button
                  key={category.id}
                  type="button"
                  onMouseEnter={() => setActiveIndex(index)}
                  onFocus={() => setActiveIndex(index)}
                  onClick={() => setActiveIndex(index)}
                  aria-pressed={isActive}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 font-mono text-[9px] font-semibold tracking-[0.1em] uppercase transition-all duration-300 powershell:rounded-[2px] ${
                    isActive
                      ? "border-line-strong bg-surface-strong text-ink"
                      : "border-line bg-surface/50 text-muted hover:text-ink"
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} aria-hidden />
                  {category.label}
                  <span aria-hidden className="opacity-50">
                    {String(category.skills.length).padStart(2, "0")}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="mt-4 text-center font-mono text-[9.5px] tracking-[0.12em] text-muted/80 uppercase">
            Hover a card to pin its category · the badge follows as you explore
          </p>
        </div>
      </div>
    </section>
  );
}
