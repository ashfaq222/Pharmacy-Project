import { Suspense } from "react";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Icon from "@/components/ui/Icons";
import ProductGrid from "@/components/home/ProductGrid";
import ProductResults from "@/components/home/ProductResults";
import { PRODUCTS_PATH, featuredProducts } from "@/lib/products";

export default function FeaturedProducts() {
  return (
    <section id="products" aria-labelledby="products-title" className="scroll-mt-20 bg-white pb-10 pt-12 lg:pb-12 lg:pt-14">
      <Container>
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-500">Featured Products</p>
            <h2 id="products-title" className="mt-2 text-[26px] font-bold tracking-[-0.02em] text-ink-900 sm:text-[30px]">
              Popular Products
            </h2>
            <p className="mt-1.5 text-[13.5px] text-ink-500 sm:text-[14px]">Handpicked products for your health and wellness.</p>
          </div>
          <Link href={PRODUCTS_PATH} className="group mb-7 hidden shrink-0 items-center gap-2 text-[13px] font-semibold text-brand-700 hover:text-brand-500 sm:flex">
            View All Products
            <Icon name="arrowRight" className="size-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
          </Link>
        </div>

        {/* Prerendered with every product; filters from the URL apply once hydrated. */}
        <Suspense fallback={<ProductGrid products={featuredProducts} />}>
          <ProductResults />
        </Suspense>

        <Link href={PRODUCTS_PATH} className="mt-6 flex h-11 items-center justify-center gap-2 rounded-md border border-line text-[13px] font-semibold text-brand-700 sm:hidden">
          View All Products
          <Icon name="arrowRight" className="size-4" strokeWidth={2} />
        </Link>
      </Container>
    </section>
  );
}
