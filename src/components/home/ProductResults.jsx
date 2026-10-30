"use client";

import Icon from "@/components/ui/Icons";
import ProductGrid from "@/components/home/ProductGrid";
import NoProductsFound from "@/components/home/NoProductsFound";
import { useProductFilters } from "@/hooks/useProductFilters";
import { products } from "@/data/home";
import { featuredProducts } from "@/lib/products";

function FilterChip({ label, removeLabel, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-white py-1 pl-3 pr-1 text-[12.5px] font-medium text-ink-800 ring-1 ring-line">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={removeLabel}
        className="grid size-5 place-items-center rounded-full text-ink-400 transition-colors hover:bg-mist hover:text-ink-900"
      >
        <Icon name="close" className="size-3" strokeWidth={2.2} />
      </button>
    </span>
  );
}

/**
 * Homepage product grid; reads ?q= and ?category= from the URL. Unfiltered it shows the featured
 * row; a search or category searches the whole catalogue.
 */
export default function ProductResults() {
  const { query, category, results: matches, isFiltered, setQuery, setCategory, reset } = useProductFilters();
  const results = isFiltered ? matches : featuredProducts;
  const term = query.trim();

  return (
    <>
      {isFiltered && (
        <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-line bg-mist px-4 py-3">
          <p role="status" className="text-[13px] text-ink-700">
            <span className="font-semibold text-ink-900">{results.length}</span> of {products.length} products
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {term && <FilterChip label={`“${term}”`} removeLabel="Clear search" onRemove={() => setQuery("")} />}
            {category && <FilterChip label={category.label} removeLabel={`Remove ${category.label} filter`} onRemove={() => setCategory("")} />}
          </div>
          <button type="button" onClick={reset} className="ml-auto text-[13px] font-semibold text-brand-700 transition-colors hover:text-brand-500">
            Clear all
          </button>
        </div>
      )}

      {results.length > 0 ? (
        <ProductGrid products={results} className={isFiltered ? "mt-5" : "mt-7"} />
      ) : (
        <NoProductsFound term={term} category={category} onReset={reset} />
      )}
    </>
  );
}
