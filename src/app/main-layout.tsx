"use client";

import PageTransition from "@/components/layout/page-transition";
import { StorefrontShell } from "@/features/storefront/components/storefront-shell";

interface Props {
  readonly children: React.ReactNode;
}

export default function MainLayout({ children }: Props) {
  return (
    <StorefrontShell>
      <PageTransition>{children}</PageTransition>
    </StorefrontShell>
  );
}
