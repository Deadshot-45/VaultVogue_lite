"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useGetProducts } from "@/lib/queries/useGetProducts";
import { mapApiProductToVariantProduct } from "@/lib/utility/category-adapter";
import { CATEGORY_CONFIGS } from "@/data/categories";
import type {
  CatalogCategory,
  CatalogSortOption,
  CatalogBadge,
  CatalogFilterState,
} from "@/types/catalog";
import type { VariantProduct, VariantSize } from "@/features/storefront/types/variant";

const ITEMS_PER_PAGE = 12;

export function useProductCatalog() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. Parse initial state from URL parameters
  const currentCategory = (searchParams.get("category") || "all") as CatalogCategory;
  const currentSubcategory = searchParams.get("subcategory") || "all";
  const currentSearch = searchParams.get("search") || "";
  const currentColor = searchParams.get("color") || "all";
  const currentSize = (searchParams.get("size") || "") as VariantSize | "";
  const currentMinPrice = searchParams.get("minPrice")
    ? Number(searchParams.get("minPrice"))
    : null;
  const currentMaxPrice = searchParams.get("maxPrice")
    ? Number(searchParams.get("maxPrice"))
    : null;
  const currentSort = (searchParams.get("sort") || "featured") as CatalogSortOption;
  const currentBadge = (searchParams.get("badge") || "all") as CatalogBadge;
  const currentPage = Math.max(1, Number(searchParams.get("page") || 1));

  // Local immediate search input state for fast keyboard typing
  const [localSearch, setLocalSearch] = useState(currentSearch);

  useEffect(() => {
    setLocalSearch(currentSearch);
  }, [currentSearch]);

  // 2. URL Update Synchronizer (preserves unrelated params and resets page on filter changes)
  const updateUrlParams = useCallback(
    (updates: Partial<Record<keyof CatalogFilterState, string | number | null>>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "" || value === "all" || (key === "page" && value === 1)) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      const queryString = params.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
      router.replace(newUrl, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  // 3. Debounce local search input and sync to URL
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== currentSearch) {
        updateUrlParams({ search: localSearch.trim() || null, page: 1 });
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [localSearch, currentSearch, updateUrlParams]);

  // 4. Fetch Live API Products via TanStack Query
  const apiCategoryParam =
    currentCategory !== "all" ? currentCategory : undefined;

  const {
    data: apiData,
    isLoading: isApiLoading,
    isError: isApiError,
    error: apiError,
    refetch,
  } = useGetProducts({
    categoryName: apiCategoryParam,
    label: currentCategory,
    search: currentSearch || undefined,
    limit: 100,
  });

  const rawApiProducts = useMemo(() => {
    return apiData?.pages.flatMap((page) => page) || [];
  }, [apiData]);

  // Transform raw API products into VariantProducts
  const apiVariantProducts = useMemo(() => {
    return rawApiProducts.map(mapApiProductToVariantProduct);
  }, [rawApiProducts]);

  // Fallback / offline master catalog
  const _fallbackCatalog = useMemo(() => {
    const list: VariantProduct[] = [];
    Object.values(CATEGORY_CONFIGS).forEach((conf) => {
      conf.products.forEach((p) => {
        if (!list.some((existing) => existing.id === p.id || existing.slug === p.slug)) {
          list.push(p);
        }
      });
    });
    return list;
  }, []);

  // Determine active product pool
  const isLive = apiVariantProducts.length > 0;
  const allAvailableProducts = useMemo(() => {
    if (isLive) return apiVariantProducts;
    return [];
  }, [isLive, apiVariantProducts]);

  // 5. Client-Side Filtering across Active Product Pool
  const filteredProducts = useMemo(() => {
    let list = [...allAvailableProducts];

    // Category Filter (if category selected and using fallback dataset)
    if (currentCategory !== "all" && !isLive) {
      list = list.filter((p) => {
        const idLower = p.id.toLowerCase();
        const codeLower = p.code.toLowerCase();
        const catLower = p.category.toLowerCase();
        return (
          idLower.includes(currentCategory) ||
          codeLower.startsWith(currentCategory.slice(0, 2)) ||
          catLower.includes(currentCategory)
        );
      });
    }

    // Subcategory Filter
    if (currentSubcategory !== "all") {
      const sub = currentSubcategory.toLowerCase();
      list = list.filter((p) => {
        const cat = p.category.toLowerCase();
        const slug = p.slug.toLowerCase();
        return cat === sub || cat.includes(sub) || sub.includes(cat) || slug.includes(sub);
      });
    }

    // Color Filter
    if (currentColor !== "all") {
      const clr = currentColor.toLowerCase();
      list = list.filter((p) => {
        return p.colors.some(
          (c) =>
            c.name.toLowerCase().includes(clr) ||
            c.id.toLowerCase().includes(clr) ||
            c.code.toLowerCase() === clr,
        );
      });
    }

    // Size Filter
    if (currentSize) {
      list = list.filter((p) => {
        return p.colors.some((c) => (c.stockBySize[currentSize] ?? 0) > 0);
      });
    }

    // Price Range Filter
    if (currentMinPrice !== null) {
      list = list.filter((p) => p.price >= currentMinPrice);
    }
    if (currentMaxPrice !== null) {
      list = list.filter((p) => p.price <= currentMaxPrice);
    }

    // Badges / Editorial Merchandising Filter
    if (currentBadge === "new") {
      list = list.filter(
        (p) =>
          p.leadTime.toLowerCase().includes("new") ||
          p.code.includes("01") ||
          p.code.includes("02"),
      );
    } else if (currentBadge === "bestseller") {
      list = list.filter(
        (p) =>
          p.leadTime.toLowerCase().includes("demand") ||
          p.leadTime.toLowerCase().includes("bestseller"),
      );
    } else if (currentBadge === "sale") {
      // Products with discount or under ₹5,000
      list = list.filter((p) => p.price <= 5000);
    }

    // Sorting
    switch (currentSort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        list.reverse();
        break;
      case "featured":
      default:
        break;
    }

    return list;
  }, [
    allAvailableProducts,
    currentCategory,
    isLive,
    currentSubcategory,
    currentColor,
    currentSize,
    currentMinPrice,
    currentMaxPrice,
    currentBadge,
    currentSort,
  ]);

  // 6. Pagination Calculations
  const totalCount = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));
  const validPage = Math.min(currentPage, totalPages);
  const startIndex = (validPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalCount);

  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, startIndex, endIndex]);

  // 7. Active Filter Counter
  const activeFiltersCount =
    (currentCategory !== "all" ? 1 : 0) +
    (currentSubcategory !== "all" ? 1 : 0) +
    (currentSearch.trim() ? 1 : 0) +
    (currentColor !== "all" ? 1 : 0) +
    (currentSize ? 1 : 0) +
    (currentMinPrice !== null || currentMaxPrice !== null ? 1 : 0) +
    (currentBadge !== "all" ? 1 : 0) +
    (currentSort !== "featured" ? 1 : 0);

  // 8. Action Handlers
  const setCategory = (cat: CatalogCategory) => {
    updateUrlParams({ category: cat, subcategory: "all", page: 1 });
  };

  const setSubcategory = (sub: string) => {
    updateUrlParams({ subcategory: sub, page: 1 });
  };

  const setColor = (clr: string) => {
    updateUrlParams({ color: clr, page: 1 });
  };

  const setSize = (sz: VariantSize | "") => {
    updateUrlParams({ size: sz || null, page: 1 });
  };

  const setPriceRange = (min: number | null, max: number | null) => {
    updateUrlParams({ minPrice: min, maxPrice: max, page: 1 });
  };

  const setSort = (sortOption: CatalogSortOption) => {
    updateUrlParams({ sort: sortOption });
  };

  const setBadge = (badge: CatalogBadge) => {
    updateUrlParams({ badge, page: 1 });
  };

  const setPage = (pageNumber: number) => {
    updateUrlParams({ page: pageNumber });
    const el = document.getElementById("catalog-grid-anchor");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const clearAllFilters = () => {
    setLocalSearch("");
    updateUrlParams({
      category: "all",
      subcategory: "all",
      search: null,
      color: "all",
      size: null,
      minPrice: null,
      maxPrice: null,
      sort: "featured",
      badge: "all",
      page: 1,
    });
  };

  const removeFilter = (filterKey: string) => {
    if (filterKey === "search") {
      setLocalSearch("");
      updateUrlParams({ search: null, page: 1 });
    } else if (filterKey === "price") {
      updateUrlParams({ minPrice: null, maxPrice: null, page: 1 });
    } else {
      updateUrlParams({ [filterKey]: null, page: 1 });
    }
  };

  return {
    // Current filter states
    category: currentCategory,
    subcategory: currentSubcategory,
    search: localSearch,
    color: currentColor,
    size: currentSize,
    minPrice: currentMinPrice,
    maxPrice: currentMaxPrice,
    sort: currentSort,
    badge: currentBadge,
    page: validPage,
    limit: ITEMS_PER_PAGE,

    // Data products & pagination
    products: paginatedProducts,
    totalCount,
    totalPages,
    startIndex,
    endIndex,
    isLive,
    isLoading: isApiLoading && allAvailableProducts.length === 0,
    isError: isApiError && allAvailableProducts.length === 0,
    errorMessage: apiError ? String(apiError) : undefined,

    // Controls
    setCategory,
    setSubcategory,
    setSearch: setLocalSearch,
    setColor,
    setSize,
    setPriceRange,
    setSort,
    setBadge,
    setPage,
    clearAllFilters,
    removeFilter,
    refetch,
    activeFiltersCount,
    hasActiveFilters: activeFiltersCount > 0,
  };
}

