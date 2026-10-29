import type { Metadata } from "next";
import { CategoryPage } from "@/components/shop/CategoryPage";

export const metadata: Metadata = {
  title: "Kids' Collection | VAULT VOGUE",
  description:
    "Explore the VAULT VOGUE Junior archive — 100% GOTS organic cottons, sensory-friendly knitwear, and play-proof luxury streetwear for petites.",
};

export default function KidsPage() {
  return <CategoryPage categoryKey="kids" />;
}
