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

  availableSizes: string[];
  sizeQuantities: Record<string, number>;

  // 🔥 critical for cart
  sizeToVariantMap: Record<string, string>;

  lowStockThreshold: number;

  image: string;
  category: string;
  description?: string;

  bestseller: boolean;
  trending: boolean;

  isNew: boolean;

  variants: any;
  sizes: { variantId: string; size: string; price: number; stock: number }[];
  createdAt: string;
};

interface UseGetProductsProps {
  categoryId?: string;
  limit?: number;
  label?: string; // e.g. "men" | "women" | "kids" - used as part of query key
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

  const availableSizes = Array.from(new Set(sizes.map((s) => s.size)));

  const sizeQuantities: Record<string, number> = {};
  const sizeToVariantMap: Record<string, string> = {};

  for (const s of sizes) {
    sizeQuantities[s.size] = (sizeQuantities[s.size] ?? 0) + s.stock;
    sizeToVariantMap[s.size] = s.variantId;
  }

  const priceList = sizes.map((s) => s.price);
  const minPrice = priceList.length ? Math.min(...priceList) : p.minPrice;
  const maxPrice = priceList.length ? Math.max(...priceList) : p.maxPrice;

  return {
    id: p._id,
    name: p.name,

    price: minPrice, // UI default base price

    minPrice,
    maxPrice,

    sellerId: p.sellerId,

    availableSizes,
    sizeQuantities,
    sizeToVariantMap,

    lowStockThreshold: 5, // or from backend if available

    image: p.images?.find((img) => img.isPrimary)?.url ?? p.images?.[0]?.url ?? "",
    category: "unknown", // ⚠️ map properly if backend has category

    description: p.description,

    bestseller: p.bestseller ?? false,
    trending: p.trending ?? false,

    isNew: false, // derive from createdAt if needed

    variants: variants.map((v) => ({
      id: v._id,
      productId: v.productId,
      sellerId: v.sellerId,
      sku: v.sku,
      attributes: v.attributes,
      price: v.price,
      images: v.images,
      isActive: v.isActive,
    })),

    sizes,

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
}: UseGetProductsProps = {}) => {
  return useInfiniteQuery({
    queryKey: ["products", label, categoryId, limit],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      try {
        const apiProducts: ApiProduct[] = await productService.getAllProducts({
          page: pageParam,
          limit,
          sortBy: "createdAt",
          order: "desc",
          categoryId: categoryId as string,
        });

        return apiProducts.map(mapProduct);
      } catch (error) {
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
