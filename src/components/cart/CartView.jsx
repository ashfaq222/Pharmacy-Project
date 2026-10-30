"use client";

import Link from "next/link";
import Container from "@/components/ui/Container";
import Icon from "@/components/ui/Icons";
import CartLineItem, { CART_COLUMNS } from "@/components/cart/CartLineItem";
import EmptyCart from "@/components/cart/EmptyCart";
import OrderSummary from "@/components/cart/OrderSummary";
import { useCart } from "@/components/cart/CartProvider";

/** Shown during SSR/hydration, before the stored cart is known — avoids flashing the empty state. Also used by checkout. */
export function CartSkeleton() {
  return (
    <section aria-busy="true" aria-label="Loading cart" className="bg-white py-8 sm:py-10 lg:py-14">
      <Container className="animate-pulse">
        <div className="h-9 w-56 rounded-md bg-mist" />
        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_380px] xl:gap-8">
          <div className="h-72 rounded-xl bg-mist" />
          <div className="h-80 rounded-xl bg-mist" />
        </div>
      </Container>
    </section>
  );
}

export default function CartView() {
  const { lines, count, subtotal, ready } = useCart();

  if (!ready) return <CartSkeleton />;
  if (lines.length === 0) return <EmptyCart />;

  return (
    <section className="bg-white py-8 sm:py-10 lg:py-14">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
          <div>
            <h1 className="text-[28px] font-bold tracking-[-0.02em] text-ink-900 sm:text-[32px]">Shopping Cart</h1>
            <p className="mt-1 text-[14px] text-ink-500">
              {count} {count === 1 ? "item" : "items"} in your cart
            </p>
          </div>
          <Link href="/" className="group inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand-700 hover:text-brand-500">
            <Icon name="chevronLeft" className="size-4 transition-transform group-hover:-translate-x-0.5" strokeWidth={2} />
            Continue Shopping
          </Link>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start xl:grid-cols-[minmax(0,1fr)_380px] xl:gap-8">
          <div className="overflow-hidden rounded-xl border border-line bg-white shadow-card">
            <div
              aria-hidden="true"
              className={`hidden border-b border-line bg-mist px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-500 md:grid md:gap-4 ${CART_COLUMNS}`}
            >
              <span>Product</span>
              <span>Price</span>
              <span>Quantity</span>
              <span className="text-right">Subtotal</span>
            </div>
            <ul aria-label="Cart items" className="divide-y divide-line">
              {lines.map((line) => (
                <CartLineItem key={line.slug} line={line} />
              ))}
            </ul>
          </div>

          <OrderSummary count={count} subtotal={subtotal} />
        </div>
      </Container>
    </section>
  );
}
