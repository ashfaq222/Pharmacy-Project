"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icons";
import QuantityStepper from "@/components/ui/QuantityStepper";
import { useCart } from "@/components/cart/CartProvider";
import { formatPrice } from "@/lib/products";

/** Quantity stepper + Add to Cart, wired to the shared CartProvider. */
export default function PurchasePanel({ product }) {
  const { add, getQuantity } = useCart();
  const soldOut = product.stock <= 0;
  const inCart = getQuantity(product.slug);
  const available = Math.max(product.stock - inCart, 0); // what can still be added
  const atLimit = !soldOut && available === 0;

  const [quantity, setQuantity] = useState(1);
  const [wished, setWished] = useState(false);
  const [added, setAdded] = useState(false);
  const selected = Math.min(quantity, Math.max(available, 1));

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 1800);
    return () => clearTimeout(t);
  }, [added]);

  const handleAdd = () => {
    if (add(product.slug, selected) > 0) {
      setAdded(true);
      setQuantity(1);
    }
  };

  return (
    <div>
      <div className="flex items-stretch gap-3">
        <QuantityStepper
          value={soldOut ? 0 : selected}
          onChange={setQuantity}
          max={Math.max(available, 1)}
          disabled={soldOut || atLimit}
          label={`Quantity of ${product.name}`}
        />

        <button
          type="button"
          onClick={handleAdd}
          disabled={soldOut || atLimit}
          className={`flex h-12 min-w-0 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 sm:px-6 text-[14px] font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:bg-ink-400 ${
            added ? "bg-brand-500" : "bg-brand-700 hover:bg-brand-800"
          }`}
        >
          {soldOut ? (
            "Out of Stock"
          ) : added ? (
            <>
              <Icon name="check" className="size-[18px]" strokeWidth={2.2} /> Added to Cart
            </>
          ) : atLimit ? (
            "Stock Limit Reached"
          ) : (
            <>
              <Icon name="cart" className="size-[18px]" />
              Add to Cart
              <span className="hidden font-medium text-white/70 min-[420px]:inline">· {formatPrice(product.price * selected)}</span>
            </>
          )}
        </button>

        <button
          type="button"
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wished}
          onClick={() => setWished((w) => !w)}
          className={`grid size-12 shrink-0 place-items-center rounded-md border transition-colors ${
            wished ? "border-sale/30 bg-sale/5 text-sale" : "border-line text-ink-700 hover:border-sale/30 hover:text-sale"
          }`}
        >
          <Icon name="heart" className={`size-5 ${wished ? "fill-current" : ""}`} />
        </button>
      </div>

      {inCart > 0 && (
        <p className="mt-3 flex flex-wrap items-center gap-x-2 text-[12.5px] text-ink-500">
          <Icon name="check" className="size-3.5 text-brand-500" strokeWidth={2.4} />
          {inCart} in your cart{atLimit ? " — all available stock" : ""}.
          <Link href="/cart" className="font-semibold text-brand-700 hover:text-brand-500">
            View cart
          </Link>
        </p>
      )}
      {!soldOut && !atLimit && selected >= available && available < product.stock && (
        <p className="mt-1.5 text-[12px] text-ink-500">Only {available} more can be added.</p>
      )}
      {!soldOut && inCart === 0 && selected >= product.stock && (
        <p className="mt-2.5 text-[12px] text-ink-500">You&apos;ve selected the maximum available quantity.</p>
      )}
    </div>
  );
}
