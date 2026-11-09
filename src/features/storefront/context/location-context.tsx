"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { DeliveryLocation, LocationLookupResult } from "../types/location";

interface LocationContextValue {
  location: DeliveryLocation | null;
  setLocation: (loc: DeliveryLocation) => void;
  clearLocation: () => void;
  isLocationSelected: boolean;
  isHydrated: boolean;

  dialogOpen: boolean;
  openLocationDialog: () => void;
  closeLocationDialog: () => void;
  setDialogOpen: (open: boolean) => void;

  isLoading: boolean;
  error: string | null;
  searchPincode: (pin: string) => Promise<LocationLookupResult>;
  detectCurrentLocation: () => Promise<LocationLookupResult>;
}

const LOCATION_STORAGE_KEY = "vault-vogue-delivery-location";
const LocationContext = createContext<LocationContextValue | null>(null);

function isValidStoredLocation(obj: unknown): obj is DeliveryLocation {
  if (!obj || typeof obj !== "object") return false;
  const candidate = obj as Record<string, unknown>;
  return (
    typeof candidate.pincode === "string" &&
    /^\d{6}$/.test(candidate.pincode) &&
    typeof candidate.city === "string" &&
    typeof candidate.state === "string" &&
    Array.isArray(candidate.postOffices)
  );
}

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocationState] = useState<DeliveryLocation | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Restore persisted location on client mount
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(LOCATION_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (isValidStoredLocation(parsed)) {
          setLocationState(parsed);
        } else {
          window.localStorage.removeItem(LOCATION_STORAGE_KEY);
        }
      }
    } catch {
      window.localStorage.removeItem(LOCATION_STORAGE_KEY);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  const setLocation = useCallback((loc: DeliveryLocation) => {
    setLocationState(loc);
    try {
      window.localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(loc));
    } catch {
      // Storage quota or privacy mode
    }
  }, []);

  const clearLocation = useCallback(() => {
    setLocationState(null);
    try {
      window.localStorage.removeItem(LOCATION_STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const openLocationDialog = useCallback(() => setDialogOpen(true), []);
  const closeLocationDialog = useCallback(() => setDialogOpen(false), []);

  // 1. Search by 6-digit Pincode
  const searchPincode = useCallback(
    async (pin: string): Promise<LocationLookupResult> => {
      const cleanPin = pin.trim().replace(/\s+/g, "");
      if (!/^\d{6}$/.test(cleanPin)) {
        const err = "Please enter a valid 6-digit Indian pincode.";
        setError(err);
        return { success: false, error: err };
      }

      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/location/pincode/${cleanPin}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          const err =
            data.error || `No postal delivery found for pincode ${cleanPin}.`;
          setError(err);
          return { success: false, error: err };
        }

        return {
          success: true,
          pincode: data.pincode,
          city: data.city,
          district: data.district,
          state: data.state,
          postOffices: data.postOffices || [],
          isServiceable: true,
        };
      } catch {
        const err = "Unable to connect to location service. Please try again.";
        setError(err);
        return { success: false, error: err };
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  // 2. Detect Current Location using Geolocation API + Route Handler Reverse Geocode
  const detectCurrentLocation =
    useCallback(async (): Promise<LocationLookupResult> => {
      if (typeof window === "undefined" || !("geolocation" in navigator)) {
        const err = "Geolocation is not supported by your browser.";
        setError(err);
        return { success: false, error: err };
      }

      setIsLoading(true);
      setError(null);

      return new Promise<LocationLookupResult>((resolve) => {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              const res = await fetch("/api/location/reverse-geocode", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ latitude, longitude }),
              });

              const data = await res.json();
              setIsLoading(false);

              if (!res.ok || !data.success) {
                const err =
                  data.error ||
                  "Could not resolve postal code from GPS coordinates.";
                setError(err);
                resolve({ success: false, error: err });
                return;
              }

              resolve({
                success: true,
                pincode: data.pincode,
                city: data.city,
                district: data.district,
                state: data.state,
                locality: data.locality,
                postOffices: data.postOffices || [],
                isServiceable: true,
              });
            } catch {
              setIsLoading(false);
              const err = "Failed to reverse-geocode location.";
              setError(err);
              resolve({ success: false, error: err });
            }
          },
          (geoError) => {
            setIsLoading(false);
            let message = "Unable to determine current position.";
            switch (geoError.code) {
              case geoError.PERMISSION_DENIED:
                message =
                  "Location permission denied. Please enter your 6-digit pincode manually.";
                break;
              case geoError.POSITION_UNAVAILABLE:
                message =
                  "Location information is currently unavailable. Please enter pincode.";
                break;
              case geoError.TIMEOUT:
                message =
                  "Location detection timed out. Please enter your pincode manually.";
                break;
            }
            setError(message);
            resolve({ success: false, error: message });
          },
          { enableHighAccuracy: true, timeout: 9000, maximumAge: 60000 },
        );
      });
    }, []);

  const value = useMemo(
    () => ({
      location,
      setLocation,
      clearLocation,
      isLocationSelected: Boolean(location?.pincode),
      isHydrated,
      dialogOpen,
      openLocationDialog,
      closeLocationDialog,
      setDialogOpen,
      isLoading,
      error,
      searchPincode,
      detectCurrentLocation,
    }),
    [
      location,
      setLocation,
      clearLocation,
      isHydrated,
      dialogOpen,
      openLocationDialog,
      closeLocationDialog,
      isLoading,
      error,
      searchPincode,
      detectCurrentLocation,
    ],
  );

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
}
