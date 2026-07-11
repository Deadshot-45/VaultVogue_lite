"use client";

import React, { useState } from "react";
import ProductCard from "@/components/product-card";
import { useGetProducts } from "@/lib/query/useGetProducts";
import { classifySubcategory } from "@/utility/utils";
import { ProductCardSkeletonGrid } from "@/components/product-card-skeleton";

const categories = ["All", "Baby", "Knitwear", "Outfits", "Footwear", "Trousers", "Sleepwear", "Outerwear"];

export default function KidsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const { data, isLoading } = useGetProducts({ categoryName: "kids", label: "kids", limit: 20 });
  const allProducts = data?.pages.flatMap((page) => page) || [];

  const classifiedProducts = allProducts.map((p) => ({
    ...p,
    category: classifySubcategory(p.name, p.category || "Outfits"),
  }));

  const filteredProducts = classifiedProducts.filter((product) => {
    if (selectedCategory === "All") return true;
    return product.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <section className="w-full py-16 bg-[var(--background)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Heading */}
        <div className="mb-12">
          <p className="section-label">Little Ones</p>
          <div className="gold-divider" />
          <h1 className="mt-5 font-cormorant text-4xl font-light text-[var(--brand-text)] lg:text-5xl">
            Kid's Collection
          </h1>
          <p className="mt-3 text-xs text-muted-foreground max-w-md leading-relaxed">
            Miniature edits of extra-fine knitwear and soft organic playsuits designed with extreme care for delicate skin.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="mb-12 flex flex-wrap gap-2.5">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-300 hover:scale-[1.02] active:scale-98 cursor-pointer ${
                  isActive
                    ? "bg-[var(--gold)] text-white shadow-md"
                    : "border border-border/40 text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <ProductCardSkeletonGrid count={8} columns="grid-cols-2 md:grid-cols-3 lg:grid-cols-4" />
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-80 text-center space-y-4">
            <h3 className="text-lg font-semibold">No creations found</h3>
            <p className="text-xs text-muted-foreground max-w-xs">
              Check back soon for new seasonal edits in this category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
