import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account | VAULT VOGUE",
  description:
    "Sign in or create your Vault Vogue account for faster checkout, saved favorites, and order tracking.",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative w-full min-h-screen bg-(--vault-bg) text-(--vault-ink) transition-colors duration-300">
      {children}
    </div>
  );
}
