"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useCartQueue } from "@/hooks/useCartQueue";
import {
  useAddToCart,
  useCart,
  useDecrementFromCart,
  useRemoveFromCart,
} from "@/lib/query/useCart";
import { UIProduct } from "@/lib/query/useGetProducts";
import { useAppSelector } from "@/lib/store/hooks";
import { motion } from "framer-motion";
import { Eye, Heart, Minus, Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AddToCartButton } from "../products/AddtoCart";
import { Variant } from "@/utility/types/productVariant";
import { FALLBACK_IMAGE, resolveUiProductImage } from "@/utility/utils";

export default function AnimatedProductCard({
  product,
}: {
  product: UIProduct;
}) {
  const router = useRouter();
  const auth = useAppSelector((state) => state.auth);
  const { data: cartItems = [] } = useCart();
  const addToCart = useAddToCart();
  const decrement = useDecrementFromCart();
  const remove = useRemoveFromCart();

  const { add: queueCartAction } = useCartQueue((actions) => {
    actions.forEach(({ variantId, delta }) => {
      console.log(delta);

      if (delta === 0) {
        console.log("zero");

        remove.mutate(variantId);
      }
      if (delta > 0) {
        addToCart.mutate({ variantId, quantity: delta });
      }

      if (delta < 0) {
        const abs = Math.abs(delta);

        if (abs > 10) {
          remove.mutate(variantId);
        } else {
          for (let i = 0; i < abs; i++) {
            decrement.mutate(variantId);
          }
        }
      }
    });
  });

  const cartItem = cartItems.find((item) => item.productId === product.id);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [imageSrc, setImageSrc] = useState(() =>
    resolveUiProductImage(product.image),
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
    if (cartItem) {
      if (cartItem?.size) {
        const nextSize = cartItem.size ?? null;
        queueMicrotask(() => setSelectedSize(nextSize));
        return;
      }
    }

    if (product.availableSizes.length === 1) {
      const onlySize = product.availableSizes[0] ?? null;
      queueMicrotask(() => setSelectedSize(onlySize));
    }
  }, [cartItem, product]);

  useEffect(() => {
    queueMicrotask(() => setImageSrc(resolveUiProductImage(product.image)));
  }, [product.image]);

  const handleAdd = () => {
    if (!selectedSize) {
      toast.error("Select a size");
      return;
    }

    const variant = product.sizes?.find(
      (v: Variant) => v.size === selectedSize,
    );

    if (!variant) {
      toast.error("Invalid variant");
      return;
    }

    queueCartAction(variant.variantId, 1);
  };

  const handleDecrement = () => {
    if (!cartItem) return;

    if (cartItem.quantity <= 1) {
      console.log("zero");
      queueCartAction(cartItem?.variantId ?? "", 0);

      return;
    }

    // you need update mutation (not redux)
    queueCartAction(cartItem?.variantId ?? "", -1);
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

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
                  onClick={handleViewProduct}
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
            <h3
              className="mt-1 line-clamp-1 cursor-pointer text-sm font-semibold leading-snug transition-colors group-hover:sale-text"
              onClick={handleViewProduct}
            >
              {product.name}
            </h3>
          </div>

          <div className="flex items-center justify-between">
            <motion.p
              className="text-lg font-bold sale-text"
              whileHover={{ scale: 1.05 }}
            >
              ${product.maxPrice?.toFixed(2)}
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
              {/* <div className="rounded-full bg-sale-red-500/10 px-3 py-1 text-center text-[11px] font-medium sale-text">
                Already in cart
              </div> */}
              {/* <div className="text-center text-[11px] text-muted-foreground">
                Size: {cartItem.size || selectedSize || "N/A"}
              </div> */}
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
                    onClick={handleAdd}
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
              <AddToCartButton
                onAdd={handleAdd}
                disabled={!auth?.isAuthenticated}
                className="flex h-10 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold shadow-md transition-all hover:bg-primary/90 hover:shadow-lg disabled:opacity-60"
              />
            </motion.div>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
