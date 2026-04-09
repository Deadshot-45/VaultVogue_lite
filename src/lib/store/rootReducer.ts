import { combineReducers, createAction } from "@reduxjs/toolkit";
import appReducer, { logOut } from "@/lib/store/slices/appSlice";
import authReducer from "@/lib/store/slices/authSlice";
import cartReducer from "@/lib/store/slices/cartSlice";

const appReducerCombined = combineReducers({
  app: appReducer,
  auth: authReducer,
  cart: cartReducer,
});

export const resetStore = createAction("root/resetStore");

const rootReducer = (
  state: ReturnType<typeof appReducerCombined> | undefined,
  action: { type: string },
) => {
  if (action.type === resetStore.type || action.type === logOut.type) {
    return appReducerCombined(undefined, action);
  }

  return appReducerCombined(state, action);
};

export type RootState = ReturnType<typeof appReducerCombined>;

export default rootReducer;
