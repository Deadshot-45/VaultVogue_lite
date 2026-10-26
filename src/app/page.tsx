import PageTransition from "@/components/layout/page-transition";
import { StorefrontHome } from "@/features/storefront/components/storefront-home";
import { StorefrontShell } from "@/features/storefront/components/storefront-shell";

export const unstable_instant = false;

export const instant = false;

export default function HomePage() {
  return (
    <StorefrontShell>
      <PageTransition>
        <StorefrontHome />
      </PageTransition>
    </StorefrontShell>
  );
}
