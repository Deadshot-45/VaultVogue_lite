"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { Search, X, ArrowUpRight, TrendingUp } from "lucide-react";
import { VARIANT_PRODUCTS } from "../data/catalog";
import { formatCurrency } from "../lib/variant-utils";
import { isReducedMotion } from "@/lib/animations/gsap-utils";
import type { VariantProduct } from "../types/variant";

interface Props {
  open: boolean;
  onClose: () => void;
}

const POPULAR_SEARCHES = [
  "Oversized Tees",
  "Tailored Trousers",
  "Outerwear",
  "Knitwear",
  "Accessories",
  "Aero-Structure",
  "Technical Blazer",
];

export function StorefrontSearchOverlay({ open, onClose }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const overlayRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;

    if (inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }

    if (!isReducedMotion() && overlayRef.current) {
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" },
      );
    }
  }, [open]);

  const handleClose = () => {
    if (isReducedMotion() || !overlayRef.current) {
      onClose();
      return;
    }
    gsap.to(overlayRef.current, {
      opacity: 0,
      y: -15,
      duration: 0.2,
      ease: "power2.in",
      onComplete: onClose,
    });
  };

  const filteredProducts: VariantProduct[] = query.trim()
    ? VARIANT_PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase()) ||
          p.fabric.toLowerCase().includes(query.toLowerCase()),
      )
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/products?search=${encodeURIComponent(query.trim())}`);
    handleClose();
  };

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[80] flex flex-col bg-[var(--vault-canvas)]/98 backdrop-blur-xl"
    >
      {/* Top bar */}
      <div className="border-b border-[var(--vault-line)] px-6 py-6 sm:px-12">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--vault-accent)]">
            Vault Vogue Search Architecture
          </span>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close search overlay"
            className="flex h-10 w-10 items-center justify-center border border-[var(--vault-line)] text-[var(--vault-ink)] transition hover:border-[var(--vault-accent)] hover:text-[var(--vault-accent)]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Input box */}
        <form onSubmit={handleSearchSubmit} className="mx-auto mt-6 max-w-[960px]">
          <div className="relative flex items-center border-b-2 border-[var(--vault-ink)] pb-3">
            <Search size={26} className="text-[var(--vault-muted)] mr-4" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="SEARCH PIECES, SILHOUETTES, FABRICS..."
              className="w-full bg-transparent font-serif text-2xl uppercase tracking-tight text-[var(--vault-ink)] placeholder:text-[var(--vault-muted)] focus:outline-none sm:text-4xl"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="text-xs font-mono uppercase tracking-widest text-[var(--vault-muted)] hover:text-[var(--vault-ink)] px-2"
              >
                Clear
              </button>
            )}
          </div>
        </form>

        {/* Quick Suggestions / Popular Searches */}
        <div className="mx-auto mt-6 flex max-w-[960px] flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-[var(--vault-muted)] mr-2">
            <TrendingUp size={12} className="text-[var(--vault-cobalt)]" /> Popular:
          </span>
          {POPULAR_SEARCHES.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setQuery(item)}
              className="border border-[var(--vault-line)] bg-[var(--vault-panel)] px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-[var(--vault-ink)] transition hover:border-[var(--vault-accent)] hover:text-[var(--vault-accent)]"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Results Container */}
      <div className="flex-1 overflow-y-auto px-6 py-8 sm:px-12">
        <div className="mx-auto max-w-[1440px]">
          {query.trim() ? (
            <div>
              <div className="mb-6 flex items-center justify-between border-b border-[var(--vault-line)] pb-3 font-mono text-[10px] uppercase tracking-widest text-[var(--vault-muted)]">
                <span>
                  Found {filteredProducts.length} Results for &ldquo;{query}&rdquo;
                </span>
                <span className="text-[var(--vault-cobalt)]">Instant Indexing</span>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="py-20 text-center">
                  <p className="text-xl font-light">No archive pieces matching &ldquo;{query}&rdquo;</p>
                  <p className="mt-2 text-xs text-[var(--vault-muted)]">
                    Try searching for &quot;Trench&quot;, &quot;Blazer&quot;, &quot;Outerwear&quot; or browse all collections.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {filteredProducts.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      onClick={handleClose}
                      className="group border border-[var(--vault-line)] bg-[var(--vault-panel)] p-4 transition hover:border-[var(--vault-accent)]"
                    >
                      <div className="relative aspect-[3/4] w-full overflow-hidden bg-black/5">
                        <Image
                          src={product.colors[0]?.image || ""}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 100vw, 25vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="mt-3">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--vault-muted)]">
                          {product.code} · {product.category}
                        </span>
                        <h4 className="mt-1 font-medium text-sm text-[var(--vault-ink)] group-hover:text-[var(--vault-accent)] transition-colors">
                          {product.name}
                        </h4>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="font-mono text-xs font-semibold text-[var(--vault-ink)]">
                            {formatCurrency(product.price, "INR")}
                          </span>
                          <span className="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-[var(--vault-cobalt)]">
                            View <ArrowUpRight size={12} />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="py-12">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--vault-accent)] mb-6">
                Curated Categories To Explore
              </h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
                {[
                  { name: "Oversized Tees", href: "/#categories" },
                  { name: "Tailored Trousers", href: "/#categories" },
                  { name: "Outerwear", href: "/#categories" },
                  { name: "Knitwear", href: "/#categories" },
                  { name: "Accessories", href: "/#categories" },
                ].map((cat) => (
                  <Link
                    key={cat.name}
                    href={cat.href}
                    onClick={handleClose}
                    className="flex flex-col items-center justify-center border border-[var(--vault-line)] bg-[var(--vault-panel)] p-6 text-center transition hover:border-[var(--vault-accent)]"
                  >
                    <span className="font-serif text-lg">{cat.name}</span>
                    <span className="mt-2 font-mono text-[9px] uppercase tracking-widest text-[var(--vault-cobalt)]">
                      Explore →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

