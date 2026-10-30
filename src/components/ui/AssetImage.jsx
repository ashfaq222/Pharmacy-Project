"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * Local asset paths may contain spaces or "&" (e.g. "/media/products/Vitamins & Supplements/…").
 * A raw "&" in the path 404s when the image optimizer fetches it, and encodeURI leaves "&" alone.
 */
const encodePath = (src) => (src?.startsWith("/") ? encodeURI(src).replaceAll("&", "%26") : src);

/**
 * next/image that falls back to `fallback` when the asset file isn't there yet.
 * Lets the page ship with final asset paths before the assets exist.
 */
export default function AssetImage({ src: rawSrc, alt, fallback = null, ...props }) {
  const src = encodePath(rawSrc);
  const [failed, setFailed] = useState(!src);
  const ref = useRef(null);

  // Catch errors that fired before hydration attached onError.
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  if (failed) return fallback;
  return <Image ref={ref} src={src} alt={alt} onError={() => setFailed(true)} {...props} />;
}
