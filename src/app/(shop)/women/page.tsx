"use client";

import ProductGrid from "@/components/ProductGrid";
import { Button } from "@/components/ui/button";
import { useGetProducts } from "@/lib/query/useGetProducts";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";

const categories = ["All", "Jackets", "T-Shirts", "Footwear", "Jeans", "Pants"];

const WomensPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useGetProducts({
      categoryId: "67dfa578452634da4759bbb1",
      limit: 12,
      label: "women",
    });

  const allProducts = data?.pages.flat() ?? [];

  const filteredProducts =
    selectedCategory === "All"
      ? allProducts
      : allProducts.filter((p) => p.category === selectedCategory);

  return (
    <section className="w-full py-12">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-3xl font-bold text-secondary-foreground">
          Women&apos;s Collection
        </h2>

        <div className="mb-8 flex flex-wrap gap-3">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex h-[70vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin sale-text" />
          </div>
        ) : (
          <ProductGrid products={filteredProducts} />
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

export default WomensPage;
