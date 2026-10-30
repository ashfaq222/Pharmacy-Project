"use client";

import { useState, useSyncExternalStore } from "react";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const subscribeReducedMotion = (onChange) => {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};
const prefersReducedMotion = () => window.matchMedia(REDUCED_MOTION).matches;

/**
 * Looping hero background. Not rendered on the server or for reduced-motion
 * users, so the still beneath it acts as the poster; fades in once frames play.
 *
 * hero-loop.mp4 has black letterbox bars baked in (picture = rows 85–633 of 720,
 * ~21:9 = 76.25% of the frame). The element is 132% tall (picture ≈ 100.65% of the
 * hero) and offset −15.9% so the bars always fall just outside the hero (clipped by
 * the section), leaving the picture framed like the 21:9 still underneath.
 */
export default function HeroVideo({ src }) {
  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, prefersReducedMotion, () => true);
  const [playing, setPlaying] = useState(false);

  if (reducedMotion) return null;

  return (
    <video
      className={`absolute inset-x-0 top-[-15.9%] h-[132%] w-full object-cover object-center transition-opacity duration-700 ${
        playing ? "opacity-100" : "opacity-0"
      }`}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      onPlaying={() => setPlaying(true)}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
