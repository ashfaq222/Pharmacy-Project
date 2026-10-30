import Link from "next/link";
import Container from "@/components/ui/Container";
import Icon from "@/components/ui/Icons";
import ProductCard from "@/components/home/ProductCard";
import { PRODUCTS_PATH } from "@/lib/products";

export default function RelatedProducts({ products, eyebrow = "You may also like", title = "Related Products" }) {
  if (products.length === 0) return null;

  return (
    <section aria-labelledby="related-title" className="border-t border-line bg-white py-12 lg:py-16">
      <Container>
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-500">{eyebrow}</p>
            <h2 id="related-title" className="mt-2 text-[24px] font-bold tracking-[-0.02em] text-ink-900 sm:text-[28px]">
              {title}
            </h2>
          </div>
          <Link href={PRODUCTS_PATH} className="group mb-1 hidden shrink-0 items-center gap-2 text-[13px] font-semibold text-brand-700 hover:text-brand-500 sm:flex">
            View All Products
            <Icon name="arrowRight" className="size-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
          </Link>
        </div>

        <div className="mt-7 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </Container>
    </section>
  );
}
