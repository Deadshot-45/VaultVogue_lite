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
import { Eye, Heart, Minus, Plus, ShoppingCart } from "lucide-react";
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
      <Card className="w-full rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl bg-card">
        <CardContent className="p-4 space-y-4">
          {/* Image */}
          <div className="relative w-full h-40 overflow-hidden rounded-xl cursor-pointer" onClick={handleViewProduct}>
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
          <div onClick={handleViewProduct} className="cursor-pointer" suppressHydrationWarning>
            <h2 className="text-lg font-semibold line-clamp-1 transition-colors group-hover:text-primary" suppressHydrationWarning>
              {product.name}
            </h2>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1" suppressHydrationWarning>
              {product.description || `Explore our premium ${product.category} collection with modern design and unmatched comfort.`}
            </p>
          </div>

          {/* Tags */}
          <div className="flex gap-2 flex-wrap" suppressHydrationWarning>
            <Badge variant="secondary" className="capitalize" suppressHydrationWarning>{product.category}</Badge>
            {product.availableSizes.slice(0, 3).map((size) => (
              <Badge
                key={size}
                variant={selectedSize === size ? "default" : "secondary"}
                className={`cursor-pointer ${selectedSize === size ? "" : "bg-secondary/50 hover:bg-secondary"}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSize(size);
                }}
              >
                {size}
              </Badge>
            ))}
          </div>

          {/* Quantity + Price */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="text-xs text-muted-foreground">Quantity</p>
              <div className="flex items-center gap-2 mt-1">
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleDecrement} disabled={!cartItem}>
                  <Minus size={14} />
                </Button>
                <span className="text-sm font-medium w-4 text-center">{cartItem?.quantity || 0}</span>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleAdd} disabled={!auth?.isAuthenticated}>
                  <Plus size={14} />
                </Button>
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-lg font-bold text-primary">${((product.maxPrice || 0) * Math.max(1, cartItem?.quantity || 1)).toFixed(2)}</p>
            </div>
          </div>
        </CardContent>

        {/* Footer */}
        <CardFooter className="flex gap-2 p-4 pt-0">
          <Button variant="outline" size="icon" onClick={handleWishlist} className={isWishlisted ? "text-red-500 border-red-500 hover:text-red-600 hover:border-red-600" : ""}>
            <Heart size={18} className={isWishlisted ? "fill-current" : ""} />
          </Button>
          {!cartItem ? (
            <Button className="flex-1 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleAdd} disabled={!auth?.isAuthenticated}>
              Add to cart
            </Button>
          ) : (
            <Button className="flex-1 font-semibold" variant="secondary" onClick={() => router.push('/cart')}>
              View Cart
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
