/* eslint-disable @typescript-eslint/no-explicit-any */
import { useInfiniteQuery } from "@tanstack/react-query";
import { logError } from "../log-error";
import { Product as ApiProduct, productService } from "../api/productService";

export type UIProduct = {
  id: string;
  name: string;

  price: number;
  minPrice?: number;
  maxPrice?: number;

  sellerId?: string;

  /** Unique sizes across all variants e.g. ["S", "M", "L"] */
  availableSizes: string[];
  /** Unique colors across all variants e.g. ["Black", "Red"] */
  availableColors: string[];
  sizeQuantities: Record<string, number>;

  /**
   * Key: "size" or "color|size" composite → variantId
   * Used for cart: pick a variant by its size+color selection
   */
  sizeToVariantMap: Record<string, string>;

  lowStockThreshold: number;

  image: string;
  category: string;
  description?: string;

  bestseller: boolean;
  trending: boolean;

  isNew: boolean;
  isSale: boolean;

  variants: {
    id: string;
    sku: string;
    size: string;
    color: string;
    price: number;
    compareAtPrice?: number;
    images: { url: string; isPrimary: boolean }[];
    isActive: boolean;
  }[];

  sizes: {
    variantId: string;
    size: string;
    color: string;
    price: number;
    stock: number;
    compareAtPrice?: number;
    images: { url: string; isPrimary: boolean }[];
  }[];

  createdAt: string;
};

interface UseGetProductsProps {
  categoryId?: string;
  limit?: number;
  label?: string; // e.g. "men" | "women" | "kids" - used as part of query key
  categoryName?: string; // Add this
  search?: string;
  isSale?: boolean;
}

// type UIProductBase = Pick<
//   UIProduct,
//   | "id"
//   | "name"
//   | "image"
//   | "description"
//   | "bestseller"
//   | "trending"
//   | "createdAt"
// >;

const mapProduct = (p: ApiProduct): UIProduct => {
  const sizes = p.sizes ?? [];
  const variants = p.variants ?? [];

  // Distinct sizes and colors across all variants
  const availableSizes = Array.from(new Set(sizes.map((s) => s.size).filter(Boolean)));
  const availableColors = Array.from(new Set(sizes.map((s) => s.color).filter(Boolean)));

  const sizeQuantities: Record<string, number> = {};
  /**
   * sizeToVariantMap supports two lookup strategies:
   *   1. By size only:         sizeToVariantMap["M"]          → variantId
   *   2. By color+size combo:  sizeToVariantMap["Black|M"]    → variantId
   * UI should prefer the composite key when a color is selected.
   */
  const sizeToVariantMap: Record<string, string> = {};

  for (const s of sizes) {
    if (s.size) {
      sizeQuantities[s.size] = (sizeQuantities[s.size] ?? 0) + s.stock;
      // Fallback: last write wins for size-only key
      sizeToVariantMap[s.size] = s.variantId;
    }
    if (s.color && s.size) {
      sizeToVariantMap[`${s.color}|${s.size}`] = s.variantId;
    } else if (s.color) {
      sizeToVariantMap[s.color] = s.variantId;
    }
  }

  const priceList = sizes.map((s) => s.price).filter((v) => v != null);
  const minPrice = priceList.length ? Math.min(...priceList) : p.minPrice;
  const maxPrice = priceList.length ? Math.max(...priceList) : p.maxPrice;

  // Primary image: try variant images first (colour-specific), then product images
  const primaryImage =
    sizes[0]?.images?.find((img) => img.isPrimary)?.url ??
    sizes[0]?.images?.[0]?.url ??
    p.images?.find((img) => img.isPrimary)?.url ??
    p.images?.[0]?.url ??
    "";

  return {
    id: p._id,
    name: p.name,

    price: minPrice ?? 0,
    minPrice,
    maxPrice,

    sellerId: p.sellerId,

    availableSizes,
    availableColors,
    sizeQuantities,
    sizeToVariantMap,

    lowStockThreshold: 5,

    image: primaryImage,
    category: p.category || p.categories?.[0]?.name || "Fashion",

    description: p.description,

    bestseller: p.bestseller ?? false,
    trending: p.trending ?? false,

    isNew: false,
    isSale: sizes.some((s) => s.compareAtPrice && s.compareAtPrice > s.price),

    variants: variants.map((v) => ({
      id: v._id,
      sku: v.sku,
      size: v.size,
      color: v.color,
      price: v.price,
      compareAtPrice: v.compareAtPrice,
      images: v.images ?? [],
      isActive: v.isActive,
    })),

    sizes: sizes.map((s) => ({
      variantId: s.variantId,
      size: s.size,
      color: s.color,
      price: s.price,
      stock: s.stock,
      compareAtPrice: s.compareAtPrice,
      images: s.images ?? [],
    })),

    createdAt: p.createdAt,
  };
};

/**
 * Infinite-scroll hook for products using TanStack Query's useInfiniteQuery.
 * Pages are fetched lazily via fetchNextPage().
 * Consumers flatten data.pages to get all loaded products.
 */
export const useGetProducts = ({
  categoryId,
  limit = 12,
  label = "all",
  categoryName,
  search,
  isSale,
}: UseGetProductsProps = {}) => {
  return useInfiniteQuery({
    queryKey: ["products", label, categoryId, limit, categoryName, search, isSale],
    initialPageParam: 1,
    queryFn: async ({ pageParam, signal }) => {
      try {
        const apiProducts: ApiProduct[] = await productService.getAllProducts(
          {
            page: pageParam,
            limit,
            sortBy: "createdAt",
            order: "desc",
            categoryId: categoryId as string,
            categoryName,
            search,
            isSale,
          },
          { signal },
        );

        return apiProducts.map(mapProduct);
      } catch (error) {
        if (error && (error as any).name === "CanceledError") {
          throw error;
        }
        logError(error, "Failed to fetch products");
        return [];
      }
    },
    // If the last page returned a full batch, assume there's a next page
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === limit ? allPages.length + 1 : undefined,
    // Deduplicate across pages in case the API returns overlapping results
    select: (data) => {
      const seen = new Set<string>();
      return {
        ...data,
        pages: data.pages.map((page) =>
          page.filter((p) => {
            if (seen.has(p.id)) return false;
            seen.add(p.id);
            return true;
          }),
        ),
      };
    },
  });
};
