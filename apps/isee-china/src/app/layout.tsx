import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "iSee - AI Agent for Everyday Office Work",
  description:
    "iSee is an all-scenario AI office workbench. Say what you need, let agents run the task, and get the finished result. Your office sidekick, connected to the tools you already use.",
  icons: { icon: "/brand/logo.png" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
