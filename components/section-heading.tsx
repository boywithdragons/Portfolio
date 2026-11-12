"use client";

import { motion } from "framer-motion";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  id?: string;
  accentWord?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  id,
  accentWord,
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <div className={`relative ${centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}`}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="terminal-prompt" aria-hidden />
        <span className="eyebrow">
          <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_var(--accent)]" aria-hidden />
          {eyebrow.replace(/^•\s*/, "")}
        </span>
      </motion.div>

      <motion.h2
        id={id}
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.65, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
        className="section-title mt-5 text-ink"
      >
        {accentWord && title.includes(accentWord) ? (
          <>
            {title.split(accentWord)[0]}
            <span className="gradient-text">{accentWord}</span>
            {title.split(accentWord).slice(1).join(accentWord)}
          </>
        ) : (
          title
        )}
      </motion.h2>

      {description ? (
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className={`section-copy mt-5 ${centered ? "mx-auto" : ""}`}
        >
          {description}
        </motion.p>
      ) : null}

      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
        className={`thin-rule mt-7 origin-left ${centered ? "mx-auto max-w-md" : "max-w-sm"}`}
      />
    </div>
  );
}
