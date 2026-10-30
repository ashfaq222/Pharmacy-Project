import SiteHeader from "@/components/home/SiteHeader";
import SiteFooter from "@/components/home/SiteFooter";
import PageBand from "@/components/product/PageBand";
import CheckoutView from "@/components/checkout/CheckoutView";
import { brand } from "@/data/home";

export const metadata = {
  title: `Checkout — ${brand.name}`,
  robots: { index: false },
};

export default function CheckoutPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <PageBand crumbs={[{ label: "Home", href: "/" }, { label: "Shopping Cart", href: "/cart" }, { label: "Checkout" }]} />
        <CheckoutView />
      </main>
      <SiteFooter />
    </>
  );
}
