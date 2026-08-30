import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WorkBuddy - AI Agent for Everyday Office Work",
  description:
    "WorkBuddy 是腾讯出品的全场景 AI 办公工作台。说出要求、开始执行任务、交付完整成果。完美连接腾讯办公生态，你的办公好搭子",
  icons: { icon: "/brand/logo.svg" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
