import type { Metadata } from "next";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ProductDemo } from "@/components/ProductDemo";
import { Capabilities } from "@/components/Capabilities";
import { Ecosystem } from "@/components/Ecosystem";
import { Pricing } from "@/components/Pricing";
import { CtaSection } from "@/components/CtaSection";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "WorkBuddy - AI Agent for Everyday Office Work",
  description:
    "WorkBuddy 是腾讯出品的全场景 AI 办公工作台。说出要求、开始执行任务、交付完整成果。完美连接腾讯办公生态，你的办公好搭子",
};

export default function AgentsPage() {
  return (
    <div className="workbuddy-page overflow-x-hidden bg-white text-[#191a23]">
      <SmoothScroll />
      <Header />
      <Hero />
      <ProductDemo />
      <Capabilities />
      <Ecosystem />
      <Pricing />
      <CtaSection />
      <Footer />
    </div>
  );
}
