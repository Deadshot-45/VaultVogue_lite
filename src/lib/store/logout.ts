import { authService } from "@/lib/api/authServices";
import { clearAuthCookie } from "@/lib/auth";
import { logOut } from "@/lib/store/slices/appSlice";
import { clearPersistedStore } from "@/lib/store/store";
import type { AppDispatch } from "@/lib/store/store";

export const performAppLogout = async (dispatch: AppDispatch) => {
  clearAuthCookie();
  authService.signOut();
  await clearPersistedStore();
  dispatch(logOut());
};
