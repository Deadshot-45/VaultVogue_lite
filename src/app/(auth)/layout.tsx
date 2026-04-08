import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account | Vault Vogue",
  description:
    "Sign in or create your Vault Vogue account for faster checkout, saved favorites, and order tracking.",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(185,146,80,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(17,24,39,0.12),transparent_28%),linear-gradient(180deg,rgba(250,247,241,0.98),rgba(245,241,232,0.96))] dark:bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.12),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(148,163,184,0.08),transparent_24%),linear-gradient(180deg,rgba(10,14,20,0.98),rgba(12,18,27,0.98))]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[size:72px_72px] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)]" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.7),transparent_62%)] blur-3xl dark:bg-[radial-gradient(circle,rgba(255,255,255,0.08),transparent_62%)]" />
      <div className="relative">{children}</div>
    </div>
  );
}
