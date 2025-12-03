import { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";
import { ProductCardMobile } from "./ProductCardMobile";

interface ProductGridProps {
  products: Product[];
  emptyMessage?: string;
}

export const ProductGrid = ({ products, emptyMessage = "No products found" }: ProductGridProps) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile grid: no side padding, tighter gaps */}
      <div className="grid grid-cols-2 gap-2 px-0 py-1 sm:hidden -mx-6 sm:mx-0">
        {products.map((product) => (
          <ProductCardMobile key={product.id} product={product} />
        ))}
      </div>

      {/* Desktop / tablet grid: visible from sm and up */}
      <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 px-4 py-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
};
