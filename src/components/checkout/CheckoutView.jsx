"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Container from "@/components/ui/Container";
import Icon from "@/components/ui/Icons";
import { CartSkeleton } from "@/components/cart/CartView";
import EmptyCart from "@/components/cart/EmptyCart";
import OrderSummary from "@/components/cart/OrderSummary";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import { useCart } from "@/components/cart/CartProvider";
import { toOrderItems } from "@/lib/cart";
import { buildOrder, saveLastOrder } from "@/lib/orders";

const FORM_ID = "checkout-form";

export default function CheckoutView() {
  const router = useRouter();
  const { lines, count, subtotal, ready, clear } = useCart();
  const [placing, setPlacing] = useState(false);
  const placingRef = useRef(false); // blocks a second submit before the re-render lands
  const [saveError, setSaveError] = useState(false);

  // Shown between clearing the cart and the redirect, so the emptied cart never flashes.
  if (placing) {
    return (
      <section aria-busy="true" className="bg-white py-24">
        <Container className="flex flex-col items-center text-center">
          <span className="size-10 animate-spin rounded-full border-[3px] border-mint-100 border-t-brand-700" />
          <p className="mt-4 text-[15px] font-medium text-ink-700">Confirming your demo order…</p>
        </Container>
      </section>
    );
  }
  if (!ready) return <CartSkeleton />;
  if (lines.length === 0) {
    return <EmptyCart title="Your cart is empty" message="Add products to your cart before checking out. Explore genuine medicines, vitamins and everyday wellness essentials." />;
  }

  const items = toOrderItems(lines);

  const placeOrder = (customer) => {
    if (placingRef.current || lines.length === 0) return; // one order per submit; never an empty order
    placingRef.current = true;
    setSaveError(false);

    let saved = false;
    try {
      saved = saveLastOrder(buildOrder({ customer, items, subtotal }));
    } catch {
      saved = false;
    }
    if (!saved) {
      // Keep the cart and let the customer try again.
      placingRef.current = false;
      setSaveError(true);
      return;
    }

    setPlacing(true);
    clear(); // only once the order is created and stored
    router.replace("/order-confirmation");
  };

  return (
    <section className="bg-white py-8 sm:py-10 lg:py-14">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
          <div>
            <h1 className="text-[28px] font-bold tracking-[-0.02em] text-ink-900 sm:text-[32px]">Checkout</h1>
            <p className="mt-1 text-[14px] text-ink-500">Fields marked * are required.</p>
          </div>
          <Link href="/cart" className="group inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand-700 hover:text-brand-500">
            <Icon name="chevronLeft" className="size-4 transition-transform group-hover:-translate-x-0.5" strokeWidth={2} />
            Back to Cart
          </Link>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start xl:grid-cols-[minmax(0,1fr)_400px] xl:gap-8">
          <CheckoutForm formId={FORM_ID} onValidSubmit={placeOrder} disabled={placing} />

          <OrderSummary
            count={count}
            subtotal={subtotal}
            items={items}
            note={
              <>
                <span className="font-semibold">Demo checkout.</span> No payment is collected and no real order is placed — this store is a
                demonstration.
              </>
            }
            action={
              <>
                <button
                  type="submit"
                  form={FORM_ID}
                  disabled={placing}
                  className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-md bg-brand-700 text-[14px] font-semibold text-white transition-colors hover:bg-brand-800 disabled:cursor-wait disabled:opacity-70"
                >
                  <Icon name="lock" className="size-4" strokeWidth={2} />
                  Place Order
                </button>
                {saveError && (
                  <p role="alert" className="mt-3 flex gap-2 text-[12.5px] leading-relaxed text-sale">
                    <Icon name="alert" className="mt-0.5 size-4 shrink-0" strokeWidth={2} />
                    Your browser blocked saving the demo order, so nothing was placed and your cart is unchanged. Allow site storage (or leave
                    private browsing) and try again.
                  </p>
                )}
              </>
            }
          />
        </div>
      </Container>
    </section>
  );
}
