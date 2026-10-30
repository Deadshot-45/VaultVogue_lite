"use client";

import { ProductDetailPage } from "@/features/products/components/ProductDetailPage";
import type { VariantProduct } from "@/features/storefront/types/variant";

export function ProductDetailClient({ product }: { product: VariantProduct }) {
  return <ProductDetailPage product={product} />;
}
