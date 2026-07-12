// ─── Admin Navigation ────────────────────────────────────────────────────────

export type AdminNavSection = {
  label: string;
  items: AdminNavItem[];
};

export type AdminNavItem = {
  label: string;
  href: string;
  icon: string;
  badge?: number;
};

// ─── Dashboard Stats ─────────────────────────────────────────────────────────

export type TrendDirection = 'up' | 'down' | 'neutral';

export type StatsCardData = {
  id: string;
  label: string;
  value: string;
  delta: string;
  trend: TrendDirection;
  icon: string;
  description?: string;
};

// ─── Revenue Chart ────────────────────────────────────────────────────────────

export type RevenueDataPoint = {
  month: string;
  revenue: number;
  orders: number;
};

// ─── Category Chart ───────────────────────────────────────────────────────────

export type CategoryDataPoint = {
  name: string;
  value: number;
  color: string;
};

// ─── Orders Table ─────────────────────────────────────────────────────────────

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type OrderRow = {
  id: string;
  customer: string;
  email: string;
  date: string;
  amount: number;
  status: OrderStatus;
  items: number;
};

// ─── Products Table ───────────────────────────────────────────────────────────

export type ProductRow = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'draft' | 'archived';
  image?: string;
};

// ─── Users Table ─────────────────────────────────────────────────────────────

export type UserRow = {
  id: string;
  fullName: string;
  email: string;
  role: 'admin' | 'seller' | 'user';
  joinedAt: string;
  orders: number;
  status: 'active' | 'suspended';
};

// ─── Sellers Table ────────────────────────────────────────────────────────────

export type SellerStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export type SellerRow = {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  category: string;
  joinedAt: string;
  status: SellerStatus;
  revenue: number;
  products: number;
};

// ─── Seller Onboarding ────────────────────────────────────────────────────────

export type SellerOnboardingStep = 1 | 2 | 3 | 4;

export type BusinessInfo = {
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  category: string;
  description: string;
  website?: string;
  gstNumber?: string;
};

export type BankDetails = {
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  ifscCode: string;
  accountType: 'savings' | 'current';
};

export type ProductListing = {
  productName: string;
  sku: string;
  price: string;
  category: string;
  description: string;
  moq: string; // Minimum Order Quantity
};

export type SellerOnboardingForm = {
  businessInfo: BusinessInfo;
  bankDetails: BankDetails;
  productListing: ProductListing;
  agreedToTerms: boolean;
};
