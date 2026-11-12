"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

const INTERACTIVE_SELECTOR = "a, button, input, textarea, select, [role='button'], [data-cursor='hover']";

const RINGS = [
  { size: 26, stiffness: 520, damping: 38, mass: 0.25, opacity: 0.9 },
  { size: 44, stiffness: 280, damping: 30, mass: 0.4, opacity: 0.55 },
  { size: 68, stiffness: 170, damping: 26, mass: 0.6, opacity: 0.28 },
];

const STAR_PATH =
  "M12 0c1.15 7.6 3.25 9.7 12 12-8.75 2.3-10.85 4.4-12 12-1.15-7.6-3.25-9.7-12-12C8.75 9.7 10.85 7.6 12 0Z";

const SPARK_COLORS = ["var(--accent)", "var(--accent-2)", "var(--accent-3)", "var(--gold)"];

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  driftX: number;
  driftY: number;
  color: string;
  duration: number;
  ring: boolean;
}

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  const pointerX = useMotionValue(-100);
  const pointerY = useMotionValue(-100);

  const coreX = useSpring(pointerX, { stiffness: 1100, damping: 55, mass: 0.18 });
  const coreY = useSpring(pointerY, { stiffness: 1100, damping: 55, mass: 0.18 });

  const ringX0 = useSpring(pointerX, { stiffness: RINGS[0].stiffness, damping: RINGS[0].damping, mass: RINGS[0].mass });
  const ringY0 = useSpring(pointerY, { stiffness: RINGS[0].stiffness, damping: RINGS[0].damping, mass: RINGS[0].mass });
  const ringX1 = useSpring(pointerX, { stiffness: RINGS[1].stiffness, damping: RINGS[1].damping, mass: RINGS[1].mass });
  const ringY1 = useSpring(pointerY, { stiffness: RINGS[1].stiffness, damping: RINGS[1].damping, mass: RINGS[1].mass });
  const ringX2 = useSpring(pointerX, { stiffness: RINGS[2].stiffness, damping: RINGS[2].damping, mass: RINGS[2].mass });
  const ringY2 = useSpring(pointerY, { stiffness: RINGS[2].stiffness, damping: RINGS[2].damping, mass: RINGS[2].mass });

  const springPairs = [
    [ringX0, ringY0],
    [ringX1, ringY1],
    [ringX2, ringY2],
  ] as const;

  const sparkleId = useRef(0);
  const lastSpawn = useRef(0);
  const frame = useRef<number | null>(null);
  const pendingPoint = useRef<{ x: number; y: number } | null>(null);
  const timers = useRef<Set<number>>(new Set());

  const spawnSparkles = useCallback(() => {
    frame.current = null;
    const point = pendingPoint.current;
    if (!point) return;

    const now = performance.now();
    if (now - lastSpawn.current < 52) return;
    lastSpawn.current = now;

    const id = sparkleId.current++;
    const ring = Math.random() > 0.72;
    const duration = 0.42 + Math.random() * 0.26;

    const sparkle: Sparkle = {
      id,
      x: point.x,
      y: point.y,
      size: ring ? 9 + Math.random() * 8 : 4 + Math.random() * 7,
      rotation: Math.random() * 180,
      driftX: (Math.random() - 0.5) * 38,
      driftY: 12 + Math.random() * 34,
      color: SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)],
      duration,
      ring,
    };

    setSparkles((current) => [...current.slice(-24), sparkle]);

    const timer = window.setTimeout(() => {
      setSparkles((current) => current.filter((item) => item.id !== id));
      timers.current.delete(timer);
    }, duration * 1000 + 120);
    timers.current.add(timer);
  }, []);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");

    const updateEnabled = () => {
      setEnabled(fine.matches);
      document.documentElement.classList.toggle("custom-cursor-active", fine.matches);
    };
    updateEnabled();

    fine.addEventListener("change", updateEnabled);

    return () => {
      fine.removeEventListener("change", updateEnabled);
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onMove = (event: PointerEvent) => {
      pointerX.set(event.clientX);
      pointerY.set(event.clientY);
      setVisible(true);

      if (reducedMotion) return;
      pendingPoint.current = { x: event.clientX, y: event.clientY };
      if (frame.current === null) {
        frame.current = window.requestAnimationFrame(spawnSparkles);
      }
    };

    const onOver = (event: MouseEvent) => {
      const target = event.target as Element | null;
      setHovered(Boolean(target?.closest(INTERACTIVE_SELECTOR)));
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
      if (frame.current !== null) window.cancelAnimationFrame(frame.current);
      frame.current = null;
      for (const timer of timers.current) window.clearTimeout(timer);
      timers.current.clear();
    };
  }, [enabled, pointerX, pointerY, spawnSparkles]);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[9999] hidden [@media(pointer:fine)]:block">
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          initial={{ x: sparkle.x, y: sparkle.y, opacity: 0, scale: 0.15, rotate: sparkle.rotation }}
          animate={{
            x: sparkle.x + sparkle.driftX,
            y: sparkle.y + sparkle.driftY,
            opacity: [0, 0.95, 0],
            scale: [0.25, 1, 0.15],
            rotate: sparkle.rotation + 95,
          }}
          transition={{ duration: sparkle.duration, ease: "easeOut", times: [0, 0.25, 1] }}
          className="absolute top-0 left-0"
          style={{ color: sparkle.color }}
        >
          {sparkle.ring ? (
            <span
              className="block rounded-full border"
              style={{ width: sparkle.size, height: sparkle.size, borderColor: "currentColor" }}
            />
          ) : (
            <svg width={sparkle.size} height={sparkle.size} viewBox="0 0 24 24" fill="currentColor">
              <path d={STAR_PATH} />
            </svg>
          )}
        </motion.div>
      ))}

      {RINGS.map((ring, index) => {
        const [x, y] = springPairs[index];
        return (
          <motion.div key={ring.size} style={{ x, y }} className="absolute top-0 left-0 h-0 w-0">
            <motion.span
              animate={{
                scale: hovered ? 1.45 : 1,
                opacity: visible ? ring.opacity : 0,
                borderWidth: hovered ? 1.5 : 1,
              }}
              transition={{ type: "spring", stiffness: 320, damping: 24 }}
              className="absolute rounded-full border border-accent"
              style={{ width: ring.size, height: ring.size, left: -ring.size / 2, top: -ring.size / 2 }}
            />
          </motion.div>
        );
      })}

      <motion.div style={{ x: coreX, y: coreY }} className="absolute top-0 left-0 h-0 w-0">
        <motion.span
          animate={{ scale: hovered ? 0.5 : 1, opacity: visible ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 380, damping: 22 }}
          className="absolute -top-[3px] -left-[3px] block h-[6px] w-[6px] rounded-full bg-accent shadow-[0_0_14px_var(--accent)]"
        />
      </motion.div>
    </div>
  );
}
