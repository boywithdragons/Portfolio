import { ArrowUp, Github, Linkedin, Mail } from "lucide-react";
import { asset, siteConfig } from "@/lib/config";

const footerLinks = [
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export function SiteFooter() {
  return (
    <footer className="relative border-t border-line pt-10 pb-6">
      <div className="container-page">
        <div className="ps-window-bar">footer.ps1</div>

        <div className="grid gap-8 md:grid-cols-[1.3fr_0.7fr_0.7fr]">
          <div>
            <a href="#top" className="inline-flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-2 font-mono text-[11px] font-bold text-accent-ink powershell:rounded-[2px]">
                AK
              </span>
              <span className="text-sm font-bold tracking-tight text-ink">{siteConfig.name}</span>
            </a>
            <p className="mt-3 max-w-xs text-[12px] leading-relaxed text-muted">
              AI engineer in Hyderabad. I turn operational data into decisions and build grounded
              AI that knows when to say &ldquo;I don&apos;t know.&rdquo;
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <a
                href={`mailto:${siteConfig.email}`}
                aria-label={`Email ${siteConfig.name}`}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-surface text-muted transition-colors hover:border-accent/40 hover:text-accent powershell:rounded-[2px]"
              >
                <Mail className="h-3.5 w-3.5" aria-hidden />
              </a>
              <a
                href={siteConfig.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-surface text-muted transition-colors hover:border-accent/40 hover:text-accent powershell:rounded-[2px]"
              >
                <Github className="h-3.5 w-3.5" aria-hidden />
              </a>
              <a
                href={siteConfig.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-surface text-muted transition-colors hover:border-accent/40 hover:text-accent powershell:rounded-[2px]"
              >
                <Linkedin className="h-3.5 w-3.5" aria-hidden />
              </a>
              <a
                href={asset(siteConfig.resumePath)}
                download="Aditya-Kumar-Resume.pdf"
                className="ml-1 font-mono text-[9px] tracking-[0.12em] text-muted uppercase transition-colors hover:text-accent"
              >
                Resume.pdf ↓
              </a>
            </div>
          </div>

          <nav aria-label="Footer">
            <p className="font-mono text-[9px] tracking-[0.16em] text-muted uppercase">Sitemap</p>
            <ul className="mt-3 grid gap-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="link-sweep text-[12px] text-ink-soft transition-colors hover:text-accent"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="font-mono text-[9px] tracking-[0.16em] text-muted uppercase">Colophon</p>
            <ul className="mt-3 grid gap-2 text-[12px] text-ink-soft">
              <li>Next.js 15 · React 19</li>
              <li>Tailwind CSS v4</li>
              <li>Framer Motion · WebGL</li>
              <li>Client-side RAG</li>
            </ul>
            <a
              href={siteConfig.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="link-sweep mt-3 inline-flex text-[11px] font-semibold text-accent"
            >
              View the source
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-line pt-4 sm:flex-row sm:items-center">
          <p className="font-mono text-[9px] tracking-[0.1em] text-muted uppercase">
            © {new Date().getFullYear()} {siteConfig.name} · Built and maintained in Hyderabad
          </p>
          <div className="flex items-center gap-4">
            <p className="hidden font-mono text-[9px] tracking-[0.1em] text-muted/70 uppercase sm:block">
              PS C:\Users\Aditya&gt; exit
            </p>
            <a
              href="#top"
              aria-label="Back to top"
              className="group flex h-8 w-8 items-center justify-center rounded-full border border-line bg-surface text-muted transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:text-accent powershell:rounded-[2px]"
            >
              <ArrowUp className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5" aria-hidden />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
