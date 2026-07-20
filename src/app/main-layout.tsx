"use client";

import { AppSidebar } from "@/components/navigation/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarInset } from "@/components/ui/sidebar";
import Footer from "@/components/layout/footer";
import PageTransition from "@/components/layout/page-transition";

interface Props {
  readonly children: React.ReactNode;
}

export default function MainLayout({ children }: Props) {
  return (
    <>
      <div className="md:hidden">
        <AppSidebar />
      </div>

      <SidebarInset>
        <SiteHeader />
        <main className="min-h-[85vh] overflow-x-hidden overflow-y-auto no-scrollbar bg-[var(--background)]">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
      </SidebarInset>
    </>
  );
}
