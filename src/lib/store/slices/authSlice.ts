import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/lib/api/authServices";

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
}

const normalizeUser = (user: User | null | undefined): User | null => {
  if (!user) {
    return null;
  }

  return {
    ...user,
    id: user._id ?? user.id,
  };
};

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user: User | null }>,
    ) => {
      state.token = action.payload.token;
      state.user = normalizeUser(action.payload.user);
      state.isAuthenticated = true;
    },
    hydrateAuth: (
      state,
      action: PayloadAction<{ token: string | null; user?: User | null }>,
    ) => {
      state.token = action.payload.token;
      state.user = normalizeUser(action.payload.user);
      state.isAuthenticated = Boolean(action.payload.token);
    },
    clearAuth: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, hydrateAuth, clearAuth } = authSlice.actions;

export default authSlice.reducer;
