"use client";

import { useDispatch, useSelector, useStore } from "react-redux";
import type { AppDispatch, AppStore } from "@/lib/store/store";
import type { RootState } from "@/lib/store/rootReducer";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();
