"use client";

import { Moon, TerminalSquare } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { theme, setTheme, mounted } = useTheme();
  const isPowerShell = theme === "powershell";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isPowerShell}
      aria-label={isPowerShell ? "Switch to light lavender theme" : "Switch to PowerShell dark theme"}
      title={isPowerShell ? "Light mode" : "PowerShell mode"}
      onClick={() => setTheme(isPowerShell ? "light" : "powershell")}
      className="group relative flex h-10 w-[112px] shrink-0 items-center rounded-full border border-line bg-surface p-1 text-[11px] font-semibold backdrop-blur-md transition-colors duration-300 hover:border-line-strong powershell:rounded-[3px]"
    >
      <span
        aria-hidden
        className={`absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-full border border-line-strong bg-surface-strong shadow-sm transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] powershell:rounded-[2px] ${
          mounted && isPowerShell ? "translate-x-full" : "translate-x-0"
        }`}
      />
      <span
        className={`relative z-10 flex w-1/2 items-center justify-center gap-1 transition-colors ${
          !isPowerShell ? "text-accent" : "text-muted"
        }`}
      >
        <Moon className="h-3.5 w-3.5" aria-hidden />
        <span className="hidden sm:inline">Day</span>
      </span>
      <span
        className={`relative z-10 flex w-1/2 items-center justify-center gap-1 transition-colors ${
          mounted && isPowerShell ? "text-accent" : "text-muted"
        }`}
      >
        <TerminalSquare className="h-3.5 w-3.5" aria-hidden />
        <span className="hidden sm:inline">PS</span>
      </span>
    </button>
  );
}
