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
import { motion } from "framer-motion";
import { Eye, Heart, Minus, Plus, ShoppingCart } from "lucide-react";
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

export default function AnimatedProductCard({
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
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

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
    queueMicrotask(() => setImageSrc(resolveProductImage(product.image)));
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

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -6 }}
      className="group relative"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="relative max-md:gap-0 py-0 overflow-hidden rounded-xl border border-border/60 bg-card/80 p-0 shadow-md backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
        <CardHeader className="relative p-0">
          <motion.div
            className="relative h-48 overflow-hidden rounded-t-xl sm:h-52"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src={imageSrc}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-all duration-500 group-hover:scale-105"
              onError={() => setImageSrc(FALLBACK_IMAGE)}
            />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center gap-2 bg-black/35"
            >
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8 rounded-full bg-white/90 text-black shadow-md hover:bg-white"
                >
                  <Eye className="h-3.5 w-3.5" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={handleWishlist}
                  className={`h-8 w-8 rounded-full shadow-md ${
                    isWishlisted
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-white/90 text-black hover:bg-white"
                  }`}
                >
                  <Heart
                    className={`h-3.5 w-3.5 ${isWishlisted ? "fill-current" : ""}`}
                  />
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          <div className="absolute left-2.5 top-2.5 flex flex-col gap-2">
            {product.isNew && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <Badge className="rounded-full sale-primary px-2 py-0.5 text-[10px] shadow-md">
                  New
                </Badge>
              </motion.div>
            )}
          </div>

          {typeof lowStockCount === "number" ? (
            <div className="absolute right-2.5 top-2.5">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              >
                <Badge className="animate-pulse rounded-full bg-orange-500 px-2 py-0.5 text-[10px] text-white shadow-md">
                  Only {lowStockCount} left
                </Badge>
              </motion.div>
            </div>
          ) : null}
        </CardHeader>

        <CardContent className="space-y-2 p-3 max-md:pt-0">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {product.category}
            </p>
            <h3 className="mt-1 line-clamp-1 text-sm font-semibold leading-snug transition-colors group-hover:sale-text">
              {product.name}
            </h3>
          </div>

          <div className="flex items-center justify-between">
            <motion.p
              className="text-lg font-bold sale-text"
              whileHover={{ scale: 1.05 }}
            >
              Rs. {product.price}
            </motion.p>
          </div>

          {product.availableSizes.length > 0 && (
            <motion.div
              className="flex flex-wrap gap-1.5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {product.availableSizes.slice(0, 3).map((size) => (
                <motion.button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`rounded-full border px-2.5 py-1 text-[11px] transition-all duration-200 ${
                    selectedSize === size
                      ? "sale-primary border-sale-red-500 shadow-md"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {size}
                </motion.button>
              ))}
            </motion.div>
          )}
        </CardContent>

        <CardFooter className="p-3 pt-0">
          {cartItem ? (
            <motion.div
              className="w-full space-y-2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="rounded-full bg-sale-red-500/10 px-3 py-1 text-center text-[11px] font-medium sale-text">
                Already in cart
              </div>
              <div className="text-center text-[11px] text-muted-foreground">
                Size: {cartItem.selectedSize || selectedSize || "N/A"}
              </div>
              <div className="flex w-full items-center gap-1.5">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 shrink-0 rounded-full"
                    onClick={handleDecrement}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </motion.div>

                <div className="flex-1 rounded-full border bg-muted/40 px-3 py-2 text-center text-sm font-medium">
                  {cartItem.quantity}
                </div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    type="button"
                    size="icon"
                    className="h-9 w-9 shrink-0 rounded-full"
                    onClick={handleIncrement}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full"
            >
              <Button
                onClick={handleAdd}
                disabled={!auth?.isAuthenticated}
                className="flex h-10 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold shadow-md transition-all hover:bg-primary/90 hover:shadow-lg disabled:opacity-60"
              >
                <ShoppingCart className="h-4 w-4" />
                {auth?.isAuthenticated ? "Add to Cart" : "Login to Add"}
              </Button>
            </motion.div>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
