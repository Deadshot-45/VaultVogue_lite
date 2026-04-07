import { useQuery } from "@tanstack/react-query";
import { cartService, getCartResponseItems } from "../api/cartServices";
import { useAppDispatch } from "../store/hooks";
import { normalizeCartItems, setCartItems } from "../store/slices/cartSlice";

export const useCartDetails = ({ isEnable = true }: { isEnable: boolean }) => {
  const dispatch = useAppDispatch();

  return useQuery({
    queryKey: ["cart-details"],
    queryFn: async () => {
      const response = await cartService.getCartDetails();
      const cart = response.cart;
      const cartItems = getCartResponseItems(cart);

      if (response.success) {
        dispatch(setCartItems(normalizeCartItems(cartItems)));
      }

      return cart;
    },
    enabled: isEnable,
  });
};
