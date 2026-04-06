"use client";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Search, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

import { ModeToggle } from "./mode-toggle";
import { useCart } from "@/context/CreateContext";
import { authService } from "@/lib/api/authServices";
import { useEffect, useState } from "react";

export function SiteHeader() {
  const NAV_ITEMS = [
    { label: "Home", href: "/" },
    { label: "Men", href: "/men" },
    { label: "Women", href: "/women" },
    { label: "Kids", href: "/kids" },
    { label: "Sale", href: "/sale", destructive: true },
  ];
  const router = useRouter();
  const pathname = usePathname();

  const { cartItems } = useCart();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const syncAuthState = () => {
      setIsAuthenticated(authService.isAuthenticated());
    };

    syncAuthState();

    window.addEventListener("authchange", syncAuthState);
    window.addEventListener("storage", syncAuthState);

    return () => {
      window.removeEventListener("authchange", syncAuthState);
      window.removeEventListener("storage", syncAuthState);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md transition-all duration-300 ease-in-out h-(--header-height)">
      <div className="mx-auto flex h-full items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Left Section: Menu (Mobile) & Logo */}
        <div className="flex items-center gap-4">
          <SidebarTrigger className="md:hidden -ml-2 text-muted-foreground hover:text-foreground transition-colors" />
          <Link
            href="/"
            className="flex items-center gap-2 group transition-transform duration-200 hover:scale-[1.02]"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <span className="font-bold text-lg">V</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Vault Vogue
            </h1>
          </Link>
        </div>

        {/* Center Section: Navigation (Desktop) */}
        <nav className="hidden md:flex flex-1 justify-center px-8">
          <NavigationMenu>
            <NavigationMenuList className="gap-8">
              {NAV_ITEMS.map(({ label, href, destructive }) => (
                <NavigationMenuItem key={href}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={href}
                      className={cn(
                        "relative text-sm font-medium transition-colors hover:text-primary",
                        destructive
                          ? "text-destructive"
                          : "text-muted-foreground",
                        pathname === href || pathname?.startsWith(`${href}/`)
                          ? "text-primary bg-muted/10"
                          : "",

                        "after:absolute after:-bottom-5 after:left-0 after:h-0.5 after:w-full after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:after:scale-x-100",
                      )}
                    >
                      {label}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        {/* Right Section: Search, User, Cart */}
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Desktop Search */}
          <div className="hidden lg:flex relative group max-w-60">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <Input
              placeholder="Search..."
              className="h-9 w-full rounded-full bg-muted/50 pl-9 pr-4 text-sm border-transparent transition-all focus:bg-background focus:ring-2 focus:ring-primary/20 group-hover:bg-muted"
            />
          </div>

          <div className="flex items-center gap-1">
            <ModeToggle />

            <Button
              variant="ghost"
              size="icon"
              className="relative text-muted-foreground hover:text-foreground hover:bg-muted group"
              onClick={() => router.push("/carts")}
            >
              <ShoppingBag className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
              {cartItems.length > 0 && (
                <Badge className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary p-0 text-[10px] text-primary-foreground shadow-sm">
                  {cartItems.length}
                </Badge>
              )}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground hover:bg-muted group"
                >
                  <User className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-50 mt-2">
                {isAuthenticated ? (
                  <>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/account" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>Account</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/orders" className="flex items-center gap-2">
                        <ShoppingBag className="h-4 w-4" />
                        <span>Orders</span>
                      </Link>
                    </DropdownMenuItem>
                    <div className="my-1 border-t" />
                    <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer">
                      Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/login" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>Login</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link
                        href="/create-account"
                        className="flex items-center gap-2"
                      >
                        <User className="h-4 w-4" />
                        <span>Create Account</span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
