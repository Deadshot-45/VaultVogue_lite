"use client";

import ProductGrid from "@/components/ProductGrid";
import { Button } from "@/components/ui/button";
import { useGetProducts } from "@/lib/query/useGetProducts";
import { Loader2 } from "lucide-react";
import React from "react";

const KidsPage: React.FC = () => {
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useGetProducts({
      categoryId: "67dfa578452634da4759bbb3",
      limit: 12,
      label: "kids",
    });

  const products = data?.pages.flat() ?? [];

  return (
    <section className="w-full py-12">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-3xl font-bold text-secondary-foreground">
          Kid&apos;s Section
        </h2>

        {isLoading ? (
          <div className="flex h-[70vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <ProductGrid products={products} />
        )}

        {hasNextPage && (
          <div className="mt-8 text-center">
            <Button
              variant="secondary"
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

export default KidsPage;
