# Aditya Kumar — Portfolio OS

A modern, interactive portfolio for an AI-focused data and operations engineer. It ships as a
fully static Next.js export that can be hosted on GitHub Pages, Netlify, Vercel, or any static
host.

- **Light theme:** lavender glassmorphism (`#F5F3FF` / `#EDE9FE`, ink `#1E1B4B`)
- **Dark theme:** a working PowerShell console aesthetic (`#012456`, amber `#F9F1A5`)
- **Left-hand scrollbar** on desktop, with the content direction kept LTR
- **Sparkle cursor** with spring-trailing rings (fine pointers only)
- **Client-side RAG assistant** that answers only from the versioned JSON knowledge base
- **WebGL ripple / dissolve** project previews
- **Single-open project accordion**, skills marquee, and an amber experience timeline

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 15 App Router, React 19 |
| Styling | Tailwind CSS v4, custom CSS tokens |
| Motion | Framer Motion 12 |
| Icons | lucide-react, react-icons |
| Retrieval | Dependency-free TF-IDF + keyword scoring in the browser |
| Export | `output: "export"`, no server runtime |
| Resume | Generated with `pdf-lib` from the knowledge base |

## Run locally

```bash
npm install
npm run dev          # http://localhost:3000
npm run test:rag     # 32-query retrieval regression suite
npm run build        # static export to ./out
npm start            # preview the exported site
```

## Where to edit things

| What | Where |
| --- | --- |
| Name, role, email, phone, socials | `lib/config.ts` |
| Resume download path | `siteConfig.resumePath` in `lib/config.ts` |
| About, education, certifications | `data/knowledge-base/profile.json` |
| Roles and timeline | `data/knowledge-base/experience.json` |
| Skill categories and marquee cards | `data/knowledge-base/skills.json` |
| Projects, links, preview images | `data/knowledge-base/projects.json` |
| RAG-only extras and FAQ answers | `data/knowledge-base/faq.json` |
| Theme tokens and shared CSS | `app/globals.css` |
| Page composition | `app/page.tsx` |
| Project artwork | `public/projects/*.svg` |
| Avatar | `public/avatar.svg` |

Sections and the assistant read from the same JSON, so updating an answer keeps the page and the
RAG assistant in sync.

### Social and project links

`lib/config.ts` points at Aditya's profiles and WhatsApp:

```ts
socials: {
  github: "https://github.com/boywithdragons/",
  linkedin: "https://www.linkedin.com/in/boywithdragons/",
},
whatsapp: "https://wa.me/917549237007",
```

`data/knowledge-base/projects.json` uses `https://github.com/boywithdragons/<project>` links for
the Live Showcase, Source Code, and ripple-card destinations. Update the individual paths if the
repository names change.

## The RAG assistant

- The whole engine lives in `lib/rag.ts`. It builds a TF-IDF index at runtime from the JSON files
  imported by `lib/knowledge.ts`.
- An alias map expands common phrasings (for example “CV” → “resume”), and strong tokens get
  extra weight.
- The confidence threshold is **0.62**. Anything below it fails closed with the exact fallback:

  > Answer to the asked question is not available. Please chat or send an email to Aditya using the below mentioned Contact option.

  The UI then opens a contact hand-off modal.
- `scripts/test-rag.ts` exercises 32 representative queries. Run `npm run test:rag` after editing
  the knowledge base.

Because everything runs client-side, there are no API keys and no server. The trade-off is that
the knowledge base is public — never put private data in it.

## Resume PDF

`public/resume.pdf` is committed so the download button works out of the box. Regenerate it after
editing the JSON:

```bash
npm run make:resume
```

The script in `scripts/make-resume.ts` lays out a two-page A4 resume from the same source data.

## Contact form

Static hosting means there is no server endpoint.

- By default, the form opens the visitor's mail client with the message pre-filled.
- For a real inbox delivery, create a free [Web3Forms](https://web3forms.com/) access key and set it
  as `NEXT_PUBLIC_WEB3FORMS_KEY` at build time. The form then POSTs to Web3Forms from the browser.

## Deploy to GitHub Pages

1. Push this project to a GitHub repository.
2. In **Settings → Pages**, set **Source** to **GitHub Actions**.
3. Push to `main`. `.github/workflows/deploy.yml` builds and deploys `out/`.

The workflow automatically computes the base path:

- Project site (`username.github.io/repo-name`) → `/repo-name`
- User site (`username.github.io`) → empty

If you deploy elsewhere, or want a custom base path, set it manually before building:

```bash
NEXT_PUBLIC_BASE_PATH=/repo-name npm run build
```

`asset()` in `lib/config.ts` prefixes public images and the resume; Next.js handles `_next`
assets itself. The workflow also writes `out/.nojekyll` so GitHub Pages serves the `_next`
directory.

## Project structure

```
app/
  globals.css        theme tokens, left scrollbar, marquee, timeline, PS styles
  layout.tsx         metadata, fonts, theme boot script, header + cursor
  page.tsx           section composition
  icon.svg           favicon
components/
  hero.tsx           iridescent hero, avatar, quick-question chat bar
  chat-bar.tsx       client-side RAG UI and fallback hand-off
  skills.tsx         floating category badge + dual-row marquee
  projects.tsx       single-open accordion with layout animation
  ripple-dissolve-card.tsx  WebGL ripple and dissolve preview
  experience.tsx     central timeline + education/certifications
  contact.tsx        copy email, static form, socials
  ...
data/knowledge-base/ JSON knowledge base (also powers the visible sections)
lib/
  config.ts          site data + base-path helper
  knowledge.ts       typed exports from the JSON files
  rag.ts             TF-IDF retrieval, aliases, threshold, fallback
scripts/
  make-resume.ts     pdf-lib resume generator
  test-rag.ts        retrieval regression tests
public/
  avatar.svg, resume.pdf, projects/*.svg, .nojekyll
```

## Accessibility notes

- The sparkle cursor only activates on `(pointer: fine)` devices and never replaces the native
  cursor on touch.
- `prefers-reduced-motion` disables marquee motion, smooth scrolling, and cursor sparkles.
- Project accordions use real buttons with `aria-expanded` / `aria-controls`, the chat is a
  labelled form, and the contact modal traps focus and closes on `Escape`.
- The theme respects the stored preference and sets `color-scheme` for native controls.

## Licence

Personal portfolio — the copy, resume data, and artwork belong to Aditya Kumar. Code is shared for
reference; please replace the personal content before reusing the template.
