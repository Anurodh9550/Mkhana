import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { TrustBanner } from "@/components/home/trust-banner";
import { FeaturedProducts } from "@/components/home/featured-products";
import { WhyChoose } from "@/components/home/why-choose";
import { Categories } from "@/components/home/category-section";
import { HealthBenefits } from "@/components/home/health-benefits";
import { OriginMap } from "@/components/home/origin-map";
import { Story } from "@/components/home/story";
import { Testimonials } from "@/components/home/testimonials";
import { InstagramFeed } from "@/components/home/instagram";
import { FAQSection } from "@/components/home/faq-section";
import { Newsletter } from "@/components/shared/newsletter";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Buy Farm Fresh Makhana Online | Mithila, Bihar",
  description:
    "Premium fox nuts sourced from the ponds of Mithila. Shop raw, roasted, and house-flavoured makhana. Free COD pan India.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBanner />
      <FeaturedProducts />
      <WhyChoose />
      <Categories />
      <HealthBenefits />
      <OriginMap />
      <Story />
      <Testimonials />
      <InstagramFeed />
      <FAQSection />
      <Newsletter />
    </>
  );
}
