import { NextResponse } from "next/server";
import { products } from "@/data/home";

const knownSlugs = new Set(products.map((p) => p.slug));

function readSlug(pathname) {
  try {
    return decodeURIComponent(pathname.split("/")[2] ?? "");
  } catch {
    return null; // malformed percent-encoding — treat as unknown
  }
}

/**
 * With Cache Components, /products/[slug] streams its shell before `notFound()`
 * runs, which locks the status at 200. Unknown slugs are instead rewritten (URL
 * unchanged) to a static route that is prerendered as a true 404.
 */
export function proxy(request) {
  if (knownSlugs.has(readSlug(request.nextUrl.pathname))) return NextResponse.next();
  return NextResponse.rewrite(new URL("/products/product-not-found", request.url));
}

export const config = {
  matcher: "/products/:slug",
};
