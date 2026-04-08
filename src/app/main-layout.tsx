"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset } from "@/components/ui/sidebar";
import Footer from "@/layouts/Footer";
import PageTransition from "@/components/PageTransition";

interface Props {
  readonly children: React.ReactNode;
}

export default function MainLayout({ children }: Props) {
  return (
    <>
      <div className="min-lg:hidden">
        <AppSidebar />
      </div>

      <SidebarInset>
        <SiteHeader />
        <main className="min-h-[85vh] overflow-x-hidden overflow-y-auto no-scrollbar">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
      </SidebarInset>
    </>
  );
}
