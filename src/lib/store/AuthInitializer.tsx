"use client";

import { useEffect } from "react";
import { authService } from "@/lib/api/authServices";
import { getAuthCookie, isTokenExpired } from "@/lib/auth";
import { useAppDispatch } from "@/lib/store/hooks";
import { hydrateAuth } from "@/lib/store/slices/authSlice";
import { performAppLogout } from "@/lib/store/logout";

export function AuthInitializer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const syncAuth = async () => {
      const token = getAuthCookie();

      if (!token || isTokenExpired(token)) {
        await performAppLogout(dispatch);
        return;
      }

      authService.token = token;

      if (typeof window !== "undefined") {
        localStorage.setItem("authToken", token);
      }

      dispatch(
        hydrateAuth({
          token,
        }),
      );
    };

    void syncAuth();
  }, [dispatch]);

  return null;
}
