"use client";

import ProtectedPage from "@/components/auth/ProtectedPage";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { performAppLogout } from "@/lib/store/logout";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  ArrowUpRight,
  Package,
  ShieldCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { LogoutDialog } from "@/components/auth/LogoutDialog";
import { toast } from "sonner";

const orders = [
  {
    id: "SH-1234",
    status: "Delivered",
    total: "$495.00",
    date: "March 21, 2026",
  },
  {
    id: "SH-2871",
    status: "Processing",
    total: "$245.00",
    date: "April 4, 2026",
  },
];

const addresses = [
  {
    label: "Primary Residence",
    line1: "221B Baker Street",
    line2: "London, NW1 6XE",
  },
];

export default function AccountPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const fullName =
    user && typeof user === "object" && "fullName" in user && user.fullName
      ? String(user.fullName)
      : "Sunny Kumar";
  const email =
    user && typeof user === "object" && "email" in user && user.email
      ? String(user.email)
      : "sunny@example.com";
  const initials = fullName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const handleLogout = async () => {
    await performAppLogout(dispatch);
    router.push("/login");
  };

  return (
    <ProtectedPage>
      <div className="mx-auto w-full px-4 py-16 sm:px-6 lg:px-8 bg-[var(--background)]">
        {/* Editorial Heading */}
        <div className="mb-12">
          <p className="section-label">Your Workspace</p>
          <div className="gold-divider" />
          <h1 className="mt-5 font-cormorant text-4xl font-light text-[var(--brand-text)] lg:text-5xl">
            Account Dashboard
          </h1>
        </div>

        <div className="grid gap-10 lg:grid-cols-[320px_minmax(0,1fr)]">
          {/* Profile Sidebar */}
          <div className="space-y-8">
            <div
              className="overflow-hidden rounded-2xl border p-8 bg-card/45 backdrop-blur-md border-[var(--gold-soft)] shadow-xl"
            >
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 border-2 border-[var(--gold-soft)]">
                  <AvatarFallback className="bg-background text-2xl font-light text-[var(--brand-text)] font-cormorant">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <h3 className="mt-5 font-cormorant text-2xl font-light text-[var(--brand-text)]">
                  {fullName}
                </h3>
                <p className="text-xs text-muted-foreground">{email}</p>

                <div className="mt-6 flex w-full items-center justify-between rounded-xl border border-border/40 bg-background/50 p-4">
                  <div className="text-left">
                    <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                      Client Tier
                    </p>
                    <p className="text-xs font-semibold text-[var(--brand-text)]">Atelier Select</p>
                  </div>
                  <Badge className="rounded-full px-3 py-0.5 text-[9px] font-semibold badge-gold">
                    Active
                  </Badge>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4 text-center border-t border-b border-border/20 py-4">
                <div className="space-y-1">
                  <p className="text-xl font-light text-[var(--brand-text)] font-cormorant">{orders.length}</p>
                  <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Orders</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xl font-light text-[var(--brand-text)] font-cormorant">04</p>
                  <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Wishlist</p>
                </div>
              </div>

              <button
                onClick={() => setIsLogoutDialogOpen(true)}
                className="btn-secondary w-full py-2.5 text-xs font-semibold uppercase tracking-wider mt-8 border-red-200/50 hover:bg-red-500/5 text-red-500"
              >
                Sign Out
              </button>
            </div>

            <div className="hidden lg:block">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Need Assistance?
              </p>
              <Link
                href="/help"
                className="mt-4 flex items-center justify-between rounded-xl border border-border/40 p-4 transition-colors hover:border-[var(--gold-soft)]"
              >
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-text)]">Client Care</span>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-10">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="flex h-auto w-full justify-start gap-8 rounded-none border-b bg-transparent p-0">
                {["profile", "orders", "addresses", "settings"].map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="rounded-none border-b-2 border-transparent px-0 pb-4 pt-0 text-xs font-semibold uppercase tracking-widest transition-all data-[state=active]:border-[var(--gold)] data-[state=active]:bg-transparent data-[state=active]:text-[var(--brand-text)] text-muted-foreground"
                  >
                    {tab}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="profile" className="mt-10 space-y-6">
                <div className="grid gap-8 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Full Name</Label>
                    <Input
                      defaultValue={fullName}
                      className="h-12 rounded-xl border-border/40 bg-background/50 text-xs font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Email Address</Label>
                    <Input
                      defaultValue={email}
                      className="h-12 rounded-xl border-border/40 bg-background/50 text-xs font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Phone Number</Label>
                    <Input
                      defaultValue="+1 (555) 902-1920"
                      className="h-12 rounded-xl border-border/40 bg-background/50 text-xs font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Preferred Collection</Label>
                    <Input
                      defaultValue="Womenswear"
                      className="h-12 rounded-xl border-border/40 bg-background/50 text-xs font-medium"
                    />
                  </div>
                  <div className="pt-4 sm:col-span-2">
                    <button
                      onClick={() => toast.success("Profile updated successfully", {
                        description: "Your account details have been securely saved."
                      })}
                      className="btn-primary"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="orders" className="mt-10 space-y-4">
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="flex flex-col gap-6 rounded-2xl border border-border/40 bg-card/40 p-6 sm:flex-row sm:items-center sm:justify-between hover:border-[var(--gold-soft)] transition-colors"
                    >
                      <div className="flex gap-6 items-center">
                        <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-[var(--gold-glow)] text-[var(--gold)] border border-[var(--gold-faint)]">
                          <Package className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[var(--brand-text)]">{order.id}</p>
                          <p className="text-xs text-muted-foreground">{order.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-8 sm:justify-end">
                        <div className="text-right space-y-0.5">
                          <p className="text-sm font-bold text-[var(--gold)]">{order.total}</p>
                          <p className="text-[9px] uppercase tracking-wider font-semibold text-muted-foreground">{order.status}</p>
                        </div>
                        <button 
                          onClick={() => router.push("/orders")}
                          className="btn-secondary py-2 px-5 text-xs font-semibold uppercase tracking-wider"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="addresses" className="mt-10 space-y-4">
                <div className="grid gap-6 sm:grid-cols-2">
                  {addresses.map((address) => (
                    <div
                      key={address.label}
                      className="group relative rounded-2xl border border-border/40 p-6 transition-colors hover:border-[var(--gold-soft)] bg-card/20"
                    >
                      <Badge className="mb-4 rounded-full font-normal badge-gold text-[9px] px-2.5 py-0.5">
                        {address.label}
                      </Badge>
                      <p className="text-sm font-semibold text-[var(--brand-text)]">{address.line1}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{address.line2}</p>
                      <button className="mt-4 text-[10px] uppercase font-bold tracking-wider text-[var(--gold)] hover:underline">
                        Edit Address
                      </button>
                    </div>
                  ))}
                  <button className="flex h-full min-h-[160px] flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--gold-soft)] bg-[var(--gold-glow)] transition-colors hover:bg-[var(--gold-faint)] cursor-pointer">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[var(--gold)]">Add New Address</span>
                  </button>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="mt-10 space-y-6">
                <div className="max-w-2xl space-y-8">
                  <div className="flex items-start gap-4 rounded-2xl border border-border/40 p-6 bg-card/20">
                    <div className="mt-1 h-10 w-10 flex items-center justify-center rounded-full bg-[var(--gold-glow)] text-[var(--gold)] shrink-0 border border-[var(--gold-faint)]">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[var(--brand-text)]">Account Security</h4>
                      <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                        Your account is currently protected with standard encryption. 
                        Enable multi-factor authentication for enhanced security.
                      </p>
                      <button className="mt-4 text-[10px] uppercase tracking-wider font-bold text-[var(--gold)] hover:underline">
                        Manage Security Settings
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <button className="btn-secondary w-full py-3.5 text-xs font-semibold uppercase tracking-wider">
                      Change Account Password
                    </button>
                    <button 
                      onClick={() => toast.error("Action restricted", {
                        description: "Please contact support to initiate account data deletion."
                      })}
                      className="w-full rounded-xl border border-red-200 py-3.5 text-xs font-semibold uppercase tracking-wider text-red-500 hover:bg-red-500/5 transition-colors cursor-pointer"
                    >
                      Delete Account Data
                    </button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <LogoutDialog
        isOpen={isLogoutDialogOpen}
        onClose={() => setIsLogoutDialogOpen(false)}
        onConfirm={handleLogout}
      />
    </ProtectedPage>
  );
}
