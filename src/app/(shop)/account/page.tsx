"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authService } from "@/lib/api/authServices";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { clearAuth } from "@/lib/store/slices/authSlice";
import {
  ArrowUpRight,
  MapPin,
  Package,
  Settings,
  ShieldCheck,
  User2,
} from "lucide-react";
import { useRouter } from "next/navigation";

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

  const handleLogout = () => {
    authService.signOut();
    dispatch(clearAuth());
    router.push("/login");
  };

  return (
    <div className="mx-auto w-full px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <Card className="overflow-hidden rounded-[1.75rem] border-white/10 bg-[linear-gradient(160deg,rgba(15,23,42,1),rgba(30,41,59,0.95))] text-white shadow-[0_24px_80px_rgba(15,23,42,0.28)]">
          <CardContent className="space-y-6 p-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border border-white/15">
                <AvatarFallback className="bg-white/10 text-lg font-semibold text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-lg font-semibold">{fullName}</p>
                <p className="text-sm text-white/65">{email}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur-md">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-white/45">
                    Member Tier
                  </p>
                  <p className="mt-2 text-xl font-semibold">Vault Select</p>
                </div>
                <Badge className="rounded-full bg-[#d4af37] px-3 py-1 text-black shadow-none">
                  Active
                </Badge>
              </div>
              <p className="mt-3 text-sm leading-6 text-white/70">
                Faster checkout, order tracking, and saved preferences across
                every drop.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-2xl border border-white/10 bg-white/8 p-4">
                <p className="text-2xl font-semibold">12</p>
                <p className="mt-1 text-sm text-white/60">Orders placed</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/8 p-4">
                <p className="text-2xl font-semibold">04</p>
                <p className="mt-1 text-sm text-white/60">Saved items</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/8 p-4">
                <p className="text-2xl font-semibold">02</p>
                <p className="mt-1 text-sm text-white/60">Addresses</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div className="rounded-[1.75rem] border bg-background/75 p-6 shadow-sm backdrop-blur-xl">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">
                  Account Center
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                  Manage your profile and orders
                </h1>
              </div>
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => router.push("/")}
              >
                Continue Shopping
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid h-auto grid-cols-2 gap-2 rounded-2xl bg-muted/50 p-2 md:grid-cols-4">
              <TabsTrigger
                value="profile"
                className="rounded-xl cursor-pointer"
              >
                <User2 className="mr-2 h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="orders" className="rounded-xl cursor-pointer">
                <Package className="mr-2 h-4 w-4" />
                Orders
              </TabsTrigger>
              <TabsTrigger
                value="addresses"
                className="rounded-xl cursor-pointer"
              >
                <MapPin className="mr-2 h-4 w-4" />
                Addresses
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="rounded-xl cursor-pointer"
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-6">
              <Card className="rounded-[1.5rem]">
                <CardHeader>
                  <CardTitle>Profile Details</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <Input defaultValue={fullName} placeholder="Full Name" />
                  <Input defaultValue={email} placeholder="Email" />
                  <Input
                    defaultValue="+91 9876543210"
                    placeholder="Phone Number"
                  />
                  <Input defaultValue="Vault Select" placeholder="Membership" />
                  <div className="sm:col-span-2">
                    <Button className="w-full sm:w-auto">Save Changes</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders" className="mt-6">
              <Card className="rounded-[1.5rem]">
                <CardHeader>
                  <CardTitle>Your Orders</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="flex flex-col gap-4 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-medium">{order.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.date}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">{order.status}</Badge>
                        <span className="font-semibold">{order.total}</span>
                        <Button variant="outline">View</Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="addresses" className="mt-6">
              <Card className="rounded-[1.5rem]">
                <CardHeader>
                  <CardTitle>Saved Addresses</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {addresses.map((address) => (
                    <div key={address.label} className="rounded-2xl border p-4">
                      <p className="font-medium">{address.label}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {address.line1}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {address.line2}
                      </p>
                    </div>
                  ))}
                  <Button className="w-full sm:w-auto">Add New Address</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="mt-6">
              <Card className="rounded-[1.5rem]">
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 space-x-4">
                  <div className="flex items-start gap-3 rounded-2xl border bg-muted/30 p-4">
                    <ShieldCheck className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Security</p>
                      <p className="text-sm text-muted-foreground">
                        Keep your password strong and review sessions regularly.
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full sm:w-auto ">
                    Change Password
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full sm:w-auto"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
