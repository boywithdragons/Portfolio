import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { PDFFont, PDFPage } from "pdf-lib";

const root = process.cwd();
const dataDir = path.join(root, "data", "knowledge-base");

function readJson<T>(file: string): T {
  return JSON.parse(readFileSync(path.join(dataDir, file), "utf8")) as T;
}

interface ExperienceRole {
  title: string;
  track: string;
  company: string;
  location: string;
  dateLabel: string;
  summary: string;
  bullets: string[];
  tags: string[];
}

interface Project {
  title: string;
  tagline: string;
  tech: string[];
  year: string;
}

interface SkillCategory {
  label: string;
  skills: { name: string }[];
}

const experience = readJson<{ roles: ExperienceRole[] }>("experience.json");
const profile = readJson<{
  credentials: {
    education: { degree: string; school: string; period: string; status: string }[];
    certifications: string[];
  };
  entries: { id: string; answer: string }[];
}>("profile.json");
const projects = readJson<{ projects: Project[] }>("projects.json");
const skills = readJson<{ categories: SkillCategory[] }>("skills.json");

const contact = {
  name: "Aditya Kumar",
  role: "AI Engineer · Data & Operations",
  email: "adi.mech.32@gmail.com",
  phone: "+91 75492 37007",
  location: "Hyderabad, Telangana, India",
  linkedin: "linkedin.com/in/boywithdragons",
  github: "github.com/boywithdragons",
};

const summary =
  profile.entries.find((entry) => entry.id === "profile-about")?.answer ??
  "AI-focused data and operations engineer with 4+ years of experience in IT support, reporting, and data-driven process improvement.";

const A4 = { width: 595.28, height: 841.89 };
const margin = 44;
const bottomLimit = 56;

const color = {
  ink: rgb(0.118, 0.106, 0.294),
  body: rgb(0.255, 0.231, 0.416),
  muted: rgb(0.384, 0.361, 0.537),
  accent: rgb(0.427, 0.157, 0.851),
  accent2: rgb(0.859, 0.153, 0.475),
  gold: rgb(0.706, 0.325, 0.035),
  line: rgb(0.918, 0.902, 0.984),
  white: rgb(1, 1, 1),
  soft: rgb(0.937, 0.929, 0.996),
};

async function main() {
  const doc = await PDFDocument.create();
  doc.setTitle("Aditya Kumar — Resume");
  doc.setAuthor("Aditya Kumar");
  doc.setSubject("AI Engineer · Data & Operations");
  doc.setKeywords(["AI", "Data Analytics", "Power BI", "Python", "SQL", "RAG"]);
  doc.setCreator("Portfolio OS resume generator");
  doc.setProducer("pdf-lib");

  const fonts = {
    regular: await doc.embedFont(StandardFonts.Helvetica),
    bold: await doc.embedFont(StandardFonts.HelveticaBold),
    italic: await doc.embedFont(StandardFonts.HelveticaOblique),
    mono: await doc.embedFont(StandardFonts.Courier),
  };

  let page: PDFPage = doc.addPage([A4.width, A4.height]);
  let y = 0;
  let pageNumber = 1;

  const addPage = () => {
    page = doc.addPage([A4.width, A4.height]);
    pageNumber += 1;
    y = A4.height - margin - 10;
    page.drawText(contact.name, {
      x: margin,
      y: A4.height - 40,
      size: 8,
      font: fonts.bold,
      color: color.muted,
    });
    page.drawText("AI Engineer · Data & Operations", {
      x: A4.width - margin - fonts.regular.widthOfTextAtSize("AI Engineer · Data & Operations", 8),
      y: A4.height - 40,
      size: 8,
      font: fonts.regular,
      color: color.muted,
    });
    page.drawLine({
      start: { x: margin, y: A4.height - 48 },
      end: { x: A4.width - margin, y: A4.height - 48 },
      thickness: 0.6,
      color: color.line,
    });
  };

  const ensure = (needed: number) => {
    if (y - needed < bottomLimit) addPage();
  };

  const wrap = (text: string, font: PDFFont, size: number, width: number) => {
    const words = text.split(/\s+/).filter(Boolean);
    const lines: string[] = [];
    let line = "";
    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(candidate, size) > width && line) {
        lines.push(line);
        line = word;
      } else {
        line = candidate;
      }
    }
    if (line) lines.push(line);
    return lines;
  };

  const paragraph = (
    text: string,
    options: {
      size?: number;
      font?: PDFFont;
      color?: ReturnType<typeof rgb>;
      x?: number;
      width?: number;
      lineHeight?: number;
      gapAfter?: number;
    } = {},
  ) => {
    const size = options.size ?? 8.8;
    const font = options.font ?? fonts.regular;
    const tint = options.color ?? color.body;
    const x = options.x ?? margin;
    const width = options.width ?? A4.width - margin * 2;
    const lineHeight = options.lineHeight ?? size * 1.42;
    const lines = wrap(text, font, size, width);
    ensure(lines.length * lineHeight + (options.gapAfter ?? 0));
    for (const line of lines) {
      page.drawText(line, { x, y, size, font, color: tint });
      y -= lineHeight;
    }
    if (options.gapAfter) y -= options.gapAfter;
  };

  const section = (title: string) => {
    ensure(34);
    y -= 6;
    page.drawText(title.toUpperCase(), {
      x: margin,
      y,
      size: 9,
      font: fonts.bold,
      color: color.accent,
    });
    const labelWidth = fonts.bold.widthOfTextAtSize(title.toUpperCase(), 9);
    page.drawLine({
      start: { x: margin + labelWidth + 10, y: y + 3 },
      end: { x: A4.width - margin, y: y + 3 },
      thickness: 0.7,
      color: color.line,
    });
    y -= 14;
  };

  const bullet = (text: string) => {
    const size = 8.6;
    const x = margin + 12;
    const width = A4.width - margin * 2 - 12;
    const lineHeight = size * 1.4;
    const lines = wrap(text, fonts.regular, size, width);
    ensure(lines.length * lineHeight);
    page.drawCircle({ x: margin + 3.5, y: y + 3.3, size: 1.5, color: color.gold });
    for (const line of lines) {
      page.drawText(line, { x, y, size, font: fonts.regular, color: color.body });
      y -= lineHeight;
    }
    y -= 1.4;
  };

  // ------------------------------------------------------------------ //
  // Header banner                                                       //
  // ------------------------------------------------------------------ //
  const bannerHeight = 118;
  page.drawRectangle({
    x: 0,
    y: A4.height - bannerHeight,
    width: A4.width,
    height: bannerHeight,
    color: color.ink,
  });
  page.drawRectangle({
    x: 0,
    y: A4.height - bannerHeight,
    width: A4.width,
    height: 4,
    color: color.accent,
  });
  page.drawCircle({
    x: A4.width - 68,
    y: A4.height - 34,
    size: 54,
    color: rgb(0.337, 0.235, 0.729),
    opacity: 0.35,
  });
  page.drawCircle({
    x: A4.width - 22,
    y: A4.height - 108,
    size: 30,
    color: rgb(0.859, 0.153, 0.475),
    opacity: 0.22,
  });

  page.drawText(contact.name, {
    x: margin,
    y: A4.height - 52,
    size: 25,
    font: fonts.bold,
    color: color.white,
  });
  page.drawText(contact.role, {
    x: margin,
    y: A4.height - 70,
    size: 10,
    font: fonts.regular,
    color: rgb(0.867, 0.847, 1),
  });
  page.drawText("4+ years · Python · SQL · Power BI · RAG · IT Operations", {
    x: margin,
    y: A4.height - 84,
    size: 8,
    font: fonts.mono,
    color: rgb(0.749, 0.714, 0.965),
  });

  const contactLine = `${contact.email}   ·   ${contact.phone}   ·   ${contact.location}`;
  page.drawText(contactLine, {
    x: margin,
    y: A4.height - 104,
    size: 8,
    font: fonts.regular,
    color: rgb(0.867, 0.847, 1),
  });
  const linkLine = `${contact.linkedin}   ·   ${contact.github}`;
  page.drawText(linkLine, {
    x: A4.width - margin - fonts.regular.widthOfTextAtSize(linkLine, 8),
    y: A4.height - 104,
    size: 8,
    font: fonts.regular,
    color: rgb(0.749, 0.714, 0.965),
  });

  y = A4.height - bannerHeight - 24;

  // ------------------------------------------------------------------ //
  // Summary                                                             //
  // ------------------------------------------------------------------ //
  section("Profile");
  paragraph(summary, { gapAfter: 4 });

  // ------------------------------------------------------------------ //
  // Experience                                                          //
  // ------------------------------------------------------------------ //
  section("Experience");

  experience.roles.forEach((role, index) => {
    ensure(74);
    page.drawText(role.title, {
      x: margin,
      y,
      size: 10.5,
      font: fonts.bold,
      color: color.ink,
    });
    const dateWidth = fonts.bold.widthOfTextAtSize(role.dateLabel, 7.4);
    page.drawText(role.dateLabel, {
      x: A4.width - margin - dateWidth,
      y: y + 1,
      size: 7.4,
      font: fonts.bold,
      color: color.gold,
    });
    y -= 12;

    const company = `${role.company} · ${role.location}`;
    page.drawText(company, {
      x: margin,
      y,
      size: 8.4,
      font: fonts.bold,
      color: color.accent,
    });
    y -= 10;
    page.drawText(role.track, {
      x: margin,
      y,
      size: 8,
      font: fonts.italic,
      color: color.muted,
    });
    y -= 11;

    role.bullets.forEach(bullet);
    page.drawText(role.tags.join("  ·  "), {
      x: margin,
      y,
      size: 7.2,
      font: fonts.mono,
      color: color.muted,
    });
    y -= 16;

    if (index < experience.roles.length - 1) {
      ensure(10);
      page.drawLine({
        start: { x: margin, y: y + 5 },
        end: { x: A4.width - margin, y: y + 5 },
        thickness: 0.5,
        color: color.line,
      });
      y -= 6;
    }
  });

  // ------------------------------------------------------------------ //
  // Projects                                                            //
  // ------------------------------------------------------------------ //
  section("Selected Projects");
  projects.projects.forEach((project) => {
    ensure(30);
    const label = `${project.title}`;
    page.drawText(label, { x: margin, y, size: 9.2, font: fonts.bold, color: color.ink });
    const meta = `${project.year} · ${project.tech.join(" · ")}`;
    page.drawText(meta, {
      x: A4.width - margin - fonts.regular.widthOfTextAtSize(meta, 7.3),
      y: y + 1,
      size: 7.3,
      font: fonts.regular,
      color: color.muted,
    });
    y -= 11;
    paragraph(project.tagline, { size: 8.3, x: margin + 8, width: A4.width - margin * 2 - 8, gapAfter: 5 });
  });

  // ------------------------------------------------------------------ //
  // Skills                                                              //
  // ------------------------------------------------------------------ //
  section("Technical Skills");
  skills.categories.forEach((category) => {
    ensure(16);
    const label = `${category.label}:`;
    page.drawText(label, { x: margin, y, size: 8.2, font: fonts.bold, color: color.ink });
    const labelWidth = fonts.bold.widthOfTextAtSize(label, 8.2);
    const rest = category.skills.map((skill) => skill.name).join(" · ");
    const lines = wrap(rest, fonts.regular, 8.2, A4.width - margin * 2 - labelWidth - 6);
    lines.forEach((line, lineIndex) => {
      page.drawText(line, {
        x: lineIndex === 0 ? margin + labelWidth + 5 : margin + labelWidth + 5,
        y: y - lineIndex * 10.5,
        size: 8.2,
        font: fonts.regular,
        color: color.body,
      });
    });
    y -= Math.max(lines.length, 1) * 10.5 + 2;
  });

  // ------------------------------------------------------------------ //
  // Education & certifications                                          //
  // ------------------------------------------------------------------ //
  section("Education");
  profile.credentials.education.forEach((item) => {
    ensure(24);
    page.drawText(item.degree, { x: margin, y, size: 8.8, font: fonts.bold, color: color.ink });
    const period = `${item.period} · ${item.status}`;
    page.drawText(period, {
      x: A4.width - margin - fonts.regular.widthOfTextAtSize(period, 7.3),
      y: y + 1,
      size: 7.3,
      font: fonts.regular,
      color: color.muted,
    });
    y -= 10.5;
    page.drawText(item.school, { x: margin, y, size: 8.2, font: fonts.regular, color: color.body });
    y -= 12;
  });

  section("Certifications");
  const certs = profile.credentials.certifications;
  const half = Math.ceil(certs.length / 2);
  const columnWidth = (A4.width - margin * 2 - 12) / 2;
  const leftCerts = certs.slice(0, half);
  const rightCerts = certs.slice(half);
  ensure(leftCerts.length * 11.5 + 6);

  const renderCertColumn = (items: string[], x: number, startY: number) => {
    let cursor = startY;
    items.forEach((cert) => {
      const lines = wrap(cert, fonts.regular, 7.8, columnWidth - 10);
      page.drawCircle({ x: x + 3, y: cursor + 2.8, size: 1.4, color: color.gold });
      lines.forEach((line) => {
        page.drawText(line, { x: x + 9, y: cursor, size: 7.8, font: fonts.regular, color: color.body });
        cursor -= 10;
      });
      cursor -= 1.5;
    });
    return cursor;
  };

  const leftY = renderCertColumn(leftCerts, margin, y);
  const rightY = renderCertColumn(rightCerts, margin + columnWidth + 12, y);
  y = Math.min(leftY, rightY) - 4;

  // Footer on every page
  const pages = doc.getPages();
  pages.forEach((currentPage, index) => {
    currentPage.drawLine({
      start: { x: margin, y: 40 },
      end: { x: A4.width - margin, y: 40 },
      thickness: 0.5,
      color: color.line,
    });
    currentPage.drawText(`${contact.name} — Resume`, {
      x: margin,
      y: 30,
      size: 7,
      font: fonts.regular,
      color: color.muted,
    });
    const pageLabel = `${index + 1} / ${pages.length}`;
    currentPage.drawText(pageLabel, {
      x: A4.width - margin - fonts.regular.widthOfTextAtSize(pageLabel, 7),
      y: 30,
      size: 7,
      font: fonts.regular,
      color: color.muted,
    });
  });

  const bytes = await doc.save();
  const output = path.join(root, "public", "resume.pdf");
  writeFileSync(output, bytes);
  console.log(`Resume written to ${output} (${pages.length} page${pages.length === 1 ? "" : "s"})`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
