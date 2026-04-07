import "@/index.css";
import type { Metadata } from "next";
import { Providers } from "./providers";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "Vault Vogue Lite",
  description: "Modern E-commerce Experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Analytics />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
