"use client";

import { StorefrontShell } from "@/features/storefront/components/storefront-shell";

interface Props {
  readonly children: React.ReactNode;
}

export default function MainLayout({ children }: Props) {
  return (
    <StorefrontShell>
      <>{children}</>
    </StorefrontShell>
  );
}
