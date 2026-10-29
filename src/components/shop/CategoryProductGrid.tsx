"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  Plus,
  AlertCircle,
  RefreshCw,
  WifiOff,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useStorefront } from "@/features/storefront/context/storefront-context";
import { formatCurrency } from "@/features/storefront/lib/variant-utils";
import { isReducedMotion } from "@/lib/animations/gsap-utils";
import { FALLBACK_IMAGE } from "@/lib/utility/utils";
import type {
  VariantProduct,
  VariantSize,
} from "@/features/storefront/types/variant";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface CategoryProductItemProps {
  product: VariantProduct;
  priority?: boolean;
}

export function CategoryProductItem({
  product,
  priority = false,
}: CategoryProductItemProps) {
  const { isInWishlist, toggleWishlist, addToCart } = useStorefront();
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState<VariantSize>("M");
  const [isHovered, setIsHovered] = useState(false);
  const [primaryImgError, setPrimaryImgError] = useState(false);
  const [altImgError, setAltImgError] = useState(false);

  const activeColor = product.colors[selectedColorIdx] ?? product.colors[0];
  const alternateColor = product.colors[1] ?? activeColor;
  const inWishlist = isInWishlist(product.id);

  const hasDistinctAlternate =
    alternateColor.image && alternateColor.image !== activeColor.image;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, activeColor, selectedSize);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const activeImgSrc = primaryImgError ? FALLBACK_IMAGE : activeColor.image;
  const altImgSrc = altImgError ? activeImgSrc : alternateColor.image;

  return (
    <article
      className="group relative flex flex-col border border-[var(--vault-line)] bg-[var(--vault-panel)] transition-all duration-300 hover:border-[var(--vault-accent)] hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Frame */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-black/5">
        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          aria-label={inWishlist ? "Remove from wishlist" : "Save to wishlist"}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-[var(--vault-line)] bg-[var(--vault-panel)]/90 text-[var(--vault-ink)] backdrop-blur-md transition hover:scale-110 hover:border-[var(--vault-accent)] hover:text-[var(--vault-accent)] cursor-pointer"
        >
          <Heart
            size={14}
            className={
              inWishlist
                ? "fill-[var(--vault-accent)] text-[var(--vault-accent)]"
                : ""
            }
          />
        </button>

        {/* Lead-Time or Stock Badge */}
        <div className="absolute left-3 top-3 z-10">
          <span className="inline-flex items-center gap-1 bg-[var(--vault-panel)]/90 backdrop-blur-md border border-[var(--vault-line)] px-2 py-0.5 font-mono text-[8px] uppercase tracking-widest text-[var(--vault-accent)] font-semibold">
            {product.leadTime}
          </span>
        </div>

        {/* Image Pair with Crossfade Hover */}
        <Link
          href={`/products/${product.slug}`}
          className="block h-full w-full relative"
        >
          <Image
            src={activeImgSrc}
            alt={`${product.name} in ${activeColor.name}`}
            fill
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            onError={() => setPrimaryImgError(true)}
            className={`object-cover object-top transition-all duration-700 ease-out group-hover:scale-105 ${
              isHovered && hasDistinctAlternate ? "opacity-0" : "opacity-100"
            }`}
          />
          {hasDistinctAlternate && (
            <Image
              src={altImgSrc}
              alt={`${product.name} alternate view`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              onError={() => setAltImgError(true)}
              className={`object-cover object-top transition-all duration-700 ease-out group-hover:scale-105 ${
                isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            />
          )}
        </Link>

        {/* Desktop Quick Add Slide-Up Trigger */}
        <div className="absolute inset-x-3 bottom-3 hidden translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:block z-10">
          <button
            type="button"
            onClick={handleQuickAdd}
            className="btn-primary w-full py-2.5 font-mono text-[10px] uppercase font-bold tracking-wider shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus size={14} /> Quick Add ({selectedSize})
          </button>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
        <div>
          {/* Category & Serial Code */}
          <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-wider text-[var(--vault-muted)]">
            <span>{product.category}</span>
            <span>{product.code}</span>
          </div>

          {/* Product Title */}
          <Link href={`/products/${product.slug}`}>
            <h3 className="mt-1 font-serif text-base sm:text-lg font-light uppercase tracking-tight text-[var(--vault-ink)] transition-colors hover:text-[var(--vault-accent)] line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Pricing in INR */}
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-mono text-sm font-semibold text-[var(--vault-ink)]">
              {formatCurrency(product.price, "INR")}
            </span>
            <span className="font-mono text-[10px] line-through text-[var(--vault-muted)]">
              {formatCurrency(Math.round(product.price * 1.3), "INR")}
            </span>
          </div>

          {/* Fabric Composition */}
          <p className="mt-1 text-[10px] text-[var(--vault-muted)] line-clamp-1 font-mono">
            {product.fabric}
          </p>

          {/* Color Swatches */}
          <div className="mt-3 flex items-center gap-1.5">
            {product.colors.map((c, idx) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedColorIdx(idx)}
                aria-label={`Select ${c.name}`}
                className={`h-4 w-4 rounded-full border transition-transform cursor-pointer ${
                  selectedColorIdx === idx
                    ? "scale-125 border-[var(--vault-accent)] ring-1 ring-[var(--vault-accent)]"
                    : "border-black/20 hover:scale-110"
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
            <span className="ml-1 font-mono text-[9px] uppercase text-[var(--vault-muted)]">
              {activeColor.name}
            </span>
          </div>

          {/* Size Pills */}
          <div className="mt-3 flex items-center gap-1">
            {(["XS", "S", "M", "L", "XL"] as VariantSize[]).map((sz) => (
              <button
                key={sz}
                type="button"
                onClick={() => setSelectedSize(sz)}
                className={`h-6 w-7 border font-mono text-[9px] uppercase transition-colors cursor-pointer ${
                  selectedSize === sz
                    ? "border-[var(--vault-accent)] bg-[var(--vault-accent)] text-white font-bold"
                    : "border-[var(--vault-line)] text-[var(--vault-muted)] hover:border-[var(--vault-ink)] hover:text-[var(--vault-ink)]"
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Quick Add Button */}
        <div className="mt-4 pt-3 border-t border-[var(--vault-line)] sm:hidden">
          <button
            type="button"
            onClick={handleQuickAdd}
            className="btn-primary w-full py-2 font-mono text-[9px] uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer"
          >
            <Plus size={12} /> Add to Bag ({selectedSize})
          </button>
        </div>
      </div>
    </article>
  );
}

function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 py-8">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="border border-[var(--vault-line)] bg-[var(--vault-panel)] animate-pulse flex flex-col"
        >
          <div className="aspect-[3/4] w-full bg-[var(--vault-line)]/30" />
          <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="h-3 w-1/3 bg-[var(--vault-line)]/40 rounded-none" />
              <div className="h-4 w-3/4 bg-[var(--vault-line)]/50 rounded-none" />
              <div className="h-3 w-1/2 bg-[var(--vault-line)]/30 rounded-none" />
            </div>
            <div className="h-7 w-full bg-[var(--vault-line)]/20 rounded-none mt-4" />
          </div>
        </div>
      ))}
    </div>
  );
}

interface CategoryProductGridProps {
  products: VariantProduct[];
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  onResetFilters: () => void;
}

export function CategoryProductGrid({
  products,
  isLoading = false,
  isError = false,
  errorMessage,
  onRetry,
  onResetFilters,
}: CategoryProductGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      isReducedMotion() ||
      !gridRef.current ||
      products.length === 0 ||
      isLoading
    )
      return;

    const ctx = gsap.context(() => {
      const cards = gridRef.current?.querySelectorAll("article");
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: "power2.out",
          },
        );
      }
    }, gridRef);

    return () => ctx.revert();
  }, [products, isLoading]);

  if (isLoading) {
    return <ProductGridSkeleton count={8} />;
  }

  if (isError) {
    return (
      <div className="py-16 text-center border border-[var(--vault-accent)]/40 bg-[var(--vault-panel)] p-8 my-8 max-w-xl mx-auto space-y-4">
        <div className="flex justify-center text-[var(--vault-accent)]">
          <WifiOff size={32} />
        </div>
        <h3 className="font-serif text-2xl uppercase tracking-tight text-[var(--vault-ink)]">
          API Connection Interrupted
        </h3>
        <p className="text-xs text-[var(--vault-muted)] max-w-md mx-auto leading-relaxed font-sans">
          {errorMessage ||
            "Unable to reach the live product service. Check backend connection."}
        </p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="btn-primary inline-flex items-center gap-2 px-6 py-2.5 font-mono text-xs uppercase tracking-widest font-bold cursor-pointer"
          >
            <RefreshCw size={13} /> Retry Connection
          </button>
        )}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-20 text-center border border-[var(--vault-line)] bg-[var(--vault-panel)] p-8 my-8 max-w-xl mx-auto space-y-4">
        <div className="flex justify-center text-[var(--vault-accent)]">
          <AlertCircle size={32} />
        </div>
        <h3 className="font-serif text-2xl uppercase tracking-tight text-[var(--vault-ink)]">
          No Creations Found
        </h3>
        <p className="text-xs text-[var(--vault-muted)] max-w-md mx-auto leading-relaxed font-sans">
          No garments currently match your selected filters. Try broadening your
          criteria or reset filters to browse the complete archive.
        </p>
        <button
          type="button"
          onClick={onResetFilters}
          className="btn-primary px-6 py-2.5 font-mono text-xs uppercase tracking-widest font-bold cursor-pointer"
        >
          Reset All Filters
        </button>
      </div>
    );
  }

  return (
    <div
      ref={gridRef}
      id="category-products"
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 py-8"
    >
      {products.map((product, idx) => (
        <CategoryProductItem
          key={product.id}
          product={product}
          priority={idx < 4}
        />
      ))}
    </div>
  );
}
