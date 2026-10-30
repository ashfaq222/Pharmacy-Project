import ProductCard from "@/components/home/ProductCard";

/** The homepage product grid layout (6 columns on desktop). */
export default function ProductGrid({ products, className = "mt-7" }) {
  return (
    <div className={`grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-6 xl:gap-4 ${className}`}>
      {products.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </div>
  );
}
