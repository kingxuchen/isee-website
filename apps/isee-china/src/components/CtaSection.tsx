import { DownloadDogIcon } from "@/components/icons";

/* ------------------------------------------------------------------ *
 * CTA — #F4F4F4 band, 360px tall on desktop.
 * Left: 50px/58 headline + 20px/32 description + green 立即下载 button.
 * Right: half-width autoplay/muted/loop video (robot desert scene),
 *        flush to the right edge, object-fit cover.
 * Mobile: stacks — centred text block (30px headline) with a full-bleed
 *         240px video underneath.
 * Spec: docs/research/components/cta.spec.md · raw: docs/research/raw/cta.json
 * ------------------------------------------------------------------ */

const VIDEO_SRC = "/cta/join.mp4";

export function CtaSection() {
  return (
    <section className="w-full overflow-hidden bg-[#f4f4f4] lg:h-[360px]">
      <div className="mx-auto flex h-full max-w-[1920px] flex-col lg:flex-row lg:items-center lg:justify-between lg:gap-[57.6px] lg:pl-[57.6px]">
        {/* Left — copy + download */}
        <div className="min-w-0 px-6 pt-10 pb-8 text-center lg:w-auto lg:flex-1 lg:px-0 lg:pt-0 lg:pb-0 lg:text-left">
          <div className="mb-4 flex items-center justify-center gap-3 lg:justify-start">
            <h2 className="font-round text-[30px] leading-[38px] font-bold text-black lg:text-[50px] lg:leading-[58px] lg:whitespace-nowrap">
              开启 AI 办公新范式
            </h2>
          </div>

          <p className="mx-auto mb-10 max-w-[658px] font-round text-[20px] leading-[32px] font-medium text-wb-ink-2 lg:mx-0">
            免费开始，无限可能。把重复、繁琐、跨工具的任务交给
            iSee，把判断和创造力留给自己。
          </p>

          <div className="flex justify-center lg:block">
            <button
              type="button"
              className="flex h-12 items-center justify-center gap-2 rounded-[4px] bg-wb-green px-6 font-heading text-[18px] font-bold text-white transition-colors duration-300 hover:bg-wb-deepgreen"
            >
              <DownloadDogIcon className="h-6 w-6 shrink-0" />
              <span>立即下载</span>
            </button>
          </div>
        </div>

        {/* Right — looping video */}
        {/* 658.4 / 1432 = (100% - pl 57.6 - gap 57.6) / 2, matching the original split */}
        <div className="relative h-60 w-full overflow-hidden lg:h-full lg:w-[calc((100%-115.2px)/2)] lg:shrink-0">
          <video
            className="block h-full w-full object-cover"
            src={VIDEO_SRC}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-label="iSee 宣传视频"
          />
        </div>
      </div>
    </section>
  );
}

export default CtaSection;
