// "use client";

// import { useAddToCart } from "@/lib/query/useAddToCart";
// import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
// import { decrementItem, removeFromCart } from "@/lib/store/slices/cartSlice";
// import { Heart, Minus, Plus, ShieldCheck, Truck } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import { useCallback, useEffect, useMemo, useState } from "react";
// import { toast } from "sonner";
// import { Button } from "@/components/ui/button";
// import { AddToCartButton } from "./AddtoCart";

// type ProductVariantItem = {
//   _id: string; // Mongo internal (optional if you remove later)

//   variantId: string; // ✅ main ID (use this in frontend)

//   productId: string;
//   sellerId: string;

//   sku: string;

//   attributes: {
//     size?: string;
//     color?: string;
//     [key: string]: any; // future-proof (e.g. material, style)
//   };

//   price: number;
//   compareAtPrice?: number;

//   images: {
//     _id: string;
//     url: string;
//     isPrimary?: boolean;
//   }[];

//   isActive: boolean;

//   createdAt: string;
//   updatedAt: string;

//   // 🔥 Inventory (derived)
//   stock: number;
//   reserved: number;
//   sold: number;
//   availableStock: number;
//   isOutOfStock: boolean;
// };

// type ProductDetail = {
//   id: string;
//   name: string;
//   price: number;
//   originalPrice?: number;
//   variantId?: string;
//   variants: ProductVariantItem[];
//   sellerId?: string;
//   sellerName?: string;
//   description: string;
//   category: string;
//   isNew: boolean;
//   images: string[];
//   availableSizes: string[];
//   sizeQuantities: Record<string, number>;
//   lowStockThreshold: number;
// };

// type SuggestedProduct = {
//   id: string;
//   name: string;
//   price: number;
//   image: string;
//   category: string;
// };

// type Props = {
//   product: ProductDetail;
//   suggestions?: SuggestedProduct[];
// };

// const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";
// const FALLBACK_IMAGE =
//   "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 700'%3E%3Crect width='600' height='700' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle' fill='%239ca3af' font-family='Arial, sans-serif' font-size='24'%3ENo image%3C/text%3E%3C/svg%3E";

// const resolveProductImage = (image: string) => {
//   if (!image) {
//     return FALLBACK_IMAGE;
//   }

//   if (/^https?:\/\//i.test(image) || image.startsWith("data:")) {
//     return image;
//   }

//   if (image.startsWith("/")) {
//     return API_URL ? `${API_URL}${image}` : image;
//   }

//   return API_URL ? `${API_URL}/${image}` : `/${image}`;
// };

// const reviewItems = [
//   {
//     name: "Riya S.",
//     rating: 5,
//     comment:
//       "The fit feels premium and the finish looks even better in person. Great pick for regular styling.",
//   },
//   {
//     name: "Aman K.",
//     rating: 4,
//     comment:
//       "Good quality and clean stitching. Delivery was quick and sizing matched expectations.",
//   },
//   {
//     name: "Neha P.",
//     rating: 5,
//     comment:
//       "Really liked the fabric feel and overall look. Works well for both casual and slightly dressed-up outfits.",
//   },
// ];

// export default function ProductDetailsView({
//   product,
//   suggestions = [],
// }: Props) {
//   const dispatch = useAppDispatch();
//   const auth = useAppSelector((state) => state.auth);

//   const { mutateAsync: addToCartApi, isPending } = useAddToCart();

//   const gallery = useMemo(() => {
//     return product.images?.length
//       ? product.images.map((img) => resolveProductImage(img))
//       : [FALLBACK_IMAGE];
//   }, [product.images]);

//   const Suggestions = useMemo(() => {
//     return suggestions ?? [];
//   }, [suggestions]);

//   const [activeImage, setActiveImage] = useState(gallery[0] ?? FALLBACK_IMAGE);
//   const [selectedSize, setSelectedSize] = useState<string | null>(null);
//   const [isWishlisted, setIsWishlisted] = useState(false);

//   const selectedStock = selectedSize
//     ? product.sizeQuantities[selectedSize]
//     : undefined;

//   const lowStockCount =
//     typeof selectedStock === "number" &&
//     selectedStock > 0 &&
//     selectedStock <= product.lowStockThreshold
//       ? selectedStock
//       : undefined;

//   const selectedVariant = useMemo(() => {
//     return product.variants.find((v) => v.attributes?.size === selectedSize);
//   }, [product.variants, selectedSize]);

//   const cartItem = useAppSelector((state) => {
//     if (!selectedVariant) return undefined;

//     return state.cart.items.find(
//       (item) => item.variantId === selectedVariant.variantId,
//     );
//   });

//   const isOutOfStock = selectedVariant?.isOutOfStock ?? true;

//   useEffect(() => {
//     setActiveImage(gallery[0] ?? FALLBACK_IMAGE);
//   }, [product.id]);

//   useEffect(() => {
//     if (!selectedSize && product.variants.length) {
//       setSelectedSize(product.variants[0].attributes?.size ?? null);
//     }
//   }, [product.id]);

//   const handleSizeSelect = useCallback((size: string) => {
//     setSelectedSize(size);
//   }, []);

//   const handleAdd = async () => {
//     if (!auth?.isAuthenticated) {
//       toast.error("Please sign in first");
//       return;
//     }

//     if (!product.availableSizes.length) {
//       toast.error("Out of stock");
//       return;
//     }

//     if (!selectedSize) {
//       toast.error("Select a size");
//       return;
//     }

//     const variantId = selectedVariant?.variantId;

//     if (!variantId) {
//       toast.error("Invalid variant");
//       return;
//     }
//     if (isPending) return;

//     const response = await addToCartApi({
//       variantId,
//       quantity: 1,
//     });

//     if (!response.success) {
//       toast.error("Unable to add item to cart.");
//       return;
//     }
//     if (response.code === "CART_ITEM_ADDED") {
//       toast.success(response.message);
//     }

//     if (response.code === "INSUFFICIENT_STOCK") {
//       toast.error(response.message);
//     }
//   };

//   const handleIncrement = async () => {
//     if (!selectedSize) {
//       toast.error("Select a size");
//       return;
//     }

//     await handleAdd();
//   };

//   const handleDecrement = () => {
//     if (!cartItem) {
//       return;
//     }

//     if (cartItem.quantity <= 1) {
//       dispatch(
//         removeFromCart({
//           variantId: cartItem.variantId,
//         }),
//       );
//       return;
//     }

//     dispatch(
//       decrementItem({
//         variantId: cartItem.variantId,
//       }),
//     );
//   };

//   const handleWishlist = () => {
//     setIsWishlisted((current) => !current);
//     toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
//   };

//   // const discount =
//   //   product.originalPrice && product.originalPrice > product.price
//   //     ? Math.round(
//   //         ((product.originalPrice - product.price) / product.originalPrice) *
//   //           100,
//   //       )
//   //     : null;

//   return (
//     <section className="mx-auto w-full px-4 py-10">
//       <div className="grid gap-12 xl:grid-cols-[1.2fr_1fr_360px]">
//         {/* LEFT — IMAGES */}
//         <div className="space-y-4">
//           <div className="relative aspect-4/5 overflow-hidden rounded-3xl bg-muted/20">
//             <Image
//               src={activeImage}
//               alt={product.name}
//               fill
//               priority
//               className="object-cover"
//               sizes="(max-width: 768px) 100vw, 50vw"
//             />
//           </div>

//           <div className="flex gap-3 overflow-x-auto">
//             {gallery.map((image, index) => (
//               <button
//                 key={index}
//                 onClick={() => setActiveImage(image)}
//                 className={`relative h-20 w-16 shrink-0 overflow-hidden rounded-xl border ${
//                   activeImage === image
//                     ? "border-primary"
//                     : "border-border hover:border-primary/40"
//                 }`}
//               >
//                 <Image
//                   src={image}
//                   alt={`${product.name} thumbnail ${index + 1}`}
//                   fill
//                   className="object-cover"
//                   sizes="64px"
//                 />
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* CENTER — DETAILS */}
//         <div className="space-y-6">
//           <div className="space-y-3">
//             <p className="text-sm text-muted-foreground">{product.category}</p>

//             <h1 className="text-4xl font-bold tracking-tight">
//               {product.name}
//             </h1>

//             <p className="text-sm text-muted-foreground">
//               Sold by{" "}
//               <span className="font-medium text-foreground">
//                 {product.sellerName || "Vault Vogue Partner"}
//               </span>
//             </p>

//             <p className="text-muted-foreground">{product.description}</p>
//           </div>

//           <div className="flex items-center gap-3">
//             <p className="text-3xl font-bold sale-text">${product.price}</p>
//             {product.originalPrice && (
//               <p className="text-lg line-through text-muted-foreground">
//                 ${product.originalPrice}
//               </p>
//             )}
//           </div>

//           {/* SIZE */}
//           <div>
//             <div className="mb-2 flex items-center justify-between gap-3">
//               <p className="text-sm font-medium">Select Size</p>
//               {typeof lowStockCount === "number" ? (
//                 <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-medium text-orange-600">
//                   Only {lowStockCount} left
//                 </span>
//               ) : null}
//             </div>
//             <div className="flex flex-wrap gap-2">
//               {product.availableSizes.map((size) => {
//                 const stock = product.sizeQuantities[size];

//                 const disabled = !stock;

//                 return (
//                   <button
//                     key={size}
//                     disabled={disabled}
//                     onClick={() => handleSizeSelect(size)}
//                     className={`px-4 py-2 rounded-full border text-sm ${
//                       selectedSize === size
//                         ? "sale-primary"
//                         : "border-border bg-background hover:bg-muted"
//                     } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
//                   >
//                     {size}
//                   </button>
//                 );
//               })}
//             </div>
//           </div>

//           {/* TRUST */}
//           <div className="flex gap-6 text-sm text-muted-foreground">
//             <div className="flex items-center gap-2">
//               <Truck className="h-4 w-4" />
//               Fast delivery
//             </div>
//             <div className="flex items-center gap-2">
//               <ShieldCheck className="h-4 w-4" />
//               Secure checkout
//             </div>
//           </div>
//         </div>

//         {/* RIGHT — BUY BOX */}
//         <div className="sticky top-24 h-fit space-y-4 rounded-2xl border bg-background/95 p-6 shadow-lg">
//           <div>
//             <p className="text-2xl font-bold sale-text">
//               ${product.price.toLocaleString()}
//             </p>
//             {product.originalPrice && (
//               <p className="text-sm line-through text-muted-foreground">
//                 ${product.originalPrice.toLocaleString()}
//               </p>
//             )}
//           </div>

//           {/* SIZE QUICK */}
//           <div>
//             <p className="text-sm mb-2">Size</p>
//             <div className="flex flex-wrap gap-2">
//               {product.availableSizes.map((size) => (
//                 <button
//                   key={size}
//                   onClick={() => handleSizeSelect(size)}
//                   className={`px-3 py-1.5 rounded-full border text-sm ${
//                     selectedSize === size
//                       ? "sale-primary"
//                       : "border-border bg-background hover:bg-muted"
//                   }`}
//                 >
//                   {size}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* CART ACTION */}
//           {cartItem ? (
//             <div className="flex items-center gap-2">
//               <Button size="icon" variant="outline" onClick={handleDecrement}>
//                 <Minus />
//               </Button>

//               <span className="px-3">{cartItem.quantity}</span>

//               <Button size="icon" onClick={handleIncrement}>
//                 <Plus />
//               </Button>
//             </div>
//           ) : (
//             <>
//               {/* <Button
//                 className=""
//                 onClick={handleAdd}
//                 disabled={!auth?.isAuthenticated || isPending}
//               >
//                 {auth?.isAuthenticated
//                   ? isPending
//                     ? "Adding..."
//                     : "Add to Cart"
//                   : "Login to Buy"}
//               </Button> */}

//               <AddToCartButton
//                 onAdd={handleAdd}
//                 disabled={
//                   !auth?.isAuthenticated ||
//                   isPending ||
//                   !selectedVariant ||
//                   isOutOfStock ||
//                   false
//                 }
//                 className="w-full"
//               />

//               <Button variant="outline" className="h-12 w-full rounded-full">
//                 Buy Now
//               </Button>
//             </>
//           )}

//           {/* WISHLIST */}
//           <Button variant="ghost" className="w-full" onClick={handleWishlist}>
//             <Heart className="mr-2 h-4 w-4" />
//             {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
//           </Button>
//         </div>
//       </div>

//       {/* SUGGESTIONS */}
//       <div className="mt-16">
//         <h2 className="text-xl font-semibold mb-4">You may also like</h2>

//         <div className="flex gap-4 overflow-x-auto pb-2">
//           {Suggestions.map((item) => (
//             <Link key={item.id} href={`/products/${item.id}`}>
//               <div className="min-w-45 rounded-xl border bg-background/80 transition hover:-translate-y-1 hover:shadow-md overflow-hidden">
//                 <div className="relative h-48">
//                   <Image
//                     src={resolveProductImage(item.image)}
//                     alt={item.name}
//                     fill
//                     className="object-cover"
//                   />
//                 </div>

//                 <div className="p-3">
//                   <p className="text-sm font-medium line-clamp-2">
//                     {item.name}
//                   </p>
//                   <p className="text-sm sale-text font-semibold">
//                     ${item.price}
//                   </p>
//                 </div>
//               </div>
//             </Link>
//           ))}
//         </div>
//       </div>

//       {/* DETAILS + REVIEWS */}
//       <div className="mt-16 grid gap-6 lg:grid-cols-2">
//         {/* DETAILS */}
//         <div className="space-y-4">
//           <h2 className="text-lg font-semibold">Product Details</h2>

//           <div className="grid gap-3 sm:grid-cols-2">
//             <div className="rounded-xl border p-4">
//               <p className="text-xs text-muted-foreground">Category</p>
//               <p className="mt-1 font-medium">{product.category}</p>
//             </div>

//             <div className="rounded-xl border p-4">
//               <p className="text-xs text-muted-foreground">Seller</p>
//               <p className="mt-1 font-medium">
//                 {product.sellerName || "Vault Vogue Partner"}
//               </p>
//             </div>

//             <div className="rounded-xl border p-4">
//               <p className="text-xs text-muted-foreground">Sizes</p>
//               <p className="mt-1 font-medium">
//                 {product.availableSizes.join(", ")}
//               </p>
//             </div>

//             <div className="rounded-xl border p-4">
//               <p className="text-xs text-muted-foreground">Product ID</p>
//               <p className="mt-1 font-medium">{product.id}</p>
//             </div>
//           </div>
//         </div>

//         {/* REVIEWS */}
//         <div className="space-y-4">
//           <h2 className="text-lg font-semibold">Reviews</h2>

//           {reviewItems.map((review) => (
//             <div key={review.name} className="rounded-xl border p-4">
//               <div className="flex justify-between">
//                 <p className="font-medium">{review.name}</p>
//                 <p className="text-amber-500">{"★".repeat(review.rating)}</p>
//               </div>

//               <p className="mt-2 text-sm text-muted-foreground">
//                 {review.comment}
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import { useMemo, useState, useCallback } from "react";
import { ProductGallery } from "./ProductGallery";
import { SizeSelector } from "./SizeSelector";
import { AddToCartSection } from "./AddToCartSection";
import { Reviews } from "./Reviews";
import { resolveProductImage } from "@/utility/utils";
import { ShieldCheck, Truck } from "lucide-react";

import {
  ProductDetail,
  ProductVariant,
} from "@/utility/types/productVariant";

const FALLBACK_IMAGE =
  "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 700'%3E%3Crect width='600' height='700' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle' fill='%239ca3af' font-family='Arial, sans-serif' font-size='24'%3ENo image%3C/text%3E%3C/svg%3E";

export default function ProductDetailsView({
  product,
  suggestionsSection,
}: {
  product: ProductDetail;
  suggestionsSection: React.ReactNode;
}) {
  const [selectedSize, setSelectedSize] = useState<string | null>(() => {
    return product?.variants?.[0]?.attributes?.size ?? null;
  });

  // 🔥 O(1) variant lookup
  const variantMap = useMemo(() => {
    const map: Record<string, ProductVariant> = {};

    for (const v of product.variants ?? []) {
      if (v.attributes?.size) {
        map[v.attributes.size] = v;
      }
    }

    return map;
  }, [product.variants]);

  const sizes = useMemo(() => {
    return (product.variants ?? []).map((v) => ({
      size: v.attributes.size,
      variantId: v.variantId, // ✅ use correct id
      stock: v.stock,
    }));
  }, [product.variants]);

  const stockMap = useMemo(() => {
    const map: Record<string, number> = {};

    for (const v of product.variants ?? []) {
      if (v.attributes?.size) {
        map[v.attributes.size] = Number(v.stock ?? 0);
      }
    }

    return map;
  }, [product.variants]);

  const selectedVariant: ProductVariant | undefined = selectedSize
    ? variantMap[selectedSize]
    : undefined;

  const gallery = useMemo(() => {
    return product.images?.length
      ? product.images.map((img) => resolveProductImage(img as string))
      : [FALLBACK_IMAGE];
  }, [product.images]);

  const handleSizeSelect = useCallback((size: string) => {
    setSelectedSize(size);
  }, []);

  return (
    <section className="mx-auto w-full px-4 py-10">
      <div className="grid gap-12 xl:grid-cols-[1.2fr_1fr_360px]">
        {/* LEFT */}
        <ProductGallery gallery={gallery} productName={product.name} />

        {/* CENTER & RIGHT - Main Content & Sticky Box */}
        <div className="space-y-8 lg:pr-8">
          <div className="space-y-4">
            <p className="text-sm font-medium tracking-wider text-muted-foreground uppercase">{product.category}</p>
            <h1 className="font-cormorant font-medium text-4xl leading-tight lg:text-6xl text-foreground">
              {product.name}
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="flex items-baseline gap-4">
            <p className="text-4xl font-semibold sale-text">
              ${product.price.toLocaleString()}
            </p>
            {product.originalPrice && product.originalPrice > product.price && (
              <p className="text-xl line-through text-muted-foreground">
                ${product.originalPrice.toLocaleString()}
              </p>
            )}
          </div>

          <SizeSelector
            sizes={sizes}
            selectedSize={selectedSize}
            onSelect={handleSizeSelect}
            stockMap={stockMap}
          />
          {/* TRUST BADGES */}
          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground pt-4 border-t">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-foreground/70" />
              <span>Fast delivery available</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-foreground/70" />
              <span>Secure checkout</span>
            </div>
          </div>
        </div>

        {/* RIGHT (Sticky Buy Box on Desktop) */}
        <div className="relative">
          <div className="sticky top-24 space-y-6 rounded-2xl border bg-card/80 backdrop-blur-xl p-6 shadow-sm">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Price</p>
              <p className="text-2xl font-semibold sale-text">
                ${product.price.toLocaleString()}
              </p>
            </div>
            <AddToCartSection
              product={product}
              selectedVariant={selectedVariant}
            />
          </div>
        </div>
        
        {/* REVIEWS (Desktop Bottom) */}
        <div className="max-lg:hidden lg:col-span-2">
          <Reviews />
        </div>
      </div>

      {suggestionsSection}
      {/* RIGHT */}
      <div className="lg:hidden">
        <Reviews />
      </div>
    </section>
  );
}
