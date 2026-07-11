"use client";

import { motion } from "framer-motion";
import ProductCard from "./product-card";
import { UIProduct, useGetProducts } from "@/lib/query/useGetProducts";
import { ProductCardSkeletonGrid } from "@/components/product-card-skeleton";
import { Product } from "@/lib/api/productService";

interface FeaturedProductsProps {
  readonly products?: Product[];
}

function mapProductToCard(product: Product): UIProduct {
  const sizes = product.sizes ?? [];
  const availableSizes = Array.from(new Set(sizes.map((size) => size.size)));
  const sizeQuantities: Record<string, number> = {};
  const sizeToVariantMap: Record<string, string> = {};

  for (const size of sizes) {
    sizeQuantities[size.size] = (sizeQuantities[size.size] ?? 0) + size.stock;
    sizeToVariantMap[size.size] = size.variantId;
  }

  const priceList = sizes.map((size) => size.price);
  const minPrice = priceList.length
    ? Math.min(...priceList)
    : product.minPrice;
  const maxPrice = priceList.length
    ? Math.max(...priceList)
    : product.maxPrice;

  return {
    id: product.id ?? product._id,
    name: product.name,
    price: minPrice,
    minPrice,
    maxPrice,
    sellerId: product.sellerId,
    availableSizes,
    sizeQuantities,
    sizeToVariantMap,
    lowStockThreshold: 5,
    image:
      product.images?.find((image) => image.isPrimary)?.url ??
      product.images?.[0]?.url ??
      "",
    category: product.categories?.[0]?.name || "Fashion",
    description: product.description,
    bestseller: product.bestseller ?? false,
    trending: product.trending ?? false,
    isNew: false,
    isSale: false,
    variants:
      product.variants?.map((variant) => ({
        id: variant._id,
        productId: variant.productId,
        sellerId: variant.sellerId,
        sku: variant.sku,
        attributes: variant.attributes,
        price: variant.price,
        images: variant.images,
        isActive: variant.isActive,
      })) ?? [],
    sizes,
    createdAt: product.createdAt,
  };
}

export default function FeaturedProducts({ products = [] }: FeaturedProductsProps) {
  const { data, isLoading } = useGetProducts({ limit: 12 });
  const dashboardProducts = products.map(mapProductToCard);
  const queriedProducts = data?.pages.flatMap((page) => page) || [];
  const allProducts =
    dashboardProducts.length > 0 ? dashboardProducts : queriedProducts;

  // Select 6 products marked as bestseller or trending (or fallback to first 6 if none are flagged)
  const featured = allProducts
    .filter((p) => p.bestseller || p.trending)
    .slice(0, 6);

  const displayProducts = featured.length > 0 ? featured : allProducts.slice(0, 6);

  return (
    <section className="py-20 bg-[var(--background)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Title */}
        <div className="mb-14 text-center">
          <span className="section-label">Selected Pieces</span>
          <h2 className="section-title mt-3 font-light text-[var(--brand-text)]">
            Featured Creations
          </h2>
          <div className="gold-divider mx-auto" />
        </div>

        {/* Products Grid */}
        {isLoading && dashboardProducts.length === 0 ? (
          <ProductCardSkeletonGrid count={6} columns="grid-cols-2 md:grid-cols-3 lg:grid-cols-6" />
        ) : displayProducts.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            No creations available right now.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {displayProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
