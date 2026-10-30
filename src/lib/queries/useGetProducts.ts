import { useInfiniteQuery } from "@tanstack/react-query";
import { logError } from "../log-error";
import { Product as ApiProduct, productService } from "../services/productService";

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

export interface UseGetProductsProps {
  categoryId?: string;
  limit?: number;
  label?: string; // e.g. "men" | "women" | "kids" - used as part of query key
  categoryName?: string;
  search?: string;
  isSale?: boolean;
  sortBy?: string;
  order?: string;
  isNew?: boolean;
  bestseller?: boolean;
  trending?: boolean;
}

export const mapProduct = (p: ApiProduct): UIProduct => {
  const sizes = p.sizes ?? [];
  const variants = p.variants ?? [];

  // Distinct sizes and colors across all variants
  const availableSizes = [
    ...new Set(sizes.map((s: { size?: string }) => s.size).filter(Boolean)),
  ] as string[];
  const availableColors = [
    ...new Set(sizes.map((s: { color?: string }) => s.color).filter(Boolean)),
  ] as string[];

  // Stock per size (summed across colors for that size)
  const sizeQuantities: Record<string, number> = {};
  for (const s of sizes) {
    if (s.size) {
      sizeQuantities[s.size] = (sizeQuantities[s.size] ?? 0) + (s.stock ?? 0);
    }
  }

  // Size / color → variantId lookup map
  const sizeToVariantMap: Record<string, string> = {};
  for (const s of sizes) {
    if (s.size && s.variantId) {
      sizeToVariantMap[s.size] = s.variantId;
      if (s.color) {
        sizeToVariantMap[`${s.color}|${s.size}`] = s.variantId;
      }
    }
  }

  // Primary image fallback chain:
  // 1. First image flagged isPrimary
  // 2. First image in product.images array
  // 3. First image of first variant
  // 4. Placeholder
  const primaryImg =
    p.images?.find((img: { isPrimary?: boolean; url?: string }) => img.isPrimary)?.url ??
    p.images?.[0]?.url ??
    variants[0]?.images?.[0]?.url ??
    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=85";

  // Category name: from populated array or plain string
  const categoryName =
    p.categories?.[0]?.name ?? p.category ?? "Uncategorized";

  return {
    id: p._id,
    name: p.name,
    price: p.minPrice,
    minPrice: p.minPrice,
    maxPrice: p.maxPrice,
    sellerId: p.sellerId,
    image: primaryImg,
    category: categoryName,
    description: p.description,

    bestseller: p.bestseller ?? false,
    trending: p.trending ?? false,
    isNew: false,
    isSale: p.maxPrice > p.minPrice,

    availableSizes,
    availableColors,
    sizeQuantities,
    sizeToVariantMap,
    lowStockThreshold: 5,

    variants: variants.map((v: {
      _id: string;
      sku: string;
      size: string;
      color: string;
      price: number;
      compareAtPrice?: number;
      images: { url: string; isPrimary: boolean }[];
      isActive: boolean;
    }) => ({
      id: v._id,
      sku: v.sku,
      size: v.size,
      color: v.color,
      price: v.price,
      compareAtPrice: v.compareAtPrice,
      images: v.images ?? [],
      isActive: v.isActive,
    })),

    sizes: sizes.map((s: {
      variantId: string;
      size: string;
      color: string;
      price: number;
      stock: number;
      compareAtPrice?: number;
      images: { url: string; isPrimary: boolean }[];
    }) => ({
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
  sortBy,
  order,
  isNew,
  bestseller,
  trending,
}: UseGetProductsProps = {}) => {
  return useInfiniteQuery({
    queryKey: [
      "products",
      label,
      categoryId,
      limit,
      categoryName,
      search,
      isSale,
      sortBy,
      order,
      isNew,
      bestseller,
      trending,
    ],
    initialPageParam: 1,
    queryFn: async ({ pageParam, signal }) => {
      try {
        const apiProducts: ApiProduct[] = await productService.getAllProducts(
          {
            page: pageParam as number,
            limit,
            sortBy: sortBy || "createdAt",
            order: order || "desc",
            categoryId: categoryId as string,
            categoryName,
            search,
            isSale,
            isNew,
            bestseller,
            trending,
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
