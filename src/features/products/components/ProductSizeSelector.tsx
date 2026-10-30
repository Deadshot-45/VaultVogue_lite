"use client";

import { useState } from "react";
import { Ruler } from "lucide-react";
import type { SizeMeasurement, VariantColor, VariantSize } from "@/features/storefront/types/variant";
import { SizeGuideDialog } from "./SizeGuideDialog";

interface ProductSizeSelectorProps {
  color: VariantColor;
  selectedSize: VariantSize;
  onSelectSize: (size: VariantSize) => void;
  measurements?: Record<VariantSize, SizeMeasurement>;
}

const SIZES: readonly VariantSize[] = ["XS", "S", "M", "L", "XL"];

export function ProductSizeSelector({
  color,
  selectedSize,
  onSelectSize,
  measurements,
}: ProductSizeSelectorProps) {
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  return (
    <div className="space-y-3">
      {/* Header with Size Guide Trigger */}
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider">
        <span className="text-[var(--vault-muted)]">
          Selected Size: <strong className="text-[var(--vault-ink)]">{selectedSize}</strong>
        </span>

        <button
          type="button"
          onClick={() => setSizeGuideOpen(true)}
          className="inline-flex items-center gap-1.5 text-[var(--vault-accent)] underline underline-offset-4 hover:opacity-80 transition-opacity cursor-pointer"
        >
          <Ruler size={12} /> Size Guide
        </button>
      </div>

      {/* Size Buttons Grid */}
      <div
        role="radiogroup"
        aria-label="Size options"
        className="grid grid-cols-5 gap-2.5"
      >
        {SIZES.map((size) => {
          const stock = color.stockBySize[size] ?? 0;
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
              className={`relative flex h-11 flex-col items-center justify-center border font-mono text-xs uppercase tracking-wider transition-all cursor-pointer ${
                isSelected
                  ? "border-[var(--vault-accent)] bg-[var(--vault-accent)] text-white font-bold shadow-sm"
                  : isOutOfStock
                  ? "border-[var(--vault-line)] bg-transparent text-[var(--vault-muted)]/40 cursor-not-allowed"
                  : "border-[var(--vault-line)] bg-[var(--vault-panel)] text-[var(--vault-ink)] hover:border-[var(--vault-accent)]"
              }`}
            >
              <span>{size}</span>

              {isOutOfStock && (
                <span className="absolute inset-x-2 top-1/2 h-px -rotate-45 bg-[var(--vault-muted)]/40 pointer-events-none" />
              )}

              {isLowStock && !isSelected && (
                <span className="absolute -top-1.5 -right-1 flex h-3.5 px-1 items-center rounded-full bg-[var(--vault-accent)] font-mono text-[7px] text-white font-bold">
                  {stock}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Stock availability indicator */}
      <div className="font-mono text-[10px] uppercase tracking-wider">
        {(color.stockBySize[selectedSize] ?? 0) <= 0 ? (
          <span className="text-red-500 font-bold">Out of stock in {selectedSize}</span>
        ) : (color.stockBySize[selectedSize] ?? 0) <= 3 ? (
          <span className="text-[var(--vault-accent)] font-bold">
            Only {color.stockBySize[selectedSize]} remaining in {selectedSize}
          </span>
        ) : (
          <span className="text-emerald-500">In stock · Ready for immediate dispatch</span>
        )}
      </div>

      {/* Size Guide Modal */}
      <SizeGuideDialog
        open={sizeGuideOpen}
        onOpenChange={setSizeGuideOpen}
        measurements={measurements}
      />
    </div>
  );
}
