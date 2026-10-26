/* eslint-disable @next/next/no-img-element */

/* ------------------------------------------------------------------ *
 * Ecosystem — 声明 + 右推的表格（原轨道旋转球版式替换）。
 *
 * 标题两行、首行缩进 3vw；右列（cols 8–12）一张「连接清单」表：
 * 办公类别用柔墨、服务名全墨，行与行之间只用空白分组。
 * 左下角是 iSee 自己的吉祥物形象（项目自有资产）。
 * ------------------------------------------------------------------ */

const LINKS: { kind: string; service: string }[] = [
  { kind: "Office suite", service: "Office" },
  { kind: "Docs", service: "Notion" },
  { kind: "Cloud drive", service: "Google Drive" },
  { kind: "Messaging", service: "Slack" },
  { kind: "Code", service: "GitHub" },
  { kind: "Tracking", service: "Jira" },
];

export function Ecosystem() {
  return (
    <section
      id="ecosystem"
      aria-labelledby="ecosystem-title"
      className="bg-white py-[100px] lg:py-[160px]"
    >
      <div className="mx-auto max-w-[1920px] px-5 lg:px-[60px]">
        <h2
          id="ecosystem-title"
          className="m-0 font-heading text-[clamp(32px,4.5vw,64px)] leading-[1.08] font-bold tracking-[-0.02em] text-wb-ink"
        >
          <span className="block lg:pl-[3vw]">iSee connects</span>
          <span className="block">your office stack</span>
        </h2>
        <p className="mt-6 max-w-[46ch] text-[17px] leading-[28px] text-wb-muted">
          Seamlessly connects the office tools you already use — IM, docs, email, meetings and knowledge bases.
        </p>

        <div className="mt-16 lg:mt-20 lg:grid lg:grid-cols-12 lg:gap-8">
          {/* 左侧吉祥物形象（cols 1–4，底对齐） */}
          <div className="hidden lg:col-span-4 lg:flex lg:items-end">
            <img
              src="/demo/demo-ava.png"
              alt="iSee mascot"
              width={596}
              height={484}
              loading="lazy"
              className="aspect-[4/5] w-[22vw] max-w-[360px] object-cover object-top"
            />
          </div>

          {/* 命名小字（col 7）+ 连接清单（cols 8–12） */}
          <p
            aria-hidden="true"
            className="hidden lg:col-span-1 lg:col-start-7 lg:block lg:pt-1 lg:text-[14px] lg:text-wb-muted"
          >
            Connects
          </p>
          <ul className="m-0 list-none p-0 lg:col-span-5 lg:col-start-8">
            {LINKS.map((link) => (
              <li
                key={link.service}
                className="flex items-baseline gap-6 py-[13px]"
              >
                <span className="w-[5.5em] shrink-0 text-[15px] leading-[24px] text-wb-muted">
                  {link.kind}
                </span>
                <span className="text-[17px] leading-[26px] font-medium text-wb-ink">
                  {link.service}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default Ecosystem;
