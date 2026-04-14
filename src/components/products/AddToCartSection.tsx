"use client";

import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { resolveProductImage, updateCartCache } from "@/utility/utils";
import { CartListItem } from "@/lib/query/useCart";
import { ProductDetail, ProductVariant } from "@/utility/types/productVariant";
import { AddToCartButton } from "./AddtoCart";
import { useEffect } from "react";
import { useAppSelector } from "@/lib/store/hooks";

export const AddToCartSection = ({
  product,
  selectedVariant,
}: {
  product: ProductDetail;
  selectedVariant?: ProductVariant;
}) => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ variantId }: { variantId: string }) => {
      if (isAuthenticated) {
        const res = await fetch("/api/cart", {
          method: "POST",
          body: JSON.stringify({ variantId }),
        });

        console.log(res);

        if (!res.ok) {
          throw new Error("Failed to add to cart"); // ✅ forces onError
        }

        return res.json();
      }
    },

    onMutate: async () => {
      if (!selectedVariant || !isAuthenticated) return { prev: [] }; // ✅ always return ctx

      await queryClient.cancelQueries({ queryKey: ["cart"] });

      const prev = queryClient.getQueryData<CartListItem[]>(["cart"]) ?? [];

      queryClient.setQueryData<CartListItem[]>(["cart"], (old) => {
        const safeOld = old ?? [];

        return updateCartCache(safeOld, {
          variantId: selectedVariant.variantId,
          productId: product.id,
          name: product.name,
          price: selectedVariant.price,
          image: resolveProductImage(selectedVariant.images?.[0]?.url ?? ""),
          size: selectedVariant.attributes?.size ?? "",
          sellerId: product.sellerId,
          priceSnapshot: selectedVariant.price,
        });
      });

      return { prev };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) {
        queryClient.setQueryData(["cart"], ctx.prev);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"], exact: true });
    },
  });

  useEffect(() => {
    if (mutation.isSuccess) {
      const t = setTimeout(() => {
        mutation.reset();
      }, 1500);

      return () => clearTimeout(t);
    }
  }, [mutation.isSuccess]);

  const handleAdd = () => {
    if (!selectedVariant) return;

    mutation.mutate({
      variantId: selectedVariant.variantId,
    });
  };

  return (
    <div className="space-y-3">
      <AddToCartButton
        onAdd={handleAdd}
        disabled={!selectedVariant || selectedVariant.isOutOfStock}
        isLoading={mutation.isPending}
        isSuccess={mutation.isSuccess}
        isError={mutation.isError}
        className="w-full"
      />

      <Button variant="outline" className="w-full">
        Buy Now
      </Button>
    </div>
  );
};
