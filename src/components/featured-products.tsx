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
  const availableSizes = Array.from(
    new Set(sizes.map((s) => s.size).filter(Boolean)),
  );
  const availableColors = Array.from(
    new Set(sizes.map((s) => s.color).filter(Boolean)),
  );
  const sizeQuantities: Record<string, number> = {};
  const sizeToVariantMap: Record<string, string> = {};

  for (const s of sizes) {
    if (s.size) {
      sizeQuantities[s.size] = (sizeQuantities[s.size] ?? 0) + s.stock;
      sizeToVariantMap[s.size] = s.variantId;
    }
    if (s.color && s.size)
      sizeToVariantMap[`${s.color}|${s.size}`] = s.variantId;
    else if (s.color) sizeToVariantMap[s.color] = s.variantId;
  }

  const priceList = sizes.map((s) => s.price).filter((v) => v != null);
  const minPrice = priceList.length ? Math.min(...priceList) : product.minPrice;
  const maxPrice = priceList.length ? Math.max(...priceList) : product.maxPrice;

  const primaryImage =
    sizes[0]?.images?.find((img) => img.isPrimary)?.url ??
    sizes[0]?.images?.[0]?.url ??
    product.images?.find((img) => img.isPrimary)?.url ??
    product.images?.[0]?.url ??
    "";

  return {
    id: product.id ?? product._id,
    name: product.name,
    price: minPrice ?? 0,
    minPrice,
    maxPrice,
    sellerId: product.sellerId,
    availableSizes,
    availableColors,
    sizeQuantities,
    sizeToVariantMap,
    lowStockThreshold: 5,
    image: primaryImage,
    category: product.category || product.categories?.[0]?.name || "Fashion",
    description: product.description,
    bestseller: product.bestseller ?? false,
    trending: product.trending ?? false,
    isNew: false,
    isSale: false,
    variants:
      product.variants?.map((v) => ({
        id: v._id,
        sku: v.sku,
        size: v.size,
        color: v.color,
        price: v.price,
        compareAtPrice: v.compareAtPrice,
        images: v.images ?? [],
        isActive: v.isActive,
      })) ?? [],
    sizes: sizes.map((s) => ({
      variantId: s.variantId,
      size: s.size,
      color: s.color,
      price: s.price,
      stock: s.stock,
      compareAtPrice: s.compareAtPrice,
      images: s.images ?? [],
    })),
    createdAt: product.createdAt,
  };
}

export default function FeaturedProducts({
  products = [],
}: FeaturedProductsProps) {
  const { data, isLoading } = useGetProducts({ limit: 12 });
  const dashboardProducts = products.map(mapProductToCard);
  const queriedProducts = data?.pages.flatMap((page) => page) || [];
  const allProducts =
    dashboardProducts.length > 0 ? dashboardProducts : queriedProducts;

  // Select 6 products marked as bestseller or trending (or fallback to first 6 if none are flagged)
  const featured = allProducts
    .filter((p) => p.bestseller || p.trending)
    .slice(0, 6);

  const displayProducts =
    featured.length > 0 ? featured : allProducts.slice(0, 6);

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
          <ProductCardSkeletonGrid
            count={6}
            columns="grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
          />
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
