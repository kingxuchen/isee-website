# LegalDocumentPage Specification (/document/*)

## Overview

- **Target files:** `src/app/document/[slug]/page.tsx` + `src/app/document/[slug]/not-found` handling
- **Routes:** `/document/term`, `/document/enterprise-agreement`, `/document/privacy-policy`, `/document/acceptable-use-policy`
- **Interaction model:** static
- **Raw text:** `docs/research/pages/wb-term.txt`, `wb-enterprise.txt`, `wb-privacy.txt`, `wb-aup.txt` (verbatim innerText dumps)

## Page Structure

1. Header (reuse)
2. Main content column — **width 860px, margin 0 auto, padding 56px 24px 80px**
3. Footer (reuse)

## Typography (measured @1440)

- Container: max-width 860px content, centered; page bg white
- H1 (doc title): 32px/700/54.4px color #1A1A1A, margin-bottom 4px
- "Last updated: June 2026" line: muted — treat as subtitle, 16px, #6B7280-ish (matches h2 style below)
- H2 (CONTENTS + section titles): 13px/600/22.1px color #6B7280 (gray-blue), margin-bottom 12px — section headings are SMALL MUTED CAPS-LIKE text
- H3 (1.1, 1.2 …): 16px/600/27.2px color #1A1A1A, margin 20px 0 10px
- P: 16px/400/27.2px color #374151 (gray-700), margin 0 0 16px
- List items (bullets/numbered within body): same 16px/27.2px #374151

## Content Model

The .txt files are plain-text dumps where structure is recoverable:

- Line 1 = document title (H1)
- Next non-empty line = "Last updated: ..." subtitle
- Then "CONTENTS" block: uppercase section names, one per line — the TOC (render as muted H2 list or just skip; original site renders CONTENTS as an outline; render a simple TOC list)
- Then numbered sections `1. INTRODUCTION` (uppercase) = H2
- Sub-sections `1.1 PLEASE READ THIS AGREEMENT CAREFULLY` = H3
- Body paragraphs between headings = P
- Render order: title → last-updated → CONTENTS → sections
- Bold markers: text wrapped in quotes or "..." kept verbatim; the original bolds some inline terms. In text dump no markup — keep plain text (fidelity best effort).

## Implementation Notes

- `src/app/document/[slug]/page.tsx` is a Next 16 server component with `generateStaticParams` returning the 4 slugs.
- Read the .txt via a small helper — text files must live in repo. Copy from `docs/research/pages/` to `src/data/legal/*.txt` (or import with `.txt?raw` — tsconfig may not allow; simplest: fs.readFileSync in server component from `process.cwd() + '/src/data/legal/<slug>.txt'`).
- Parse function `parseLegalText(text: string) → { title, updated, toc: string[], sections: { id, heading, subheading, paragraphs }[] }`:
  - Treat uppercase-only lines as H2 headings; `^\d+\.\d+ [A-Z]` lines as H3; others accumulate as paragraphs.
- Metadata per slug: term → "Service Agreement — WorkBuddy", enterprise-agreement → "Enterprise Agreement", privacy-policy → "Privacy Policy", acceptable-use-policy → "Acceptable Use Policy"; title + " — WorkBuddy".
- Body font: system stack; no brand fonts.
