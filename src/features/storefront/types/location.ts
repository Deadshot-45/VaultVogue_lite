export interface DeliveryLocation {
  pincode: string;
  city: string;
  district: string;
  state: string;
  locality?: string;
  selectedLocality?: string;
  postOffices: string[];
  source: "manual" | "current-location";
  status: "verified" | "unverified";
  isServiceable: boolean;
  updatedAt: number;
}

export interface LocationLookupResult {
  success: boolean;
  pincode?: string;
  city?: string;
  district?: string;
  state?: string;
  locality?: string;
  selectedLocality?: string;
  postOffices?: string[];
  isServiceable?: boolean;
  location?: DeliveryLocation;
  error?: string;
}
