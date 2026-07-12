"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UIProduct } from "@/lib/query/useGetProducts";
import { motion } from "framer-motion";
import { Heart, Star, ShoppingBag, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useAddToCart } from "@/lib/query/useCart";
import { Skeleton } from "@/components/ui/skeleton";
import { getAuthCookie } from "@/lib/auth";

interface ProductCardProps {
  product: UIProduct & { isSale?: boolean };
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = useCallback(() => setImageLoaded(true), []);
  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(true);
  }, []);
  const addToCartMutation = useAddToCart();

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    toast.success(
      isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      {
        description: `${product.name} has been updated in your atelier collection.`,
      }
    );
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Check authentication
    const token = getAuthCookie();
    if (!token) {
      toast.error("Authentication required", {
        description: "Please sign in to add items to your cart.",
      });
      router.push("/login");
      return;
    }

    const firstVariantId = product.sizes?.[0]?.variantId || `${product.id}-xs`;

    toast.promise(
      addToCartMutation.mutateAsync({
        variantId: firstVariantId,
        quantity: 1,
      }),
      {
        loading: "Adding to your shopping bag...",
        success: "Item added to bag successfully",
        error: "Failed to add item to bag",
      }
    );
  };

  // Luxury ratings configuration (just static high ratings for elegant aesthetics)
  const rating = product.name.length % 2 === 0 ? 5 : 4.5;
  const originalPrice = product.isSale ? Math.round(product.price * 1.3) : null;

  console.log("product : ", product)

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="group relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Card className="product-card flex flex-col h-full bg-card/40 border border-border/40 overflow-hidden cursor-pointer" onClick={() => router.push(`/products/${product.id}`)}>
        {/* Image Frame */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
          {/* Image skeleton placeholder */}
          {!imageLoaded && (
            <Skeleton className="absolute inset-0 z-10 rounded-none" />
          )}
          <Image
            src={imageError ? "/fallback.png" : product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover transition-all duration-700 ease-out group-hover:scale-105 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            priority={product.isNew}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
          
          {/* Frosted overlays for quick actions */}
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
            <button
              onClick={handleAddToCart}
              className="h-10 w-10 rounded-full glass border border-white/20 text-white flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
              title="Add to bag"
            >
              <ShoppingBag className="h-4 w-4" />
            </button>
            <Link
              href={`/products/${product.id}`}
              className="h-10 w-10 rounded-full glass border border-white/20 text-white flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
              title="View details"
              onClick={(e) => e.stopPropagation()}
            >
              <Eye className="h-4 w-4" />
            </Link>
          </div>

          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-1.5 z-10">
            {product.isNew && (
              <span className="badge badge-new">New</span>
            )}
            {product.isSale && (
              <span className="badge badge-sale">Sale</span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className="absolute right-3 top-3 z-10 h-8 w-8 rounded-full glass border border-white/20 text-white flex items-center justify-center transition-transform active:scale-90 hover:scale-105"
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                isWishlisted ? "fill-red-500 text-red-500" : "text-white"
              }`}
            />
          </button>
        </div>

        {/* Content Frame */}
        <CardContent className="flex flex-col flex-1 p-4 space-y-2">
          {/* Label & Rating */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-muted-foreground">
              {product.category || "Atelier"}
            </span>
            <div className="flex items-center gap-0.5">
              <Star className="h-3 w-3 fill-[var(--gold)] text-[var(--gold)]" />
              <span className="text-xs font-medium text-foreground">{rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-montserrat text-sm font-medium tracking-wide text-[var(--brand-text)] line-clamp-1 group-hover:text-[var(--gold)] transition-colors">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-baseline gap-2 pt-1 mt-auto">
            <span className="text-sm font-semibold text-[var(--gold)]">
              ₹{product?.price?.toFixed(2)}
            </span>
            {originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                ₹{originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Inline CTA for elegant visibility */}
          <div className="pt-2 flex justify-between items-center text-xs font-medium border-t border-border/20 mt-1">
            <span className="text-muted-foreground link-underline">View Details</span>
            {/* <button
              onClick={handleAddToCart}
              className="text-[var(--gold)] hover:opacity-85 transition-opacity"
            >
              Add To Bag
            </button> */}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
