import SiteHeader from "@/components/home/SiteHeader";
import SiteFooter from "@/components/home/SiteFooter";
import PageBand from "@/components/product/PageBand";
import CartView from "@/components/cart/CartView";
import { brand } from "@/data/home";

export const metadata = {
  title: `Shopping Cart — ${brand.name}`,
  robots: { index: false },
};

export default function CartPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <PageBand crumbs={[{ label: "Home", href: "/" }, { label: "Shopping Cart" }]} />
        <CartView />
      </main>
      <SiteFooter />
    </>
  );
}
