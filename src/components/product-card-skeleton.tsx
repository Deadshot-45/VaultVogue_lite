"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductCardSkeleton() {
  return (
    <div className="group relative">
      <Card className="product-card flex flex-col h-full bg-card/40 border border-border/40 overflow-hidden">
        {/* Image skeleton */}
        <Skeleton className="aspect-[3/4] w-full rounded-none" />

        {/* Content skeleton */}
        <CardContent className="flex flex-col flex-1 p-4 space-y-3">
          {/* Category + Rating row */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-10" />
          </div>

          {/* Title */}
          <Skeleton className="h-4 w-3/4" />

          {/* Price */}
          <div className="flex items-baseline gap-2 pt-1 mt-auto">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-14" />
          </div>

          {/* Bottom row */}
          <div className="pt-2 flex justify-between items-center border-t border-border/20 mt-1">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function ProductCardSkeletonGrid({
  count = 8,
  columns = "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
}: {
  count?: number;
  columns?: string;
}) {
  return (
    <div className={`grid ${columns} gap-6`}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
