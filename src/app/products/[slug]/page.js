import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import Icon from "@/components/ui/Icons";
import AssetImage from "@/components/ui/AssetImage";
import ProductBadge from "@/components/ui/ProductBadge";
import ProductPlaceholder from "@/components/ui/ProductPlaceholder";
import PageBand from "@/components/product/PageBand";
import PurchasePanel from "@/components/product/PurchasePanel";
import RelatedProducts from "@/components/product/RelatedProducts";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import { brand, hero, products } from "@/data/home";
import { categoryHref, discountPercent, formatPrice, getProduct, getRelatedProducts, getStockStatus } from "@/lib/products";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: `Product not found — ${brand.name}` };
  return {
    title: `${product.name} — ${brand.name}`,
    description: product.description,
  };
}

const stockTones = {
  in: { dot: "bg-brand-500", text: "text-brand-700" },
  low: { dot: "bg-star", text: "text-[#b86e00]" },
  out: { dot: "bg-sale", text: "text-sale" },
};

function Rating({ rating, reviews }) {
  if (!rating) return <p className="text-[13px] text-ink-500">No reviews yet</p>;
  const filled = Math.round(rating);
  return (
    <div className="flex items-center gap-2 text-[13px]">
      <span className="flex" aria-label={`Rated ${rating} out of 5`}>
        {Array.from({ length: 5 }, (_, i) => (
          <Icon key={i} name="star" className={`size-4 ${i < filled ? "text-star" : "text-line"}`} />
        ))}
      </span>
      <span className="font-semibold text-ink-800">{rating}</span>
      <span className="text-ink-400">·</span>
      <span className="text-ink-500">{reviews} reviews</span>
    </div>
  );
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const stock = getStockStatus(product.stock);
  const tone = stockTones[stock.tone];
  const related = getRelatedProducts(product);

  const details = [
    ["Category", product.category],
    ["Brand", product.brand],
    ["Pack size", product.packSize],
    ["Availability", stock.tone === "out" ? "Out of stock" : `${product.stock} units`],
  ];

  return (
    <main className="flex-1">
      <PageBand
        crumbs={[
          { label: "Home", href: "/" },
          { label: product.category, href: categoryHref(product.category) },
          { label: product.name },
        ]}
      />

      <section className="bg-white py-8 sm:py-10 lg:py-14">
        <Container className="grid gap-8 md:grid-cols-2 md:gap-10 lg:gap-14 xl:gap-20">
          {/* Image */}
          <div className="md:sticky md:top-24 md:self-start">
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-line bg-mist">
              <AssetImage
                src={product.image}
                alt={product.name}
                fill
                preload
                sizes="(min-width: 1280px) 560px, (min-width: 768px) 46vw, 100vw"
                className="object-contain p-10 sm:p-14"
                fallback={<ProductPlaceholder className="h-[44%]" />}
              />
              {product.badge && <ProductBadge badge={product.badge} className="absolute left-4 top-4 px-2 py-1 text-[11px]" />}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={categoryHref(product.category)}
                className="rounded-full bg-mint-50 px-3 py-1 text-[11.5px] font-semibold text-brand-700 ring-1 ring-mint-100 transition-colors hover:bg-mint-100"
              >
                {product.category}
              </Link>
              <span className="text-[11.5px] font-semibold uppercase tracking-[0.18em] text-ink-500">{product.brand}</span>
            </div>

            <h1 className="mt-4 text-[28px] font-bold leading-[1.15] tracking-[-0.02em] text-ink-900 sm:text-[32px] xl:text-[38px]">
              {product.name}
            </h1>
            <div className="mt-3">
              <Rating rating={product.rating} reviews={product.reviews} />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="text-[30px] font-bold leading-none tracking-[-0.02em] text-brand-700 sm:text-[34px]">{formatPrice(product.price)}</span>
              <span className="text-[16px] text-ink-400 line-through">{formatPrice(product.compareAt)}</span>
              <span className="rounded-[4px] bg-sale/10 px-2 py-1 text-[12px] font-bold text-sale">Save {discountPercent(product)}%</span>
            </div>
            <p className="mt-2 text-[12px] text-ink-400">Inclusive of all taxes</p>

            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px]">
              <span className={`flex items-center gap-2 font-semibold ${tone.text}`}>
                <span className={`size-2 rounded-full ${tone.dot}`} />
                {stock.label}
              </span>
              <span aria-hidden="true" className="h-4 w-px bg-line" />
              <span className="text-ink-500">{product.packSize}</span>
            </div>

            <p className="mt-6 max-w-[560px] text-[15px] leading-[1.7] text-ink-700">{product.description}</p>

            <div className="mt-8 border-t border-line pt-8">
              <PurchasePanel product={product} />
            </div>

            <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line text-[13px]">
              {details.map(([term, value]) => (
                <div key={term} className="bg-white px-4 py-3.5">
                  <dt className="text-[11.5px] text-ink-400">{term}</dt>
                  <dd className="mt-0.5 font-semibold text-ink-900">{value}</dd>
                </div>
              ))}
            </dl>

            <ul className="mt-8 grid grid-cols-3 gap-3">
              {hero.trust.map((item) => (
                <li key={item.title} className="flex flex-col items-start gap-2.5 sm:flex-row sm:items-center">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-mint-50 text-brand-700">
                    <Icon name={item.icon} className="size-5" />
                  </span>
                  <span className="leading-tight">
                    <span className="block text-[12.5px] font-semibold text-ink-900">{item.title}</span>
                    <span className="mt-0.5 block text-[11.5px] text-ink-500">{item.text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <RelatedProducts products={related} />
      <WhyChooseUs />
    </main>
  );
}
