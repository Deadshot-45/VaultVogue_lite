import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vault Vogue — Admin Console",
  description: "Admin panel for Vault Vogue luxury e-commerce platform",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="flex h-screen overflow-hidden">
        <div className="hidden md:flex h-full">
          <AdminSidebar />
        </div>
        <div className="flex flex-1 flex-col min-w-0 w-dvw overflow-hidden">
          <AdminHeader />
            <main
              className="flex-1 overflow-y-auto p-4 md:p-6 w-full max-w-7xl mx-auto no-scrollbar"
              style={{ background: "var(--background)" }}
            >
              {children}
            </main>
        </div>
      </div>
    </AdminGuard>
  );
}
