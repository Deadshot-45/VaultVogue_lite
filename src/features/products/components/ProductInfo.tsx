"use client";

import Link from "next/link";
import { useState } from "react";
import type { VariantColor, VariantProduct, VariantSize } from "@/features/storefront/types/variant";
import { ProductPrice } from "./ProductPrice";
import { ProductColorSelector } from "./ProductColorSelector";
import { ProductSizeSelector } from "./ProductSizeSelector";
import { ProductQuantitySelector } from "./ProductQuantitySelector";
import { ProductPurchaseActions } from "./ProductPurchaseActions";
import { ProductDetailsAccordion } from "./ProductDetailsAccordion";

interface ProductInfoProps {
  product: VariantProduct;
  selectedColor: VariantColor;
  onSelectColor: (colorId: string) => void;
  selectedSize: VariantSize;
  onSelectSize: (size: VariantSize) => void;
  onReviewsClick?: () => void;
}

export function ProductInfo({
  product,
  selectedColor,
  onSelectColor,
  selectedSize,
  onSelectSize,
  onReviewsClick,
}: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  // Quantity is only meaningful when the chosen silhouette can be added to bag.
  const isAvailable = (selectedColor.stockBySize[selectedSize] ?? 0) > 0;

  const handleAddToCartSuccess = () => {
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2200);
  };

  const maxStock =
    selectedColor.stockBySize?.[selectedSize] ??
    product.variants?.find(
      (v) =>
        v.size === selectedSize &&
        (!v.color || v.color.toLowerCase() === selectedColor.name.toLowerCase()),
    )?.stock ??
    product.variants?.find((v) => v.size === selectedSize)?.stock ??
    10;

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* ── BREADCRUMBS ── */}
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-(--vault-muted)">
        <Link href="/" className="hover:text-(--vault-ink) transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-(--vault-ink) transition-colors">
          Catalog
        </Link>
        <span>/</span>
        <Link
          href={`/products?category=${encodeURIComponent(product.category)}`}
          className="hover:text-(--vault-ink) transition-colors"
        >
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-(--vault-ink) truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* ── PRODUCT TITLE & HEADER ── */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-(--vault-accent)">
          <span>{product.code}</span>
          <span>·</span>
          <span>{product.category}</span>
          <span>·</span>
          <span>{product.leadTime}</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light uppercase tracking-tight text-(--vault-ink)">
          {product.name}
        </h1>
      </div>

      {/* ── PRICE & RATINGS ── */}
      <ProductPrice
        price={product.price}
        originalPrice={product.originalPrice}
        currency="INR"
        rating={product.rating || 4.9}
        reviewsCount={product.reviewsCount || 42}
        onReviewsClick={onReviewsClick}
      />

      {/* ── EDITORIAL DESCRIPTION ── */}
      <p className="max-w-xl font-mono text-xs sm:text-sm leading-relaxed text-(--vault-muted)">
        {product.description}
      </p>

      {/* ── VARIANT SELECTORS (Color & Size) ── */}
      <div className="space-y-6 border-y border-(--vault-line) py-6">
        <ProductColorSelector
          colors={product.colors}
          selectedColor={selectedColor}
          onSelectColor={onSelectColor}
        />

        <ProductSizeSelector
          availability={true}
          color={selectedColor}
          selectedSize={selectedSize}
          onSelectSize={onSelectSize}
          measurements={product.measurements}
          variants={product.variants}
          availableSizes={product.availableSizes}
        />

        {isAvailable || justAdded ? (
          <ProductQuantitySelector
            quantity={quantity}
            maxStock={Math.max(1, maxStock)}
            onChange={setQuantity}
          />
        ) : null}
      </div>

      {/* ── PURCHASE ACTIONS (Add to Bag, Wishlist, Pincode) ── */}
      <ProductPurchaseActions
        product={product}
        color={selectedColor}
        size={selectedSize}
        quantity={quantity}
        onAddToCartSuccess={handleAddToCartSuccess}
      />

      {/* ── PRODUCT SPECIFICATIONS & DETAILS ACCORDION ── */}
      <div>
        <ProductDetailsAccordion product={product} />
      </div>
    </div>
  );
}
