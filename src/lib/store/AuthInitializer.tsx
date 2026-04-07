"use client";

import { useEffect } from "react";
import { authService } from "@/lib/api/authServices";
import { clearAuthCookie, getAuthCookie, isTokenExpired } from "@/lib/auth";
import { useAppDispatch } from "@/lib/store/hooks";
import { clearAuth, hydrateAuth } from "@/lib/store/slices/authSlice";

export function AuthInitializer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = getAuthCookie();

    if (!token || isTokenExpired(token)) {
      clearAuthCookie();
      authService.signOut();
      dispatch(clearAuth());
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
  }, [dispatch]);

  return null;
}
