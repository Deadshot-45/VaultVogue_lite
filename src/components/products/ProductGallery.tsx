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

  console.log(gallery);

  return (
    <div className="space-y-4">
      <div className="relative aspect-4/5 rounded-3xl overflow-hidden">
        <Image
          src={active}
          alt={productName}
          fill
          priority
          unoptimized
          className="object-cover"
        />
      </div>

      <div className="flex gap-2">
        {gallery.map((img, i) => (
          <button key={i} onClick={() => setActive(img)}>
            <img src={img} className="h-16 w-16 rounded-lg" />
          </button>
        ))}
      </div>
    </div>
  );
};
