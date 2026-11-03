import { CallMeButton } from "@/components/CallMeButton";
import { FinaleCtaSection } from "@/components/FinaleCtaSection";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HeroCarousel } from "@/components/HeroCarousel";
import { HomeInfraRd } from "@/components/HomeInfraRd";
import { HomeOutsourcing } from "@/components/HomeOutsourcing";
import { HomeProductGrid } from "@/components/HomeProductGrid";

export default function Home() {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <main id="main-content">
        <Header />
        <HeroCarousel />
        <HomeProductGrid />
        <HomeOutsourcing />
        <HomeInfraRd />
        <FinaleCtaSection />
        <Footer />
      </main>
      <CallMeButton />
    </>
  );
}
