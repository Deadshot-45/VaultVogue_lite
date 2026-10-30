"use client";

import { useQuery } from "@tanstack/react-query";
import { productService, type LandingPageData } from "../services/productService";

export function useLandingPage() {
  return useQuery<LandingPageData | null>({
    queryKey: ["landing-page-data"],
    queryFn: async ({ signal }) => {
      return productService.getDashboardProducts({ signal });
    },
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    retry: 1,
  });
}

