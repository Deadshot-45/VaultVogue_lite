"use client";

import { useEffect, useState } from "react";
import { ProductDetail, ProductVariant } from "@/lib/utility/productVariant";
import { AddToCartButton } from "./AddtoCart";
import { useAppSelector } from "@/lib/store/hooks";
import { useCartQueue } from "@/hooks/useCartQueue";
import { useRouter } from "next/navigation";
import {
  useAddToCart,
  useCart,
  useDecrementFromCart,
  useRemoveFromCart,
} from "@/lib/queries/useCart";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { getAuthCookie } from "@/lib/auth";
import { openCartDrawer } from "@/features/cart-drawer";

export const AddToCartSection = ({
  product,
  selectedVariant,
}: {
  product: ProductDetail;
  selectedVariant?: ProductVariant;
}) => {
  const router = useRouter();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const showAuthenticated = mounted && isAuthenticated;

  const { data: cartItems = [] } = useCart();
  const addToCart = useAddToCart();
  const decrement = useDecrementFromCart();
  const remove = useRemoveFromCart();

  const { add: queueCartAction } = useCartQueue((actions) => {
    actions.forEach(({ variantId, delta }) => {
      if (delta === 0) {
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

  const cartItem = cartItems.find(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (item: any) => item.variantId === selectedVariant?.variantId,
  );

  const handleAdd = () => {
    const token = getAuthCookie();
    if (!token) {
      toast.error("Authentication required", {
        description: "Please sign in to add items to your bag.",
      });
      router.push("/login");
      return;
    }

    if (!selectedVariant) {
      toast.error("Please select a size first");
      return;
    }

    queueCartAction(selectedVariant.variantId, 1);
  };

  const handleDecrement = () => {
    if (!cartItem) return;

    if (cartItem.quantity <= 1) {
      queueCartAction(cartItem.variantId ?? "", 0);
      return;
    }

    queueCartAction(cartItem.variantId ?? "", -1);
  };

  const handleBuyNow = () => {
    const token = getAuthCookie();
    if (!token) {
      toast.error("Authentication required", {
        description: "Please sign in to buy items.",
      });
      router.push("/login");
      return;
    }

    if (!selectedVariant) {
      toast.error("Please select a size first");
      return;
    }

    if (!cartItem) {
      queueCartAction(selectedVariant.variantId, 1);
    }
    toast.success("Opening shopping bag...");
    openCartDrawer();
  };

  return (
    <div className="space-y-3.5">
      {cartItem ? (
        <div className="flex items-center justify-between rounded-full border border-border/40 p-1.5 bg-background/50">
          <button
            className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors cursor-pointer active:scale-90"
            onClick={handleDecrement}
          >
            <Minus size={14} />
          </button>

          <span className="text-sm font-semibold text-[var(--brand-text)]">{cartItem.quantity}</span>

          <button
            className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors cursor-pointer active:scale-90"
            onClick={handleAdd}
          >
            <Plus size={14} />
          </button>
        </div>
      ) : (
        <AddToCartButton
          onAdd={handleAdd}
          disabled={
            !selectedVariant ||
            selectedVariant.isOutOfStock
          }
          isLoading={addToCart.isPending}
          isError={addToCart.isError}
          className="w-full py-3.5"
        />
      )}

      <button
        onClick={handleBuyNow}
        className="btn-secondary w-full py-3 text-xs font-semibold uppercase tracking-wider transition-all duration-200 active:scale-[0.98] border-[var(--gold-soft)] text-[var(--gold)]"
      >
        Buy Now
      </button>
    </div>
  );
};
