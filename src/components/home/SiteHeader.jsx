"use client";

import { Suspense, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Container from "@/components/ui/Container";
import Icon from "@/components/ui/Icons";
import Logo from "@/components/ui/Logo";
import { useCart } from "@/components/cart/CartProvider";
import { useProductFilters } from "@/hooks/useProductFilters";
import { SEARCH_PARAM, categoryHref } from "@/lib/products";
import { categories, navLinks } from "@/data/home";

/**
 * Plain GET form to /?q=… — works before hydration (and is the Suspense
 * fallback). `value`/`onChange`/`onSubmit` are added once filters are live.
 */
function SearchForm({ className = "", value, onChange, onSubmit }) {
  // Rendered up to three times (desktop, lg dropdown, mobile menu), so ids must be unique.
  const inputId = useId();
  return (
    <form role="search" action="/" onSubmit={onSubmit} className={`relative ${className}`}>
      <label htmlFor={inputId} className="sr-only">
        Search products
      </label>
      <input
        id={inputId}
        type="search"
        name={SEARCH_PARAM}
        value={value}
        onChange={onChange}
        autoComplete="off"
        placeholder="Search for medicine, health products..."
        className="h-10 w-full rounded-full border border-white/20 bg-white/[0.07] pl-4 pr-10 text-[12.5px] text-white placeholder:text-white/60 backdrop-blur-md transition-colors outline-none focus:border-mint-400/70 focus:bg-white/[0.12]"
      />
      <button type="submit" aria-label="Search" className="absolute inset-y-0 right-0 grid w-10 place-items-center text-white/75 hover:text-white">
        <Icon name="search" className="size-[17px]" />
      </button>
    </form>
  );
}

function LiveSearchForm({ className, onSearched }) {
  const pathname = usePathname();
  const { query, setQuery } = useProductFilters();
  const onHome = pathname === "/";

  const [value, setValue] = useState(query);
  // Follow URL changes made elsewhere (another search field, "Clear all").
  const [syncedQuery, setSyncedQuery] = useState(query);
  if (query !== syncedQuery) {
    setSyncedQuery(query);
    setValue(query);
  }

  const handleChange = (e) => {
    setValue(e.target.value);
    if (onHome) setQuery(e.target.value, { replace: true }); // live results on the homepage
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setQuery(value, { replace: onHome });
    if (onHome) document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
    e.currentTarget.querySelector("input")?.blur(); // dismiss the mobile keyboard
    onSearched?.();
  };

  return <SearchForm className={className} value={value} onChange={handleChange} onSubmit={handleSubmit} />;
}

function SearchField({ className = "", onSearched }) {
  return (
    <Suspense fallback={<SearchForm className={className} />}>
      <LiveSearchForm className={className} onSearched={onSearched} />
    </Suspense>
  );
}

function CartButton() {
  const { count } = useCart();
  return (
    <Link href="/cart" aria-label={`Cart, ${count} ${count === 1 ? "item" : "items"}`} className="relative grid size-10 place-items-center rounded-full text-white transition-colors hover:bg-white/10">
      <Icon name="cart" className="size-[22px]" />
      {count > 0 && (
        <span key={count} className="absolute right-0.5 top-0.5 grid h-[18px] min-w-[18px] animate-rise place-items-center rounded-full bg-mint-400 px-1 text-[10px] font-bold text-forest-950 [animation-duration:.4s]">
          {count}
        </span>
      )}
    </Link>
  );
}

const linksIn = (el) => [...(el?.querySelectorAll("a") ?? [])];

const HOVER_OPEN_MS = 90; // ignore a pointer just passing over the nav
const HOVER_CLOSE_MS = 160; // forgive a brief slip off the menu

/**
 * Desktop "Categories" disclosure: a button that opens the category links (/products?category=…).
 * Mouse hover opens it (and leaving closes it); a click toggles it, or pins it open after a hover.
 * ArrowDown / ArrowUp open it and move between links (Home / End jump); Escape, tabbing away,
 * an outside click or choosing a link closes it. Touch and pen use tap only.
 */
function CategoryMenu({ label }) {
  const [open, setOpen] = useState(false);
  const openedBy = useRef(null); // "hover" | "click" | "keyboard"
  const focusOnOpen = useRef(null); // "first" | "last" when opened from the keyboard
  const hoverTimer = useRef(null);
  const wrapperRef = useRef(null);
  const buttonRef = useRef(null);
  const panelRef = useRef(null);
  const panelId = useId();

  const show = (by) => {
    clearTimeout(hoverTimer.current);
    openedBy.current = by;
    setOpen(true);
  };
  const hide = () => {
    clearTimeout(hoverTimer.current);
    openedBy.current = null;
    setOpen(false);
  };

  useEffect(() => () => clearTimeout(hoverTimer.current), []);

  useEffect(() => {
    if (!open || !focusOnOpen.current) return;
    const all = linksIn(panelRef.current);
    (focusOnOpen.current === "last" ? all.at(-1) : all[0])?.focus();
    focusOnOpen.current = null;
  }, [open]);

  // Outside click, and Escape while the menu is open but focus is elsewhere (e.g. opened by hover).
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e) => !wrapperRef.current?.contains(e.target) && hide();
    const onKeyDown = (e) => {
      if (e.key !== "Escape" || e.defaultPrevented) return;
      e.preventDefault();
      hide();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const handlePointerEnter = (e) => {
    if (e.pointerType !== "mouse") return;
    clearTimeout(hoverTimer.current);
    if (!open) hoverTimer.current = setTimeout(() => show("hover"), HOVER_OPEN_MS);
  };
  const handlePointerLeave = (e) => {
    if (e.pointerType !== "mouse") return;
    clearTimeout(hoverTimer.current);
    if (open && openedBy.current === "hover") {
      // Keep it open while a keyboard user is working inside the panel.
      hoverTimer.current = setTimeout(() => !panelRef.current?.contains(document.activeElement) && hide(), HOVER_CLOSE_MS);
    }
  };
  const handleClick = () => {
    if (open && openedBy.current === "hover") openedBy.current = "click"; // a click after hover-open pins it
    else if (open) hide();
    else show("click");
  };

  const handleKeyDown = (e) => {
    const all = linksIn(panelRef.current);
    const index = all.indexOf(document.activeElement);
    const openAt = (where) => {
      focusOnOpen.current = where;
      show("keyboard");
    };
    if (e.key === "Escape" && open) {
      e.preventDefault(); // the header's own Escape handler skips handled events
      hide();
      buttonRef.current?.focus();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) openAt("first");
      else all[(index + 1) % all.length]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) openAt("last");
      else all[index <= 0 ? all.length - 1 : index - 1]?.focus();
    } else if ((e.key === "Home" || e.key === "End") && open && index >= 0) {
      e.preventDefault();
      (e.key === "Home" ? all[0] : all.at(-1)).focus();
    }
  };

  return (
    <div
      ref={wrapperRef}
      className="relative"
      onKeyDown={handleKeyDown}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onBlur={(e) => open && openedBy.current !== "hover" && !wrapperRef.current.contains(e.relatedTarget) && hide()}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={handleClick}
        className={`group relative flex items-center gap-1 whitespace-nowrap py-2 text-[13.5px] font-medium transition-colors ${open ? "text-white" : "text-white/85 hover:text-white"}`}
      >
        {label}
        <Icon name="chevronDown" className={`size-3.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`} strokeWidth={2} />
        <span className={`absolute -bottom-0.5 left-0 h-[2px] rounded-full bg-white/50 transition-all duration-300 ${open ? "w-full" : "w-0 group-hover:w-full"}`} />
      </button>

      {/* Outer layer: positioning, the hover bridge (pt-3 fills the gap under the button) and visibility —
          which flips instantly on open (so keyboard focus can move in) and only fades out on close. */}
      <div
        ref={panelRef}
        id={panelId}
        className={`absolute left-1/2 top-full w-[288px] -translate-x-1/2 pt-3 ${open ? "visible" : "invisible transition-[visibility] duration-200"}`}
      >
        {/* Glass surface: opacity lives here, with the blur, so the blur keeps seeing the page while it fades. */}
        <div
          className={`rounded-2xl border border-white/70 bg-white/80 bg-[linear-gradient(180deg,rgb(255_255_255/0.6),rgb(239_250_240/0.45))] p-2 text-ink-800 shadow-[0_24px_60px_-20px_rgb(6_20_15/0.5),0_2px_8px_rgb(6_20_15/0.06)] backdrop-blur-xl backdrop-saturate-150 transition-[opacity,translate] duration-200 ease-out ${
            open ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0"
          }`}
        >
          <ul>
            {categories.map((cat, i) => (
              <li key={cat.label} className={i === 0 ? "mb-1 border-b border-brand-900/[0.07] pb-1" : undefined}>
                <Link
                  href={categoryHref(cat.label)}
                  onClick={hide}
                  className="group/item flex items-center gap-3 rounded-xl px-2.5 py-2 text-[13.5px] font-medium outline-none transition-colors duration-150 hover:bg-mint-50/90 hover:text-brand-700 focus-visible:bg-mint-50/90 focus-visible:text-brand-700 focus-visible:ring-2 focus-visible:ring-brand-500/70"
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-mint-50 text-brand-700 ring-1 ring-inset ring-mint-100 transition-colors duration-150 group-hover/item:bg-mint-100 group-focus-visible/item:bg-mint-100">
                    <Icon name={cat.icon} className="size-[17px]" strokeWidth={1.6} />
                  </span>
                  <span className="flex-1">{cat.label}</span>
                  <Icon
                    name="chevronRight"
                    className="size-3.5 -translate-x-1 text-brand-700 opacity-0 transition-[opacity,translate] duration-150 group-hover/item:translate-x-0 group-hover/item:opacity-100 group-focus-visible/item:translate-x-0 group-focus-visible/item:opacity-100"
                    strokeWidth={2}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/** Mobile-menu version of the category menu: a row that expands the category links in place. */
function MobileCategoryMenu({ label, onNavigate }) {
  const [open, setOpen] = useState(false);
  const listId = useId();
  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between py-3.5 text-[15px] font-medium text-white/85"
      >
        {label}
        <Icon name="chevronDown" className={`size-4 opacity-50 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <ul id={listId} hidden={!open} className="-mt-1 grid gap-0.5 pb-3 min-[480px]:grid-cols-2">
        {categories.map((cat) => (
          <li key={cat.label}>
            <Link
              href={categoryHref(cat.label)}
              onClick={onNavigate}
              className="flex items-center gap-3 rounded-lg px-2 py-2 text-[14px] text-white/80 transition-colors hover:bg-white/[0.06] hover:text-white"
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-mint-400/10 text-mint-400 ring-1 ring-inset ring-mint-400/20">
                <Icon name={cat.icon} className="size-[17px]" strokeWidth={1.6} />
              </span>
              {cat.label}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const searchButtonRef = useRef(null);
  const pathname = usePathname();
  const isActive = (link) => (link.activePrefix ? pathname.startsWith(link.activePrefix) : link.href === pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The mobile menu is hidden from lg up, so close it rather than leave it open behind the desktop nav.
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 64rem)");
    const onChange = (e) => e.matches && setMenuOpen(false);
    desktop.addEventListener("change", onChange);
    return () => desktop.removeEventListener("change", onChange);
  }, []);

  // Escape closes the open panel and returns focus to the button that opened it.
  useEffect(() => {
    if (!menuOpen && !searchOpen) return;
    const onKeyDown = (e) => {
      if (e.key !== "Escape" || e.defaultPrevented || e.isComposing) return;
      e.preventDefault(); // also stops a search input's native clear-on-Escape
      if (menuOpen) {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      } else {
        setSearchOpen(false);
        searchButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen, searchOpen]);

  // Lock page scroll behind the open mobile menu; restore the previous inline styles on close/unmount.
  useEffect(() => {
    if (!menuOpen) return;
    const { style } = document.body;
    const previous = { overflow: style.overflow, paddingRight: style.paddingRight };
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    style.overflow = "hidden";
    if (scrollbarWidth > 0) style.paddingRight = `${scrollbarWidth}px`; // avoid a layout shift
    return () => {
      style.overflow = previous.overflow;
      style.paddingRight = previous.paddingRight;
    };
  }, [menuOpen]);

  const solid = scrolled || menuOpen || searchOpen;

  return (
    <header className="fixed inset-x-0 top-0 z-50 text-white">
      {/* The solid backdrop is its own layer: a backdrop-filter on <header> itself would make it a
          backdrop root, and the Categories panel's glass blur could no longer see the page below. */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 -z-10 transition-[background-color,box-shadow,backdrop-filter] duration-500 ${
          solid ? "bg-forest-950/90 shadow-[0_1px_0_rgb(255_255_255/0.06)] backdrop-blur-xl" : "bg-transparent"
        }`}
      />
      <Container className={`flex items-center gap-6 transition-[height] duration-500 ${scrolled ? "h-16 lg:h-[68px]" : "h-16 lg:h-[84px]"}`}>
        <Logo />

        <nav aria-label="Primary" className="ml-auto hidden lg:ml-8 lg:block xl:ml-14">
          <ul className="flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <li key={link.label}>
                {link.hasMenu ? (
                  <CategoryMenu label={link.label} />
                ) : (
                  <Link
                    href={link.href}
                    aria-current={isActive(link) ? "page" : undefined}
                    className={`group relative flex items-center gap-1 whitespace-nowrap py-2 text-[13.5px] font-medium transition-colors ${
                      isActive(link) ? "text-mint-400" : "text-white/85 hover:text-white"
                    }`}
                  >
                    {link.label}
                    <span
                      className={`absolute -bottom-0.5 left-0 h-[2px] rounded-full bg-mint-400 transition-all duration-300 ${
                        isActive(link) ? "w-full" : "w-0 group-hover:w-full group-hover:bg-white/50"
                      }`}
                    />
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <SearchField className="mr-2 hidden w-[240px] md:block lg:hidden xl:block xl:w-[280px] 2xl:w-[340px]" />
          {/* lg only: nav leaves no room for the full field, so it drops down instead */}
          <button
            ref={searchButtonRef}
            type="button"
            aria-label="Search"
            aria-expanded={searchOpen}
            aria-controls="header-search"
            onClick={() => setSearchOpen((o) => !o)}
            className="hidden size-10 place-items-center rounded-full text-white transition-colors hover:bg-white/10 lg:grid xl:hidden"
          >
            <Icon name={searchOpen ? "close" : "search"} className="size-5" />
          </button>
          <a href="#" aria-label="Account" className="hidden size-10 place-items-center rounded-full border border-white/25 text-white transition-colors hover:border-white/50 hover:bg-white/10 sm:grid">
            <Icon name="user" className="size-[18px]" />
          </a>
          <CartButton />
          <button
            ref={menuButtonRef}
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((o) => !o)}
            className="grid size-10 place-items-center rounded-full text-white transition-colors hover:bg-white/10 lg:hidden"
          >
            <Icon name={menuOpen ? "close" : "menu"} className="size-[22px]" />
          </button>
        </div>
      </Container>

      {searchOpen && (
        <div id="header-search" className="hidden border-t border-white/10 lg:block xl:hidden">
          <Container className="py-4">
            <SearchField onSearched={() => setSearchOpen(false)} />
          </Container>
        </div>
      )}

      {/* Kept mounted for the height animation; inert keeps its links and search out of the tab order while closed. */}
      <div
        id="mobile-menu"
        inert={!menuOpen}
        className={`grid overflow-hidden transition-[grid-template-rows] duration-500 ease-out lg:hidden ${menuOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        {/* Capped to the viewport (below the 4rem bar) so a long menu scrolls while the page is locked. */}
        <div className="max-h-[calc(100dvh-4rem)] min-h-0 overflow-y-auto overscroll-contain">
          <Container className="border-t border-white/10 pb-6 pt-4">
            <SearchField className="md:hidden" onSearched={() => setMenuOpen(false)} />
            <ul className="mt-3 divide-y divide-white/[0.07]">
              {navLinks.map((link) => (
                <li key={link.label}>
                  {link.hasMenu ? (
                    // Keyed on menuOpen so the list starts collapsed each time the menu opens.
                    <MobileCategoryMenu key={String(menuOpen)} label={link.label} onNavigate={() => setMenuOpen(false)} />
                  ) : (
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center justify-between py-3.5 text-[15px] font-medium ${isActive(link) ? "text-mint-400" : "text-white/85"}`}
                    >
                      {link.label}
                      <Icon name="chevronRight" className="size-4 opacity-50" />
                    </Link>
                  )}
                </li>
              ))}
              <li className="sm:hidden">
                <a href="#" className="flex items-center gap-3 py-3.5 text-[15px] font-medium text-white/85">
                  <Icon name="user" className="size-[18px]" /> My Account
                </a>
              </li>
            </ul>
          </Container>
        </div>
      </div>
    </header>
  );
}
