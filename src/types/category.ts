  import type { VariantProduct, VariantSize } from "@/features/storefront/types/variant";

export type CategoryKey = "men" | "women" | "kids";

export interface CategorySubcategory {
  id: string;
  label: string;
  image: string;
  productCount?: number;
}

export interface CategoryCampaign {
  title: string;
  subtitle: string;
  tagline: string;
  description: string;
  image: string;
  href: string;
  ctaText?: string;
  quote?: string;
}

export interface CategoryConfig {
  key: CategoryKey;
  title: string;
  subtitle: string;
  tagline: string;
  description: string;
  heroImage: string;
  heroAlt: string;
  accentLabel: string;
  seasonBadge: string;
  subcategories: CategorySubcategory[];
  campaign: CategoryCampaign;
  products: VariantProduct[];
}

export type SortOption = "featured" | "newest" | "price-asc" | "price-desc";

export interface CategoryFilterState {
  subcategory: string;
  sizes: VariantSize[];
  sort: SortOption;
  maxPrice: number;
  inStockOnly: boolean;
  searchQuery: string;
}
