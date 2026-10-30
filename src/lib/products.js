import { brand, categories, featuredSlugs, products } from "@/data/home";

export const formatPrice = (value) => `${brand.currency} ${value.toLocaleString("en-US")}`;

export const productHref = (product) => `/products/${product.slug}`;

/** The All Products page. */
export const PRODUCTS_PATH = "/products";

export const discountPercent = (product) => Math.round((1 - product.price / product.compareAt) * 100);

export function getProduct(slug) {
  return products.find((p) => p.slug === slug);
}

/** The homepage's curated "Popular Products" row. */
export const featuredProducts = featuredSlugs.map(getProduct).filter(Boolean);

/** Same-category products first, then the rest of the catalogue. */
export function getRelatedProducts(product, limit = 4) {
  const others = products.filter((p) => p.slug !== product.slug);
  const sameCategory = others.filter((p) => p.category === product.category);
  const rest = others.filter((p) => p.category !== product.category);
  return [...sameCategory, ...rest].slice(0, limit);
}

export const LOW_STOCK_THRESHOLD = 10;

export function getStockStatus(stock) {
  if (stock <= 0) return { tone: "out", label: "Out of stock" };
  if (stock <= LOW_STOCK_THRESHOLD) return { tone: "low", label: `Only ${stock} left in stock` };
  return { tone: "in", label: "In stock" };
}

/* ---------- Search & category filtering ---------- */

export const SEARCH_PARAM = "q";
export const CATEGORY_PARAM = "category";

/** A real category (never "All Categories") by its URL slug, or undefined. */
export function getCategory(slug) {
  return slug ? categories.find((c) => c.slug === slug) : undefined;
}

/** All Products URL that shows a product's category filtered. */
export function categoryHref(label) {
  const category = categories.find((c) => c.label === label);
  return category?.slug ? `${PRODUCTS_PATH}?${CATEGORY_PARAM}=${category.slug}` : PRODUCTS_PATH;
}

// "Omega-3 Fish Oil" -> "omega 3 fish oil" (case, accents and punctuation ignored)
const normalize = (text) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const searchIndex = new Map(
  products.map((p) => {
    const primary = normalize(`${p.name} ${p.brand}`);
    const all = normalize(`${p.name} ${p.brand} ${p.category} ${p.packSize} ${p.description}`);
    return [p.slug, { primary, all, compact: all.replace(/ /g, "") }];
  }),
);

/**
 * Products matching every word of `query` (in name, brand, category, pack
 * size or description) within `category`. Name/brand matches sort first;
 * otherwise catalogue order is kept.
 */
export function filterProducts(list, { query = "", category } = {}) {
  const terms = normalize(query).split(" ").filter(Boolean);
  const inCategory = category ? list.filter((p) => p.category === category.label) : list;
  if (terms.length === 0) return inCategory;

  const matches = (text, compact) => terms.every((term) => text.includes(term) || compact?.includes(term));
  return inCategory
    .filter((p) => {
      const idx = searchIndex.get(p.slug);
      return matches(idx.all, idx.compact); // compact lets "omega3" match "Omega-3"
    })
    .sort((a, b) => Number(!matches(searchIndex.get(a.slug).primary)) - Number(!matches(searchIndex.get(b.slug).primary)));
}

/* ---------- Sorting & grouping (All Products page) ---------- */

export const SORT_PARAM = "sort";

// "" = default order (catalogue order, or relevance while searching). Products have no date field, so no "Newest".
export const SORT_OPTIONS = [
  { value: "", label: "Default" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

/** A known ?sort= value, or "" (unknown values are ignored). */
export const getSort = (value) => (SORT_OPTIONS.some((o) => o.value === value) ? value : "");

export function sortProducts(list, sort) {
  if (sort === "price-asc") return [...list].sort((a, b) => a.price - b.price);
  if (sort === "price-desc") return [...list].sort((a, b) => b.price - a.price);
  return list;
}

/** `list` split into category sections, in category-rail order; categories with no products are left out. */
export function groupByCategory(list) {
  return categories
    .filter((c) => c.slug)
    .map((category) => ({ category, products: list.filter((p) => p.category === category.label) }))
    .filter((group) => group.products.length > 0);
}
