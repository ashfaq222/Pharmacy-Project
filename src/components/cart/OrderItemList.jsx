import AssetImage from "@/components/ui/AssetImage";
import ProductPlaceholder from "@/components/ui/ProductPlaceholder";
import { formatPrice } from "@/lib/products";

/** Compact line items (image, name, qty × unit price, line total). `items` come from toOrderItems() or a placed order. */
export default function OrderItemList({ items, className = "" }) {
  return (
    <ul aria-label="Order items" className={`divide-y divide-line ${className}`}>
      {items.map((item) => (
        <li key={item.slug} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
          <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-mist">
            <AssetImage src={item.image} alt="" fill sizes="56px" className="object-contain p-1.5" fallback={<ProductPlaceholder className="h-[62%]" />} />
            <span className="absolute -right-0 -top-0 grid h-5 min-w-5 place-items-center rounded-bl-md bg-brand-700 px-1 text-[10.5px] font-bold text-white">
              {item.quantity}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="line-clamp-2 text-[13px] font-semibold leading-snug text-ink-900">{item.name}</p>
            <p className="mt-0.5 text-[12px] tabular-nums text-ink-500">
              Qty {item.quantity} × {formatPrice(item.unitPrice)}
            </p>
          </div>
          <p className="shrink-0 text-[13.5px] font-semibold tabular-nums text-ink-900">{formatPrice(item.unitPrice * item.quantity)}</p>
        </li>
      ))}
    </ul>
  );
}
