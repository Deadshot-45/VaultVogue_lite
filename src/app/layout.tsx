import "@/index.css";
import type { Metadata } from "next";
import { Providers } from "./providers";
import { Analytics } from "@vercel/analytics/next";
// import { SpeedInsights } from "@vercel/speed-insights/next";

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
      <body className="sale-theme">
        <Analytics />
        {/* <SpeedInsights /> */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
