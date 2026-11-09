"use client";

import { Minus, Plus } from "lucide-react";

interface ProductQuantitySelectorProps {
  quantity: number;
  maxStock: number;
  onChange: (quantity: number) => void;
}

export function ProductQuantitySelector({
  quantity,
  maxStock,
  onChange,
}: ProductQuantitySelectorProps) {
  const handleDecrement = () => {
    if (quantity > 1) {
      onChange(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < maxStock) {
      onChange(quantity + 1);
    }
  };

  return (
    <div className="space-y-2">
      <span className="block font-mono text-[10px] uppercase tracking-wider text-(--vault-muted)">
        Quantity
      </span>

      <div className="inline-flex h-11 items-center border border-(--vault-line) bg-(--vault-panel)">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={quantity <= 1}
          aria-label="Decrease quantity"
          className="flex h-full w-10 items-center justify-center text-(--vault-ink) hover:text-(--vault-accent) disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <Minus size={14} />
        </button>

        <span
          aria-live="polite"
          className="flex h-full min-w-10 items-center justify-center border-x border-(--vault-line) px-3 font-mono text-xs font-bold text-(--vault-ink) select-none"
        >
          {quantity}
        </span>

        <button
          type="button"
          onClick={handleIncrement}
          disabled={quantity >= maxStock}
          aria-label="Increase quantity"
          className="flex h-full w-10 items-center justify-center text-(--vault-ink) hover:text-(--vault-accent) disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}
