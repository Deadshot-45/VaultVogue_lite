import { combineReducers } from "@reduxjs/toolkit";
import appReducer from "@/lib/store/slices/appSlice";
import authReducer from "@/lib/store/slices/authSlice";
import cartReducer from "@/lib/store/slices/cartSlice";

const rootReducer = combineReducers({
  app: appReducer,
  auth: authReducer,
  cart: cartReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
