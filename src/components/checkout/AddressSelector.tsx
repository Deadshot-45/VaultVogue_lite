"use client";

import React, { useState } from "react";
import { Plus, Edit2, Check, Mail, Phone, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

interface AddressSelectorProps {
  selectedAddressId: string;
  onSelectAddress: (id: string) => void;
  addresses: Address[];
  onAddAddress: (address: Omit<Address, "id">) => void;
  onUpdateAddress: (address: Address) => void;
}

export function AddressSelector({
  selectedAddressId,
  onSelectAddress,
  addresses,
  onAddAddress,
  onUpdateAddress,
}: AddressSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  // Form State
  const [formData, setFormData] = useState<Omit<Address, "id">>({
    fullName: "",
    phone: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "India",
    zipCode: "",
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof Address, string>>>({});

  const handleOpenAdd = () => {
    setEditingAddress(null);
    setFormData({
      fullName: "",
      phone: "",
      email: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      country: "India",
      zipCode: "",
    });
    setFormErrors({});
    setIsOpen(true);
  };

  const handleOpenEdit = (addr: Address, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card selection on edit click
    setEditingAddress(addr);
    setFormData({
      fullName: addr.fullName,
      phone: addr.phone,
      email: addr.email,
      addressLine1: addr.addressLine1,
      addressLine2: addr.addressLine2 || "",
      city: addr.city,
      state: addr.state,
      country: addr.country,
      zipCode: addr.zipCode,
    });
    setFormErrors({});
    setIsOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof Address]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const errors: Partial<Record<keyof Address, string>> = {};
    if (!formData.fullName.trim()) errors.fullName = "Full name is required";
    if (!formData.phone.trim() || formData.phone.length < 10) {
      errors.phone = "Valid phone number is required";
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Valid email is required";
    }
    if (!formData.addressLine1.trim()) errors.addressLine1 = "Address is required";
    if (!formData.city.trim()) errors.city = "City is required";
    if (!formData.state.trim()) errors.state = "State is required";
    if (!formData.zipCode.trim() || formData.zipCode.length < 6) {
      errors.zipCode = "6-digit PIN code is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingAddress) {
      onUpdateAddress({
        ...formData,
        id: editingAddress.id,
      });
    } else {
      onAddAddress(formData);
    }
    setIsOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-cormorant text-2xl font-light text-[var(--brand-text)] flex items-center gap-2">
          <MapPin className="h-5 w-5 text-[var(--gold)]" />
          Shipping Address
        </h3>
        <Button
          type="button"
          onClick={handleOpenAdd}
          variant="outline"
          className="h-9 px-3 border-[var(--gold-soft)] text-[var(--gold)] hover:bg-[var(--gold-glow)] text-xs font-semibold flex items-center gap-1.5 rounded-lg active:scale-95 transition-all"
        >
          <Plus className="h-3.5 w-3.5" />
          Add New Address
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {addresses.map((addr) => {
          const isSelected = selectedAddressId === addr.id;
          return (
            <Card
              key={addr.id}
              onClick={() => onSelectAddress(addr.id)}
              className={`relative cursor-pointer overflow-hidden rounded-2xl border transition-all duration-300 ${
                isSelected
                  ? "border-blue-500 bg-blue-500/[0.02] shadow-[0_4px_20px_-4px_rgba(59,130,246,0.12)]"
                  : "border-border/40 hover:border-slate-300 bg-white"
              }`}
            >
              {isSelected && (
                <div className="absolute right-3 top-3 h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center shadow-md">
                  <Check className="h-3 w-3 text-white" />
                </div>
              )}
              <CardContent className="p-5 space-y-3 text-xs text-left">
                <div className="pr-6">
                  <p className="font-bold text-sm text-[var(--brand-text)]">{addr.fullName}</p>
                </div>

                <div className="space-y-1.5 text-muted-foreground">
                  <p className="leading-relaxed">
                    {addr.addressLine1}
                    {addr.addressLine2 ? `, ${addr.addressLine2}` : ""}
                  </p>
                  <p className="font-medium text-[var(--brand-text)]">
                    {addr.city}, {addr.state} - {addr.zipCode}
                  </p>
                  <p>{addr.country}</p>
                </div>

                <div className="flex flex-col gap-1 border-t border-slate-100 pt-3 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-3 w-3 text-[var(--gold-soft)]" />
                    {addr.phone}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-3 w-3 text-[var(--gold-soft)] text-ellipsis overflow-hidden truncate max-w-[220px]" />
                    {addr.email}
                  </span>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={(e) => handleOpenEdit(addr, e)}
                    className="h-8 px-2.5 text-[10px] text-muted-foreground hover:text-[var(--brand-text)] hover:bg-slate-50 rounded-md font-semibold flex items-center gap-1"
                  >
                    <Edit2 className="h-3 w-3" />
                    Edit Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add/Edit Address Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6 bg-white border border-border">
          <DialogHeader>
            <DialogTitle className="font-cormorant text-2xl font-light text-[var(--brand-text)]">
              {editingAddress ? "Edit Shipping Address" : "Add New Shipping Address"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-left">
            <div className="space-y-1">
              <Label htmlFor="fullName" className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Full Name
              </Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Receiver Name"
                className={`h-11 text-xs border-[var(--gold-faint)] focus-visible:border-[var(--gold)] ${formErrors.fullName ? "border-red-500" : ""}`}
              />
              {formErrors.fullName && (
                <p className="text-[9px] text-red-500 mt-0.5">{formErrors.fullName}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="phone" className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="10-digit number"
                  className={`h-11 text-xs border-[var(--gold-faint)] focus-visible:border-[var(--gold)] ${formErrors.phone ? "border-red-500" : ""}`}
                />
                {formErrors.phone && (
                  <p className="text-[9px] text-red-500 mt-0.5">{formErrors.phone}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="email" className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="email@domain.com"
                  className={`h-11 text-xs border-[var(--gold-faint)] focus-visible:border-[var(--gold)] ${formErrors.email ? "border-red-500" : ""}`}
                />
                {formErrors.email && (
                  <p className="text-[9px] text-red-500 mt-0.5">{formErrors.email}</p>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="addressLine1" className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Street Address
              </Label>
              <Input
                id="addressLine1"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleInputChange}
                placeholder="Avenue / Street / Suite / Flat"
                className={`h-11 text-xs border-[var(--gold-faint)] focus-visible:border-[var(--gold)] ${formErrors.addressLine1 ? "border-red-500" : ""}`}
              />
              {formErrors.addressLine1 && (
                <p className="text-[9px] text-red-500 mt-0.5">{formErrors.addressLine1}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="addressLine2" className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Landmarks / Apartment details (Optional)
              </Label>
              <Input
                id="addressLine2"
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleInputChange}
                placeholder="Near landmarks, floor, wing, etc."
                className="h-11 text-xs border-[var(--gold-faint)] focus-visible:border-[var(--gold)]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="city" className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  City
                </Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="City"
                  className={`h-11 text-xs border-[var(--gold-faint)] focus-visible:border-[var(--gold)] ${formErrors.city ? "border-red-500" : ""}`}
                />
                {formErrors.city && (
                  <p className="text-[9px] text-red-500 mt-0.5">{formErrors.city}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="state" className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  State
                </Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="State"
                  className={`h-11 text-xs border-[var(--gold-faint)] focus-visible:border-[var(--gold)] ${formErrors.state ? "border-red-500" : ""}`}
                />
                {formErrors.state && (
                  <p className="text-[9px] text-red-500 mt-0.5">{formErrors.state}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="zipCode" className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  ZIP / PIN Code
                </Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  placeholder="6-digit PIN code"
                  className={`h-11 text-xs border-[var(--gold-faint)] focus-visible:border-[var(--gold)] ${formErrors.zipCode ? "border-red-500" : ""}`}
                />
                {formErrors.zipCode && (
                  <p className="text-[9px] text-red-500 mt-0.5">{formErrors.zipCode}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="country" className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Country
                </Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  disabled
                  className="h-11 text-xs border-[var(--gold-faint)] bg-muted/30 cursor-not-allowed rounded-lg"
                />
              </div>
            </div>

            <DialogFooter className="pt-4 border-t border-slate-100 flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="h-10 text-xs font-semibold rounded-lg flex-1 border-slate-200"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="btn-primary h-10 text-xs font-semibold rounded-lg flex-1 active:scale-95 transition-all text-slate-100"
              >
                {editingAddress ? "Save Changes" : "Save Address"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
