import Link from "next/link";
import AssetImage from "@/components/ui/AssetImage";
import Icon from "@/components/ui/Icons";

const tones = {
  dark: {
    surface: "bg-forest-900",
    placeholder: "bg-[radial-gradient(70%_80%_at_70%_40%,rgb(107_212_119/0.14),transparent_70%)]",
    fade: "bg-[linear-gradient(90deg,var(--color-forest-900)_0%,rgb(10_42_32/0.92)_34%,rgb(10_42_32/0.35)_62%,transparent_85%)]",
    blend: "from-forest-900",
    title: "text-white",
    text: "text-white/80",
    button: "bg-white text-ink-900 hover:bg-mint-300",
  },
  light: {
    surface: "bg-cream",
    placeholder: "bg-[radial-gradient(70%_80%_at_70%_40%,rgb(255_255_255/0.6),transparent_70%)]",
    fade: "bg-[linear-gradient(90deg,var(--color-cream)_0%,rgb(245_237_229/0.94)_34%,rgb(245_237_229/0.3)_62%,transparent_85%)]",
    blend: "from-cream",
    title: "text-brand-700",
    text: "text-ink-500",
    button: "bg-white text-brand-700 shadow-[0_2px_10px_rgb(16_24_20/0.08)] hover:bg-brand-700 hover:text-white",
  },
};

// From sm, nudge 80px past right-aligned so subjects clear the text column; the
// image is wider than the panel, and any exposed left edge sits under the solid fade.
// A slide can override this via `imageClassName` (e.g. for a differently framed photo).
const DEFAULT_IMAGE_POSITION = "sm:[object-position:calc(100%_+_80px)_center]";

/**
 * Promotional panel. Below `sm` the image is a strip above the text; from `sm`
 * it covers the whole panel (right-anchored, so the subject stays clear of the
 * text) behind the left-to-right fade. Size is set by the parent.
 */
export default function PromoBanner({ banner, className = "" }) {
  const t = tones[banner.tone];

  return (
    <div className={`relative isolate flex size-full flex-col overflow-hidden sm:flex-row ${t.surface} ${className}`}>
      <div className="relative h-40 w-full shrink-0 sm:absolute sm:inset-0 sm:-z-10 sm:h-auto">
        <AssetImage
          src={banner.image}
          alt={banner.imageAlt}
          fill
          // Rendered width = banner height × 3.03 (object-cover on a 3:1 image), which can exceed the panel width.
          sizes="(min-width: 1280px) 820px, (min-width: 768px) 100vw, (min-width: 640px) 760px, 500px"
          className={`object-cover object-right ${banner.imageClassName ?? DEFAULT_IMAGE_POSITION}`}
          fallback={<div className={`size-full ${t.placeholder}`} />}
        />
        <div aria-hidden="true" className={`absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t to-transparent sm:hidden ${t.blend}`} />
      </div>
      <div aria-hidden="true" className={`absolute inset-0 -z-10 hidden sm:block ${t.fade}`} />

      <div className="flex flex-1 flex-col justify-center px-6 pb-7 pt-5 sm:max-w-[62%] sm:flex-none sm:px-8 sm:py-8 xl:px-10">
        <h3 className={`text-[23px] font-bold leading-[1.15] tracking-[-0.02em] sm:text-[26px] xl:text-[30px] ${t.title}`}>
          {banner.titleLines[0]}
          <br />
          {banner.titleLines[1]}
        </h3>
        <p className={`mt-3 max-w-[290px] text-[13px] leading-[1.55] ${t.text}`}>{banner.text}</p>
        {/* Link (not <a>): a category CTA like "/?category=…#products" then filters in place instead of reloading the page. */}
        <Link
          href={banner.cta.href}
          className={`group mt-6 inline-flex h-10 w-fit items-center gap-2 rounded-full px-5 text-[13px] font-semibold transition-colors ${t.button}`}
        >
          {banner.cta.label}
          <Icon name="arrowRight" className="size-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
        </Link>
      </div>
    </div>
  );
}
