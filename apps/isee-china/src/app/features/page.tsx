import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { DesktopFeatures } from "@/components/DesktopFeatures";
import { CtaSection } from "@/components/CtaSection";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "iSee 桌面端功能",
  description:
    "iSee 桌面客户端功能导览：会话工作台、Agent 对话、群协作、Agent 市场、工作区面板与设置，全部附真实界面截图。",
};

export default function FeaturesPage() {
  return (
    <div className="isee-page overflow-x-hidden bg-white text-[#191a23]">
      <Header />
      <DesktopFeatures />
      <CtaSection />
      <Footer />
    </div>
  );
}
