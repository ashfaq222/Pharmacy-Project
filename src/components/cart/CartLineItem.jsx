"use client";

import Link from "next/link";
import AssetImage from "@/components/ui/AssetImage";
import Icon from "@/components/ui/Icons";
import ProductPlaceholder from "@/components/ui/ProductPlaceholder";
import QuantityStepper from "@/components/ui/QuantityStepper";
import { useCart } from "@/components/cart/CartProvider";
import { LOW_STOCK_THRESHOLD, formatPrice, productHref } from "@/lib/products";

/** Column template shared with the table header in CartView (md and up). */
export const CART_COLUMNS = "md:grid-cols-[minmax(0,1fr)_96px_124px_104px] lg:grid-cols-[minmax(0,1fr)_92px_124px_100px] xl:grid-cols-[minmax(0,1fr)_104px_132px_112px]";

export default function CartLineItem({ line }) {
  const { setQuantity, remove } = useCart();
  const { product, quantity } = line;
  const href = productHref(product);
  const atMax = quantity >= product.stock;

  return (
    <li className={`flex flex-col gap-4 p-4 sm:p-5 md:grid md:items-center md:gap-4 ${CART_COLUMNS}`}>
      {/* Product */}
      <div className="flex min-w-0 gap-4">
        <Link href={href} tabIndex={-1} aria-hidden="true" className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-mist sm:size-[88px]">
          <AssetImage src={product.image} alt="" fill sizes="88px" className="object-contain p-2" fallback={<ProductPlaceholder className="h-[62%]" />} />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-400">{product.brand}</p>
          <h3 className="mt-0.5 text-[14px] font-semibold leading-snug text-ink-900 sm:text-[15px]">
            <Link href={href} className="transition-colors hover:text-brand-700">
              {product.name}
            </Link>
          </h3>
          <p className="mt-1 text-[12px] text-ink-500">{product.packSize}</p>
          <p className="mt-1 text-[13px] text-ink-700 md:hidden">
            {formatPrice(product.price)} <span className="text-ink-400">each</span>
          </p>
          {(atMax || product.stock <= LOW_STOCK_THRESHOLD) && (
            <p className="mt-1.5 text-[11.5px] font-medium text-[#b86e00]">
              {atMax ? "Maximum available quantity" : `Only ${product.stock} left in stock`}
            </p>
          )}
          <button
            type="button"
            onClick={() => remove(product.slug)}
            aria-label={`Remove ${product.name} from cart`}
            className="mt-2.5 inline-flex items-center gap-1.5 rounded text-[12px] font-medium text-ink-500 transition-colors hover:text-sale"
          >
            <Icon name="trash" className="size-[15px]" />
            Remove
          </button>
        </div>
      </div>

      {/* Price (md+) */}
      <p className="hidden text-[14px] text-ink-700 md:block">{formatPrice(product.price)}</p>

      {/* Quantity — on mobile it shares a row with the subtotal, aligned under the text */}
      <div className="flex items-center justify-between gap-4 pl-24 sm:pl-[104px] md:block md:pl-0">
        <QuantityStepper
          size="sm"
          value={quantity}
          max={product.stock}
          onChange={(q) => setQuantity(product.slug, q)}
          label={`Quantity of ${product.name}`}
        />
        <p className="text-right md:hidden">
          <span className="block text-[11px] text-ink-400">Subtotal</span>
          <span className="text-[16px] font-bold text-brand-700">{formatPrice(product.price * quantity)}</span>
        </p>
      </div>

      {/* Subtotal (md+) */}
      <p className="hidden text-right text-[15px] font-bold text-brand-700 md:block">{formatPrice(product.price * quantity)}</p>
    </li>
  );
}
