"use client";

import { VARIANT_SIZES } from "../types/variant";
import type { VariantColor, VariantProduct, VariantSize } from "../types/variant";

interface Props {
  product: VariantProduct;
  color: VariantColor;
  size: VariantSize;
  onColorChange: (colorId: string) => void;
  onSizeChange: (size: VariantSize) => void;
}

export function VariantPicker({
  product,
  color,
  size,
  onColorChange,
  onSizeChange,
}: Props) {
  return (
    <div className="space-y-6">
      <fieldset>
        <legend className="mb-3 flex w-full items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em]">
          <span>Color / {color.name}</span>
          <span className="text-[var(--vault-muted)]">{product.colors.length} colorways</span>
        </legend>
        <div className="flex flex-wrap gap-2.5">
          {product.colors.map((option) => (
            <button
              key={option.id}
              type="button"
              aria-label={`Select ${option.name}`}
              aria-pressed={color.id === option.id}
              onClick={() => onColorChange(option.id)}
              className={`flex h-10 w-10 items-center justify-center rounded-full border transition duration-300 ${
                color.id === option.id
                  ? "border-[var(--vault-ink)] ring-2 ring-[var(--vault-accent)] ring-offset-2 ring-offset-[var(--vault-canvas)]"
                  : "border-[var(--vault-line)] hover:scale-105"
              }`}
            >
              <span
                className="h-7 w-7 rounded-full border border-black/10"
                style={{ backgroundColor: option.hex }}
              />
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 flex w-full items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em]">
          <span>Size matrix</span>
          <span className="text-[var(--vault-muted)]">XS — XL</span>
        </legend>
        <div className="grid grid-cols-5 gap-2">
          {VARIANT_SIZES.map((option) => {
            const stock = color.stockBySize[option];
            const selected = size === option;
            return (
              <button
                key={option}
                type="button"
                disabled={stock === 0}
                aria-pressed={selected}
                onClick={() => onSizeChange(option)}
                className={`relative min-h-12 border font-mono text-xs transition duration-300 ${
                  selected
                    ? "border-[var(--vault-accent)] bg-[var(--vault-accent)] font-bold text-[var(--vault-accent-ink)]"
                    : "border-[var(--vault-line)] hover:border-[var(--vault-ink)]"
                } disabled:cursor-not-allowed disabled:opacity-35`}
              >
                {option}
                {stock === 0 && <span className="absolute inset-x-1/4 top-1/2 h-px -rotate-45 bg-current" />}
              </button>
            );
          })}
        </div>
        <p className="mt-3 min-h-4 font-mono text-[10px] uppercase tracking-wider text-[var(--vault-muted)]" aria-live="polite">
          {color.stockBySize[size] > 0
            ? `${color.stockBySize[size]} units available · variant stock`
            : "Currently unavailable in this size"}
        </p>
      </fieldset>
    </div>
  );
}
