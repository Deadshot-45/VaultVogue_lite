"use client";

import { useState } from "react";
import { Ruler } from "lucide-react";
import type { SizeMeasurement, VariantColor, VariantSize } from "@/features/storefront/types/variant";
import { SizeGuideDialog } from "./SizeGuideDialog";

interface ProductSizeSelectorProps {
  color: VariantColor;
  selectedSize: VariantSize;
  onSelectSize: (size: VariantSize) => void;
  measurements?: Record<string, SizeMeasurement>;
  availability: boolean;
  variants?: {
    id?: string;
    sku?: string;
    size?: string;
    color?: string;
    price?: number;
    compareAtPrice?: number;
    stock?: number;
    isActive?: boolean;
  }[];
  availableSizes?: string[];
}

const SIZES: readonly VariantSize[] = ["XS", "S", "M", "L", "XL"];

export function ProductSizeSelector({
  color,
  selectedSize,
  onSelectSize,
  measurements,
  availability,
  variants,
  availableSizes,
}: ProductSizeSelectorProps) {
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  // Derive available sizes directly from API variants or availableSizes
  const sizesFromColorVariants = variants
    ?.filter(
      (v) =>
        !color?.name ||
        !v.color ||
        v.color.toLowerCase() === color.name.toLowerCase() ||
        variants.length <= 1,
    )
    .map((v) => v.size)
    .filter(Boolean) as string[];

  const allVariantSizes = variants?.map((v) => v.size).filter(Boolean) as string[];

  const displaySizes: readonly string[] =
    sizesFromColorVariants && sizesFromColorVariants.length > 0
      ? Array.from(new Set(sizesFromColorVariants))
      : allVariantSizes && allVariantSizes.length > 0
      ? Array.from(new Set(allVariantSizes))
      : availableSizes && availableSizes.length > 0
      ? availableSizes
      : Object.keys(color?.stockBySize || {}).length > 0
      ? Object.keys(color.stockBySize)
      : SIZES;

  const getStock = (size: string): number => {
    // 1. Variant matching both size and selected color
    const colorMatch = variants?.find(
      (v) =>
        v.size === size &&
        (!color?.name || !v.color || v.color.toLowerCase() === color.name.toLowerCase()),
    );
    if (colorMatch && typeof colorMatch.stock === "number") {
      return colorMatch.stock;
    }

    // 2. Any variant matching the size
    const anyMatch = variants?.find((v) => v.size === size);
    if (anyMatch && typeof anyMatch.stock === "number") {
      return anyMatch.stock;
    }

    // 3. Fallback to color.stockBySize
    if (color?.stockBySize && typeof color.stockBySize[size] === "number") {
      return color.stockBySize[size];
    }

    return availability ? 10 : 0;
  };

  const currentStock = getStock(selectedSize);

  return (
    <div className="space-y-3">
      {/* Header with Size Guide Trigger */}
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider">
        <span className="text-(--vault-muted)">
          Selected Size: <strong className="text-(--vault-ink)">{selectedSize}</strong>
        </span>

        <button
          type="button"
          onClick={() => setSizeGuideOpen(true)}
          className="inline-flex items-center gap-1.5 text-(--vault-accent) underline underline-offset-4 hover:opacity-80 transition-opacity cursor-pointer"
        >
          <Ruler size={12} /> Size Guide
        </button>
      </div>

      {/* Size Buttons Grid */}
      <div
        role="radiogroup"
        aria-label="Size options"
        className="flex flex-wrap gap-2.5"
      >
        {displaySizes.map((size) => {
          const stock = getStock(size);
          const isOutOfStock = stock <= 0;
          const isSelected = size === selectedSize;
          const isLowStock = stock > 0 && stock <= 3;

          return (
            <button
              key={size}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={isOutOfStock}
              onClick={() => onSelectSize(size)}
              className={`relative flex h-11 min-w-[48px] px-3.5 flex-col items-center justify-center border font-mono text-xs uppercase tracking-wider transition-all cursor-pointer ${
                isSelected
                  ? "border-(--vault-accent) bg-(--vault-accent) text-white font-bold shadow-sm"
                  : isOutOfStock
                  ? "border-(--vault-line) bg-transparent text-(--vault-muted)/40 cursor-not-allowed"
                  : "border-(--vault-line) bg-(--vault-panel) text-(--vault-ink) hover:border-(--vault-accent)"
              }`}
            >
              <span>{size}</span>

              {isOutOfStock && (
                <span className="absolute inset-x-2 top-1/2 h-px -rotate-45 bg-(--vault-muted)/40 pointer-events-none" />
              )}

              {isLowStock && !isSelected && (
                <span className="absolute -top-1.5 -right-1 flex h-3.5 px-1 items-center rounded-full bg-(--vault-accent) font-mono text-[7px] text-white font-bold">
                  {stock}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Stock availability indicator */}
      <div className="font-mono text-[10px] uppercase tracking-wider">
        {currentStock <= 0 ? (
          <span className="text-red-500 font-bold">Out of stock in {selectedSize}</span>
        ) : currentStock <= 3 ? (
          <span className="text-(--vault-accent) font-bold">
            Only {currentStock} remaining in {selectedSize}
          </span>
        ) : (
          <span className="text-emerald-500">In stock · Ready for immediate dispatch</span>
        )}
      </div>

      {/* Size Guide Modal */}
      <SizeGuideDialog
        open={sizeGuideOpen}
        onOpenChange={setSizeGuideOpen}
        measurements={measurements as Record<VariantSize, SizeMeasurement> | undefined}
      />
    </div>
  );
}
