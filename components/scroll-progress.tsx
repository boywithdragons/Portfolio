"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.3 });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed top-0 right-0 left-0 z-[70] h-[3px] origin-left bg-gradient-to-r from-accent via-accent-2 to-accent-3 powershell:h-[4px] powershell:bg-[repeating-linear-gradient(90deg,var(--accent)_0_8px,transparent_8px_14px)]"
    />
  );
}
