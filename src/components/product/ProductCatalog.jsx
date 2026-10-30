"use client";

import { Suspense, useId, useState } from "react";
import Container from "@/components/ui/Container";
import Icon from "@/components/ui/Icons";
import ProductGrid from "@/components/home/ProductGrid";
import NoProductsFound from "@/components/home/NoProductsFound";
import { useProductFilters } from "@/hooks/useProductFilters";
import { products } from "@/data/home";
import { PRODUCTS_PATH, SEARCH_PARAM, SORT_OPTIONS, groupByCategory } from "@/lib/products";

const control =
  "h-11 w-full rounded-md border border-line bg-white text-[14px] text-ink-900 outline-none transition-[border-color,box-shadow] hover:border-ink-400/40 focus:border-brand-500 focus:ring-4 focus:ring-mint-100";

const countLabel = (n) => `${n} ${n === 1 ? "product" : "products"}`;

/** Plain GET form to /products?q=… — works before hydration. `value`/`onChange`/`onSubmit` are added once live. */
function CatalogSearch({ value, onChange, onSubmit }) {
  const id = useId();
  return (
    <form role="search" action={PRODUCTS_PATH} onSubmit={onSubmit} className="relative w-full sm:max-w-[420px]">
      <label htmlFor={id} className="sr-only">
        Search products
      </label>
      <Icon name="search" className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-ink-400" />
      <input
        id={id}
        type="search"
        name={SEARCH_PARAM}
        value={value}
        onChange={onChange}
        autoComplete="off"
        placeholder="Search medicines, brands, health products..."
        className={`${control} pl-10 pr-4 placeholder:text-ink-400`}
      />
    </form>
  );
}

function SortSelect({ value, onChange }) {
  const id = useId();
  return (
    <div className="flex shrink-0 items-center gap-2.5">
      <label htmlFor={id} className="shrink-0 text-[13px] font-medium text-ink-500">
        Sort by
      </label>
      <div className="relative w-full sm:w-[210px]">
        <select id={id} value={value} onChange={onChange} className={`${control} cursor-pointer appearance-none pl-4 pr-10`}>
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <Icon name="chevronDown" className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-500" strokeWidth={2} />
      </div>
    </div>
  );
}

function CategorySection({ category, products }) {
  const titleId = `category-${category.slug}-title`;
  return (
    <section aria-labelledby={titleId}>
      <div className="flex items-center gap-3 border-b border-line pb-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-mint-50 text-brand-700">
          <Icon name={category.icon} className="size-[22px]" strokeWidth={1.5} />
        </span>
        <h2 id={titleId} className="text-[19px] font-bold tracking-[-0.01em] text-ink-900 sm:text-[21px]">
          {category.label}
        </h2>
        <span className="ml-auto shrink-0 text-[12.5px] text-ink-500">{countLabel(products.length)}</span>
      </div>
      <ProductGrid products={products} className="mt-5" />
    </section>
  );
}

/** Heading, toolbar, count and category sections. Without handlers (pre-hydration fallback) it shows the full catalogue. */
function CatalogView({ results = products, term = "", category, sort, isFiltered = false, search = {}, onSort, onReset }) {
  const groups = groupByCategory(results);

  return (
    <section aria-labelledby="all-products-title" className="bg-white pb-14 pt-8 sm:pt-10 lg:pb-16 lg:pt-12">
      <Container>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-500">Our catalogue</p>
        <h1 id="all-products-title" className="mt-2 text-[28px] font-bold tracking-[-0.02em] text-ink-900 sm:text-[34px]">
          All Products
        </h1>
        <p className="mt-1.5 text-[13.5px] text-ink-500 sm:text-[14px]">Genuine medicines, vitamins and everyday health essentials.</p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CatalogSearch {...search} />
          <SortSelect value={sort} onChange={onSort} />
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1">
          <p role="status" className="text-[13px] text-ink-700">
            Showing <span className="font-semibold text-ink-900">{results.length}</span> of {countLabel(products.length)}
            {term && (
              <>
                {" "}
                matching <span className="font-semibold text-ink-900">“{term}”</span>
              </>
            )}
            {category ? (
              <>
                {" "}
                in <span className="font-semibold text-ink-900">{category.label}</span>
              </>
            ) : (
              groups.length > 1 && ` in ${groups.length} categories`
            )}
          </p>
          {isFiltered && (
            <button type="button" onClick={onReset} className="ml-auto text-[13px] font-semibold text-brand-700 transition-colors hover:text-brand-500">
              Clear filters
            </button>
          )}
        </div>

        {groups.length > 0 ? (
          <div className="mt-7 space-y-10 lg:space-y-12">
            {groups.map((group) => (
              <CategorySection key={group.category.slug} {...group} />
            ))}
          </div>
        ) : (
          <NoProductsFound term={term} category={category} onReset={onReset} className="mt-6" />
        )}
      </Container>
    </section>
  );
}

function LiveCatalog() {
  const { query, category, sort, results, isFiltered, setQuery, setSort, reset } = useProductFilters();

  const [value, setValue] = useState(query);
  // Follow URL changes made elsewhere (header search, "Clear filters", Back/Forward).
  const [syncedQuery, setSyncedQuery] = useState(query);
  if (query !== syncedQuery) {
    setSyncedQuery(query);
    setValue(query);
  }

  const search = {
    value,
    // Live results; starting a search adds one history entry (so Back clears it), later keystrokes replace it.
    onChange: (e) => {
      setValue(e.target.value);
      setQuery(e.target.value, { replace: query.trim() !== "" });
    },
    onSubmit: (e) => {
      e.preventDefault();
      e.currentTarget.querySelector("input")?.blur(); // dismiss the mobile keyboard
    },
  };

  return (
    <CatalogView
      results={results}
      term={query.trim()}
      category={category}
      sort={sort}
      isFiltered={isFiltered}
      search={search}
      onSort={(e) => setSort(e.target.value)}
      onReset={reset}
    />
  );
}

/** The All Products page body; reads ?q=, ?category= and ?sort= from the URL. */
export default function ProductCatalog() {
  return (
    <Suspense fallback={<CatalogView />}>
      <LiveCatalog />
    </Suspense>
  );
}
