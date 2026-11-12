"use client";

import { useEffect, useState } from "react";
import { ArrowDownToLine, Menu, X } from "lucide-react";
import { asset, siteConfig } from "@/lib/config";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "py-2.5" : "py-4 sm:py-5"
      }`}
    >
      <div className="container-page">
        <div
          className={`flex items-center justify-between gap-3 rounded-full border px-2.5 py-2 transition-all duration-300 powershell:rounded-[4px] ${
            scrolled || menuOpen
              ? "border-line bg-surface-strong shadow-[var(--shadow-soft)] backdrop-blur-xl"
              : "border-transparent bg-transparent"
          }`}
        >
          <a
            href={asset(siteConfig.resumePath)}
            download="Aditya-Kumar-Resume.pdf"
            className="group inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface-strong px-3.5 py-2 text-[12px] font-semibold tracking-tight text-ink transition-all duration-300 hover:border-accent hover:bg-accent hover:text-accent-ink hover:shadow-[0_10px_30px_-12px_var(--glow)] sm:px-4 sm:text-[13px] powershell:rounded-[2px]"
          >
            <span className="terminal-prompt !mb-0 !text-[9px] !text-current opacity-60" aria-hidden />
            <span className="sm:hidden">Resume</span>
            <span className="hidden sm:inline">Download Resume</span>
            <ArrowDownToLine
              aria-hidden
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-y-0.5"
            />
            <span className="sr-only">Download Aditya&apos;s resume as a PDF</span>
          </a>

          <nav aria-label="Primary" className="hidden items-center gap-0.5 lg:flex">
            {navItems.map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                className="group relative rounded-full px-3.5 py-2 text-[12px] font-medium text-muted transition-colors hover:text-ink powershell:rounded-[2px]"
              >
                <span className="mr-1.5 font-mono text-[9px] text-accent/70">0{index + 1}</span>
                {item.label}
                <span className="absolute inset-x-3.5 -bottom-0.5 h-px origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              aria-label={menuOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-ink transition-colors hover:border-line-strong hover:bg-surface-strong lg:hidden powershell:rounded-[2px]"
            >
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {menuOpen ? (
          <nav
            aria-label="Mobile"
            className="mt-2 grid gap-1 rounded-3xl border border-line bg-surface-strong p-2 shadow-[var(--shadow-soft)] backdrop-blur-xl lg:hidden powershell:rounded-[3px]"
          >
            {navItems.map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium text-ink transition-colors hover:bg-accent/10 powershell:rounded-[2px]"
              >
                <span>
                  <span className="mr-2 font-mono text-[10px] text-accent">0{index + 1}</span>
                  {item.label}
                </span>
                <span aria-hidden className="font-mono text-xs text-muted">
                  →
                </span>
              </a>
            ))}
          </nav>
        ) : null}
      </div>
    </header>
  );
}
