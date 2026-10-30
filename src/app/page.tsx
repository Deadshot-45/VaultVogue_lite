import PageTransition from "@/components/layout/page-transition";
import { StorefrontHome } from "@/features/storefront/components/storefront-home";
import { StorefrontShell } from "@/features/storefront/components/storefront-shell";

export default function HomePage() {
  return (
    <StorefrontShell overlapHeader>
      <PageTransition>
        <StorefrontHome />
      </PageTransition>
    </StorefrontShell>
  );
}
