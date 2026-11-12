"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/components/theme-provider";

const PALETTES = {
  light: [
    "rgba(244, 114, 182, 0.62)",
    "rgba(167, 139, 250, 0.7)",
    "rgba(45, 212, 191, 0.42)",
    "rgba(253, 224, 71, 0.44)",
    "rgba(129, 140, 248, 0.55)",
    "rgba(251, 146, 60, 0.3)",
    "rgba(232, 121, 249, 0.4)",
  ],
  powershell: [
    "rgba(37, 99, 235, 0.6)",
    "rgba(14, 165, 233, 0.45)",
    "rgba(125, 211, 252, 0.28)",
    "rgba(249, 241, 165, 0.2)",
    "rgba(30, 64, 175, 0.55)",
    "rgba(94, 234, 212, 0.16)",
    "rgba(59, 130, 246, 0.36)",
  ],
} as const;

export function IridescentCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const palette = PALETTES[theme === "powershell" ? "powershell" : "light"];
    const blobs = palette.map((color, index) => ({
      color,
      x: 0.14 + ((index * 0.137) % 0.72),
      y: 0.2 + ((index * 0.233) % 0.6),
      radius: 0.26 + ((index * 0.077) % 0.22),
      driftX: 0.07 + (index % 3) * 0.022,
      driftY: 0.05 + ((index + 1) % 4) * 0.018,
      speed: 0.00018 + index * 0.000035,
      phase: index * 1.7,
    }));

    let width = 1;
    let height = 1;
    let frame = 0;
    let start = performance.now();

    const draw = (now: number) => {
      const t = now - start;
      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = "lighter";

      for (const blob of blobs) {
        const x = width * (blob.x + Math.sin(t * blob.speed + blob.phase) * blob.driftX);
        const y = height * (blob.y + Math.cos(t * blob.speed * 0.82 + blob.phase) * blob.driftY);
        const radius = Math.min(width, height) * (blob.radius + Math.sin(t * blob.speed * 1.4 + blob.phase) * 0.04);
        const gradient = context.createRadialGradient(x, y, 0, x, y, Math.max(radius, 1));
        gradient.addColorStop(0, blob.color);
        gradient.addColorStop(0.58, blob.color.replace(/0\.\d+\)$/, "0.18)"));
        gradient.addColorStop(1, "rgba(0,0,0,0)");
        context.fillStyle = gradient;
        context.fillRect(0, 0, width, height);
      }

      context.globalCompositeOperation = "source-over";
      frame = window.requestAnimationFrame(draw);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(rect.width, 1);
      height = Math.max(rect.height, 1);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (reduced.matches) {
        start = performance.now();
        draw(start);
        if (frame) window.cancelAnimationFrame(frame);
        frame = 0;
      }
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    const shouldAnimate = () => !reduced.matches && !document.hidden;

    const startLoop = () => {
      if (frame || !shouldAnimate()) return;
      start = performance.now() - 4000;
      frame = window.requestAnimationFrame(draw);
    };

    const stopLoop = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
    };

    const onVisibility = () => (document.hidden ? stopLoop() : startLoop());
    const onMotion = () => {
      stopLoop();
      resize();
      if (!reduced.matches) startLoop();
    };

    document.addEventListener("visibilitychange", onVisibility);
    reduced.addEventListener("change", onMotion);
    startLoop();

    return () => {
      stopLoop();
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      reduced.removeEventListener("change", onMotion);
    };
  }, [theme]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="h-full w-full opacity-90 blur-[54px] saturate-150 [transform:translateZ(0)] powershell:opacity-80 powershell:blur-[62px]"
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_18%,var(--canvas)_88%)] opacity-80" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-canvas" />
    </div>
  );
}
