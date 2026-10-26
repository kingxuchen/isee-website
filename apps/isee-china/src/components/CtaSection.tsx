/* ------------------------------------------------------------------ *
 * CTA — 两端问句：100svh 最深色场，两行大字分贴上下边缘，
 * 正中一行两个实心按钮，中间一个「or」字。
 * 两行文案取自原 CTA 描述（把重复交给 iSee，把判断和创造力留给自己）。
 * ------------------------------------------------------------------ */

export function CtaSection() {
  return (
    <section
      aria-labelledby="cta-title"
      className="flex min-h-[100svh] w-full flex-col justify-between overflow-hidden bg-wb-ink px-5 pt-8 pb-6 text-white lg:px-[60px]"
    >
      <h2
        id="cta-title"
        className="m-0 text-center font-heading text-[clamp(52px,11vw,160px)] leading-[1.0] font-bold tracking-[-0.03em] whitespace-nowrap"
      >
        <span className="block">Hand the repeats</span>
      </h2>

      {/* 光心处的一行：两个答案 + 「or」 */}
      <div className="flex flex-col items-center">
        <div className="flex w-full max-w-[560px] flex-col items-center gap-3 sm:w-auto sm:flex-row sm:gap-0">
          <a
            href="#download-section"
            className="flex h-14 w-full items-center justify-center rounded-[4px] bg-wb-action px-12 text-[18px] font-medium whitespace-nowrap text-white transition-colors duration-300 hover:bg-wb-action-deep sm:w-[220px]"
          >
            Download
          </a>
          <span
            aria-hidden="true"
            className="px-0 py-1 text-[18px] text-white/60 sm:px-[60px]"
          >
            or
          </span>
          <a
            href="#"
            className="flex h-14 w-full items-center justify-center rounded-[4px] bg-white px-12 text-[18px] font-medium whitespace-nowrap text-wb-ink transition-colors duration-300 hover:bg-wb-panel sm:w-[220px]"
          >
            Use online
          </a>
        </div>
        <p className="m-0 mt-5 text-center text-[16px] leading-[26px] text-white/60">
          Free to start, limitless to go
        </p>
      </div>

      <p className="m-0 text-center font-heading text-[clamp(52px,11vw,160px)] leading-[1.0] font-bold tracking-[-0.03em] whitespace-nowrap">
        keep the creating
      </p>
    </section>
  );
}

export default CtaSection;
