import type { Metadata } from "next";
import { CategoryPage } from "@/components/shop/CategoryPage";

export const metadata: Metadata = {
  title: "Men's Collection | VAULT VOGUE",
  description:
    "Explore the VAULT VOGUE Men's archive — technical outerwear, precision tailoring, heavyweight knitwear, and contemporary luxury streetwear.",
};

export default function MensPage() {
  return <CategoryPage categoryKey="men" />;
}
