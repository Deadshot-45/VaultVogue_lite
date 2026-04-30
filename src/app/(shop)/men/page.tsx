"use client";

import ProductGrid from "@/components/ProductGrid";
import { Button } from "@/components/ui/button";
import { useGetProducts } from "@/lib/query/useGetProducts";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";

const categories = ["All", "Jackets", "T-Shirts", "Footwear", "Jeans", "Pants"];

const MensPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useGetProducts({
      categoryId: "67dfa578452634da4759bbb2",
      limit: 12,
      label: "men",
    });

  const allProducts = data?.pages.flat() ?? [];

  const filteredProducts =
    selectedCategory === "All"
      ? allProducts
      : allProducts.filter((p) => p.category === selectedCategory);

  return (
    <section className="w-full py-12 lg:py-16">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
        {/* Editorial heading */}
        <div className="mb-10">
          <p className="section-label">For Him</p>
          <div className="gold-divider" />
          <h1 className="mt-5 font-cormorant text-4xl font-light text-foreground lg:text-5xl">
            Men&apos;s Collection
          </h1>
        </div>

        {/* Filter pills */}
        <div className="mb-10 flex flex-wrap gap-2">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 active:scale-95 ${
                  isActive
                    ? "text-white shadow-sm"
                    : "border border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
                }`}
                style={isActive ? { background: "var(--gold)" } : undefined}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {isLoading ? (
          <div className="flex h-[70vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" style={{ color: "var(--gold)" }} />
          </div>
        ) : (
          <ProductGrid products={filteredProducts} />
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

export default MensPage;
