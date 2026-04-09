import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AppState {
  initialized: boolean;
}

const initialState: AppState = {
  initialized: true,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.initialized = action.payload;
    },
    logOut: () => initialState,
  },
});

export const { setInitialized, logOut } = appSlice.actions;

export default appSlice.reducer;
