"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { UIProduct } from "@/lib/query/useGetProducts";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { decrementItem, removeFromCart } from "@/lib/store/slices/cartSlice";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";
const FALLBACK_IMAGE =
  "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 400'%3E%3Crect width='300' height='400' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle' fill='%239ca3af' font-family='Arial, sans-serif' font-size='18'%3ENo image%3C/text%3E%3C/svg%3E";

const resolveProductImage = (image: string) => {
  if (!image) {
    return FALLBACK_IMAGE;
  }

  if (/^https?:\/\//i.test(image) || image.startsWith("data:")) {
    return image;
  }

  if (image.startsWith("/")) {
    return API_URL ? `${API_URL}${image}` : image;
  }

  return API_URL ? `${API_URL}/${image}` : `/${image}`;
};

export default function PremiumProductCard({
  product,
  onAddToCart,
}: {
  product: UIProduct;
  onAddToCart: (size: string) => void;
}) {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const cartItem = useAppSelector((state) =>
    state.cart.items.find(
      (item) => item.id === product.id || item.inventoryId === product.id,
    ),
  );

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [imageSrc, setImageSrc] = useState(() =>
    resolveProductImage(product.image),
  );

  const selectedStock = selectedSize
    ? product.sizeQuantities[selectedSize]
    : undefined;
  const fallbackLowStock = Object.values(product.sizeQuantities)
    .filter((quantity) => quantity > 0 && quantity <= product.lowStockThreshold)
    .sort((a, b) => a - b)[0];
  const lowStockCount =
    typeof selectedStock === "number" && selectedStock > 0
      ? selectedStock <= product.lowStockThreshold
        ? selectedStock
        : undefined
      : fallbackLowStock;

  useEffect(() => {
    if (cartItem?.selectedSize) {
      const nextSize = cartItem.selectedSize ?? null;
      queueMicrotask(() => setSelectedSize(nextSize));
      return;
    }

    if (product.availableSizes.length === 1) {
      const onlySize = product.availableSizes[0] ?? null;
      queueMicrotask(() => setSelectedSize(onlySize));
    }
  }, [cartItem?.selectedSize, product]);

  useEffect(() => {
    setImageSrc(resolveProductImage(product.image));
  }, [product.image]);

  const handleAdd = () => {
    if (!auth?.isAuthenticated) {
      toast.error("Please sign in first");
      return;
    }

    if (!product.availableSizes.length) {
      toast.error("Out of stock");
      return;
    }

    if (!selectedSize) {
      toast.error("Select a size");
      return;
    }

    onAddToCart(selectedSize);
  };

  const handleIncrement = () => {
    if (!selectedSize) {
      toast.error("Select a size");
      return;
    }

    onAddToCart(selectedSize);
  };

  const handleDecrement = () => {
    if (!cartItem) {
      return;
    }

    if (cartItem.quantity <= 1) {
      dispatch(
        removeFromCart({
          id: product.id,
          selectedSize: cartItem.selectedSize,
        }),
      );
      return;
    }

    dispatch(
      decrementItem({
        id: product.id,
        selectedSize: cartItem.selectedSize,
      }),
    );
  };

  return (
    <Card className="overflow-hidden rounded-2xl border bg-background shadow-sm transition-all active:scale-[0.98]">
      <CardHeader className="relative p-0">
        <Image
          src={imageSrc}
          alt={product.name}
          width={300}
          height={300}
          className="aspect-3/4 w-full object-cover"
          onError={() => setImageSrc(FALLBACK_IMAGE)}
        />

        <div className="absolute top-2 left-2">
          {product.isNew && (
            <Badge className="bg-black px-2 py-1 text-xs text-white">New</Badge>
          )}
        </div>

        {typeof lowStockCount === "number" ? (
          <div className="absolute top-2 right-2">
            <Badge className="bg-orange-600 px-2 py-1 text-xs text-white">
              Only {lowStockCount} left
            </Badge>
          </div>
        ) : null}
      </CardHeader>

      <CardContent className="space-y-1 p-3">
        <p className="text-[11px] text-muted-foreground">{product.category}</p>

        <h3 className="line-clamp-2 text-sm font-medium leading-tight">
          {product.name}
        </h3>

        <p className="mt-1 text-lg font-bold">₹{product.price}</p>

        {product.availableSizes.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {product.availableSizes.slice(0, 4).map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`rounded-md border px-3 py-1.5 text-xs transition ${
                  selectedSize === size
                    ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                    : "bg-background"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="p-3 pt-0">
        {cartItem ? (
          <div className="w-full space-y-2">
            <div className="text-xs font-medium text-primary">
              Already in cart
            </div>
            <div className="text-xs text-muted-foreground">
              Size: {cartItem.selectedSize || selectedSize || "N/A"}
            </div>
            <div className="flex w-full items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="shrink-0"
                onClick={handleDecrement}
              >
                <Minus className="h-4 w-4" />
              </Button>

              <div className="flex-1 rounded-md border bg-muted/40 px-3 py-2 text-center font-medium">
                {cartItem.quantity}
              </div>

              <Button
                type="button"
                size="icon"
                className="shrink-0"
                onClick={handleIncrement}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <Button
            onClick={handleAdd}
            disabled={!auth?.isAuthenticated}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-full text-sm font-medium disabled:opacity-60"
          >
            <ShoppingCart className="h-4 w-4" />
            {auth?.isAuthenticated ? "Add to Cart" : "Login to Add"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
