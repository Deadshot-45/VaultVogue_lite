"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ArrowLeft, Plus, Check } from "lucide-react";
import { useStorefront } from "../context/storefront-context";
import { useVariantSelection } from "../hooks/use-variant-selection";
import { formatCurrency, buildSku } from "../lib/variant-utils";
import type { VariantProduct, VariantSize } from "../types/variant";
import { VariantImageStage } from "./variant-image-stage";
import { VariantPicker } from "./variant-picker";
import { isReducedMotion } from "@/lib/animations/gsap-utils";

export function ProductDetailClient({ product }: { product: VariantProduct }) {
  const { color, size, replaceVariant } = useVariantSelection(product);
  const { addToCart } = useStorefront();
  const [added, setAdded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const available = color.stockBySize[size] > 0;

  useEffect(() => {
    if (product?.name) {
      document.title = `${product.name} | Vault Vogue`;
    }
  }, [product?.name]);

  useEffect(() => {
    if (isReducedMotion() || !containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const addSelectedVariant = () => {
    if (!addToCart(product, color, size)) return;
    setAdded(true);
    if (buttonRef.current && !isReducedMotion()) {
      gsap.fromTo(
        buttonRef.current,
        { scale: 0.96 },
        { scale: 1, duration: 0.35, ease: "back.out(2)" },
      );
    }
    window.setTimeout(() => setAdded(false), 1800);
  };

  return (
    <main ref={containerRef} className="mx-auto max-w-[1440px] px-4 py-7 sm:px-8 sm:py-12">
      <Link href="/#collection" className="mb-7 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-[var(--vault-muted)] transition hover:text-[var(--vault-ink)]">
        <ArrowLeft size={14} /> Back to collection
      </Link>
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
        <VariantImageStage product={product} color={color} size={size} />
        <section className="flex flex-col justify-center py-2 lg:py-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--vault-accent)]">
            {product.code} / {product.category} / {product.leadTime}
          </p>
          <h1 className="mt-4 text-4xl font-light uppercase leading-[1.05] sm:text-6xl">{product.name}</h1>
          <p className="mt-5 font-mono text-lg">{formatCurrency(product.price, "USD")}</p>
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-[var(--vault-muted)]">{product.description}</p>

          <div className="my-8 border-y border-[var(--vault-line)] py-7">
            <VariantPicker
              product={product}
              color={color}
              size={size}
              onColorChange={(colorId) => replaceVariant({ colorId })}
              onSizeChange={(nextSize: VariantSize) => replaceVariant({ size: nextSize })}
            />
          </div>

          <div className="mb-5 grid grid-cols-2 gap-4 font-mono text-[10px] uppercase tracking-wider">
            <div className="border border-[var(--vault-line)] p-3">
              <span className="block text-[var(--vault-muted)]">SKU</span>
              <span className="mt-1 block" aria-live="polite">{buildSku(product, color, size)}</span>
            </div>
            <div className="border border-[var(--vault-line)] p-3">
              <span className="block text-[var(--vault-muted)]">Material</span>
              <span className="mt-1 block">{product.fabric}</span>
            </div>
          </div>
          <button
            ref={buttonRef}
            type="button"
            disabled={!available}
            onClick={addSelectedVariant}
            className="flex min-h-14 w-full items-center justify-center gap-2 bg-[var(--vault-accent)] px-5 font-mono text-xs font-bold uppercase tracking-[0.16em] text-[var(--vault-accent-ink)] transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {added ? (
              <>
                <Check size={16} /> Added to bag
              </>
            ) : available ? (
              <>
                <Plus size={16} /> Add selected variant to bag
              </>
            ) : (
              "Unavailable in selected size"
            )}
          </button>
        </section>
      </div>
    </main>
  );
}

