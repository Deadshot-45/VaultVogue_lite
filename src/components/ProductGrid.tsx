"use client";

import { UIProduct } from "@/lib/query/useGetProducts";
import { useState } from "react";
import ProductCard from "./global/ProductCard";
import ProductModal from "./global/ProductModal";

const ProductGrid = ({ products }: { products: UIProduct[] }) => {
  const [selectedProduct, setSelectedProduct] = useState<UIProduct | null>(
    null,
  );

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-72 text-center space-y-4">
        <div className="w-14 h-14 flex items-center justify-center rounded-full bg-muted text-lg font-semibold">
          Box
        </div>

        <h3 className="text-lg font-semibold">No Products Found</h3>

        <p className="text-sm text-muted-foreground max-w-xs">
          Try adjusting filters or search terms.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onQuickView={setSelectedProduct}
          />
        ))}
      </div>

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  );
};

export default ProductGrid;
