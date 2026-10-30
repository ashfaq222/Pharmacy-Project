"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { products } from "@/data/home";
import { CATEGORY_PARAM, PRODUCTS_PATH, SEARCH_PARAM, SORT_PARAM, filterProducts, getCategory, getSort, sortProducts } from "@/lib/products";

/**
 * Search + category filters (and sort), stored in the URL of a product listing
 * — the homepage or /products (?q=…&category=…&sort=…) — so they survive
 * refreshes, can be shared, and work from any page's header.
 *
 * Uses useSearchParams, so callers must sit inside a <Suspense> boundary
 * (required for prerendered routes with Cache Components).
 */
export function useProductFilters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const onListing = pathname === "/" || pathname === PRODUCTS_PATH;

  const query = searchParams.get(SEARCH_PARAM) ?? "";
  const category = getCategory(searchParams.get(CATEGORY_PARAM)); // unknown slugs are ignored
  const sort = getSort(searchParams.get(SORT_PARAM));
  const results = sortProducts(filterProducts(products, { query, category }), sort);
  const isFiltered = query.trim() !== "" || Boolean(category);

  /**
   * On a listing page, update its URL in place via the History API (Next keeps
   * useSearchParams in sync, no server request). Elsewhere, navigate home.
   */
  function update(changes, { replace = false } = {}) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(changes)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    const qs = params.toString();
    const base = onListing ? pathname : "/";
    const url = qs ? `${base}?${qs}` : base;

    if (onListing) {
      window.history[replace ? "replaceState" : "pushState"](null, "", url);
    } else {
      router.push(`${url}#products`);
    }
  }

  return {
    query,
    category,
    sort,
    results,
    isFiltered,
    setQuery: (value, options) => update({ [SEARCH_PARAM]: value.trim() ? value : "" }, options),
    setCategory: (slug) => update({ [CATEGORY_PARAM]: slug }),
    setSort: (value) => update({ [SORT_PARAM]: getSort(value) }),
    reset: () => update({ [SEARCH_PARAM]: "", [CATEGORY_PARAM]: "" }),
  };
}
