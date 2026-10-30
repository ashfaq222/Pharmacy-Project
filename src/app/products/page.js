import PageBand from "@/components/product/PageBand";
import CategoryNav from "@/components/home/CategoryNav";
import ProductCatalog from "@/components/product/ProductCatalog";
import { brand } from "@/data/home";

export const metadata = {
  title: `All Products — ${brand.name}`,
  description: "Browse genuine medicines, vitamins, skincare and health devices by category. Search, filter and sort the full catalogue.",
};

export default function AllProductsPage() {
  return (
    <main className="flex-1">
      <PageBand crumbs={[{ label: "Home", href: "/" }, { label: "All Products" }]} />
      <CategoryNav />
      <ProductCatalog />
    </main>
  );
}
