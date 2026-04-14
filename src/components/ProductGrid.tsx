"use client";

import { UIProduct } from "@/lib/query/useGetProducts";
import AnimatedProductCard from "./global/AnimatedProductCard";

const ProductGrid = ({
  products,
  isLoading,
}: {
  products: UIProduct[];
  isLoading?: boolean;
}) => {

  // 🔹 Loading
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-4 xl:gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl overflow-hidden border bg-muted/30 animate-pulse"
          >
            <div className="aspect-3/4 bg-muted" />
            <div className="p-3 space-y-2">
              <div className="h-3 w-1/2 bg-muted rounded" />
              <div className="h-4 w-full bg-muted rounded" />
              <div className="h-4 w-3/4 bg-muted rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 🔹 Empty
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-80 text-center space-y-4">
        <div className="w-16 h-16 flex items-center justify-center rounded-full bg-muted text-xl">
          📦
        </div>
        <h3 className="text-lg font-semibold">No products found</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Try adjusting your filters or search query.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-4 xl:gap-5">
      {products.map((product) => (
        <div
          key={product.id}
          className="mx-auto w-full max-w-60 transition-transform duration-200 active:scale-[0.98] hover:-translate-y-1 md:max-w-none"
        >
          <AnimatedProductCard
            product={product}
          />
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
