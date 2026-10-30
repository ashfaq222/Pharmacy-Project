"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Icon from "@/components/ui/Icons";
import { CartSkeleton } from "@/components/cart/CartView";
import OrderSummary from "@/components/cart/OrderSummary";
import { formatPhone } from "@/lib/checkout";
import { readLastOrder } from "@/lib/orders";

const subscribeNoop = () => () => {};

const primaryButton =
  "group inline-flex h-12 items-center justify-center gap-2 rounded-md bg-brand-700 px-6 text-[14px] font-semibold text-white transition-colors hover:bg-brand-800";
const secondaryButton =
  "inline-flex h-12 items-center justify-center rounded-md border border-line px-6 text-[14px] font-semibold text-ink-800 transition-colors hover:border-brand-700 hover:text-brand-700";

function Detail({ icon, label, children }) {
  return (
    <div className="flex gap-3">
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-mint-50 text-brand-700">
        <Icon name={icon} className="size-[18px]" />
      </span>
      <div className="min-w-0">
        <dt className="text-[11.5px] font-semibold uppercase tracking-[0.12em] text-ink-400">{label}</dt>
        <dd className="mt-0.5 break-words text-[14px] leading-relaxed text-ink-900">{children}</dd>
      </div>
    </div>
  );
}

function NoOrder() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <Container className="flex flex-col items-center text-center">
        <span className="grid size-20 place-items-center rounded-full bg-mint-50 text-brand-700 ring-8 ring-mint-50/50">
          <Icon name="cart" className="size-9" strokeWidth={1.4} />
        </span>
        <h1 className="mt-6 text-[28px] font-bold tracking-[-0.02em] text-ink-900 sm:text-[34px]">No recent order to show</h1>
        <p className="mt-3 max-w-[460px] text-[15px] leading-[1.65] text-ink-500">
          Order confirmations are kept for this browser tab only. Place a demo order from your cart to see one here.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/cart" className={primaryButton}>
            Go to Cart
          </Link>
          <Link href="/" className={secondaryButton}>
            Continue Shopping
          </Link>
        </div>
      </Container>
    </section>
  );
}

export default function OrderConfirmation() {
  // false during SSR + hydration; the order lives in sessionStorage (client only).
  const ready = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const order = ready ? readLastOrder() : null;

  if (!ready) return <CartSkeleton />;
  if (!order) return <NoOrder />;

  const { customer, delivery, items } = order;
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const placedAt = new Date(order.placedAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });
  const firstName = customer.fullName.split(/\s+/)[0];

  return (
    <section className="bg-white py-8 sm:py-10 lg:py-14">
      <Container>
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <span className="grid size-16 place-items-center rounded-full bg-mint-100 text-brand-700 ring-8 ring-mint-50">
            <Icon name="check" className="size-8" strokeWidth={2.2} />
          </span>
          <span className="mt-6 rounded-full bg-star/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#9a5b00]">Demo order</span>
          <h1 className="mt-3 text-[28px] font-bold tracking-[-0.02em] text-ink-900 sm:text-[34px]">Thank you, {firstName}!</h1>
          <p className="mt-2 max-w-[520px] text-[15px] leading-[1.65] text-ink-500">Your demo order has been recorded in this browser. Here are the details.</p>

          <dl className="mt-6 flex flex-wrap justify-center gap-3">
            <div className="rounded-lg border border-line bg-mist px-5 py-3 text-left">
              <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-400">Order ID</dt>
              <dd className="mt-0.5 text-[17px] font-bold tabular-nums tracking-[0.06em] text-ink-900">{order.id}</dd>
            </div>
            <div className="rounded-lg border border-line bg-mist px-5 py-3 text-left">
              <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-400">Placed</dt>
              <dd className="mt-0.5 text-[15px] font-semibold text-ink-900">{placedAt}</dd>
            </div>
          </dl>
        </div>

        {/* Demo disclaimer */}
        <div role="note" className="mx-auto mt-8 flex max-w-[760px] gap-3 rounded-xl bg-star/10 p-4 text-[13px] leading-relaxed text-[#7a4a00] ring-1 ring-star/30">
          <Icon name="alert" className="mt-0.5 size-5 shrink-0" strokeWidth={1.8} />
          <p>
            <span className="font-semibold">This is a demonstration only.</span> No real order has been placed, no payment has been taken and nothing
            will be delivered. Details are stored in this browser tab and are not sent anywhere.
          </p>
        </div>

        {/* Details + summary */}
        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start xl:grid-cols-[minmax(0,1fr)_400px] xl:gap-8">
          <div className="rounded-xl border border-line bg-white p-5 shadow-card sm:p-6">
            <h2 className="text-[17px] font-bold tracking-[-0.01em] text-ink-900">Customer &amp; Delivery</h2>
            <dl className="mt-5 grid gap-5 sm:grid-cols-2">
              <Detail icon="user" label="Customer">
                {customer.fullName}
              </Detail>
              <Detail icon="phone" label="Phone">
                {formatPhone(customer.phone)}
              </Detail>
              {customer.email && (
                <Detail icon="mail" label="Email">
                  {customer.email}
                </Detail>
              )}
              <Detail icon="mapPin" label="Delivery address">
                {delivery.address}
                <br />
                {delivery.area}, {delivery.district}
              </Detail>
              {delivery.instructions && (
                <div className="sm:col-span-2">
                  <Detail icon="truck" label="Instructions">
                    {delivery.instructions}
                  </Detail>
                </div>
              )}
            </dl>
          </div>

          <OrderSummary
            count={count}
            subtotal={order.subtotal}
            totals={{ deliveryFee: order.deliveryFee, total: order.total }}
            items={items}
            sticky={false}
            note={null}
            action={
              <div className="mt-6 grid gap-3">
                <Link href="/" className={primaryButton}>
                  Continue Shopping
                  <Icon name="arrowRight" className="size-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
                </Link>
              </div>
            }
          />
        </div>
      </Container>
    </section>
  );
}
