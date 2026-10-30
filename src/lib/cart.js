import { getProduct } from "@/lib/products";

/**
 * Cart persistence + pricing rules. Plain JS so it can be unit-tested and
 * shared; the React side lives in components/cart/CartProvider.jsx.
 *
 * Stored shape (localStorage[CART_STORAGE_KEY]):
 *   { version: 1, items: [{ slug: "omega-3", quantity: 2 }, ...] }
 * Only slugs and quantities are stored — names, prices and stock are always
 * re-read from the catalogue so a stale or edited entry can't change a price.
 */

export const CART_STORAGE_KEY = "healthplus.cart";
const STORAGE_VERSION = 1;

/** Demo flat-rate delivery charge, in the store currency. */
export const DELIVERY_FEE = 60;

/**
 * Turns anything (parsed JSON, old formats, hand-edited data) into a valid
 * cart: known in-stock products only, whole quantities clamped to 1..stock,
 * and one entry per product (duplicates are merged).
 */
export function sanitizeCartItems(value) {
  const list = Array.isArray(value) ? value : Array.isArray(value?.items) ? value.items : [];
  const merged = new Map();

  for (const entry of list) {
    if (!entry || typeof entry !== "object" || typeof entry.slug !== "string") continue;
    const product = getProduct(entry.slug);
    const quantity = Math.floor(Number(entry.quantity));
    if (!product || product.stock <= 0 || !Number.isFinite(quantity) || quantity < 1) continue;
    merged.set(product.slug, Math.min((merged.get(product.slug) ?? 0) + quantity, product.stock));
  }

  return Array.from(merged, ([slug, quantity]) => ({ slug, quantity }));
}

/** Client-only. Never throws: blocked storage or corrupted JSON yields an empty cart. */
export function readStoredCart() {
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    return sanitizeCartItems(JSON.parse(raw));
  } catch {
    try {
      window.localStorage.removeItem(CART_STORAGE_KEY); // drop unreadable data
    } catch {
      // storage unavailable (e.g. privacy mode) — nothing to clean up
    }
    return [];
  }
}

/** Client-only. Fails silently when storage is full or unavailable. */
export function writeStoredCart(items) {
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ version: STORAGE_VERSION, items }));
  } catch {
    // quota exceeded / storage disabled — the in-memory cart still works
  }
}

export function getOrderTotals(subtotal) {
  const deliveryFee = subtotal > 0 ? DELIVERY_FEE : 0;
  return { subtotal, deliveryFee, total: subtotal + deliveryFee };
}

/** Cart lines -> plain order items (prices captured now). Used by the checkout summary and placed orders. */
export function toOrderItems(lines) {
  return lines.map(({ product, quantity }) => ({
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    image: product.image,
    unitPrice: product.price,
    quantity,
  }));
}
