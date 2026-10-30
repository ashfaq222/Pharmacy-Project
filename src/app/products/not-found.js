import Link from "next/link";
import Container from "@/components/ui/Container";
import Icon from "@/components/ui/Icons";
import PageBand from "@/components/product/PageBand";
import RelatedProducts from "@/components/product/RelatedProducts";
import { PRODUCTS_PATH, featuredProducts } from "@/lib/products";

export default function ProductNotFound() {
  return (
    <main className="flex-1">
      <PageBand crumbs={[{ label: "Home", href: "/" }, { label: "Shop", href: PRODUCTS_PATH }, { label: "Product not found" }]} />

      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <Container className="flex flex-col items-center text-center">
          <span className="grid size-16 place-items-center rounded-full bg-mint-50 text-brand-700 ring-8 ring-mint-50/50">
            <Icon name="search" className="size-7" />
          </span>
          <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-500">Error 404</p>
          <h1 className="mt-2 text-[28px] font-bold tracking-[-0.02em] text-ink-900 sm:text-[34px]">We couldn&apos;t find that product</h1>
          <p className="mt-3 max-w-[460px] text-[15px] leading-[1.65] text-ink-500">
            It may have been removed or renamed, or the link may be incorrect. Browse our popular products instead.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href={PRODUCTS_PATH}
              className="group inline-flex h-12 items-center gap-2 rounded-md bg-brand-700 px-6 text-[14px] font-semibold text-white transition-colors hover:bg-brand-800"
            >
              Back to Shop
              <Icon name="arrowRight" className="size-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
            </Link>
            <Link
              href="/"
              className="inline-flex h-12 items-center rounded-md border border-line px-6 text-[14px] font-semibold text-ink-800 transition-colors hover:border-brand-700 hover:text-brand-700"
            >
              Go to Homepage
            </Link>
          </div>
        </Container>
      </section>

      <RelatedProducts products={featuredProducts.slice(0, 4)}eyebrow="Featured products" title="Popular Right Now" />
    </main>
  );
}
