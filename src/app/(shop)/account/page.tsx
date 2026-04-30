"use client";

import ProtectedPage from "@/components/auth/ProtectedPage";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    id: "VV-1234",
    status: "Delivered",
    total: "₹4,999",
    date: "March 21, 2026",
  },
  {
    id: "VV-2871",
    status: "Processing",
    total: "₹2,499",
    date: "April 4, 2026",
  },
];

const addresses = [
  {
    label: "Home",
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
      <div className="mx-auto w-full px-4 py-12 sm:px-6 lg:px-8">
        {/* Editorial Heading */}
        <div className="mb-12">
          <p className="section-label">Your Workspace</p>
          <div className="gold-divider" />
          <h1 className="mt-5 font-cormorant text-4xl font-light text-foreground lg:text-5xl">
            Account Dashboard
          </h1>
        </div>

        <div className="grid gap-10 lg:grid-cols-[320px_minmax(0,1fr)]">
          {/* Profile Sidebar */}
          <div className="space-y-8">
            <div
              className="overflow-hidden rounded-2xl border p-8"
              style={{
                borderColor: "var(--gold-faint)",
                background: "var(--gold-glow)",
              }}
            >
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 border-2" style={{ borderColor: "var(--gold-soft)" }}>
                  <AvatarFallback className="bg-background text-2xl font-light text-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <h3 className="mt-5 font-cormorant text-2xl font-light text-foreground">
                  {fullName}
                </h3>
                <p className="text-sm text-muted-foreground">{email}</p>

                <div className="mt-6 flex w-full items-center justify-between rounded-xl border border-border/40 bg-background/50 p-4">
                  <div className="text-left">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      Tier
                    </p>
                    <p className="text-sm font-medium">Vault Select</p>
                  </div>
                  <Badge
                    className="rounded-full px-3 py-0.5 text-[10px] font-medium shadow-none"
                    style={{ background: "var(--gold)", color: "white" }}
                  >
                    Active
                  </Badge>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xl font-light text-foreground">{orders.length}</p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Orders</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xl font-light text-foreground">04</p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Saved</p>
                </div>
              </div>

              <button
                onClick={() => setIsLogoutDialogOpen(true)}
                className="mt-8 w-full rounded-full border border-border/40 py-2 text-xs font-medium transition-colors hover:bg-muted/50"
              >
                Sign Out
              </button>
            </div>

            <div className="hidden lg:block">
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                Need Assistance?
              </p>
              <Link
                href="/help"
                className="mt-4 flex items-center justify-between rounded-xl border border-border/40 p-4 transition-colors hover:bg-muted/50"
              >
                <span className="text-sm font-medium">Help Center</span>
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
                    className="rounded-none border-b-2 border-transparent px-0 pb-4 pt-0 text-sm font-medium tracking-wide transition-all data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground"
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="profile" className="mt-10 animate-in fade-in slide-in-from-bottom-2">
                <div className="grid gap-8 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Full Name</Label>
                    <Input
                      defaultValue={fullName}
                      className="h-12 rounded-xl border-border/40 bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Email Address</Label>
                    <Input
                      defaultValue={email}
                      className="h-12 rounded-xl border-border/40 bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Phone Number</Label>
                    <Input
                      defaultValue="+91 9876543210"
                      className="h-12 rounded-xl border-border/40 bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Preferred Collection</Label>
                    <Input
                      defaultValue="Womenswear"
                      className="h-12 rounded-xl border-border/40 bg-background/50"
                    />
                  </div>
                  <div className="pt-4 sm:col-span-2">
                    <button
                      onClick={() => toast.success("Profile updated successfully", {
                        description: "Your account details have been securely saved."
                      })}
                      className="rounded-full px-10 py-3 text-sm font-medium text-white transition-transform active:scale-95"
                      style={{ background: "var(--gold)" }}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="orders" className="mt-10 animate-in fade-in slide-in-from-bottom-2">
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="flex flex-col gap-6 rounded-2xl border border-border/40 bg-background/50 p-6 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex gap-6 items-center">
                        <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-muted/30">
                          <Package className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{order.id}</p>
                          <p className="text-xs text-muted-foreground">{order.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-8 sm:justify-end">
                        <div className="text-right">
                          <p className="text-sm font-semibold">{order.total}</p>
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{order.status}</p>
                        </div>
                        <Button variant="ghost" size="sm" className="rounded-full">
                          Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="addresses" className="mt-10 animate-in fade-in slide-in-from-bottom-2">
                <div className="grid gap-6 sm:grid-cols-2">
                  {addresses.map((address) => (
                    <div
                      key={address.label}
                      className="group relative rounded-2xl border border-border/40 p-6 transition-colors hover:border-foreground/20"
                    >
                      <Badge variant="outline" className="mb-4 rounded-full border-border/60 font-normal">
                        {address.label}
                      </Badge>
                      <p className="text-sm font-medium text-foreground">{address.line1}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{address.line2}</p>
                      <button className="mt-4 text-xs font-medium text-muted-foreground underline-offset-4 hover:underline">
                        Edit Address
                      </button>
                    </div>
                  ))}
                  <button className="flex h-full min-h-[160px] flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 transition-colors hover:bg-muted/30">
                    <span className="text-sm font-medium">Add New Address</span>
                  </button>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="mt-10 animate-in fade-in slide-in-from-bottom-2">
                <div className="max-w-2xl space-y-8">
                  <div className="flex items-start gap-4 rounded-2xl border border-border/40 p-6">
                    <div className="mt-1 h-10 w-10 flex items-center justify-center rounded-full" style={{ background: "var(--gold-glow)" }}>
                      <ShieldCheck className="h-5 w-5" style={{ color: "var(--gold)" }} />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Account Security</h4>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">
                        Your account is currently protected with standard encryption. 
                        Enable multi-factor authentication for enhanced security.
                      </p>
                      <button className="mt-4 text-xs font-medium" style={{ color: "var(--gold)" }}>
                        Manage Security Settings
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <button className="w-full rounded-xl border border-border/40 py-3 text-sm font-medium transition-colors hover:bg-muted/50">
                      Change Account Password
                    </button>
                    <button 
                      onClick={() => toast.error("Action restricted", {
                        description: "Please contact support to initiate account data deletion."
                      })}
                      className="w-full rounded-xl border border-destructive/20 py-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive/5"
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
