import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { loadLegalDoc } from "@/lib/legal";

/* ------------------------------------------------------------------ *
 * Legal document page — /document/[slug]
 * Spec: docs/research/components/legal-docs.spec.md
 * Data: src/data/legal/<slug>.txt (verbatim innerText dumps)
 * Typography: H1 32/700, H2 13/600 #6B7280, H3 16/600 #1A1A1A,
 *             P 16/27.2 #374151, container 860px centered.
 * ------------------------------------------------------------------ */

const SYSTEM_FONT =
  '-apple-system, "system-ui", "Segoe UI", Roboto, sans-serif';

const SLUGS = [
  "term",
  "enterprise-agreement",
  "privacy-policy",
  "acceptable-use-policy",
] as const;

const DOC_NAME: Record<(typeof SLUGS)[number], string> = {
  term: "Service Agreement",
  "enterprise-agreement": "Enterprise Agreement",
  "privacy-policy": "Privacy Policy",
  "acceptable-use-policy": "Acceptable Use Policy",
};

export function generateStaticParams() {
  return SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const name =
    DOC_NAME[slug as (typeof SLUGS)[number]] ??
    slug.charAt(0).toUpperCase() + slug.slice(1);
  return { title: `${name} — iSee` };
}

export default async function LegalDocumentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = loadLegalDoc(slug);

  return (
    <div className="isee-page overflow-x-hidden bg-white text-[#191a23]">
      <Header />
      <main className="mx-auto w-full max-w-[860px] px-6 pt-[104px] pb-20 md:pt-[120px] md:pb-[80px]">
        <h1
          className="m-0 mb-1 text-[32px] leading-[54px] font-bold text-[#1A1A1A]"
          style={{ fontFamily: SYSTEM_FONT }}
        >
          {doc.title}
        </h1>
        {doc.updated ? (
          <p
            className="mb-12 mt-2 text-[13px] leading-[22px] font-semibold text-[#6B7280]"
            style={{ fontFamily: SYSTEM_FONT }}
          >
            {doc.updated}
          </p>
        ) : null}

        {/* CONTENTS outline */}
        {doc.toc.length ? (
          <nav aria-label="目录" className="mb-12">
            <h2
              className="mb-3 text-[13px] leading-[22px] font-semibold text-[#6B7280]"
              style={{ fontFamily: SYSTEM_FONT }}
            >
              CONTENTS
            </h2>
            <ul
              className="m-0 list-none p-0"
              style={{ fontFamily: SYSTEM_FONT }}
            >
              {doc.toc.map((item) => (
                <li
                  key={item}
                  className="py-1 text-[16px] leading-[27px] text-[#374151]"
                >
                  {item}
                </li>
              ))}
            </ul>
          </nav>
        ) : null}

        {doc.sections.map((section, sectionIndex) => (
          <section key={sectionIndex}>
            {section.heading ? (
              /^\d+\.\d+/.test(section.heading) ? (
                <h3
                  className="mt-5 mb-2.5 text-[16px] leading-[27px] font-semibold text-[#1A1A1A]"
                  style={{ fontFamily: SYSTEM_FONT }}
                >
                  {section.heading}
                </h3>
              ) : (
                <h2
                  className="mt-5 mb-3 text-[13px] leading-[22px] font-semibold text-[#6B7280]"
                  style={{ fontFamily: SYSTEM_FONT }}
                >
                  {section.heading}
                </h2>
              )
            ) : null}
            {section.paragraphs.map((p, pIndex) => (
              <p
                key={pIndex}
                className="m-0 mb-4 text-[16px] leading-[27px] text-[#374151]"
                style={{ fontFamily: SYSTEM_FONT }}
              >
                {p}
              </p>
            ))}
          </section>
        ))}
      </main>
      <Footer />
    </div>
  );
}
