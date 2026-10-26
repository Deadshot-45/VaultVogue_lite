"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useTextScramble } from "../hooks/use-text-scramble";
import { buildSku } from "../lib/variant-utils";
import type { VariantColor, VariantProduct, VariantSize } from "../types/variant";

interface Props {
  product: VariantProduct;
  color: VariantColor;
  size: VariantSize;
  compact?: boolean;
}

export function VariantImageStage({ product, color, size, compact = false }: Props) {
  const [baseColor, setBaseColor] = useState(color);
  const incomingRef = useRef<HTMLDivElement>(null);
  const outgoingRef = useRef<HTMLImageElement>(null);
  const sku = useTextScramble(buildSku(product, color, size));

  useEffect(() => {
    if (baseColor.id === color.id || !incomingRef.current || !outgoingRef.current) {
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setBaseColor(color);
      return;
    }

    const timeline = gsap.timeline({
      onComplete: () => {
        gsap.set(outgoingRef.current, { clearProps: "opacity,transform" });
        setBaseColor(color);
      },
    });
    timeline.fromTo(
      incomingRef.current,
      {
        clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
      },
      {
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        duration: 0.74,
        ease: "expo.out",
      },
      0,
    );
    timeline.to(
      outgoingRef.current,
      { scale: 0.96, opacity: 0.52, duration: 0.74, ease: "expo.out" },
      0,
    );

    return () => {
      timeline.kill();
    };
  }, [baseColor.id, color]);

  const sizeInfo = product.measurements[size];
  const isTransitioning = baseColor.id !== color.id;

  return (
    <div
      className={`group relative w-full overflow-hidden bg-[var(--vault-panel)] ${
        compact ? "aspect-[4/3]" : "aspect-[4/4.7]"
      }`}
    >
      <Image
        ref={outgoingRef}
        src={baseColor.image}
        alt={`${product.name} in ${baseColor.name}`}
        fill
        priority={!compact}
        sizes={compact ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 55vw"}
        className="object-cover"
      />
      {isTransitioning && (
        <div
          ref={incomingRef}
          className="absolute inset-0 z-10"
          style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)" }}
        >
          <Image
            src={color.image}
            alt={`${product.name} in ${color.name}`}
            fill
            sizes={compact ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 55vw"}
            className="object-cover"
          />
        </div>
      )}
      <div className="absolute inset-x-0 top-0 z-20 flex items-start justify-between p-3 sm:p-4">
        <span className="border border-white/20 bg-black/75 px-2.5 py-1.5 font-mono text-[10px] font-semibold tracking-wider text-white backdrop-blur">
          {sku}
        </span>
        <span
          className="px-2.5 py-1.5 font-mono text-[10px] font-semibold uppercase text-white"
          style={{ backgroundColor: color.hex }}
        >
          {color.code} · {size}
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 z-20 flex justify-between gap-2 bg-gradient-to-t from-black/90 via-black/55 to-transparent px-3 pb-3 pt-10 font-mono text-[9px] uppercase tracking-wide text-white sm:px-4 sm:pb-4">
        <span>Pantone {color.pantone.replace("PMS ", "")}</span>
        <span>Chest {sizeInfo.chest}</span>
        <span className="text-[var(--vault-accent)] font-semibold">Stock {color.stockBySize[size]}</span>
      </div>
    </div>
  );
}
