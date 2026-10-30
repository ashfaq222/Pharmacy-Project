import { notFound } from "next/navigation";

/**
 * Proxy rewrites unknown /products/[slug] URLs here. Because this route is
 * fully static, its notFound() is resolved at build time and served with a
 * real 404 status — unlike the streamed dynamic route. Renders ../not-found.js.
 */
export default function ProductNotFoundRoute() {
  notFound();
}
