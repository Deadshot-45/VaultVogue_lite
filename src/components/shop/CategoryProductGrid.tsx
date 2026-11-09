"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  Plus,
  Check,
  AlertCircle,
  RefreshCw,
  WifiOff,
} from "lucide-react";
import { gsap } from "gsap";
import { useStorefront } from "@/features/storefront/context/storefront-context";
import { formatCurrency } from "@/features/storefront/lib/variant-utils";
import { isReducedMotion } from "@/lib/animations/gsap-utils";
import { FALLBACK_IMAGE } from "@/lib/utility/utils";
import type {
  VariantProduct,
  VariantSize,
} from "@/features/storefront/types/variant";

const SIZES: readonly VariantSize[] = ["XS", "S", "M", "L", "XL"];

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
  const [isHovered, setIsHovered] = useState(false);
  const [primaryImgError, setPrimaryImgError] = useState(false);
  const [altImgError, setAltImgError] = useState(false);
  const [justAddedSize, setJustAddedSize] = useState<string | null>(null);

  const activeColor = product.colors[selectedColorIdx] ?? product.colors[0];
  const alternateColor = product.colors[1] ?? activeColor;
  const inWishlist = isInWishlist(product.id);

  const hasDistinctAlternate =
    alternateColor.image && alternateColor.image !== activeColor.image;

  const handleQuickAdd = (size: VariantSize, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if chosen size has stock
    const stock = activeColor.stockBySize?.[size] ?? 1;
    if (stock <= 0) return;

    addToCart(product, activeColor, size);
    setJustAddedSize(size);
    setTimeout(() => {
      setJustAddedSize(null);
    }, 1800);
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
      className="group relative flex flex-col border border-(--vault-line) bg-(--vault-panel) transition-all duration-300 hover:border-(--vault-accent)/70 hover:shadow-lg"
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
          className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-(--vault-line) bg-(--vault-panel)/85 text-(--vault-ink) backdrop-blur-md transition-all duration-200 hover:scale-110 hover:border-(--vault-accent) hover:text-(--vault-accent) active:scale-95 cursor-pointer"
        >
          <Heart
            size={13}
            className={`transition-colors duration-200 ${
              inWishlist
                ? "fill-(--vault-accent) text-(--vault-accent)"
                : ""
            }`}
          />
        </button>

        {/* Lead-Time or Stock Badge */}
        {product.leadTime && (
          <div className="absolute left-3 top-3 z-10">
            <span className="inline-flex items-center gap-1 bg-(--vault-panel)/85 backdrop-blur-md border border-(--vault-line) px-2 py-0.5 font-mono text-[8px] uppercase tracking-widest text-(--vault-muted) font-medium">
              {product.leadTime}
            </span>
          </div>
        )}

        {/* Image Pair with Smooth Crossfade Hover */}
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
            className={`object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105 ${
              isHovered && hasDistinctAlternate ? "opacity-0" : "opacity-100"
            }`}
          />
          {hasDistinctAlternate && (
            <Image
              src={altImgSrc}
              alt={`${product.name} alternate view`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              loading="lazy"
              onError={() => setAltImgError(true)}
              className={`object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105 ${
                isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            />
          )}
        </Link>

        {/* Slide-Up Quick Size Selector Overlay */}
        <div
          className={`absolute inset-x-0 bottom-0 z-10 border-t border-(--vault-line) bg-(--vault-panel)/95 backdrop-blur-md px-3 py-2.5 transition-all duration-300 ${
            isHovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] uppercase tracking-wider text-(--vault-muted)">
              {justAddedSize ? (
                <span className="text-emerald-500 font-semibold inline-flex items-center gap-1">
                  <Check size={11} /> Size {justAddedSize} Added
                </span>
              ) : (
                "Quick Add Size:"
              )}
            </span>

            <div className="flex items-center gap-1">
              {SIZES.map((sz) => {
                const stock = activeColor.stockBySize?.[sz] ?? 1;
                const isOutOfStock = stock <= 0;

                return (
                  <button
                    key={sz}
                    type="button"
                    disabled={isOutOfStock}
                    onClick={(e) => handleQuickAdd(sz, e)}
                    className={`h-6 w-6 font-mono text-[9px] uppercase border transition-colors cursor-pointer flex items-center justify-center ${
                      isOutOfStock
                        ? "border-(--vault-line)/40 text-(--vault-muted)/40 cursor-not-allowed line-through"
                        : justAddedSize === sz
                        ? "border-emerald-500 bg-emerald-500 text-white font-bold"
                        : "border-(--vault-line) text-(--vault-ink) hover:border-(--vault-accent) hover:bg-(--vault-accent) hover:text-white"
                    }`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Block */}
      <div className="flex flex-1 flex-col justify-between p-3.5 sm:p-4">
        <div>
          {/* Category Monospace Label */}
          <div className="font-mono text-[9px] uppercase tracking-wider text-(--vault-muted)">
            {product.category}
          </div>

          {/* Product Title */}
          <Link href={`/products/${product.slug}`}>
            <h3 className="mt-1 font-serif text-sm sm:text-base font-light uppercase tracking-tight text-(--vault-ink) transition-colors hover:text-(--vault-accent) line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Pricing */}
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="font-mono text-xs sm:text-sm font-semibold text-(--vault-ink)">
              {formatCurrency(product.price, "INR")}
            </span>
            <span className="font-mono text-[10px] line-through text-(--vault-muted)/70">
              {formatCurrency(Math.round(product.price * 1.25), "INR")}
            </span>
          </div>
        </div>

        {/* Minimal Color Swatches & Mobile Quick-Add Trigger */}
        <div className="mt-3 flex items-center justify-between border-t border-(--vault-line)/50 pt-2.5">
          {/* Swatches */}
          <div className="flex items-center gap-1.5">
            {product.colors.map((c, idx) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedColorIdx(idx)}
                aria-label={`Select ${c.name}`}
                className={`h-3 w-3 rounded-full border transition-all cursor-pointer ${
                  selectedColorIdx === idx
                    ? "scale-125 border-(--vault-accent) ring-1 ring-(--vault-accent)"
                    : "border-black/20 hover:scale-110"
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>

          {/* Mobile Tap-To-Add Pill */}
          <div className="sm:hidden">
            <button
              type="button"
              onClick={(e) => handleQuickAdd("M", e)}
              className="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-(--vault-accent) border border-(--vault-accent)/40 px-2 py-0.5 cursor-pointer"
            >
              <Plus size={10} /> Add
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 py-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="border border-(--vault-line) bg-(--vault-panel) animate-pulse flex flex-col"
        >
          <div className="aspect-[3/4] w-full bg-(--vault-line)/25" />
          <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="h-2.5 w-1/4 bg-(--vault-line)/40" />
              <div className="h-4 w-3/4 bg-(--vault-line)/50" />
              <div className="h-3 w-1/2 bg-(--vault-line)/30" />
            </div>
            <div className="h-2 w-1/3 bg-(--vault-line)/20 mt-3" />
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
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.04,
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
      <div className="py-16 text-center border border-(--vault-accent)/40 bg-(--vault-panel) p-8 my-8 max-w-md mx-auto space-y-3">
        <div className="flex justify-center text-(--vault-accent)">
          <WifiOff size={28} />
        </div>
        <h3 className="font-serif text-xl uppercase tracking-tight text-(--vault-ink)">
          Live Service Reconnecting
        </h3>
        <p className="text-xs text-(--vault-muted) max-w-sm mx-auto leading-relaxed font-sans">
          {errorMessage || "Unable to reach the product catalog service."}
        </p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="btn-primary inline-flex items-center gap-2 px-5 py-2 font-mono text-xs uppercase tracking-widest font-bold cursor-pointer mt-2"
          >
            <RefreshCw size={12} /> Retry
          </button>
        )}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-16 text-center border border-(--vault-line) bg-(--vault-panel) p-8 my-8 max-w-md mx-auto space-y-3">
        <div className="flex justify-center text-(--vault-accent)">
          <AlertCircle size={28} />
        </div>
        <h3 className="font-serif text-xl uppercase tracking-tight text-(--vault-ink)">
          No Silhouettes Found
        </h3>
        <p className="text-xs text-(--vault-muted) max-w-sm mx-auto leading-relaxed font-sans">
          No garments currently match your selected filters. Reset filters to browse the complete collection.
        </p>
        <button
          type="button"
          onClick={onResetFilters}
          className="btn-primary px-5 py-2 font-mono text-xs uppercase tracking-widest font-bold cursor-pointer mt-2"
        >
          Reset Filters
        </button>
      </div>
    );
  }

  return (
    <div
      ref={gridRef}
      id="category-catalog"
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 py-6"
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
