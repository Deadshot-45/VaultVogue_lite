import React from "react";

type SizeSelectorProps = {
  sizes: {
    size: string;
    variantId: string;
    stock: number;
  }[];
  selectedSize: string | null;
  onSelect: (size: string) => void;
  stockMap: Record<string, number>;
};

export const SizeSelector = React.memo(
  ({ sizes, selectedSize, onSelect, stockMap }: SizeSelectorProps) => {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-text)]">
            Select Size
          </p>
          {selectedSize && stockMap[selectedSize] <= 5 && stockMap[selectedSize] > 0 && (
            <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider animate-pulse">
              Only {stockMap[selectedSize]} left in stock
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2.5">
          {sizes.map((item) => {
            const disabled = (stockMap[item.size] ?? 0) <= 0;
            const isSelected = selectedSize === item.size;

            return (
              <button
                key={item.variantId}
                disabled={disabled}
                onClick={() => onSelect(item.size)}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider cursor-pointer border transition-all duration-300 active:scale-95 ${
                  isSelected
                    ? "bg-[var(--gold)] text-white border-transparent shadow-md"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-foreground hover:bg-muted/10"
                } ${disabled ? "opacity-30 cursor-not-allowed line-through" : ""}`}
              >
                {item.size}
              </button>
            );
          })}
        </div>
      </div>
    );
  },
);
SizeSelector.displayName = "SizeSelector";
