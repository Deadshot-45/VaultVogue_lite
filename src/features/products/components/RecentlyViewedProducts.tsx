"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";
import { formatCurrency } from "@/features/storefront/lib/variant-utils";
import { resolveUiProductImage } from "@/lib/utility/utils";
import type { VariantProduct } from "@/features/storefront/types/variant";

const STORAGE_KEY = "vault-vogue-recently-viewed-items";

interface ViewedItemSummary {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface RecentlyViewedProps {
  currentProduct: VariantProduct;
}

export function RecentlyViewedProducts({
  currentProduct,
}: RecentlyViewedProps) {
  const [recentItems, setRecentItems] = useState<ViewedItemSummary[]>([]);
  const primaryImage = currentProduct.colors[0]?.image || "";

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const parsed: ViewedItemSummary[] = raw ? JSON.parse(raw) : [];

      const currentSummary: ViewedItemSummary = {
        id: currentProduct.id,
        slug: currentProduct.slug || currentProduct.id,
        name: currentProduct.name,
        price: currentProduct.price,
        image: primaryImage,
        category: currentProduct.category,
      };

      // Exclude current item, prepend it, and cap at 8
      const updated = [
        currentSummary,
        ...parsed.filter(
          (item) =>
            item.id !== currentProduct.id && item.slug !== currentProduct.slug,
        ),
      ].slice(0, 8);

      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      // Display previously viewed items (excluding current product)
      const others = parsed.filter(
        (item) =>
          item.id !== currentProduct.id && item.slug !== currentProduct.slug,
      );
      setRecentItems(others.slice(0, 4));
    } catch (err) {
      console.error("Failed to update recently viewed", err);
    }
  }, [
    currentProduct.id,
    currentProduct.slug,
    currentProduct.name,
    currentProduct.price,
    currentProduct.category,
    primaryImage,
  ]);

  if (recentItems.length === 0) return null;

  return (
    <section className="border-t border-[var(--vault-line)] pt-16 sm:pt-20">
      <div className="mb-8 flex items-center justify-between border-b border-[var(--vault-line)] pb-4">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-[var(--vault-accent)]" />
          <h3 className="font-serif text-2xl font-light uppercase tracking-tight text-[var(--vault-ink)]">
            Recently Inspected
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {recentItems.map((item) => {
          const mainImg =
            item.image ||
            "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=85";
          return (
            <Link
              key={item.id}
              href={`/products/${item.slug || item.id}`}
              className="group border border-[var(--vault-line)] bg-[var(--vault-panel)] p-3 transition hover:border-[var(--vault-accent)]"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-[var(--vault-canvas)]">
                <Image
                  src={resolveUiProductImage(mainImg, 400)}
                  alt={item.name}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  loading="lazy"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="pt-3 space-y-1">
                <span className="block font-mono text-[9px] uppercase tracking-wider text-[var(--vault-muted)] truncate">
                  {item.category}
                </span>
                <h4 className="font-serif text-sm font-light uppercase tracking-tight text-[var(--vault-ink)] truncate group-hover:text-[var(--vault-accent)] transition-colors">
                  {item.name}
                </h4>
                <p className="font-mono text-xs font-semibold text-[var(--vault-ink)]">
                  {formatCurrency(item.price, "USD")}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
