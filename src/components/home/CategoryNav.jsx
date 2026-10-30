"use client";

import { Suspense, useRef } from "react";
import Container from "@/components/ui/Container";
import Icon from "@/components/ui/Icons";
import { categories } from "@/data/home";
import { useProductFilters } from "@/hooks/useProductFilters";

function ArrowButton({ direction, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "left" ? "Previous categories" : "Next categories"}
      className="hidden size-9 shrink-0 place-items-center rounded-full text-ink-500 transition-colors hover:bg-white hover:text-brand-700 hover:shadow-card md:grid"
    >
      <Icon name={direction === "left" ? "chevronLeft" : "chevronRight"} className="size-[18px]" strokeWidth={1.8} />
    </button>
  );
}

/** `activeSlug` "" = All Categories. `onSelect` is absent in the pre-hydration fallback. */
function CategoryRail({ activeSlug = "", onSelect }) {
  const railRef = useRef(null);

  const scroll = (dir) => {
    const rail = railRef.current;
    if (rail) rail.scrollBy({ left: dir * rail.clientWidth * 0.6, behavior: "smooth" });
  };

  return (
    <section id="categories" aria-label="Shop by category" className="scroll-mt-20 bg-mist py-5 lg:py-6">
      <Container className="flex items-center gap-2 lg:gap-3">
        <ArrowButton direction="left" onClick={() => scroll(-1)} />

        <ul
          ref={railRef}
          className="scrollbar-none -mx-4 flex flex-1 snap-x snap-mandatory gap-2 overflow-x-auto px-4 py-1 md:mx-0 md:gap-0 md:rounded-2xl md:bg-white md:px-1.5 md:py-1.5 md:shadow-card"
        >
          {categories.map((cat, i) => {
            const isActive = cat.slug === activeSlug;
            return (
              <li key={cat.label} className="flex flex-1 snap-start items-stretch">
                {i > 0 && <span aria-hidden="true" className="my-5 hidden w-px bg-line md:block" />}
                <button
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => onSelect?.(cat.slug)}
                  className={`group flex w-full min-w-[104px] flex-col items-center gap-2.5 rounded-xl px-3 pb-3.5 pt-4 transition-all duration-300 md:min-w-[118px] lg:pb-4 xl:min-w-0 ${
                    isActive ? "bg-white shadow-[0_6px_20px_-6px_rgb(16_24_20/0.14)] ring-1 ring-line" : "bg-white md:bg-transparent md:hover:bg-mist/70"
                  }`}
                >
                  <span
                    className={`grid size-12 place-items-center rounded-full transition-colors duration-300 ${
                      isActive ? "bg-mint-100 text-brand-700" : "text-ink-800 group-hover:bg-mint-50 group-hover:text-brand-700"
                    }`}
                  >
                    <Icon name={cat.icon} className="size-[26px]" strokeWidth={1.5} />
                  </span>
                  <span className={`whitespace-nowrap text-[12px] font-medium lg:text-[12.5px] ${isActive ? "text-ink-900" : "text-ink-700"}`}>
                    {cat.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <ArrowButton direction="right" onClick={() => scroll(1)} />
      </Container>
    </section>
  );
}

function LiveCategoryRail() {
  const { category, setCategory } = useProductFilters();
  return <CategoryRail activeSlug={category?.slug ?? ""} onSelect={setCategory} />;
}

export default function CategoryNav() {
  return (
    <Suspense fallback={<CategoryRail />}>
      <LiveCategoryRail />
    </Suspense>
  );
}
