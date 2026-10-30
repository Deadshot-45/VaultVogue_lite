"use client";

import { useState } from "react";
import { Check, Heart, ShoppingBag, Truck, ShieldCheck, RotateCcw, MapPin } from "lucide-react";
import { toast } from "sonner";
import type { VariantColor, VariantProduct, VariantSize } from "@/features/storefront/types/variant";
import { useStorefront } from "@/features/storefront/context/storefront-context";

interface ProductPurchaseActionsProps {
  product: VariantProduct;
  color: VariantColor;
  size: VariantSize;
  quantity: number;
}

export function ProductPurchaseActions({
  product,
  color,
  size,
  quantity,
}: ProductPurchaseActionsProps) {
  const { addToCart, openCart, toggleWishlist, isInWishlist } = useStorefront();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [pincode, setPincode] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState<string | null>(null);

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
      toast.success(`Added ${product.name} (${color.name} / ${size}) to your bag.`);
      openCart();
      setTimeout(() => setJustAdded(false), 2200);
    } else {
      toast.error("Maximum available atelier stock already reached in your bag.");
    }
  };

  const handleWishlistToggle = () => {
    toggleWishlist(product);
    if (!inWishlist) {
      toast.success(`Archived ${product.name} to your Wishlist.`);
    } else {
      toast.info(`Removed ${product.name} from your Wishlist.`);
    }
  };

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pincode.trim();
    if (!cleanPin || cleanPin.length < 4) {
      setDeliveryStatus("Please enter a valid postal or ZIP code.");
      return;
    }
    setDeliveryStatus("Insured air-courier available · Expected delivery within 2–4 business days.");
  };

  return (
    <div className="space-y-6">
      {/* Primary CTAs: Add to Bag & Wishlist */}
      <div className="flex gap-3">
        <button
          type="button"
          disabled={!isAvailable || isAdding}
          onClick={handleAddToCart}
          className="flex min-h-14 flex-1 items-center justify-center gap-2.5 bg-[var(--vault-accent)] px-6 font-mono text-xs font-bold uppercase tracking-[0.16em] text-white transition-all hover:opacity-90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer shadow-sm"
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
              ? "border-[var(--vault-accent)] bg-[var(--vault-accent)]/10 text-[var(--vault-accent)]"
              : "border-[var(--vault-line)] text-[var(--vault-ink)] hover:border-[var(--vault-accent)] hover:text-[var(--vault-accent)]"
          }`}
        >
          <Heart size={18} className={inWishlist ? "fill-[var(--vault-accent)]" : ""} />
        </button>
      </div>

      {/* Pincode Delivery Availability Checker */}
      <div className="border border-[var(--vault-line)] bg-[var(--vault-panel)] p-4 space-y-2.5">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-[var(--vault-muted)]">
          <MapPin size={12} className="text-[var(--vault-accent)]" />
          <span>Check Delivery Availability</span>
        </div>

        <form onSubmit={handlePincodeCheck} className="flex gap-2">
          <input
            type="text"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            placeholder="Enter ZIP / Postal Code"
            className="flex-1 border border-[var(--vault-line)] bg-[var(--vault-canvas)] px-3 py-2 font-mono text-xs text-[var(--vault-ink)] placeholder:text-[var(--vault-muted)]/60 focus:border-[var(--vault-accent)] focus:outline-none"
          />
          <button
            type="submit"
            className="border border-[var(--vault-line)] px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-[var(--vault-ink)] hover:border-[var(--vault-accent)] hover:text-[var(--vault-accent)] transition-colors cursor-pointer"
          >
            Check
          </button>
        </form>

        {deliveryStatus && (
          <p className="font-mono text-[10px] text-[var(--vault-accent)] leading-relaxed animate-in fade-in">
            {deliveryStatus}
          </p>
        )}
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-[var(--vault-line)] pt-4 pb-1">
        <div className="flex items-start gap-2.5 font-mono text-[9px] uppercase tracking-wider text-[var(--vault-muted)]">
          <Truck size={14} className="text-[var(--vault-accent)] shrink-0 mt-0.5" />
          <span>Insured Global Air Express</span>
        </div>
        <div className="flex items-start gap-2.5 font-mono text-[9px] uppercase tracking-wider text-[var(--vault-muted)]">
          <ShieldCheck size={14} className="text-[var(--vault-accent)] shrink-0 mt-0.5" />
          <span>100% Vault Authenticated</span>
        </div>
        <div className="flex items-start gap-2.5 font-mono text-[9px] uppercase tracking-wider text-[var(--vault-muted)]">
          <RotateCcw size={14} className="text-[var(--vault-accent)] shrink-0 mt-0.5" />
          <span>Complimentary 14-Day Returns</span>
        </div>
      </div>
    </div>
  );
}
