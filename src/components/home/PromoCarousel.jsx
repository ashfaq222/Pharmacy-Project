"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import PromoBanner from "@/components/home/PromoBanner";
import Icon from "@/components/ui/Icons";

const AUTOPLAY_MS = 3000;

// Browser state read through useSyncExternalStore (server snapshot: no autoplay).
const subscribeVisibility = (onChange) => {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
};
const isPageVisible = () => document.visibilityState === "visible";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const subscribeReducedMotion = (onChange) => {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};
const prefersReducedMotion = () => window.matchMedia(REDUCED_MOTION).matches;

export default function PromoCarousel({ slides, className = "" }) {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  const pageVisible = useSyncExternalStore(subscribeVisibility, isPageVisible, () => false);
  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, prefersReducedMotion, () => true);

  const go = (dir) => setIndex((i) => (i + dir + slides.length) % slides.length);
  const autoplay = slides.length > 1 && pageVisible && !reducedMotion && !hovered && !keyboardFocus;

  // One timeout per shown slide: any slide change (auto or manual) restarts the
  // countdown, and cleanup guarantees a single pending timer (also on unmount).
  useEffect(() => {
    if (!autoplay) return;
    const timer = setTimeout(() => setIndex((i) => (i + 1) % slides.length), AUTOPLAY_MS);
    return () => clearTimeout(timer);
  }, [autoplay, index, slides.length]);

  return (
    <div
      className={`relative grid overflow-hidden ${className}`}
      role="region"
      aria-roledescription="carousel"
      aria-label="Promotions"
      aria-live={autoplay ? "off" : "polite"}
      // Mouse only: a touch tap fires pointerenter without a matching leave.
      onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setHovered(false)}
      // Keyboard only: a mouse click also focuses the arrow, which must not stop autoplay.
      onFocus={(e) => setKeyboardFocus(e.target.matches(":focus-visible"))}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setKeyboardFocus(false)}
    >
      {slides.map((slide, i) => (
        <div
          key={slide.titleLines.join(" ")}
          aria-hidden={i !== index}
          inert={i !== index}
          className={`col-start-1 row-start-1 transition-opacity duration-700 ease-out ${i === index ? "opacity-100" : "opacity-0"}`}
        >
          <PromoBanner banner={slide} />
        </div>
      ))}

      {slides.length > 1 && (
        <div className="absolute bottom-4 right-4 flex gap-2 sm:bottom-5 sm:right-5">
          {[
            ["chevronLeft", -1, "Previous promotion"],
            ["chevronRight", 1, "Next promotion"],
          ].map(([icon, dir, label]) => (
            <button
              key={icon}
              type="button"
              aria-label={label}
              onClick={() => go(dir)}
              className="grid size-8 place-items-center rounded-full bg-white/90 text-ink-800 shadow-[0_2px_8px_rgb(16_24_20/0.12)] backdrop-blur transition-colors hover:bg-white hover:text-brand-700"
            >
              <Icon name={icon} className="size-4" strokeWidth={2} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
