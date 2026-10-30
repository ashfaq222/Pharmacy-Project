import Icon from "@/components/ui/Icons";

/** Empty state for a filtered product list (homepage + All Products). `term` is the trimmed search, `category` the active one. */
export default function NoProductsFound({ term, category, onReset, className = "mt-5" }) {
  return (
    <div className={`flex flex-col items-center rounded-xl border border-dashed border-line px-6 py-14 text-center ${className}`}>
      <span className="grid size-14 place-items-center rounded-full bg-mint-50 text-brand-700">
        <Icon name="search" className="size-6" />
      </span>
      <h3 className="mt-4 text-[18px] font-bold tracking-[-0.01em] text-ink-900">No products found</h3>
      <p className="mt-1.5 max-w-[420px] text-[14px] leading-relaxed text-ink-500">
        We couldn&apos;t find anything
        {term && (
          <>
            {" "}
            matching <span className="font-semibold text-ink-800">“{term}”</span>
          </>
        )}
        {category && (
          <>
            {" "}
            in <span className="font-semibold text-ink-800">{category.label}</span>
          </>
        )}
        . Try a different search or browse all categories.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-6 inline-flex h-11 items-center rounded-md bg-brand-700 px-5 text-[13.5px] font-semibold text-white transition-colors hover:bg-brand-800"
      >
        Clear filters
      </button>
    </div>
  );
}
