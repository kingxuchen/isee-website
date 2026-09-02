import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { IntlPricing } from "@/components/IntlPricing";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "iSee Pricing - AI Agent for Everyday Office Work",
  description:
    "iSee 提供 Free、Pro 与 Team 三种方案，支持年付和月付。按需选择适合你的方案，开启 AI 办公新范式。",
};

export default function PricingPage() {
  return (
    <div className="isee-page overflow-x-hidden bg-white text-[#191a23]">
      <Header />
      <IntlPricing />
      <Footer />
    </div>
  );
}
