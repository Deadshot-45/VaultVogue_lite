"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset } from "@/components/ui/sidebar";
import Footer from "@/layouts/Footer";

interface Props {
  readonly children: React.ReactNode;
}

export default function MainLayout({ children }: Props) {
  return (
    <>
      <AppSidebar />

      <SidebarInset>
        <SiteHeader />
        <main className="min-h-[85vh] overflow-x-hidden overflow-y-auto no-scrollbar">
          {children}
        </main>
        <Footer />
      </SidebarInset>
    </>
  );
}
