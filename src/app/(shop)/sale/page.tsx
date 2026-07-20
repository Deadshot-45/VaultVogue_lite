"use client";

import { motion } from "framer-motion";
import ProductCardComponent from "@/features/products/components/product-card";
import { useGetProducts } from "@/lib/queries/useGetProducts";
import { useRouter } from "next/navigation";
import { ProductCardSkeletonGrid } from "@/features/products/components/product-card-skeleton";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function Page() {
  const router = useRouter();

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } = useGetProducts({
    isSale: true,
    label: "sale",
    limit: 12,
  });

  const products = data?.pages.flatMap((page) => page) || [];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 text-center">
        {/* Editorial Heading */}
        <div className="mx-auto max-w-4xl px-4">
          <p className="section-label inline-block">The Private Archive</p>
          <div className="gold-divider mx-auto mt-4" />
          <h1 className="mt-8 font-cormorant text-5xl font-light tracking-tight text-[var(--brand-text)] md:text-7xl">
            Seasonal picks with <br />
            <span className="italic font-normal text-[var(--gold)]">Maison Special</span> pricing
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-xs leading-relaxed text-muted-foreground">
            Explore a curated selection of archival pieces and seasonal favorites, 
            offering restrained luxury at an exceptional value for our members.
          </p>
          <button
            onClick={() => router.push("/women")}
            className="btn-primary mt-10"
          >
            Explore the Collection
          </button>
        </div>

        {/* Decorative background orb */}
        <div 
          className="pointer-events-none absolute left-1/2 top-0 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px] opacity-10 bg-[var(--gold)]"
        />
      </section>

      {/* Product List */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        {isLoading ? (
          <ProductCardSkeletonGrid count={6} columns="grid-cols-2 md:grid-cols-3" />
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-80 text-center space-y-4">
            <h3 className="text-lg font-semibold">No archival creations found</h3>
            <p className="text-xs text-muted-foreground max-w-xs">
              Check back soon for new seasonal edits in our private archive.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
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
                  className="rounded-full px-8 transition-all duration-200 active:scale-95 cursor-pointer"
                  style={{ borderColor: "var(--gold-soft)" }}
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                >
                  {isFetchingNextPage ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {isFetchingNextPage ? "Loading..." : "Load More"}
                </Button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Footer Banner */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div 
          className="relative overflow-hidden rounded-[2.5rem] p-12 text-center text-white sm:p-20 bg-gradient-to-tr from-[var(--gold)] via-[var(--brand-text)] to-[var(--brand-text)] shadow-2xl"
        >
          <div className="relative z-10 max-w-xl mx-auto space-y-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--gold)]">
              Maison Archivist
            </span>
            <h2 className="font-cormorant text-4xl font-light sm:text-5xl">Refresh Your Wardrobe</h2>
            <p className="text-xs opacity-90 leading-relaxed max-w-sm mx-auto">
              Build your next look with marked-down essentials from across our collections before the selection rotates.
            </p>
            <button 
              onClick={() => router.push("/women")}
              className="rounded-full bg-white px-8 py-3.5 text-xs font-semibold uppercase tracking-wider text-[var(--brand-text)] transition-transform hover:scale-[1.02] active:scale-98 cursor-pointer"
            >
              Explore All Offers
            </button>
          </div>
          
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "24px 24px" }} />
        </div>
      </section>
    </div>
  );
}
