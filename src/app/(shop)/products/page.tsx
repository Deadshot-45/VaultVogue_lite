"use client";

import ProductGrid from "@/components/ProductGrid";
import { Button } from "@/components/ui/button";
import { useGetProducts } from "@/lib/query/useGetProducts";
import { Loader2 } from "lucide-react";
import React from "react";
import { useSearchParams } from "next/navigation";

const ProductsSearchPage: React.FC = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useGetProducts({
      limit: 12,
      label: "search",
      search,
    });

  const products = data?.pages.flat() ?? [];

  return (
    <section className="w-full py-12 lg:py-16">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
        {/* Editorial heading */}
        <div className="mb-10">
          <p className="section-label">Search Results</p>
          <div className="gold-divider" />
          <h1 className="mt-5 font-cormorant text-4xl font-light text-foreground lg:text-5xl">
            {search ? `Results for "${search}"` : "All Products"}
          </h1>
        </div>

        {isLoading ? (
          <div className="flex h-[70vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" style={{ color: "var(--gold)" }} />
          </div>
        ) : (
          <ProductGrid products={products} />
        )}

        {hasNextPage && (
          <div className="mt-12 text-center">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-8 transition-all duration-200 active:scale-95"
              style={{ borderColor: "var(--gold-soft)" }}
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {isFetchingNextPage ? "Loading..." : "Load More"}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsSearchPage;
