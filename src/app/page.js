import SiteHeader from "@/components/home/SiteHeader";
import Hero from "@/components/home/Hero";
import CategoryNav from "@/components/home/CategoryNav";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import PromoBanners from "@/components/home/PromoBanners";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import SiteFooter from "@/components/home/SiteFooter";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <CategoryNav />
        <FeaturedProducts />
        <PromoBanners />
        <WhyChooseUs />
      </main>
      <SiteFooter />
    </>
  );
}
