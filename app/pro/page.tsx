
import { BenefitsSection } from "@/components/sections/intern-benefits";
import { FAQSection } from "@/components/sections/intern-faqs";
import { FeaturesSection } from "@/components/sections/intern-features";
import { HeroSection } from "@/components/sections/intern-hero";
import { PricingSection } from "@/components/sections/intern-pricing";
import { TestimonialSection } from "@/components/sections/intern-testomonials";


export default function Pro() {
  return (
    <>
      <HeroSection />
      <BenefitsSection />
      <FeaturesSection/>
      <TestimonialSection />
      <PricingSection/>
      <FAQSection/>
    </>
  );
}

//<CheckoutButton/>