"use client";

import { useMemo, useState, useCallback } from "react";
import { ProductGallery } from "./ProductGallery";
import { SizeSelector } from "./SizeSelector";
import { AddToCartSection } from "./AddToCartSection";
import { Reviews } from "./Reviews";
import { resolveProductImage } from "@/lib/utility/utils";
import { ShieldCheck, Truck, ArrowLeft, Tag } from "lucide-react";
import Link from "next/link";

import { ProductDetail, ProductVariant } from "@/lib/utility/productVariant";

const FALLBACK_IMAGE =
  "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 700'%3E%3Crect width='600' height='700' fill='%23f5f0ea'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle' fill='%238a6a42' font-family='Arial, sans-serif' font-size='20'%3EAtelier Piece%3C/text%3E%3C/svg%3E";

export default function ProductDetailsView({
  product,
  suggestionsSection,
}: {
  product: ProductDetail;
  suggestionsSection: React.ReactNode;
}) {
  const [selectedSize, setSelectedSize] = useState<string | null>(() => {
    const variants = product.variants ?? [];
    const mediumVariant = variants.find(
      (variant) =>
        variant.attributes?.size === "M" &&
        !variant.isOutOfStock &&
        variant.availableStock > 0,
    );
    const firstAvailableVariant = variants.find(
      (variant) => !variant.isOutOfStock && variant.availableStock > 0,
    );

    return mediumVariant?.attributes.size ?? firstAvailableVariant?.attributes.size ?? null;
  });

  console.log("Single Product : ", product);

  // O(1) variant lookup
  const variantMap = useMemo(() => {
    const map: Record<string, ProductVariant> = {};
    for (const v of product.variants ?? []) {
      if (v.attributes?.size) {
        map[v.attributes.size] = v;
      }
    }
    return map;
  }, [product.variants]);

  const sizes = useMemo(() => {
    return (product.variants ?? []).map((v) => ({
      size: v.attributes.size,
      variantId: v.variantId,
      stock: v.availableStock ?? v.stock,
    }));
  }, [product.variants]);

  const stockMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const v of product.variants ?? []) {
      if (v.attributes?.size) {
        map[v.attributes.size] = Number(v.availableStock ?? v.stock ?? 0);
      }
    }
    return map;
  }, [product.variants]);

  const selectedVariant: ProductVariant | undefined = selectedSize
    ? variantMap[selectedSize]
    : undefined;

  const gallery = useMemo(() => {
    return product.images?.length
      ? product.images.map((img) => resolveProductImage(img as string))
      : [FALLBACK_IMAGE];
  }, [product.images]);

  const handleSizeSelect = useCallback((size: string) => {
    setSelectedSize(size);
  }, []);

  const displayedPrice = selectedVariant?.price ?? product.price;
  const displayedOriginalPrice =
    selectedVariant?.compareAtPrice ?? product.originalPrice;
  const hasDiscount =
    displayedOriginalPrice && displayedOriginalPrice > displayedPrice;

  const discountPct = hasDiscount
    ? Math.round(
        ((displayedOriginalPrice! - displayedPrice) / displayedOriginalPrice!) *
          100,
      )
    : 0;

  return (
    <section className="mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 bg-[var(--background)]">
      {/* Breadcrumb nav */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:text-[var(--gold)] transition-colors duration-200"
          aria-label="Back to catalog"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Catalog</span>
        </Link>
      </div>

      <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr_340px] items-start">
        {/* ── LEFT — IMAGE GALLERY ────────────────────────────── */}
        <ProductGallery gallery={gallery} productName={product.name} />

        {/* ── CENTER — PRODUCT INFO ───────────────────────────── */}
        <div className="space-y-7">
          {/* Category + Name */}
          <div className="space-y-3">
            <span className="section-label">{product.category}</span>

            <h1 className="font-cormorant font-light text-4xl leading-snug lg:text-5xl text-[var(--brand-text)]">
              {product.name}
            </h1>

            <div className="gold-divider" />

            {/* Seller attribution */}
            <p className="text-sm text-muted-foreground">
              Curated by{" "}
              <span className="font-semibold text-[var(--brand-text)]">
                {product.sellerName || "StyleHub Maison"}
              </span>
            </p>
          </div>

          {/* Description — bumped to text-sm, generous line-height */}
          <p className="text-sm leading-7 text-muted-foreground max-w-prose">
            {product.description ||
              "A curated piece featuring natural structures, exquisite materials, and timeless design."}
          </p>

          {/* Pricing — USD */}
          <div className="flex items-baseline gap-3 pt-1">
            <p className="text-3xl font-bold tracking-tight text-[var(--gold)]">
              ₹{displayedPrice.toFixed(2)}
            </p>

            {hasDiscount && (
              <>
                <p className="text-base line-through text-muted-foreground/60">
                  ₹{displayedOriginalPrice!.toFixed(2)}
                </p>
                <span className="inline-flex items-center gap-1 rounded-full bg-[var(--gold-glow)] px-2.5 py-0.5 text-xs font-bold text-[var(--gold)] border border-[var(--gold-faint)]">
                  <Tag className="h-3 w-3" />
                  {discountPct}% off
                </span>
              </>
            )}
          </div>

          {/* Size Selector */}
          <SizeSelector
            sizes={sizes}
            selectedSize={selectedSize}
            onSelect={handleSizeSelect}
            stockMap={stockMap}
          />

          {/* Commitment badges */}
          <div className="flex flex-col sm:flex-row gap-4 pt-5 border-t border-border/20">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--gold-glow)] border border-[var(--gold-faint)]">
                <Truck
                  className="h-4 w-4 text-[var(--gold)]"
                  aria-hidden="true"
                />
              </div>
              <span className="text-xs font-medium text-foreground">
                Complimentary Atelier Delivery
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--gold-glow)] border border-[var(--gold-faint)]">
                <ShieldCheck
                  className="h-4 w-4 text-[var(--gold)]"
                  aria-hidden="true"
                />
              </div>
              <span className="text-xs font-medium text-foreground">
                Secure Encrypted Checkout
              </span>
            </div>
          </div>
        </div>

        {/* ── RIGHT — STICKY BUY BOX ──────────────────────────── */}
        <div className="relative">
          <div className="sticky top-28 space-y-6 rounded-2xl border border-[var(--gold-soft)] bg-card/45 backdrop-blur-md p-6 shadow-xl">
            {/* Summary price row */}
            <div className="space-y-0.5 pb-4 border-b border-border/20">
              <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                Total Value
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <p className="text-2xl font-bold text-[var(--gold)]">
                  ₹{displayedPrice.toFixed(2)}
                </p>
                {hasDiscount && (
                  <p className="text-sm line-through text-muted-foreground/60">
                    ₹{displayedOriginalPrice!.toFixed(2)}
                  </p>
                )}
              </div>
              {selectedSize && (
                <p className="text-xs text-muted-foreground mt-1">
                  Size:{" "}
                  <span className="font-semibold text-foreground">
                    {selectedSize}
                  </span>
                </p>
              )}
            </div>

            <AddToCartSection
              product={product}
              selectedVariant={selectedVariant}
            />
          </div>
        </div>
      </div>

      {/* REVIEWS */}
      <Reviews />

      {/* RECOMMENDED SUGGESTIONS */}
      {suggestionsSection}
    </section>
  );
}
