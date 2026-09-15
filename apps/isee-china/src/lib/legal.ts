import { readFileSync } from "node:fs";
import { join } from "node:path";

/* ------------------------------------------------------------------ *
 * Legal document loader — reads the verbatim innerText dumps of the
 * live /document/* pages (docs/research/pages/*.txt) and recovers the
 * heading structure. Spec: docs/research/components/legal-docs.spec.md
 *
 * Text layout per dump:
 *   line 1      = document title (H1)
 *   line 2      = "Last updated: ..." subtitle
 *   CONTENTS    = TOC block (capitalized lines) until first numbered
 *                 section; rendered as muted list, then skipped from body
 *   "^N. NAME"  = H2 section heading (incl. 'Jurisdiction-specific
 *                 Addendum' which is unnumbered)
 *   "^N.N ..."  = H3 subsection heading
 *   everything  = body paragraphs (tables with tab separators kept)
 * ------------------------------------------------------------------ */

export interface LegalSection {
  heading: string | null;
  paragraphs: string[];
}

export interface LegalDoc {
  slug: string;
  title: string;
  updated: string | null;
  toc: string[];
  sections: LegalSection[];
}

const LEGAL_DIR = join(process.cwd(), "src", "data", "legal");

const HEADING_RE = /^\d+\.\s+\S/; // "1. INTRODUCTION", "3.1 Illegal..."
const SUBHEADING_RE = /^\d+\.\d+/; // "1.1 PLEASE READ..."
const UNNUMBERED_H2 = new Set([
  "Jurisdiction-specific Addendum",
  "Jurisdictional Addendum",
]);

export function parseLegalText(slug: string, text: string): LegalDoc {
  const lines = text.split(/\r?\n/);

  const title = lines[0]?.trim() || slug;
  let updated: string | null = null;
  const toc: string[] = [];
  const sections: LegalSection[] = [];
  let current: LegalSection = { heading: null, paragraphs: [] };
  let paragraph: string[] = [];
  let inContents = false;
  let sawFirstHeading = false;

  const flushParagraph = () => {
    const joined = paragraph.join(" ").replace(/\s+/g, " ").trim();
    if (joined) current.paragraphs.push(joined);
    paragraph = [];
  };
  const pushHeading = (heading: string) => {
    if (current.heading !== null || current.paragraphs.length) {
      sections.push(current);
    }
    current = { heading, paragraphs: [] };
  };

  // Skip the first line (title) already consumed; find subtitle line 2.
  for (let i = 1; i < lines.length; i++) {
    const raw = lines[i];
    const line = raw.trim();

    if (i === 1 && updated === null) {
      if (/^last updated:/i.test(line)) {
        updated = line;
        continue;
      }
      // Some dumps place a short intro before CONTENTS — treat as paragraph
      // only once we are past the TOC; before that, skip.
      if (/^contents$/i.test(line)) {
        inContents = true;
        continue;
      }
      if (!inContents) {
        // e.g. enterprise-agreement puts "Last updated" on line 2 too; if the
        // second line starts with 'CONTENTS' skip handled above; otherwise
        // treat as a pre-contents body paragraph.
        paragraph.push(line);
        continue;
      }
    }

    if (!line) {
      if (inContents) continue;
      flushParagraph();
      continue;
    }

    const isHead = HEADING_RE.test(line) || UNNUMBERED_H2.has(line);

    if (inContents) {
      if (isHead && !UNNUMBERED_H2.has(line)) {
        // First numbered section ends the TOC block.
        inContents = false;
        sawFirstHeading = true;
        pushHeading(line);
        continue;
      }
      // CONTENTS entries are standalone capitalized titles; AUP/privacy list
      // them without numbers.
      if (!sawFirstHeading) {
        toc.push(line);
        continue;
      }
      toc.push(line);
      continue;
    }

    if (UNNUMBERED_H2.has(line)) {
      flushParagraph();
      pushHeading(line);
      continue;
    }
    if (isHead) {
      if (SUBHEADING_RE.test(line)) {
        // N.N subheadings
        flushParagraph();
        if (current.heading !== null || current.paragraphs.length) {
          sections.push(current);
        }
        current = { heading: line, paragraphs: [] };
      } else {
        if (!inContents) flushParagraph();
        pushHeading(line);
      }
      continue;
    }

    paragraph.push(line);
  }
  flushParagraph();
  if (current.heading !== null || current.paragraphs.length) {
    sections.push(current);
  }

  return { slug, title, updated, toc, sections };
}

export function loadLegalDoc(slug: string): LegalDoc {
  const text = readFileSync(join(LEGAL_DIR, `${slug}.txt`), "utf8");
  return parseLegalText(slug, text);
}
