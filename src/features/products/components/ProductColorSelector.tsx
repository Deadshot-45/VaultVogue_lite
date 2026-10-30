"use client";

import type { VariantColor } from "@/features/storefront/types/variant";

interface ProductColorSelectorProps {
  colors: VariantColor[];
  selectedColor: VariantColor;
  onSelectColor: (colorId: string) => void;
}

export function ProductColorSelector({
  colors,
  selectedColor,
  onSelectColor,
}: ProductColorSelectorProps) {
  if (!colors || colors.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider">
        <span className="text-[var(--vault-muted)]">Color Tone:</span>
        <span className="font-bold text-[var(--vault-ink)]">
          {selectedColor.name} <span className="text-[var(--vault-muted)] font-normal">({selectedColor.code})</span>
        </span>
      </div>

      <div
        role="radiogroup"
        aria-label="Color options"
        className="flex flex-wrap items-center gap-3"
      >
        {colors.map((color) => {
          const isSelected = color.id === selectedColor.id;
          return (
            <button
              key={color.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={`Select ${color.name} color`}
              onClick={() => onSelectColor(color.id)}
              className={`group relative flex h-9 w-9 items-center justify-center rounded-full transition-all cursor-pointer ${
                isSelected
                  ? "ring-2 ring-[var(--vault-accent)] ring-offset-2 ring-offset-[var(--vault-canvas)] scale-105"
                  : "border border-[var(--vault-line)] hover:scale-105 hover:ring-1 hover:ring-[var(--vault-accent)]/50"
              }`}
            >
              <span
                className="h-7 w-7 rounded-full shadow-inner transition-transform"
                style={{ backgroundColor: color.hex }}
              />
              <span className="sr-only">{color.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
