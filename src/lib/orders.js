import { getOrderTotals } from "@/lib/cart";

/**
 * Demo orders. Nothing is sent anywhere: the last placed order is kept in
 * sessionStorage so /order-confirmation can show it after navigation and
 * refresh. sessionStorage (not localStorage) keeps the customer's name,
 * phone and address scoped to this tab and gone when it closes.
 */

export const ORDER_STORAGE_KEY = "healthplus.lastOrder";

const ID_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O, 1/I lookalikes

/** e.g. "HP-261030-7KQ2XM" — date + 6 random characters. */
export function createOrderId(date = new Date()) {
  const stamp = [date.getFullYear() % 100, date.getMonth() + 1, date.getDate()].map((n) => String(n).padStart(2, "0")).join("");
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  const random = Array.from(bytes, (b) => ID_ALPHABET[b % ID_ALPHABET.length]).join("");
  return `HP-${stamp}-${random}`;
}

/**
 * Freezes the cart into an order record. `items` come from toOrderItems()
 * and `subtotal` from the cart, so prices are captured at placement time.
 */
export function buildOrder({ customer, items, subtotal }) {
  const { deliveryFee, total } = getOrderTotals(subtotal);
  return {
    id: createOrderId(),
    placedAt: new Date().toISOString(),
    demo: true,
    customer: { fullName: customer.fullName, phone: customer.phone, email: customer.email },
    delivery: { district: customer.district, area: customer.area, address: customer.address, instructions: customer.instructions },
    items,
    subtotal,
    deliveryFee,
    total,
  };
}

/**
 * Stores the order and reads it back. Returns true only when it is really
 * persisted (so the confirmation page survives a refresh); false when storage
 * is blocked or full — the caller must then keep the cart.
 */
export function saveLastOrder(order) {
  try {
    const json = JSON.stringify(order);
    window.sessionStorage.setItem(ORDER_STORAGE_KEY, json);
    return window.sessionStorage.getItem(ORDER_STORAGE_KEY) === json;
  } catch {
    return false;
  }
}

const isNum = (n) => typeof n === "number" && Number.isFinite(n);
const isStr = (s) => typeof s === "string";

function isValidOrder(o) {
  return (
    o && typeof o === "object" &&
    isStr(o.id) && isStr(o.placedAt) && !Number.isNaN(Date.parse(o.placedAt)) &&
    isStr(o.customer?.fullName) && isStr(o.customer?.phone) &&
    isStr(o.delivery?.district) && isStr(o.delivery?.area) && isStr(o.delivery?.address) &&
    Array.isArray(o.items) && o.items.length > 0 &&
    o.items.every((i) => i && isStr(i.slug) && isStr(i.name) && isNum(i.unitPrice) && Number.isInteger(i.quantity) && i.quantity > 0) &&
    isNum(o.subtotal) && isNum(o.deliveryFee) && isNum(o.total)
  );
}

let cache = { raw: undefined, order: null };

/** Client-only. The last demo order, or null when missing or unreadable. */
export function readLastOrder() {
  let raw = null;
  try {
    raw = window.sessionStorage.getItem(ORDER_STORAGE_KEY);
  } catch {
    return null;
  }
  if (raw === null) return null;
  if (raw !== cache.raw) {
    let order = null;
    try {
      const parsed = JSON.parse(raw);
      order = isValidOrder(parsed) ? parsed : null;
    } catch {
      order = null;
    }
    cache = { raw, order };
  }
  return cache.order;
}
