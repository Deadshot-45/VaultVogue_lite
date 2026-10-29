"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Loader2,
  ArrowRight,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import ProductCardComponent from "@/features/products/components/product-card";
import { useGetProducts } from "@/lib/queries/useGetProducts";
import { ProductCardSkeletonGrid } from "@/features/products/components/product-card-skeleton";
import { Button } from "@/components/ui/button";

export default function SalePage() {
  const router = useRouter();

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useGetProducts({
      isSale: true,
      label: "sale",
      limit: 12,
    });

  const products = data?.pages.flatMap((page) => page) || [];

  return (
    <div className="min-h-screen bg-[var(--vault-bg)] text-[var(--vault-ink)] transition-colors duration-300">
      {/* Breadcrumb Navigation */}
      <div className="w-full border-b border-[var(--vault-line)] bg-[var(--vault-panel)]/60 py-3 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[var(--vault-muted)]"
          >
            <Link
              href="/"
              className="hover:text-[var(--vault-accent)] transition-colors"
            >
              Vault Vogue
            </Link>
            <ChevronRight size={10} className="text-[var(--vault-line)]" />
            <Link
              href="/products"
              className="hover:text-[var(--vault-accent)] transition-colors"
            >
              Catalog
            </Link>
            <ChevronRight size={10} className="text-[var(--vault-line)]" />
            <span className="text-[var(--vault-accent)] font-semibold">
              Private Archive &amp; Seasonal Sale
            </span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 text-center border-b border-[var(--vault-line)] bg-[var(--vault-panel)]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="flex items-center justify-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--vault-accent)] animate-pulse" />
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--vault-accent)]">
              THE PRIVATE ARCHIVE · EDITIONS ROTATION
            </p>
          </div>

          <div className="mx-auto my-4 h-px w-12 bg-[var(--vault-accent)]/40" />

          <h1 className="mt-4 font-serif text-4xl sm:text-6xl font-light uppercase tracking-tight text-[var(--vault-ink)] leading-none">
            Seasonal Picks with <br />
            <span className="italic text-[var(--vault-accent)]">
              Maison Special
            </span>{" "}
            Pricing.
          </h1>

          <p className="mx-auto mt-6 max-w-xl font-sans text-xs sm:text-sm leading-relaxed text-[var(--vault-muted)]">
            Explore a curated selection of archival pieces and seasonal
            favorites, offering restrained luxury at an exceptional value for
            our collectors.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={() => router.push("/products?badge=sale")}
              className="btn-primary inline-flex items-center gap-2 px-8 py-3.5 font-mono text-xs uppercase tracking-widest font-bold cursor-pointer"
            >
              Explore Archive Pieces <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Product List */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {isLoading ? (
          <ProductCardSkeletonGrid
            count={6}
            columns="grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          />
        ) : products.length === 0 ? (
          <div className="mx-auto my-12 max-w-md border border-[var(--vault-line)] bg-[var(--vault-panel)] p-8 text-center space-y-3">
            <AlertCircle
              size={28}
              className="mx-auto text-[var(--vault-accent)]"
            />
            <h3 className="font-serif text-xl uppercase tracking-tight text-[var(--vault-ink)]">
              No Archival Creations Marked Down
            </h3>
            <p className="font-sans text-xs text-[var(--vault-muted)]">
              All seasonal editions are currently reserved. Discover the primary
              collection across our catalog.
            </p>
            <Link
              href="/products"
              className="btn-primary inline-block px-6 py-2.5 font-mono text-xs uppercase tracking-wider font-bold mt-4"
            >
              Browse All Products
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                >
                  <ProductCardComponent product={p} />
                </motion.div>
              ))}
            </div>

            {hasNextPage && (
              <div className="mt-12 text-center">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-none border border-[var(--vault-line)] bg-[var(--vault-panel)] px-8 font-mono text-xs uppercase tracking-wider text-[var(--vault-ink)] hover:border-[var(--vault-accent)] transition-all cursor-pointer"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                >
                  {isFetchingNextPage ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin text-[var(--vault-accent)]" />
                  ) : null}
                  {isFetchingNextPage
                    ? "Loading Archive..."
                    : "Load More Pieces"}
                </Button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Footer Banner */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="border border-[var(--vault-line)] bg-[var(--vault-panel)] p-8 sm:p-14 text-center shadow-lg">
          <div className="relative z-10 max-w-xl mx-auto space-y-4">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--vault-accent)] flex items-center justify-center gap-1.5">
              MAISON ARCHIVIST
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-light uppercase tracking-tight text-[var(--vault-ink)]">
              Refresh Your Silhouette
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[var(--vault-muted)] leading-relaxed max-w-sm mx-auto">
              Build your next look with marked-down essentials from across our
              collections before the selection rotates.
            </p>
            <div className="pt-2">
              <Link
                href="/products?badge=sale"
                className="btn-primary inline-flex items-center gap-2 px-8 py-3.5 font-mono text-xs uppercase tracking-widest font-bold"
              >
                Explore All Offers <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
