"use client";

import React, { useEffect, useRef } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { gsap } from "gsap";
import { CategoryProductItem } from "./CategoryProductGrid";
import { ProductEmptyState } from "./ProductEmptyState";
import { isReducedMotion } from "@/lib/animations/gsap-utils";
import type { VariantProduct } from "@/features/storefront/types/variant";

interface ProductGridProps {
  products: VariantProduct[];
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  onResetFilters: () => void;
  hasFilters: boolean;
  density?: 3 | 4;
}

function ProductGridSkeleton({ density = 4 }: { density?: 3 | 4 }) {
  const gridClasses =
    density === 3
      ? "grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
      : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6";

  return (
    <div className={gridClasses}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="border border-[var(--vault-line)] bg-[var(--vault-panel)] animate-pulse flex flex-col"
        >
          <div className="aspect-[3/4] w-full bg-[var(--vault-line)]/40" />
          <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="h-3 w-1/3 bg-[var(--vault-line)]/50" />
              <div className="h-4 w-3/4 bg-[var(--vault-line)]/60" />
              <div className="h-3 w-1/2 bg-[var(--vault-line)]/40" />
            </div>
            <div className="h-8 w-full bg-[var(--vault-line)]/30 mt-4" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProductGrid({
  products,
  isLoading = false,
  isError = false,
  errorMessage,
  onRetry,
  onResetFilters,
  hasFilters,
  density = 4,
}: ProductGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isReducedMotion() || !gridRef.current || products.length === 0 || isLoading) return;

    const ctx = gsap.context(() => {
      const cards = gridRef.current?.querySelectorAll("article");
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.06,
            ease: "power2.out",
          },
        );
      }
    }, gridRef);

    return () => ctx.revert();
  }, [products, isLoading]);

  if (isLoading) {
    return <ProductGridSkeleton density={density} />;
  }

  if (isError) {
    return (
      <div className="mx-auto my-12 max-w-xl border border-[var(--vault-accent)]/40 bg-[var(--vault-panel)] p-8 text-center space-y-4">
        <div className="flex justify-center text-[var(--vault-accent)]">
          <AlertTriangle size={32} />
        </div>
        <h3 className="font-serif text-2xl uppercase tracking-tight text-[var(--vault-ink)]">
          Connection Issue
        </h3>
        <p className="text-xs text-[var(--vault-muted)] max-w-md mx-auto leading-relaxed font-sans">
          {errorMessage || "Unable to retrieve the catalog pieces. Please check connection and retry."}
        </p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="btn-primary inline-flex items-center gap-2 px-6 py-2.5 font-mono text-xs uppercase tracking-widest font-bold cursor-pointer"
          >
            <RefreshCw size={13} /> Retry Catalog Load
          </button>
        )}
      </div>
    );
  }

  if (products.length === 0) {
    return <ProductEmptyState onClearFilters={onResetFilters} hasFilters={hasFilters} />;
  }

  const gridClasses =
    density === 3
      ? "grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
      : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6";

  return (
    <div ref={gridRef} className={gridClasses}>
      {products.map((product, idx) => (
        <CategoryProductItem key={product.id} product={product} priority={idx < 4} />
      ))}
    </div>
  );
}

