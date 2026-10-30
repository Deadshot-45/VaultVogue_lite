"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Heart } from "lucide-react";
import { useGetProducts, type UIProduct } from "@/lib/queries/useGetProducts";
import { mapApiProductToVariantProduct } from "@/lib/utility/category-adapter";
import { formatCurrency } from "@/features/storefront/lib/variant-utils";
import { resolveUiProductImage } from "@/lib/utility/utils";
import { useStorefront } from "@/features/storefront/context/storefront-context";
import type { VariantProduct } from "@/features/storefront/types/variant";

interface RelatedProductsProps {
  currentProductId: string;
  category?: string;
}

export function RelatedProducts({ currentProductId, category }: RelatedProductsProps) {
  const { toggleWishlist, isInWishlist } = useStorefront();

  const { data: infiniteData, isLoading } = useGetProducts({
    categoryName: category,
    limit: 6,
  });

  const apiProducts: UIProduct[] = infiniteData?.pages
    ? infiniteData.pages.flatMap((page) => page)
    : [];

  // Convert API products to VariantProducts
  const products: VariantProduct[] = (() => {
    if (apiProducts.length > 0) {
      const mapped = apiProducts
        .map(mapApiProductToVariantProduct)
        .filter((p: VariantProduct) => p.id !== currentProductId && p.slug !== currentProductId);
      if (mapped.length > 0) return mapped.slice(0, 4);
    }

    return [];
  })();

  if (products.length === 0) return null;

  return (
    <section className="border-t border-[var(--vault-line)] pt-16 sm:pt-24">
      <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[var(--vault-line)] pb-6">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--vault-accent)]">
            Complete Your Look
          </span>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-light uppercase tracking-tight text-[var(--vault-ink)]">
            Complementary Silhouettes
          </h2>
        </div>
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[var(--vault-muted)] hover:text-[var(--vault-ink)] transition-colors"
        >
          View Full Archive <ArrowUpRight size={13} />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse border border-[var(--vault-line)] bg-[var(--vault-panel)] p-4 space-y-3">
              <div className="aspect-[3/4] w-full bg-[var(--vault-line)]/50" />
              <div className="h-3 w-1/3 bg-[var(--vault-line)]/60" />
              <div className="h-4 w-3/4 bg-[var(--vault-line)]/70" />
              <div className="h-3 w-1/4 bg-[var(--vault-line)]/60" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {products.map((item) => {
            const primaryColor = item.colors[0];
            const inWishlist = isInWishlist(item.id);

            return (
              <article
                key={item.id}
                className="group relative flex flex-col justify-between border border-[var(--vault-line)] bg-[var(--vault-panel)] p-3 sm:p-4 transition-all duration-300 hover:border-[var(--vault-accent)] hover:shadow-xl"
              >
                {/* Image Link */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-[var(--vault-canvas)]">
                  <Link href={`/products/${item.slug || item.id}`} className="block h-full w-full">
                    <Image
                      src={resolveUiProductImage(
                        primaryColor?.image ||
                          "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80",
                        600,
                      )}
                      alt={item.name}
                      fill
                      loading="lazy"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </Link>

                  {/* Wishlist quick toggle button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleWishlist(item);
                    }}
                    aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                    className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center bg-[var(--vault-canvas)]/80 text-[var(--vault-ink)] backdrop-blur-md transition hover:bg-[var(--vault-accent)] hover:text-white cursor-pointer"
                  >
                    <Heart size={14} className={inWishlist ? "fill-[var(--vault-accent)] text-[var(--vault-accent)]" : ""} />
                  </button>
                </div>

                {/* Details */}
                <div className="pt-4 space-y-2">
                  <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-wider text-[var(--vault-muted)]">
                    <span className="truncate max-w-[110px]">{item.category}</span>
                    <span>{item.code}</span>
                  </div>

                  <Link href={`/products/${item.slug || item.id}`}>
                    <h3 className="font-serif text-base sm:text-lg font-light uppercase tracking-tight text-[var(--vault-ink)] line-clamp-1 transition-colors group-hover:text-[var(--vault-accent)]">
                      {item.name}
                    </h3>
                  </Link>

                  <div className="flex items-center justify-between pt-1">
                    <span className="font-mono text-xs sm:text-sm font-semibold text-[var(--vault-ink)]">
                      {formatCurrency(item.price, "USD")}
                    </span>

                    <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--vault-accent)]">
                      {item.colors.length} {item.colors.length === 1 ? "Color" : "Colors"}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
