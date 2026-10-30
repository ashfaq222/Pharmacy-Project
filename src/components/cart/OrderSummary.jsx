import Link from "next/link";
import Icon from "@/components/ui/Icons";
import OrderItemList from "@/components/cart/OrderItemList";
import { formatPrice } from "@/lib/products";
import { getOrderTotals } from "@/lib/cart";

function Row({ label, hint, value }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-ink-500">
        {label}
        {hint && <span className="mt-0.5 block text-[11.5px] text-ink-400">{hint}</span>}
      </dt>
      <dd className="font-semibold tabular-nums text-ink-900">{value}</dd>
    </div>
  );
}

const checkoutLink = (
  <Link
    href="/checkout"
    className="group mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-md bg-brand-700 text-[14px] font-semibold text-white transition-colors hover:bg-brand-800"
  >
    Proceed to Checkout
    <Icon name="arrowRight" className="size-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
  </Link>
);

const demoNote = (
  <>
    <span className="font-semibold">Demo checkout.</span> This is a demonstration store — no payment is taken and no order is placed.
  </>
);

/**
 * Totals card shared by cart, checkout and order confirmation.
 * - `items`: optional line items (see OrderItemList) shown above the totals.
 * - `totals`: pass a placed order's frozen totals; otherwise derived from `subtotal`.
 * - `action`: replaces the "Proceed to Checkout" link (pass null for none).
 */
export default function OrderSummary({ count, subtotal, items, totals, action = checkoutLink, note = demoNote, sticky = true }) {
  const { deliveryFee, total } = totals ?? getOrderTotals(subtotal);

  return (
    <aside aria-labelledby="summary-title" className={`rounded-xl border border-line bg-white p-5 shadow-card sm:p-6 ${sticky ? "lg:sticky lg:top-24" : ""}`}>
      <h2 id="summary-title" className="text-[18px] font-bold tracking-[-0.01em] text-ink-900">
        Order Summary
      </h2>

      {items && <OrderItemList items={items} className="mt-5 border-b border-line pb-5" />}

      <dl className="mt-5 space-y-3.5 text-[14px]">
        <Row label={`Subtotal (${count} ${count === 1 ? "item" : "items"})`} value={formatPrice(subtotal)} />
        <Row label="Delivery charge" hint="Demo flat rate, nationwide" value={formatPrice(deliveryFee)} />
      </dl>

      <div className="mt-5 flex items-baseline justify-between gap-4 border-t border-line pt-5">
        <span className="text-[15px] font-semibold text-ink-900">Total</span>
        <span className="text-[26px] font-bold leading-none tracking-[-0.02em] tabular-nums text-brand-700">{formatPrice(total)}</span>
      </div>
      <p className="mt-1.5 text-right text-[11.5px] text-ink-400">Inclusive of all taxes</p>

      {action}

      {note && (
        <div className="mt-4 flex gap-2.5 rounded-lg bg-mint-50 p-3.5 text-[12px] leading-relaxed text-brand-800 ring-1 ring-mint-100">
          <Icon name="lock" className="mt-0.5 size-4 shrink-0" strokeWidth={1.8} />
          <p>{note}</p>
        </div>
      )}
    </aside>
  );
}
