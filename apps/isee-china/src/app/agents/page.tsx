import type { Metadata } from "next";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ProductDemo } from "@/components/ProductDemo";
import { Capabilities } from "@/components/Capabilities";
import { Ecosystem } from "@/components/Ecosystem";
import { CtaSection } from "@/components/CtaSection";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "iSee - AI Agent for Everyday Office Work",
  description:
    "iSee is an all-scenario AI office workbench. Say what you need, let agents run the task, and get the finished result — connected to the office tools you already use.",
};

export default function AgentsPage() {
  return (
    <div className="isee-page overflow-x-hidden bg-white text-[#191a23]">
      <SmoothScroll />
      <Header />
      <Hero />
      <ProductDemo />
      <Capabilities />
      <Ecosystem />
      <CtaSection />
      <Footer />
    </div>
  );
}
