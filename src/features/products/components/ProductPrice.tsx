"use client";

import { Star } from "lucide-react";
import { formatCurrency } from "@/features/storefront/lib/variant-utils";

interface ProductPriceProps {
  price: number;
  originalPrice?: number;
  currency?: "USD" | "INR" | "EUR";
  rating?: number;
  reviewsCount?: number;
  onReviewsClick?: () => void;
}

export function ProductPrice({
  price,
  originalPrice,
  currency = "INR",
  rating = 4.9,
  reviewsCount = 42,
  onReviewsClick,
}: ProductPriceProps) {
  const hasDiscount = originalPrice && originalPrice > price;
  const discountPct = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <div className="space-y-3">
      {/* Price + Discount Tag */}
      <div className="flex flex-wrap items-baseline gap-3">
        <span className="font-mono text-2xl sm:text-3xl font-light tracking-tight text-[var(--vault-ink)]">
          {formatCurrency(price, currency)}
        </span>

        {hasDiscount && (
          <>
            <span className="font-mono text-base text-[var(--vault-muted)] line-through">
              {formatCurrency(originalPrice, currency)}
            </span>
            <span className="border border-[var(--vault-accent)] bg-[var(--vault-accent)]/10 px-2 py-0.5 font-mono text-[10px] uppercase font-bold tracking-wider text-[var(--vault-accent)]">
              {discountPct}% OFF
            </span>
          </>
        )}
      </div>

      {/* Review summary line */}
      <div className="flex items-center gap-2 font-mono text-[11px] text-[var(--vault-muted)]">
        <div className="flex items-center gap-0.5 text-[var(--vault-accent)]">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={12}
              className={i < Math.floor(rating) ? "fill-[var(--vault-accent)] text-[var(--vault-accent)]" : "text-[var(--vault-line)]"}
            />
          ))}
        </div>
        <span className="font-bold text-[var(--vault-ink)]">{rating.toFixed(1)}</span>
        <span>·</span>
        <button
          type="button"
          onClick={onReviewsClick}
          className="underline underline-offset-4 hover:text-[var(--vault-accent)] transition-colors cursor-pointer"
        >
          {reviewsCount} Atelier Reviews
        </button>
      </div>
    </div>
  );
}
