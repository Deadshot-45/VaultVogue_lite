"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { UIProduct } from "@/lib/query/useGetProducts";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FALLBACK_IMAGE, resolveUiProductImage } from "@/utility/utils";

export default function AnimatedProductCard({
  product,
}: {
  product: UIProduct;
}) {
  const router = useRouter();
  const [imageSrc, setImageSrc] = useState(() =>
    resolveUiProductImage(product.image),
  );

  const lowStockCount = Object.values(product.sizeQuantities)
    .filter((quantity) => quantity > 0 && quantity <= product.lowStockThreshold)
    .sort((a, b) => a - b)[0];

  useEffect(() => {
    queueMicrotask(() => setImageSrc(resolveUiProductImage(product.image)));
  }, [product.image]);

  const handleViewProduct = () => {
    router.push(`/products/${product.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -6 }}
      className="group relative"
    >
      <Card
        onClick={handleViewProduct}
        className="w-full rounded-2xl gap-2 shadow-md transition-all duration-300 hover:shadow-xl py-3 bg-card cursor-pointer border border-border/40 hover:border-primary/20"
      >
        <CardContent className="px-2 sm:px-3 space-y-2 pb-1">
          {/* Image */}
          <div className="relative w-full h-40 overflow-hidden rounded-xl">
            <Image
              src={imageSrc}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-all duration-500 group-hover:scale-105"
              onError={() => setImageSrc(FALLBACK_IMAGE)}
              loading="eager"
            />
            {product.isNew && (
              <Badge className="absolute left-2 top-2 rounded-full sale-primary px-2 py-0.5 text-[10px] shadow-md">
                New
              </Badge>
            )}
            {typeof lowStockCount === "number" && (
              <Badge className="absolute right-2 top-2 animate-pulse rounded-full bg-orange-500 px-2 py-0.5 text-[10px] text-white shadow-md">
                Only {lowStockCount} left
              </Badge>
            )}
          </div>

          {/* Title */}
          <div suppressHydrationWarning>
            <h2 className="text-lg font-semibold line-clamp-1 transition-colors group-hover:text-primary min-h-[1.75rem]" suppressHydrationWarning>
              {product.name}
            </h2>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1 min-h-[2.5rem]" suppressHydrationWarning>
              {product.description || `Explore our premium ${product.category} collection with modern design and unmatched comfort.`}
            </p>
          </div>

          {/* Tags */}
          <div className="flex gap-2 flex-wrap" suppressHydrationWarning>
            <Badge variant="secondary" className="capitalize" suppressHydrationWarning>{product.category}</Badge>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-lg font-bold text-primary">${(product.maxPrice || 0).toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
