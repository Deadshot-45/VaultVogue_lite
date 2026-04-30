"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

export const ProductGallery = ({
  gallery,
  productName,
}: {
  gallery: string[];
  productName: string;
}) => {
  const [active, setActive] = useState(gallery[0]);

  useEffect(() => {
    setActive(gallery[0]);
  }, [gallery]);

  // 🔥 preload images
  useEffect(() => {
    gallery.slice(1).forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, [gallery]);

  return (
    <div className="space-y-6">
      {/* Main Image */}
      <div className="relative aspect-4/5 rounded-3xl overflow-hidden bg-muted/20 border shadow-sm">
        <Image
          key={active} // forces re-render for basic fade, but we can also do css transitions
          src={active}
          alt={productName}
          fill
          priority
          unoptimized
          className="object-cover transition-opacity duration-500 ease-in-out animate-in fade-in zoom-in-95"
        />
      </div>

      {/* Thumbnails */}
      <div className="flex gap-3 p-1 overflow-x-auto pb-2 no-scrollbar">
        {gallery.map((img, i) => {
          const isActive = active === img;
          return (
            <button
              key={i}
              onClick={() => setActive(img)}
              className={`relative h-20 w-16 shrink-0 rounded-xl overflow-hidden transition-all duration-200 ease-out ${
                isActive
                  ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-100"
                  : "opacity-70 hover:opacity-100 hover:scale-105 border border-transparent"
              }`}
            >
              <img src={img} className="h-full w-full object-cover" alt="thumbnail" />
            </button>
          );
        })}
      </div>
    </div>
  );
};
