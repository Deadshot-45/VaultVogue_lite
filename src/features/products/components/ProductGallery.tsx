"use client";

import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { resolveUiProductImage } from "@/lib/utility/utils";

interface ProductGalleryProps {
  gallery: string[];
  productName: string;
  activeColorImage?: string;
  activeColorName?: string;
}

export function ProductGallery({
  gallery = [],
  productName,
  activeColorImage,
  activeColorName,
}: ProductGalleryProps) {
  // Use real images: activeColorImage, then gallery images.
  const displayImages = (() => {
    const rawList: string[] = [];
    if (activeColorImage) rawList.push(activeColorImage);
    gallery.forEach((url) => {
      if (url && !rawList.includes(url)) rawList.push(url);
    });

    if (rawList.length === 0) {
      rawList.push(
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=85",
      );
    }

    return rawList;
  })();

  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const mainImageContainerRef = useRef<HTMLDivElement>(null);

  // If activeColorImage changes from variant selector, automatically switch to image 0
  useEffect(() => {
    setActiveIndex(0);
  }, [activeColorImage]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  }, [displayImages.length]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  }, [displayImages.length]);

  // Keyboard navigation for carousel & lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Escape" && isLightboxOpen) setIsLightboxOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrev, handleNext, isLightboxOpen]);

  // Desktop hover zoom lens tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mainImageContainerRef.current) return;
    const rect = mainImageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const currentImage = displayImages[activeIndex] || displayImages[0];

  return (
    <div className="flex flex-col-reverse gap-4 lg:flex-row lg:gap-6">
      {/* ── THUMBNAILS LIST (Horizontal on mobile, Vertical on desktop) ── */}
      <div
        role="tablist"
        aria-label="Product image thumbnails"
        className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto no-scrollbar py-1 lg:max-h-[calc(100vh-8rem)] shrink-0"
      >
        {displayImages.map((imgSrc, idx) => {
          const isSelected = activeIndex === idx;
          return (
            <button
              key={`${imgSrc}-${idx}`}
              type="button"
              role="tab"
              aria-selected={isSelected}
              aria-label={`View photo ${idx + 1} of ${displayImages.length}`}
              onClick={() => setActiveIndex(idx)}
              className={`group relative h-20 w-16 sm:h-24 sm:w-20 shrink-0 overflow-hidden border transition-all duration-200 cursor-pointer ${
                isSelected
                  ? "border-[var(--vault-accent)] ring-1 ring-[var(--vault-accent)] opacity-100 shadow-md"
                  : "border-[var(--vault-line)] opacity-60 hover:opacity-100 hover:border-[var(--vault-accent)]/50"
              }`}
            >
              <Image
                src={resolveUiProductImage(imgSrc, 160)}
                alt={`${productName} thumbnail ${idx + 1}`}
                fill
                sizes="80px"
                loading="lazy"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <span className="absolute bottom-1 right-1 bg-black/60 px-1 font-mono text-[8px] text-white">
                0{idx + 1}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── MAIN IMAGE HERO CONTAINER ── */}
      <div className="relative flex-1">
        <div
          ref={mainImageContainerRef}
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
          onClick={() => setIsLightboxOpen(true)}
          className="relative aspect-[3/4] max-h-[calc(100vh-8rem)] w-full overflow-hidden border border-[var(--vault-line)] bg-[var(--vault-panel)] cursor-zoom-in"
        >
          {/* Main Visual with Pan & Zoom on Hover */}
          <div
            className="h-full w-full transition-transform duration-200 ease-out will-change-transform"
            style={{
              transform: isZoomed ? "scale(1.4)" : "scale(1)",
              transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
            }}
          >
            <Image
              src={resolveUiProductImage(currentImage, 1200)}
              alt={`${productName} - Silhouette View ${activeIndex + 1}`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover transition-opacity duration-300"
            />
          </div>

          {/* Watermark / Brand Badge */}
          <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 bg-[var(--vault-canvas)]/80 px-2.5 py-1 backdrop-blur-md border border-[var(--vault-line)]">
            <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--vault-accent)]">
              OWN YOUR EDGE
            </span>
            {activeColorName && (
              <>
                <span className="text-[var(--vault-line)]">|</span>
                <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--vault-ink)]">
                  {activeColorName}
                </span>
              </>
            )}
          </div>

          {/* Image Counter Badge */}
          <div className="pointer-events-none absolute right-4 top-4 bg-[var(--vault-canvas)]/80 px-2.5 py-1 backdrop-blur-md border border-[var(--vault-line)] font-mono text-[9px] uppercase tracking-widest text-[var(--vault-ink)]">
            0{activeIndex + 1} / 0{displayImages.length}
          </div>

          {/* Zoom In Tooltip (desktop indicator) */}
          <div className="pointer-events-none absolute bottom-4 right-4 hidden items-center gap-1.5 bg-black/75 px-3 py-1.5 text-white backdrop-blur-md sm:flex font-mono text-[9px] uppercase tracking-wider opacity-80 group-hover:opacity-100">
            <ZoomIn size={12} className="text-[var(--vault-accent)]" /> Click to Expand Lightbox
          </div>

          {/* Prev / Next Controls on Image */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            aria-label="Previous image"
            className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center bg-[var(--vault-canvas)]/85 text-[var(--vault-ink)] backdrop-blur-md border border-[var(--vault-line)] transition hover:bg-[var(--vault-accent)] hover:text-white cursor-pointer"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            aria-label="Next image"
            className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center bg-[var(--vault-canvas)]/85 text-[var(--vault-ink)] backdrop-blur-md border border-[var(--vault-line)] transition hover:bg-[var(--vault-accent)] hover:text-white cursor-pointer"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* ── FULLSCREEN LIGHTBOX MODAL ── */}
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${productName} image viewer`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-xl animate-in fade-in duration-200"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            aria-label="Close image lightbox"
            className="absolute right-6 top-6 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-[var(--vault-accent)] hover:text-white cursor-pointer"
          >
            <X size={20} />
          </button>

          {/* Navigation Controls in Lightbox */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous lightbox photo"
            className="absolute left-6 top-1/2 -translate-y-1/2 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-[var(--vault-accent)] cursor-pointer"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next lightbox photo"
            className="absolute right-6 top-1/2 -translate-y-1/2 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-[var(--vault-accent)] cursor-pointer"
          >
            <ChevronRight size={24} />
          </button>

          {/* Main Lightbox Image Stage */}
          <div className="relative h-[85vh] w-[90vw] max-w-5xl">
            <Image
              src={resolveUiProductImage(currentImage, 1600)}
              alt={`${productName} fullscreen view ${activeIndex + 1}`}
              fill
              className="object-contain"
              sizes="90vw"
              priority
            />
          </div>

          {/* Bottom Lightbox Controls & Counter */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/60 px-5 py-2.5 rounded-full backdrop-blur-md border border-white/20 text-white font-mono text-xs uppercase tracking-widest">
            <span>{productName}</span>
            <span>·</span>
            <span>0{activeIndex + 1} of 0{displayImages.length}</span>
          </div>
        </div>
      )}
    </div>
  );
}
