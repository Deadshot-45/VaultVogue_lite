import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CartItem, cartService } from "../api/cartServices";
import { useAppSelector } from "../store/hooks";

export interface CartListItem {
  variantId: string; // ✅ SINGLE SOURCE OF TRUTH

  productId: string;
  name: string;
  image: string;

  price: number;
  priceSnapshot: number;

  quantity: number;

  size?: string;
  color?: string;

  sellerId?: string;
  sellerName?: string;
  selectedSize?: string;
}

export interface CartItemIdentity {
  variantId: string;
}

export const normalizeCartItems = (items?: CartItem[]): CartListItem[] =>
  (items ?? [])
    .filter((item) => item.variantId || item.id)
    .map((item) => {
      const variantId = item.variantId ?? item.id;

      if (!variantId) {
        throw new Error("Cart item missing variantId");
      }

      return {
        variantId,

        productId: item.productId,

        name: item.name ?? item.product?.name ?? "Product",

        price: item.price ?? item.priceSnapshot ?? 0,
        priceSnapshot: item.priceSnapshot ?? item.price ?? 0,

        image:
          item.image ??
          item.product?.images?.find((img) => img.isPrimary)?.url ??
          item.product?.images?.[0]?.url ??
          "/images/placeholder.png",

        quantity: item.quantity,

        size: item.size,

        sellerId: item.sellerId,
        sellerName: item.sellerName,
      };
    });

export const useCart = (isEnable?: boolean) => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  return useQuery<CartItem[]>({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await cartService.getCartDetails();

      if (!res?.success) return [];

      return normalizeCartItems(res.data);
    },
    staleTime: 1000 * 60 * 5,
    enabled: isEnable || isAuthenticated,
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { variantId: string; quantity: number }) =>
      cartService.addToCart(payload),

    onMutate: async (newItem) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });

      const prev = queryClient.getQueryData<CartItem[]>(["cart"]);

      queryClient.setQueryData<CartItem[]>(["cart"], (old) => {
        const prevData = old ?? [];

        const exists = prevData.find((i) => i.variantId === newItem.variantId);

        if (exists) {
          return prevData.map((i) =>
            i.variantId === newItem.variantId
              ? {
                  ...i,
                  quantity: i.quantity + newItem.quantity, // ✅ FIX
                }
              : i,
          );
        }

        // ✅ optimistic but stable (no fake UI flicker)
        return [
          ...prevData,
          {
            variantId: newItem.variantId,
            productId: newItem.variantId, // fallback identity
            name: "", // keep empty instead of "Loading..."
            price: 0,
            image: "",
            quantity: newItem.quantity,
          },
        ];
      });

      return { prev };
    },

    onError: (_err, _newItem, ctx) => {
      if (ctx?.prev) {
        queryClient.setQueryData(["cart"], ctx.prev);
      }
    },

    onSuccess: (data) => {
      // ✅ BEST PRACTICE: sync exact server state
      if (data?.cart) {
        queryClient.setQueryData(["cart"], data.cart);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variantId: string) => cartService.removeCartItem(variantId),

    onMutate: async (variantId) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });

      const prev = queryClient.getQueryData<CartItem[]>(["cart"]);

      queryClient.setQueryData<CartItem[]>(["cart"], (old) => {
        const prevData = old ?? [];
        return prevData.filter((i) => i.variantId !== variantId);
      });

      return { prev };
    },

    onError: (_err, _id, ctx) => {
      if (ctx?.prev) {
        queryClient.setQueryData(["cart"], ctx.prev);
      }
    },

    onSuccess: (data) => {
      if (data?.cart) {
        queryClient.setQueryData(["cart"], data.cart);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const useDecrementFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variantId: string) =>
      cartService.decrementFromCart({ variantId, quantity: 1 }),

    onMutate: async (variantId) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });

      const prev = queryClient.getQueryData<CartItem[]>(["cart"]);

      queryClient.setQueryData<CartItem[]>(["cart"], (old = []) => {
        return old
          .map((item) => {
            if (item.variantId !== variantId) return item;

            const newQty = item.quantity - 1;

            // if quantity becomes 0 → remove it
            if (newQty <= 0) return null;

            return {
              ...item,
              quantity: newQty,
            };
          })
          .filter(Boolean) as CartItem[];
      });

      return { prev };
    },

    onError: (_err, _variantId, ctx) => {
      if (ctx?.prev) {
        queryClient.setQueryData(["cart"], ctx.prev);
      }
    },

    onSuccess: (data) => {
      // optional: if backend returns full cart
      if (data?.cart) {
        queryClient.setQueryData(["cart"], data.cart);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};
