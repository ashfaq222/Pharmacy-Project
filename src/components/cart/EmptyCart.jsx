import Link from "next/link";
import Container from "@/components/ui/Container";
import Icon from "@/components/ui/Icons";
import RelatedProducts from "@/components/product/RelatedProducts";
import { featuredProducts } from "@/lib/products";

const DEFAULT_MESSAGE = "Looks like you haven't added anything yet. Explore genuine medicines, vitamins and everyday wellness essentials.";

export default function EmptyCart({ title = "Your cart is empty", message = DEFAULT_MESSAGE }) {
  return (
    <>
      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <Container className="flex flex-col items-center text-center">
          <span className="grid size-20 place-items-center rounded-full bg-mint-50 text-brand-700 ring-8 ring-mint-50/50">
            <Icon name="cart" className="size-9" strokeWidth={1.4} />
          </span>
          <h1 className="mt-6 text-[28px] font-bold tracking-[-0.02em] text-ink-900 sm:text-[34px]">{title}</h1>
          <p className="mt-3 max-w-[440px] text-[15px] leading-[1.65] text-ink-500">{message}</p>
          <Link
            href="/"
            className="group mt-8 inline-flex h-12 items-center gap-2 rounded-md bg-brand-700 px-6 text-[14px] font-semibold text-white transition-colors hover:bg-brand-800"
          >
            Continue Shopping
            <Icon name="arrowRight" className="size-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
          </Link>
        </Container>
      </section>

      <RelatedProducts products={featuredProducts.slice(0, 4)}eyebrow="Featured products" title="Popular Right Now" />
    </>
  );
}
