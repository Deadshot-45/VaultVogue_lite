"use client";

import { useState } from "react";
import {
  Check,
  Heart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
  MapPin,
  Navigation,
  Loader2,
  Clock,
  Banknote,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import type { VariantColor, VariantProduct, VariantSize } from "@/features/storefront/types/variant";
import { useStorefront } from "@/features/storefront/context/storefront-context";
import { useLocation } from "@/features/storefront/context/location-context";
import { usePathname, useRouter } from "next/navigation";
import { getAuthCookie } from "@/lib/auth";
import { useAddToCart } from "@/lib/queries/useCart";

interface ProductPurchaseActionsProps {
  product: VariantProduct;
  color: VariantColor;
  size: VariantSize;
  quantity: number;
  onAddToCartSuccess?: () => void;
}

function getEstimatedDeliveryDate(daysToAdd: number = 3): string {
  const date = new Date();
  let added = 0;
  while (added < daysToAdd) {
    date.setDate(date.getDate() + 1);
    if (date.getDay() !== 0) {
      added++;
    }
  }
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function ProductPurchaseActions({
  product,
  color,
  size,
  quantity,
  onAddToCartSuccess,
}: ProductPurchaseActionsProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useStorefront();
  const {
    location,
    setLocation,
    openLocationDialog,
    searchPincode,
    detectCurrentLocation,
    isHydrated,
    isLoading: isLocationLoading,
  } = useLocation();

  const router = useRouter();
  const pathName = usePathname();
  const buyNowMutation = useAddToCart();

  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [pincodeInput, setPincodeInput] = useState("");
  const [isCheckingPincode, setIsCheckingPincode] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const isAvailable = (color.stockBySize[size] ?? 0) > 0;
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    if (!isAvailable) {
      toast.error("This silhouette is currently out of stock in the chosen size.");
      return;
    }

    setIsAdding(true);
    const success = addToCart(product, color, size, quantity);
    setIsAdding(false);

    if (success) {
      setJustAdded(true);
      onAddToCartSuccess?.();
      toast.success(`Added ${product.name} (${color.name} / ${size}) to your bag.`);
      setTimeout(() => setJustAdded(false), 2200);
    } else {
      toast.error("Maximum available atelier stock already reached in your bag.");
    }
  };

  const handleBuyNow = () => {
    if (!isAvailable) {
      toast.error("This silhouette is currently out of stock in the chosen size.");
      return;
    }

    const token = getAuthCookie();
    if (!token) {
      toast.error("Authentication required", {
        description: "Please sign in to buy now.",
      });
      router.push(`/login?redirect=${encodeURIComponent(pathName)}`);
      return;
    }

    const variant = product.variants?.find(
      (v) =>
        v.size === size &&
        (!color.name || !v.color || v.color.toLowerCase() === color.name.toLowerCase()),
    );

    // Adds to the same API-backed bag that the checkout page reads.
    buyNowMutation.mutate(
      { variantId: variant?.id ?? product.id, quantity },
      {
        onSuccess: () => {
          router.push("/checkout");
        },
        onError: () => {
          toast.error("Unable to add item to your bag. Please try again.");
        },
      },
    );
  };

  const handleWishlistToggle = () => {
    toggleWishlist(product);
    if (!inWishlist) {
      toast.success(`Archived ${product.name} to your Wishlist.`);
    } else {
      toast.info(`Removed ${product.name} from your Wishlist.`);
    }
  };

  const handleDetectLocation = async () => {
    setLocalError(null);
    try {
      const res = await detectCurrentLocation();
      if (res.success && res.pincode && res.city) {
        const defaultLocality = res.locality || res.postOffices?.[0] || res.city;
        setLocation({
          pincode: res.pincode,
          city: res.city,
          district: res.district || res.city,
          state: res.state || "",
          locality: defaultLocality,
          selectedLocality: defaultLocality,
          postOffices: res.postOffices || [],
          source: "current-location",
          status: "verified",
          isServiceable: true,
          updatedAt: Date.now(),
        });
        toast.success(
          `Delivery location detected: ${res.city} (${res.pincode})`,
        );
      } else {
        setLocalError(res.error || "Unable to determine current location.");
      }
    } catch {
      setLocalError("Unable to retrieve location. Please enter pincode manually.");
    }
  };

  const handlePincodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pincodeInput.trim().replace(/\s+/g, "");
    if (!/^\d{6}$/.test(cleanPin)) {
      setLocalError("Please enter a valid 6-digit Indian PIN code.");
      return;
    }

    setIsCheckingPincode(true);
    setLocalError(null);

    try {
      const res = await searchPincode(cleanPin);
      if (res.success && res.pincode && res.city && res.state) {
        const defaultLocality = res.locality || res.postOffices?.[0] || res.city;
        setLocation({
          pincode: res.pincode,
          city: res.city,
          district: res.district || res.city,
          state: res.state,
          locality: defaultLocality,
          selectedLocality: defaultLocality,
          postOffices: res.postOffices || [],
          source: "manual",
          status: "verified",
          isServiceable: true,
          updatedAt: Date.now(),
        });
        toast.success(`Delivery verified for ${res.city} (${cleanPin})`);
        setPincodeInput("");
      } else {
        setLocalError(res.error || `PIN code ${cleanPin} not found.`);
      }
    } catch {
      setLocalError("Unable to verify pincode. Please try again.");
    } finally {
      setIsCheckingPincode(false);
    }
  };

  const hasSelectedLocation = isHydrated && !!location;
  const deliveryDateString = getEstimatedDeliveryDate(3);

  return (
    <div className="space-y-6">
      {/* Primary CTAs: Add to Bag & Wishlist */}
      <div className="flex gap-3">
        <button
          type="button"
          disabled={!isAvailable || isAdding}
          onClick={handleAddToCart}
          className="flex min-h-14 flex-1 items-center justify-center gap-2.5 bg-(--vault-accent) px-6 font-mono text-xs font-bold uppercase tracking-[0.16em] text-white transition-all hover:opacity-90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer shadow-sm"
        >
          {justAdded ? (
            <>
              <Check size={16} /> Added to Bag
            </>
          ) : isAvailable ? (
            <>
              <ShoppingBag size={16} /> Add to Bag · {quantity > 1 ? `(${quantity})` : ""}
            </>
          ) : (
            "Sold Out in Chosen Size"
          )}
        </button>

        <button
          type="button"
          onClick={handleWishlistToggle}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          className={`flex h-14 w-14 shrink-0 items-center justify-center border transition-all cursor-pointer ${
            inWishlist
              ? "border-(--vault-accent) bg-(--vault-accent)/10 text-(--vault-accent)"
              : "border-(--vault-line) text-(--vault-ink) hover:border-(--vault-accent) hover:text-(--vault-accent)"
          }`}
        >
          <Heart size={18} className={inWishlist ? "fill-(--vault-accent)" : ""} />
        </button>
      </div>

      {/* Buy Now: add to bag and proceed directly to checkout */}
      <button
        type="button"
        disabled={!isAvailable || isAdding || buyNowMutation.isPending}
        onClick={handleBuyNow}
        className="min-h-14 w-full flex items-center justify-center gap-2.5 border border-(--vault-line) bg-(--vault-panel) px-6 font-mono text-xs font-bold uppercase tracking-[0.16em] text-(--vault-ink) transition-all hover:bg-(--vault-accent)/10 hover:text-(--vault-accent) disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer shadow-sm"
      >
        {buyNowMutation.isPending ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <>
            <ArrowRight size={16} /> Buy Now &amp; Checkout
          </>
        )}
      </button>

      {/* Global Delivery Availability & Pincode Checker */}
      <div className="border border-(--vault-line) bg-(--vault-panel) p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-(--vault-muted)">
            <MapPin size={12} className="text-(--vault-accent)" />
            <span>Delivery Availability &amp; Dispatch</span>
          </div>

          {/* Change or Open Location Dialog Trigger */}
          <button
            type="button"
            onClick={openLocationDialog}
            className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-(--vault-accent) hover:underline cursor-pointer touch-manipulation focus-visible:ring-1 focus-visible:ring-(--vault-accent) focus-visible:outline-none"
          >
            <span>{hasSelectedLocation ? "Change Location" : "Choose on Map"}</span>
            <ArrowRight size={10} />
          </button>
        </div>

        {hasSelectedLocation ? (
          /* Active Selected Global Location Card */
          <div className="space-y-2 border-t border-(--vault-line)/60 pt-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-1.5 font-medium text-(--vault-ink)">
                <Check size={14} className="text-emerald-500 shrink-0" />
                Delivery by{" "}
                <span className="font-mono font-semibold text-(--vault-accent)">
                  {deliveryDateString}
                </span>
              </span>
              <span className="font-mono text-[9px] uppercase tracking-wider text-(--vault-muted) tabular-nums">
                2–3 Business Days
              </span>
            </div>

            <div className="flex items-center justify-between font-mono text-[10px] text-(--vault-muted)">
              <span className="truncate">
                Delivering to:{" "}
                <strong className="font-semibold text-(--vault-ink)">
                  {location.selectedLocality ? `${location.selectedLocality}, ` : ""}{location.city}
                  {location.state ? `, ${location.state}` : ""}
                </strong>{" "}
                ({location.pincode})
              </span>
              <button
                type="button"
                onClick={openLocationDialog}
                className="ml-2 font-mono text-[10px] uppercase text-(--vault-accent) hover:underline shrink-0 cursor-pointer"
              >
                Change
              </button>
            </div>

            <div className="space-y-1 pt-1 font-mono text-[9px] text-(--vault-muted) leading-relaxed">
              <p className="flex items-center gap-1.5">
                <Clock size={11} className="text-(--vault-cobalt) shrink-0" />
                <span>Atelier Dispatch within 24 hours via Insured Blue Dart Air Express</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Banknote size={11} className="text-emerald-500 shrink-0" />
                <span>Cash on Delivery (COD) &amp; Online Express checkout available</span>
              </p>
            </div>
          </div>
        ) : (
          /* Pincode Input Form & GPS Detection Button */
          <div className="space-y-2">
            <form onSubmit={handlePincodeSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={pincodeInput}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                    setPincodeInput(val);
                    if (localError) setLocalError(null);
                  }}
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="Enter 6-digit Indian PIN code"
                  className="w-full border border-(--vault-line) bg-(--vault-canvas) px-3 py-2 font-mono text-xs text-(--vault-ink) placeholder:text-(--vault-muted)/60 focus:border-(--vault-accent) focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={isCheckingPincode || pincodeInput.length !== 6}
                className="border border-(--vault-line) px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-(--vault-ink) hover:border-(--vault-accent) hover:text-(--vault-accent) disabled:opacity-50 transition-colors cursor-pointer"
              >
                {isCheckingPincode ? "Checking..." : "Check"}
              </button>
            </form>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={isLocationLoading}
                className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-(--vault-accent) hover:underline disabled:opacity-50 cursor-pointer touch-manipulation focus-visible:ring-1 focus-visible:ring-(--vault-accent) focus-visible:outline-none"
                aria-label="Detect my location using GPS"
              >
                {isLocationLoading ? (
                  <>
                    <Loader2 size={11} className="animate-spin text-(--vault-accent)" />
                    <span>Locating...</span>
                  </>
                ) : (
                  <>
                    <Navigation size={11} className="text-(--vault-accent)" />
                    <span>Use Current Location</span>
                  </>
                )}
              </button>
              <span className="font-mono text-[9px] text-(--vault-muted)">
                India Post 6-digit PIN
              </span>
            </div>

            {localError && (
              <p className="font-mono text-[10px] text-rose-500 leading-relaxed animate-in fade-in pt-1">
                {localError}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-(--vault-line) pt-4 pb-1">
        <div className="flex items-start gap-2.5 font-mono text-[9px] uppercase tracking-wider text-(--vault-muted)">
          <Truck size={14} className="text-(--vault-accent) shrink-0 mt-0.5" />
          <span>Insured Global Air Express</span>
        </div>
        <div className="flex items-start gap-2.5 font-mono text-[9px] uppercase tracking-wider text-(--vault-muted)">
          <ShieldCheck size={14} className="text-(--vault-accent) shrink-0 mt-0.5" />
          <span>100% Vault Authenticated</span>
        </div>
        <div className="flex items-start gap-2.5 font-mono text-[9px] uppercase tracking-wider text-(--vault-muted)">
          <RotateCcw size={14} className="text-(--vault-accent) shrink-0 mt-0.5" />
          <span>Complimentary 14-Day Returns</span>
        </div>
      </div>
    </div>
  );
}
