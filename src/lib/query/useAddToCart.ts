import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  cartService,
  getCartResponseItems,
  type AddToCartPayload,
  type CartResponse,
} from "../api/cartServices";
import { useAppDispatch } from "../store/hooks";
import { normalizeCartItems, setCartItems } from "../store/slices/cartSlice";

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation<CartResponse, Error, AddToCartPayload>({
    mutationFn: (payload) => cartService.addToCart(payload),
    onSuccess: (response) => {
      const cartItems = getCartResponseItems(response.cart);

      dispatch(setCartItems(normalizeCartItems(cartItems)));
      queryClient.invalidateQueries({ queryKey: ["cart-details"] });
    },
  });
};
