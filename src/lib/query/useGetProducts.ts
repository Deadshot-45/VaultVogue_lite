import { useInfiniteQuery } from "@tanstack/react-query";
import { logError } from "../log-error";
import { Product as ApiProduct, productService } from "../api/productService";

export type UIProduct = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  sellerId?: string;
  availableSizes: string[];
  sizeQuantities: Record<string, number>;
  lowStockThreshold: number;
  image: string;
  category: string;
  description: string;
  isNew: boolean;
};

interface UseGetProductsProps {
  categoryId?: string;
  limit?: number;
  label?: string; // e.g. "men" | "women" | "kids" - used as part of query key
}

const mapProduct = (p: ApiProduct): UIProduct => {
  const inventoryItems = p.inventoryId?.items ?? [];

  return {
    id: p._id,
    name: p.name,
    price: p.price,
    originalPrice:
      typeof (p as ApiProduct & { originalPrice?: number }).originalPrice ===
      "number"
        ? (p as ApiProduct & { originalPrice?: number }).originalPrice
        : undefined,
    sellerId: p.sellerId,
    availableSizes: inventoryItems
      .filter((item) => item.quantity > 0)
      .map((item) => item.size),
    sizeQuantities: Object.fromEntries(
      inventoryItems.map((item) => [item.size, item.quantity]),
    ),
    lowStockThreshold: 5,
    image:
      p.images.find((img) => img.isPrimary)?.url ||
      p.images[0]?.url ||
      "/images/placeholder.png",
    category: "Fashion",
    description: "Premium selection from Vault Vogue.",
    isNew: true,
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
