"use client";

import { createContext, useContext, useSyncExternalStore } from "react";
import { getProduct } from "@/lib/products";
import { CART_STORAGE_KEY, readStoredCart, writeStoredCart } from "@/lib/cart";

/*
 * Cart store — one per browser tab, persisted to localStorage.
 *
 * Read through useSyncExternalStore: the server snapshot is always the empty
 * cart, so server HTML and the first client render agree (no hydration
 * mismatch); React then re-renders with the stored cart. localStorage is only
 * touched in getSnapshot / event handlers, which never run on the server.
 */
const EMPTY_CART = [];
let cartItems = EMPTY_CART;
let loaded = false;
const listeners = new Set();

function emit() {
  listeners.forEach((listener) => listener());
}

// Keep other open tabs in sync.
function handleStorage(event) {
  if (event.key !== CART_STORAGE_KEY && event.key !== null) return;
  cartItems = readStoredCart();
  emit();
}

function subscribe(listener) {
  if (listeners.size === 0) window.addEventListener("storage", handleStorage);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", handleStorage);
  };
}

function getSnapshot() {
  if (!loaded) {
    cartItems = readStoredCart();
    loaded = true;
  }
  return cartItems;
}

const getServerSnapshot = () => EMPTY_CART;

function commit(next) {
  cartItems = next;
  writeStoredCart(next);
  emit();
}

/** Adds up to `quantity`, capped by stock. Returns how many were actually added. */
function add(slug, quantity = 1) {
  const product = getProduct(slug);
  const current = getSnapshot();
  const existing = current.find((item) => item.slug === slug);
  const have = existing?.quantity ?? 0;
  const next = product ? Math.min(have + Math.max(1, Math.floor(quantity)), product.stock) : have;
  if (next <= have) return 0;

  commit(existing ? current.map((item) => (item.slug === slug ? { ...item, quantity: next } : item)) : [...current, { slug, quantity: next }]);
  return next - have;
}

/** Sets a line's quantity, clamped to 1..stock. */
function setQuantity(slug, quantity) {
  const product = getProduct(slug);
  if (!product) return;
  const next = Math.min(Math.max(1, Math.floor(quantity)), product.stock);
  commit(getSnapshot().map((item) => (item.slug === slug ? { ...item, quantity: next } : item)));
}

function remove(slug) {
  commit(getSnapshot().filter((item) => item.slug !== slug));
}

function clear() {
  commit(EMPTY_CART);
}

const subscribeNoop = () => () => {};

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  // false during SSR + hydration, true once the stored cart has been read.
  const ready = useSyncExternalStore(subscribeNoop, () => true, () => false);

  const lines = items.map((item) => ({ ...item, product: getProduct(item.slug) }));
  const count = lines.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  const getQuantity = (slug) => items.find((item) => item.slug === slug)?.quantity ?? 0;

  return (
    <CartContext value={{ lines, count, subtotal, ready, add, setQuantity, remove, clear, getQuantity }}>
      {children}
    </CartContext>
  );
}

export function useCart() {
  const cart = useContext(CartContext);
  if (!cart) throw new Error("useCart must be used inside <CartProvider>");
  return cart;
}
