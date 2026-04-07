"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { UIProduct } from "@/lib/query/useGetProducts";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { decrementItem, removeFromCart } from "@/lib/store/slices/cartSlice";
import { toast } from "sonner";

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

  // Auto select if only one size
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
    <Card className="rounded-2xl overflow-hidden border bg-background shadow-sm active:scale-[0.98] transition-all">
      {/* IMAGE */}
      <CardHeader className="p-0 relative">
        <Image
          src={product.image}
          alt={product.name}
          width={300}
          height={300}
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

        {/* Sizes (SELECTABLE) */}
        {product.availableSizes?.length > 0 && (
          <div className="flex gap-2 mt-2 flex-wrap">
            {product.availableSizes.slice(0, 4).map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-3 py-1.5 text-xs border rounded-md transition
                  ${
                    selectedSize === size
                      ? "bg-black dark:bg-white dark:text-black text-white border-black dark:border-white"
                      : "bg-background"
                  }`}
              >
                {size}
              </button>
            ))}
          </div>
        )}
      </CardContent>

      {/* CTA */}
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
