"use client";

import { Button } from "@/components/ui/button";
import { ProductDetail, ProductVariant } from "@/utility/types/productVariant";
import { AddToCartButton } from "./AddtoCart";
import { useAppSelector } from "@/lib/store/hooks";
import { useCartQueue } from "@/hooks/useCartQueue";
import {
  useAddToCart,
  useCart,
  useDecrementFromCart,
  useRemoveFromCart,
} from "@/lib/query/useCart";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";

export const AddToCartSection = ({
  product,
  selectedVariant,
}: {
  product: ProductDetail;
  selectedVariant?: ProductVariant;
}) => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
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

  // Find the cart item matching the selected variant
  const cartItem = cartItems.find(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (item: any) => item.variantId === selectedVariant?.variantId,
  );

  const handleAdd = () => {
    if (!isAuthenticated) {
      toast.error("Please sign in first");
      return;
    }

    if (!selectedVariant) {
      toast.error("Select a size first");
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

  return (
    <div className="space-y-3">
      {cartItem ? (
        <div className="flex items-center justify-between rounded-xl border p-3">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 transition-all duration-200 active:scale-95"
            onClick={handleDecrement}
          >
            <Minus size={16} />
          </Button>

          <span className="text-lg font-semibold">{cartItem.quantity}</span>

          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 transition-all duration-200 active:scale-95"
            onClick={handleAdd}
          >
            <Plus size={16} />
          </Button>
        </div>
      ) : (
        <AddToCartButton
          onAdd={handleAdd}
          disabled={
            !isAuthenticated ||
            !selectedVariant ||
            selectedVariant.isOutOfStock
          }
          isLoading={addToCart.isPending}
          isSuccess={addToCart.isSuccess}
          isError={addToCart.isError}
          className="w-full"
        />
      )}

      <Button
        variant="outline"
        className="w-full h-11 transition-all duration-200 active:scale-95 hover:bg-muted/50 rounded-xl"
      >
        Buy Now
      </Button>
    </div>
  );
};
