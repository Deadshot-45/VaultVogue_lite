"use client";

import { useEffect, useState } from "react";
import {
  MapPin,
  Navigation,
  Loader2,
  Check,
  AlertCircle,
  Truck,
  ShieldCheck,
  Building,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation } from "../context/location-context";
import type { DeliveryLocation } from "../types/location";

export function LocationDialog() {
  const {
    location,
    setLocation,
    dialogOpen,
    closeLocationDialog,
    searchPincode,
    detectCurrentLocation,
  } = useLocation();

  const [pincodeInput, setPincodeInput] = useState("");
  const [selectedLocality, setSelectedLocality] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Staging state before confirming
  const [previewLocation, setPreviewLocation] =
    useState<DeliveryLocation | null>(null);

  // Sync with current global location when dialog opens
  useEffect(() => {
    if (dialogOpen) {
      setErrorMessage(null);
      if (location) {
        setPincodeInput(location.pincode);
        setSelectedLocality(location.locality || location.postOffices[0] || "");
        setPreviewLocation(location);
      } else {
        setPincodeInput("");
        setSelectedLocality("");
        setPreviewLocation(null);
      }
    }
  }, [dialogOpen, location]);

  const handlePincodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pincodeInput.trim().replace(/\s+/g, "");

    if (!/^\d{6}$/.test(cleanPin)) {
      setErrorMessage("Please enter an exact 6-digit numeric Indian pincode.");
      return;
    }

    setErrorMessage(null);
    setIsSearching(true);

    try {
      const result = await searchPincode(cleanPin);
      if (!result.success || !result.city || !result.state) {
        setErrorMessage(
          result.error || `No postal circles found for pincode ${cleanPin}.`,
        );
        setPreviewLocation(null);
      } else {
        const postOffices = result.postOffices || [];
        const defaultLocality = postOffices[0] || result.city;
        setSelectedLocality(defaultLocality);

        const newLoc: DeliveryLocation = {
          pincode: cleanPin,
          city: result.city,
          district: result.district || result.city,
          state: result.state,
          locality: defaultLocality,
          selectedLocality: defaultLocality,
          postOffices,
          source: "manual",
          status: "verified",
          isServiceable: true,
          updatedAt: Date.now(),
        };

        setPreviewLocation(newLoc);
      }
    } catch {
      setErrorMessage("Failed to verify pincode. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleDetectGps = async () => {
    setErrorMessage(null);
    setIsDetectingGps(true);

    try {
      const result = await detectCurrentLocation();
      if (!result.success || !result.pincode || !result.city) {
        setErrorMessage(
          result.error ||
            "Could not determine postal code from GPS. Please enter your pincode.",
        );
      } else {
        setPincodeInput(result.pincode);
        const postOffices = result.postOffices || [];
        const locality = result.locality || postOffices[0] || result.city;
        setSelectedLocality(locality);

        const newLoc: DeliveryLocation = {
          pincode: result.pincode,
          city: result.city,
          district: result.district || result.city,
          state: result.state || "",
          locality,
          selectedLocality: locality,
          postOffices,
          source: "current-location",
          status: "verified",
          isServiceable: true,
          updatedAt: Date.now(),
        };

        setPreviewLocation(newLoc);
        toast.success(
          `Location detected: ${result.city} (${result.pincode})`,
        );
      }
    } catch {
      setErrorMessage("GPS location lookup failed. Please enter pincode.");
    } finally {
      setIsDetectingGps(false);
    }
  };

  const handleConfirmLocation = () => {
    if (!previewLocation) return;

    const locName = selectedLocality || previewLocation.locality || previewLocation.selectedLocality;
    const confirmedLocation: DeliveryLocation = {
      ...previewLocation,
      locality: locName,
      selectedLocality: locName,
      updatedAt: Date.now(),
    };

    setLocation(confirmedLocation);
    toast.success(
      `Delivery location set to ${confirmedLocation.city} (${confirmedLocation.pincode})`,
    );
    closeLocationDialog();
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={(open) => !open && closeLocationDialog()}>
      <DialogContent className="border border-(--vault-line) bg-(--vault-canvas) text-(--vault-ink) sm:max-w-[480px] p-6 shadow-2xl">
        <DialogHeader className="space-y-1.5 text-left">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-(--vault-accent)">
            <MapPin size={13} className="text-(--vault-accent) shrink-0" />
            <span>Atelier Logistics Network</span>
          </div>
          <DialogTitle className="font-serif text-2xl font-light uppercase tracking-tight text-(--vault-ink)">
            Choose your delivery location
          </DialogTitle>
          <DialogDescription className="font-sans text-xs text-(--vault-muted) leading-relaxed font-light">
            Enter your postal code to calculate exact air-express delivery dates,
            COD eligibility, and regional warehouse dispatch windows.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-3">
          {/* Pincode Search Form */}
          <form onSubmit={handlePincodeSubmit} className="space-y-2">
            <label className="font-mono text-[10px] uppercase tracking-wider text-(--vault-muted)">
              6-Digit Indian Pincode
            </label>
            <div className="flex gap-2">
              <Input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={pincodeInput}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setPincodeInput(val);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="e.g. 452001 or 110001"
                className="font-mono text-sm tracking-widest border-(--vault-line) bg-(--vault-panel) text-(--vault-ink) placeholder:text-(--vault-muted)/50 focus-visible:ring-1 focus-visible:ring-(--vault-accent)"
              />
              <Button
                type="submit"
                disabled={isSearching || pincodeInput.length !== 6}
                className="shrink-0 bg-(--vault-accent) hover:bg-(--vault-accent)/90 text-white font-mono text-xs uppercase tracking-wider px-5 disabled:opacity-50"
              >
                {isSearching ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  "Check"
                )}
              </Button>
            </div>
          </form>

          {/* OR Divider */}
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-(--vault-line)" />
            </div>
            <span className="relative bg-(--vault-canvas) px-3 font-mono text-[9px] uppercase tracking-widest text-(--vault-muted)">
              OR
            </span>
          </div>

          {/* GPS Location Button */}
          <button
            type="button"
            onClick={handleDetectGps}
            disabled={isDetectingGps}
            className="w-full flex items-center justify-center gap-2.5 border border-(--vault-line) bg-(--vault-panel) hover:border-(--vault-accent) hover:text-(--vault-accent) text-(--vault-ink) py-3 px-4 transition-all duration-200 font-mono text-xs uppercase tracking-wider disabled:opacity-50 cursor-pointer shadow-sm active:scale-[0.99]"
          >
            {isDetectingGps ? (
              <>
                <Loader2 size={14} className="animate-spin text-(--vault-accent)" />
                <span>Acquiring Coordinates via GPS...</span>
              </>
            ) : (
              <>
                <Navigation size={14} className="text-(--vault-accent)" />
                <span>Use My Current Location</span>
              </>
            )}
          </button>

          {/* Error Banner */}
          {errorMessage && (
            <div className="flex items-start gap-2 border border-rose-500/30 bg-rose-500/10 p-3 text-rose-500 text-xs font-mono">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Search Result / Preview Location Card */}
          {previewLocation && (
            <div className="border border-(--vault-line) bg-(--vault-panel) p-4 space-y-3.5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-(--vault-line) pb-2.5">
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-(--vault-accent) font-semibold">
                  <Check size={13} className="text-emerald-500" />
                  Serviceable Postal Zone
                </span>
                <span className="font-mono text-xs font-bold tabular-nums text-(--vault-ink)">
                  {previewLocation.pincode}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-wider text-(--vault-muted)">
                    City / District
                  </p>
                  <p className="mt-0.5 font-medium text-(--vault-ink) truncate">
                    {previewLocation.city}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-wider text-(--vault-muted)">
                    State
                  </p>
                  <p className="mt-0.5 font-medium text-(--vault-ink) truncate">
                    {previewLocation.state}
                  </p>
                </div>
              </div>

              {/* Locality / Post Office Selector (When multiple exist) */}
              {previewLocation.postOffices &&
                previewLocation.postOffices.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <label className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-(--vault-muted)">
                      <Building size={11} className="text-(--vault-accent)" />
                      Select Local Area / Post Office ({previewLocation.postOffices.length} Available)
                    </label>
                    <select
                      value={selectedLocality}
                      onChange={(e) => setSelectedLocality(e.target.value)}
                      className="w-full border border-(--vault-line) bg-(--vault-canvas) px-3 py-2 font-mono text-xs text-(--vault-ink) focus:border-(--vault-accent) focus:outline-none"
                    >
                      {previewLocation.postOffices.map((po) => (
                        <option key={po} value={po}>
                          {po}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

              {/* Logistics SLA specs */}
              <div className="border-t border-(--vault-line)/60 pt-2.5 space-y-1 text-[10px] font-mono text-(--vault-muted)">
                <p className="flex items-center gap-1.5 text-(--vault-ink) font-medium">
                  <Truck size={12} className="text-(--vault-cobalt)" />
                  <span>Insured Air-Courier: Est. 2–3 Business Days</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <ShieldCheck size={12} className="text-emerald-500" />
                  <span>Cash on Delivery & Secure Online Checkout Eligible</span>
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={closeLocationDialog}
              className="border-(--vault-line) font-mono text-xs uppercase tracking-wider hover:bg-(--vault-panel)"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={!previewLocation}
              onClick={handleConfirmLocation}
              className="bg-(--vault-accent) hover:bg-(--vault-accent)/90 text-white font-mono text-xs uppercase tracking-wider px-6 disabled:opacity-50"
            >
              Confirm Location
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
