import { SellerGuard } from "@/features/seller/components/SellerGuard";
import { SellerSidebar } from "@/features/seller/components/SellerSidebar";
import { SellerHeader } from "@/features/seller/components/SellerHeader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vault Vogue — Seller Atelier",
  description: "Seller portal for managing products, tracking orders, and revenue insights",
};

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SellerGuard>
      <div className="flex h-screen w-dvw overflow-hidden bg-[var(--background)]">
        {/* Navigation Sidebar */}
        <div className="hidden lg:flex h-full">
          <SellerSidebar />
        </div>

        {/* Dashboard Main Area */}
        <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
          {/* Main Top Header */}
          <SellerHeader />

          {/* Main Scrollable Content Area */}
          <main
            className="flex-1 overflow-y-auto p-4 md:p-6 w-full max-w-7xl mx-auto no-scrollbar"
            style={{ background: "var(--background)" }}
          >
            {children}
          </main>
        </div>
      </div>
    </SellerGuard>
  );
}
