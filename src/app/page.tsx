import { SmoothScroll } from "@/components/SmoothScroll";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ProductDemo } from "@/components/ProductDemo";
import { Capabilities } from "@/components/Capabilities";
import { Ecosystem } from "@/components/Ecosystem";
import { Pricing } from "@/components/Pricing";
import { CtaSection } from "@/components/CtaSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="isee-page overflow-x-hidden bg-white text-[#191a23]">
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
