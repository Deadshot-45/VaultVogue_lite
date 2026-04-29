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
      <div>
        <p className="mb-2 text-sm">Select Size</p>

        <div className="flex gap-2 flex-wrap">
          {sizes.map((item) => {
            const disabled = (stockMap[item.size] ?? 0) <= 0;

            return (
              <button
                key={item.variantId}
                disabled={disabled}
                onClick={() => onSelect(item.size)}
                className={`px-4 py-2 rounded-full cursor-pointer border transition-all duration-200 active:scale-95 hover:-translate-y-0.5 ${
                  selectedSize === item.size
                    ? "sale-primary border-transparent"
                    : "border-ring text-muted-foreground"
                } ${disabled ? "opacity-30 cursor-not-allowed" : ""}`}
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
