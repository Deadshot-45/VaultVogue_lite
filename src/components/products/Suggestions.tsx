import React from "react";
import ProductCardComponent from "@/components/product-card";
import { ProductCard as ProductCardType } from "@/utility/types/productVariant";
import { UIProduct } from "@/lib/query/useGetProducts";

type SuggestionsProps = {
  items: ProductCardType[];
};

export const Suggestions = React.memo(({ items }: SuggestionsProps) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="mt-20">
      {/* Section Header */}
      <div className="mb-10 text-center">
        <span className="section-label">Recommendations</span>
        <h2 className="section-title mt-3 font-light text-[var(--brand-text)]">
          You May Also Like
        </h2>
        <div className="gold-divider mx-auto" />
      </div>

      {/* Grid of Product Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((item) => {
          const uiProduct: UIProduct = {
            id: item.id,
            name: item.name,
            price: item.price,
            minPrice: item.price,
            maxPrice: item.price,
            availableSizes: ["XS", "S", "M", "L", "XL"],
            availableColors: [],
            sizeQuantities: { XS: 10, S: 10, M: 10, L: 10, XL: 10 },
            sizeToVariantMap: {
              XS: `${item.id}-xs`,
              S: `${item.id}-s`,
              M: `${item.id}-m`,
              L: `${item.id}-l`,
              XL: `${item.id}-xl`,
            },
            lowStockThreshold: 5,
            image: item.image,
            category: item.category || "Fashion",
            description: "",
            bestseller: false,
            trending: false,
            isNew: false,
            isSale: false,
            variants: [],
            sizes: [
              { variantId: `${item.id}-xs`, size: "XS", color: "", price: item.price, stock: 10, images: [] },
              { variantId: `${item.id}-s`, size: "S", color: "", price: item.price, stock: 10, images: [] },
              { variantId: `${item.id}-m`, size: "M", color: "", price: item.price, stock: 10, images: [] },
            ],
            createdAt: new Date().toISOString(),
          };

          return <ProductCardComponent key={item.id} product={uiProduct} />;
        })}
      </div>
    </div>
  );
});
