"use client";

import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import type { VariantColor, VariantProduct, VariantSize } from "@/features/storefront/types/variant";
import { isReducedMotion } from "@/lib/animations/gsap-utils";
import { ProductGallery } from "./ProductGallery";
import { ProductInfo } from "./ProductInfo";
import { ProductReviews } from "./ProductReviews";
import { RelatedProducts } from "./RelatedProducts";
import { RecentlyViewedProducts } from "./RecentlyViewedProducts";

interface ProductDetailPageProps {
  product: VariantProduct;
}

export function ProductDetailPage({ product }: ProductDetailPageProps) {
  // State for active variant selection
  const defaultColor: VariantColor =
    product.colors && product.colors.length > 0
      ? product.colors[0]
      : {
          id: "default",
          name: "Classic Obsidian",
          code: "BLK",
          hex: "#080B12",
          pantone: "PMS 19-4005",
          image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85",
          stockBySize: { XS: 5, S: 8, M: 12, L: 6, XL: 2 },
        };

  const [selectedColorId, setSelectedColorId] = useState<string>(defaultColor.id);
  const [selectedSize, setSelectedSize] = useState<VariantSize>("M");

  const selectedColor: VariantColor =
    product.colors.find((c) => c.id === selectedColorId) || defaultColor;

  const pageRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  // Dynamic document title
  useEffect(() => {
    if (product.name) {
      document.title = `${product.name} | VAULT VOGUE Atelier`;
    }
  }, [product.name]);

  // GSAP Coordinated Entrance Animation
  useEffect(() => {
    if (isReducedMotion() || !pageRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (galleryRef.current && infoRef.current) {
        tl.fromTo(
          galleryRef.current,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.7, clearProps: "transform" },
        ).fromTo(
          infoRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.65, clearProps: "transform" },
          "-=0.4",
        );
      }
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const handleReviewsClick = () => {
    const el = document.getElementById("reviews-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main ref={pageRef} className="mx-auto max-w-[1440px] px-4 py-6 sm:px-8 sm:py-10">
      {/* ── TWO COLUMN DESKTOP PDP LAYOUT ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-14 items-start">
        {/* Left Column: Sticky Product Image Gallery */}
        <div ref={galleryRef} className="w-full lg:sticky lg:top-24 self-start">
          <ProductGallery
            gallery={product.gallery || []}
            productName={product.name}
            activeColorImage={selectedColor.image}
            activeColorName={selectedColor.name}
          />
        </div>

        {/* Right Column: Product Information & Purchase Panel */}
        <div ref={infoRef} className="w-full">
          <ProductInfo
            product={product}
            selectedColor={selectedColor}
            onSelectColor={setSelectedColorId}
            selectedSize={selectedSize}
            onSelectSize={setSelectedSize}
            onReviewsClick={handleReviewsClick}
          />
        </div>
      </div>

      {/* ── LOWER EDITORIAL SECTIONS ── */}
      <div className="mt-10 sm:mt-14 space-y-12 sm:space-y-16">
        {/* Customer Reviews & Feedback */}
        <ProductReviews
          rating={product.rating || 4.9}
          reviewsCount={product.reviewsCount || 42}
        />

        {/* You May Also Like / Complementary Silhouettes */}
        <RelatedProducts
          currentProductId={product.id}
          category={product.category}
        />

        {/* Recently Inspected Garments */}
        <RecentlyViewedProducts currentProduct={product} />
      </div>
    </main>
  );
}
