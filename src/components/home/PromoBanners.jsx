import Container from "@/components/ui/Container";
import PromoBanner from "@/components/home/PromoBanner";
import PromoCarousel from "@/components/home/PromoCarousel";
import { promoSkincare, promoFamilySlides } from "@/data/home";

const frame = "rounded-xl sm:h-[250px] xl:h-[268px]";

export default function PromoBanners() {
  return (
    <section aria-label="Promotions" className="bg-white pb-14 lg:pb-16">
      <Container className="grid gap-4 lg:gap-5 xl:grid-cols-2 xl:gap-6">
        <PromoBanner banner={promoSkincare} className={frame} />
        <PromoCarousel slides={promoFamilySlides} className={frame} />
      </Container>
    </section>
  );
}
