"use client";

import { useAddToCart } from "@/lib/query/useAddToCart";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { decrementItem, removeFromCart } from "@/lib/store/slices/cartSlice";
import { Heart, Minus, Plus, ShieldCheck, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type ProductDetail = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  sellerId?: string;
  sellerName?: string;
  description: string;
  category: string;
  isNew: boolean;
  images: string[];
  availableSizes: string[];
  sizeQuantities: Record<string, number>;
  lowStockThreshold: number;
};

type SuggestedProduct = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
};

type Props = {
  product: ProductDetail;
  suggestions?: SuggestedProduct[];
};

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";
const FALLBACK_IMAGE =
  "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 700'%3E%3Crect width='600' height='700' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle' fill='%239ca3af' font-family='Arial, sans-serif' font-size='24'%3ENo image%3C/text%3E%3C/svg%3E";

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

const reviewItems = [
  {
    name: "Riya S.",
    rating: 5,
    comment:
      "The fit feels premium and the finish looks even better in person. Great pick for regular styling.",
  },
  {
    name: "Aman K.",
    rating: 4,
    comment:
      "Good quality and clean stitching. Delivery was quick and sizing matched expectations.",
  },
  {
    name: "Neha P.",
    rating: 5,
    comment:
      "Really liked the fabric feel and overall look. Works well for both casual and slightly dressed-up outfits.",
  },
];

export default function ProductDetailsView({
  product,
  suggestions = [],
}: Props) {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const cartItem = useAppSelector((state) =>
    state.cart.items.find(
      (item) => item.id === product.id || item.inventoryId === product.id,
    ),
  );
  const { mutateAsync: addToCartApi, isPending } = useAddToCart();

  const gallery = product.images.length
    ? product.images.map(resolveProductImage)
    : [FALLBACK_IMAGE];

  const [activeImage, setActiveImage] = useState(gallery[0] ?? FALLBACK_IMAGE);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const selectedStock = selectedSize
    ? product.sizeQuantities[selectedSize]
    : undefined;
  const lowStockCount =
    typeof selectedStock === "number" &&
    selectedStock > 0 &&
    selectedStock <= product.lowStockThreshold
      ? selectedStock
      : undefined;

  useEffect(() => {
    queueMicrotask(() => setActiveImage(gallery[0] ?? FALLBACK_IMAGE));
  }, [product.id, gallery]);

  useEffect(() => {
    if (cartItem?.selectedSize) {
      queueMicrotask(() => setSelectedSize(cartItem?.selectedSize ?? null));
      return;
    }

    if (product.availableSizes.length === 1) {
      queueMicrotask(() => setSelectedSize(product.availableSizes[0] ?? null));
    }
  }, [cartItem?.selectedSize, product.availableSizes]);

  const handleAdd = async () => {
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

    const response = await addToCartApi({
      productId: product.id,
      sellerId: product.sellerId ?? "",
      size: selectedSize,
      quantity: 1,
      priceSnapshot: product.price,
    });

    if (!response.success) {
      toast.error("Unable to add item to cart.");
      return;
    }

    toast.success("Added to cart");
  };

  const handleIncrement = async () => {
    if (!selectedSize) {
      toast.error("Select a size");
      return;
    }

    await handleAdd();
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
    setIsWishlisted((current) => !current);
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  // const discount =
  //   product.originalPrice && product.originalPrice > product.price
  //     ? Math.round(
  //         ((product.originalPrice - product.price) / product.originalPrice) *
  //           100,
  //       )
  //     : null;

  return (
    <section className="mx-auto w-full px-4 py-10">
      <div className="grid gap-12 xl:grid-cols-[1.2fr_1fr_360px]">
        {/* LEFT — IMAGES */}
        <div className="space-y-4">
          <div className="relative aspect-4/5 overflow-hidden rounded-3xl bg-muted/20">
            <Image
              src={activeImage}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          <div className="flex gap-3 overflow-x-auto">
            {gallery.map((image, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(image)}
                className={`relative h-20 w-16 shrink-0 overflow-hidden rounded-xl border ${
                  activeImage === image
                    ? "border-primary"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <Image
                  src={image}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </button>
            ))}
          </div>
        </div>

        {/* CENTER — DETAILS */}
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">{product.category}</p>

            <h1 className="text-4xl font-bold tracking-tight">
              {product.name}
            </h1>

            <p className="text-sm text-muted-foreground">
              Sold by{" "}
              <span className="font-medium text-foreground">
                {product.sellerName || "Vault Vogue Partner"}
              </span>
            </p>

            <p className="text-muted-foreground">{product.description}</p>
          </div>

          <div className="flex items-center gap-3">
            <p className="text-3xl font-bold sale-text">
              ₹{product.price.toLocaleString()}
            </p>
            {product.originalPrice && (
              <p className="text-lg line-through text-muted-foreground">
                ₹{product.originalPrice.toLocaleString()}
              </p>
            )}
          </div>

          {/* SIZE */}
          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="text-sm font-medium">Select Size</p>
              {typeof lowStockCount === "number" ? (
                <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-medium text-orange-600">
                  Only {lowStockCount} left
                </span>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-2">
              {product.availableSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 rounded-full border text-sm ${
                    selectedSize === size
                      ? "sale-primary"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* TRUST */}
          <div className="flex gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Fast delivery
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              Secure checkout
            </div>
          </div>
        </div>

        {/* RIGHT — BUY BOX */}
        <div className="sticky top-24 h-fit space-y-4 rounded-2xl border bg-background/95 p-6 shadow-lg">
          <div>
            <p className="text-2xl font-bold sale-text">
              ₹{product.price.toLocaleString()}
            </p>
            {product.originalPrice && (
              <p className="text-sm line-through text-muted-foreground">
                ₹{product.originalPrice.toLocaleString()}
              </p>
            )}
          </div>

          {/* SIZE QUICK */}
          <div>
            <p className="text-sm mb-2">Size</p>
            <div className="flex flex-wrap gap-2">
              {product.availableSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 py-1.5 rounded-full border text-sm ${
                    selectedSize === size
                      ? "sale-primary"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* CART ACTION */}
          {cartItem ? (
            <div className="flex items-center gap-2">
              <Button size="icon" variant="outline" onClick={handleDecrement}>
                <Minus />
              </Button>

              <span className="px-3">{cartItem.quantity}</span>

              <Button size="icon" onClick={handleIncrement}>
                <Plus />
              </Button>
            </div>
          ) : (
            <>
              <Button
                className="h-12 w-full rounded-full text-base font-semibold"
                onClick={handleAdd}
                disabled={!auth?.isAuthenticated || isPending}
              >
                {auth?.isAuthenticated
                  ? isPending
                    ? "Adding..."
                    : "Add to Cart"
                  : "Login to Buy"}
              </Button>

              <Button variant="outline" className="h-12 w-full rounded-full">
                Buy Now
              </Button>
            </>
          )}

          {/* WISHLIST */}
          <Button variant="ghost" className="w-full" onClick={handleWishlist}>
            <Heart className="mr-2 h-4 w-4" />
            {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
          </Button>
        </div>
      </div>

      {/* SUGGESTIONS */}
      <div className="mt-16">
        <h2 className="text-xl font-semibold mb-4">You may also like</h2>

        <div className="flex gap-4 overflow-x-auto pb-2">
          {suggestions.map((item) => (
            <Link key={item.id} href={`/products/${item.id}`}>
              <div className="min-w-[180px] rounded-xl border bg-background/80 transition hover:-translate-y-1 hover:shadow-md overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src={resolveProductImage(item.image)}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-3">
                  <p className="text-sm font-medium line-clamp-2">
                    {item.name}
                  </p>
                  <p className="text-sm sale-text font-semibold">
                    ₹{item.price.toLocaleString()}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* DETAILS + REVIEWS */}
      <div className="mt-16 grid gap-6 lg:grid-cols-2">
        {/* DETAILS */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Product Details</h2>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border p-4">
              <p className="text-xs text-muted-foreground">Category</p>
              <p className="mt-1 font-medium">{product.category}</p>
            </div>

            <div className="rounded-xl border p-4">
              <p className="text-xs text-muted-foreground">Seller</p>
              <p className="mt-1 font-medium">
                {product.sellerName || "Vault Vogue Partner"}
              </p>
            </div>

            <div className="rounded-xl border p-4">
              <p className="text-xs text-muted-foreground">Sizes</p>
              <p className="mt-1 font-medium">
                {product.availableSizes.join(", ")}
              </p>
            </div>

            <div className="rounded-xl border p-4">
              <p className="text-xs text-muted-foreground">Product ID</p>
              <p className="mt-1 font-medium">{product.id}</p>
            </div>
          </div>
        </div>

        {/* REVIEWS */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Reviews</h2>

          {reviewItems.map((review) => (
            <div key={review.name} className="rounded-xl border p-4">
              <div className="flex justify-between">
                <p className="font-medium">{review.name}</p>
                <p className="text-amber-500">{"★".repeat(review.rating)}</p>
              </div>

              <p className="mt-2 text-sm text-muted-foreground">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
