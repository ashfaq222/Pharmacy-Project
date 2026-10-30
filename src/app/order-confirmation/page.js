import SiteHeader from "@/components/home/SiteHeader";
import SiteFooter from "@/components/home/SiteFooter";
import PageBand from "@/components/product/PageBand";
import OrderConfirmation from "@/components/checkout/OrderConfirmation";
import { brand } from "@/data/home";

export const metadata = {
  title: `Order Confirmation (Demo) — ${brand.name}`,
  robots: { index: false },
};

export default function OrderConfirmationPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <PageBand crumbs={[{ label: "Home", href: "/" }, { label: "Order Confirmation" }]} />
        <OrderConfirmation />
      </main>
      <SiteFooter />
    </>
  );
}
