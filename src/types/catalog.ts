import type { VariantSize } from "@/features/storefront/types/variant";

export type CatalogCategory = "all" | "men" | "women" | "kids";

export type CatalogSortOption =
  | "featured"
  | "newest"
  | "price-asc"
  | "price-desc";

export type CatalogBadge = "all" | "new" | "bestseller" | "sale";

export interface CatalogFilterState {
  category: CatalogCategory;
  subcategory: string;
  search: string;
  color: string;
  size: VariantSize | "";
  minPrice: number | null;
  maxPrice: number | null;
  sort: CatalogSortOption;
  badge: CatalogBadge;
  page: number;
  limit: number;
}

export const DEFAULT_CATALOG_FILTERS: CatalogFilterState = {
  category: "all",
  subcategory: "all",
  search: "",
  color: "all",
  size: "",
  minPrice: null,
  maxPrice: null,
  sort: "featured",
  badge: "all",
  page: 1,
  limit: 12,
};

