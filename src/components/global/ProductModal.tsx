"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import { UIProduct } from "@/lib/query/useGetProducts";

export default function PremiumProductCard({
  product,
  onAddToCart,
}: {
  product: UIProduct;
  onAddToCart: () => void;
}) {
  const productImage = product?.image || "/images/placeholder.png";

  return (
    <Card className="rounded-2xl overflow-hidden border bg-background shadow-sm active:scale-[0.98] transition-all">
      {/* IMAGE */}
      <CardHeader className="p-0 relative">
        <img
          src={productImage}
          alt={product.name}
          className="w-full aspect-3/4 object-cover"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2">
          {product.isNew && (
            <Badge className="bg-black text-white text-xs px-2 py-1">New</Badge>
          )}
        </div>

        <div className="absolute top-2 right-2">
          <Badge className="bg-orange-600 text-white text-xs px-2 py-1">
            Only 2 left 🔥
          </Badge>
        </div>
      </CardHeader>

      {/* CONTENT */}
      <CardContent className="p-3 space-y-1">
        <p className="text-[11px] text-muted-foreground">{product.category}</p>

        <h3 className="text-sm font-medium leading-tight line-clamp-2">
          {product.name}
        </h3>

        <p className="text-lg font-bold mt-1">₹{product.price}</p>

        {/* Sizes */}
        {product.availableSizes?.length > 0 && (
          <div className="flex gap-2 mt-2">
            {product.availableSizes.slice(0, 4).map((size) => (
              <span
                key={size}
                className="px-3 py-1.5 text-xs border rounded-md bg-background active:scale-95"
              >
                {size}
              </span>
            ))}
          </div>
        )}
      </CardContent>

      {/* CTA */}
      <CardFooter className="p-3 pt-0">
        <Button
          onClick={onAddToCart}
          className="w-full h-11 rounded-full text-sm font-medium flex items-center justify-center gap-2"
        >
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
