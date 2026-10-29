import type { Metadata } from "next";
import { CategoryPage } from "@/components/shop/CategoryPage";

export const metadata: Metadata = {
  title: "Women's Collection | VAULT VOGUE",
  description:
    "Explore the VAULT VOGUE Women's archive — flowing silk silhouettes, sculpted tailoring, cashmere outerwear, and architectural accessories.",
};

export default function WomensPage() {
  return <CategoryPage categoryKey="women" />;
}
