import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";

import { CustomCursor } from "@/components/custom-cursor";
import { ScrollProgress } from "@/components/scroll-progress";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";

const themeScript = `(function(){try{var t=localStorage.getItem("aditya-theme");if(t==="powershell"){document.documentElement.dataset.theme="powershell";document.documentElement.style.colorScheme="dark";}}catch(e){}})();`;

export const metadata: Metadata = {
  title: {
    default: "Aditya Kumar — AI Engineer",
    template: "%s · Aditya Kumar",
  },
  description:
    "Portfolio of Aditya Kumar, an AI-focused data and operations engineer in Hyderabad. Projects in RAG, Power BI, Python, SQL, and reporting automation.",
  keywords: [
    "Aditya Kumar",
    "AI Engineer",
    "Data Analyst",
    "Power BI",
    "Python",
    "SQL",
    "RAG",
    "Hyderabad",
  ],
  authors: [{ name: "Aditya Kumar" }],
  creator: "Aditya Kumar",
  openGraph: {
    type: "website",
    title: "Aditya Kumar — AI Engineer",
    description:
      "AI-focused data and operations engineer. Client-side RAG assistant, Power BI dashboards, Python analytics, and reporting automation.",
    siteName: "Aditya Kumar",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aditya Kumar — AI Engineer",
    description: "AI-focused data and operations engineer based in Hyderabad.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f3ff" },
    { media: "(prefers-color-scheme: dark)", color: "#012456" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ThemeProvider>
          <a
            href="#main"
            className="fixed top-3 left-3 z-[120] -translate-y-24 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-ink transition-transform focus:translate-y-0"
          >
            Skip to content
          </a>
          <ScrollProgress />
          <CustomCursor />
          <SiteHeader />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
