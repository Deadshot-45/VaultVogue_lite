import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Vault Collection | All Products | VAULT VOGUE",
  description:
    "Find your next icon. Explore the complete VAULT VOGUE contemporary luxury streetwear catalog across Men, Women, and Kids silhouettes.",
  openGraph: {
    title: "The Vault Collection | VAULT VOGUE",
    description:
      "Find your next icon. Discover contemporary essentials, expressive silhouettes, and everyday pieces designed to move with you.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "VAULT VOGUE All Products Collection",
      },
    ],
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

