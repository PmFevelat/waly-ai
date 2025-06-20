import { HeroHeader } from "@/components/header";
import PricingHeroSection from "@/components/pricing-hero-section";
import PricingSection from "@/components/pricing-section-two"; 
import FooterSection from "@/components/footer-four";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tarifs - Waly",
  description: "Découvrez nos tarifs adaptés à vos besoins et commencez à optimiser votre workflow dès aujourd'hui",
};

export default function PricingPage() {
  return (
    <>
      <HeroHeader />
      <PricingHeroSection />
      <section>
        <PricingSection />
      </section>
      <FooterSection />
    </>
  );
} 