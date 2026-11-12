/**
 * Central site configuration.
 * Update these values (and the files in data/knowledge-base) to make the
 * portfolio yours. Everything else on the page reads from here or the KB.
 */
export const siteConfig = {
  name: "Aditya Kumar",
  firstName: "Aditya",
  role: "AI Engineer",
  greeting: "Hey, I'm Aditya",
  intro:
    "I turn operational data into decisions — and build grounded AI that helps teams move faster without guessing.",
  location: "Hyderabad, Telangana, India",
  timezone: "IST · UTC+5:30",
  email: "adi.mech.32@gmail.com",
  phone: "+91 75492 37007",
  phoneHref: "+917549237007",
  whatsapp: "https://wa.me/917549237007",
  resumePath: "/resume.pdf",
  socials: {
    github: "https://github.com/boywithdragons/",
    linkedin: "https://www.linkedin.com/in/boywithdragons/",
  },
  /** Optional: create a free Web3Forms key to receive the contact form by email. */
  web3formsKey: process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "",
} as const;

/** Prefix public assets when the site is hosted under a GitHub Pages repo path. */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string): string {
  if (!path.startsWith("/")) return path;
  return `${basePath}${path}`;
}

export function absoluteUrl(path: string): string {
  return `${basePath}${path.startsWith("/") ? path : `/${path}`}`;
}
