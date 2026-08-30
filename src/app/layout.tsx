import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const alimamaShuHeiTi = localFont({
  src: "../../public/fonts/AlimamaShuHeiTi-Bold.subset.woff2",
  variable: "--font-alimama-shuheiti",
  weight: "400 900",
});

const alimamaFangYuanTi = localFont({
  src: "../../public/fonts/AlimamaFangYuanTiVF-Thin.subset.woff2",
  variable: "--font-alimama-fangyuanti",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "WorkBuddy - AI Agent for Everyday Office Work",
  description:
    "WorkBuddy 是腾讯出品的全场景 AI 办公工作台。说出要求、开始执行任务、交付完整成果。完美连接腾讯办公生态，你的办公好搭子",
  icons: { icon: "/brand/logo.svg" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="zh-CN"
      className={`${alimamaShuHeiTi.variable} ${alimamaFangYuanTi.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
