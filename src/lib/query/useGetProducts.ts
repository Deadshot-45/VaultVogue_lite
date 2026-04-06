import { useInfiniteQuery } from "@tanstack/react-query";
import { Product as ApiProduct, productService } from "../api/productService";

export type UIProduct = {
  id: string;
  name: string;
  price: number;
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

const mapProduct = (p: ApiProduct): UIProduct => ({
  id: p._id,
  name: p.name,
  price: p.price,
  image:
    p.images.find((img) => img.isPrimary)?.url ||
    p.images[0]?.url ||
    "/images/placeholder.png",
  category: "Fashion",
  description: "Premium selection from Vault Vogue.",
  isNew: true,
});

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
      const response = await productService.getAllProducts({
        page: pageParam,
        limit,
        sortBy: "createdAt",
        order: "desc",
        categoryId: categoryId as string,
      });

      const apiProducts: ApiProduct[] = response?.data?.data || [];
      return apiProducts.map(mapProduct);
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
