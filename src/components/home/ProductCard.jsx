"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AssetImage from "@/components/ui/AssetImage";
import Icon from "@/components/ui/Icons";
import ProductBadge from "@/components/ui/ProductBadge";
import ProductPlaceholder from "@/components/ui/ProductPlaceholder";
import { useCart } from "@/components/cart/CartProvider";
import { formatPrice, productHref } from "@/lib/products";

export default function ProductCard({ product }) {
  const { add } = useCart();
  const [wished, setWished] = useState(false);
  const [status, setStatus] = useState(null); // "added" | "limit" — brief button feedback

  useEffect(() => {
    if (!status) return;
    const t = setTimeout(() => setStatus(null), 1600);
    return () => clearTimeout(t);
  }, [status]);

  const handleAdd = () => {
    setStatus(add(product.slug) > 0 ? "added" : "limit");
  };

  return (
    <article className="group relative flex flex-col rounded-[10px] border border-line bg-white p-2 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-card-hover sm:p-2.5">
      <div className="relative aspect-[6/5] overflow-hidden rounded-md bg-mist">
        <AssetImage
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1280px) 200px, (min-width: 768px) 30vw, 46vw"
          // No inner padding (the photos carry their own studio margin) and a slight zoom: the widest
          // product shots (box + blister, monitor + cuff, dumbbells) still fit whole at the 1.1 hover scale.
          className="scale-[1.06] object-contain transition-transform duration-500 group-hover:scale-[1.1]"
          fallback={<ProductPlaceholder />}
        />
        {product.badge && <ProductBadge badge={product.badge} className="absolute left-2 top-2" />}
        <button
          type="button"
          aria-label={wished ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          aria-pressed={wished}
          onClick={() => setWished((w) => !w)}
          className={`absolute right-1.5 top-1.5 z-10 grid size-8 place-items-center rounded-full transition-colors ${
            wished ? "text-sale" : "text-ink-700 hover:bg-white hover:text-sale"
          }`}
        >
          <Icon name="heart" className={`size-[17px] ${wished ? "fill-current" : ""}`} />
        </button>
      </div>

      <div className="flex flex-1 flex-col px-1 pb-1 pt-3 sm:px-1.5">
        <h3 className="line-clamp-2 min-h-[2.5em] text-[13px] font-semibold leading-[1.25] text-ink-900 sm:text-[13.5px]">
          {/* Stretched link: the whole card navigates; buttons sit above it via z-10. */}
          <Link href={productHref(product)} className="outline-none after:absolute after:inset-0 after:rounded-[10px] focus-visible:after:ring-2 focus-visible:after:ring-brand-500">
            {product.name}
          </Link>
        </h3>
        <p className="mt-0.5 text-[12px] text-ink-400">{product.brand}</p>

        <div className="mt-3 flex items-center gap-1 text-[12px]">
          {product.rating ? (
            <>
              <Icon name="star" className="size-3.5 text-star" />
              <span className="font-semibold text-ink-800">{product.rating}</span>
              <span className="text-ink-400">({product.reviews})</span>
            </>
          ) : (
            <span className="text-ink-400">No reviews yet</span>
          )}
        </div>

        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-[16px] font-bold tracking-[-0.01em] text-brand-700 sm:text-[17px]">{formatPrice(product.price)}</span>
          <span className="text-[11.5px] text-ink-400 line-through">{formatPrice(product.compareAt)}</span>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className={`relative z-10 mt-3.5 flex h-9 w-full items-center justify-center gap-1.5 rounded-md text-[12.5px] font-semibold text-white transition-colors sm:text-[13px] ${
            status === "added" ? "bg-brand-500" : status === "limit" ? "bg-ink-500" : "bg-brand-700 hover:bg-brand-800"
          }`}
        >
          {status === "added" ? (
            <>
              <Icon name="check" className="size-4" strokeWidth={2.2} /> Added
            </>
          ) : status === "limit" ? (
            "Stock limit reached"
          ) : (
            "Add to Cart"
          )}
        </button>
      </div>
    </article>
  );
}
