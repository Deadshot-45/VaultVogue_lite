"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { SidebarTrigger } from "@/components/ui/sidebar";
import { authService } from "@/lib/api/authServices";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { clearAuth } from "@/lib/store/slices/authSlice";
import { cn } from "@/lib/utils";
import { Search, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ModeToggle } from "./mode-toggle";
import { getAuthCookie } from "@/lib/auth";
import { useCartDetails } from "@/lib/query/useCartDetails";

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
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const token = getAuthCookie();
  useCartDetails({ isEnable: !!token });

  const handleLogout = () => {
    authService.signOut();
    dispatch(clearAuth());
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 h-(--header-height) w-full border-b bg-background/80 backdrop-blur-md transition-all duration-300 ease-in-out">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="-ml-2 text-muted-foreground transition-colors hover:text-foreground md:hidden" />
          <Link
            href="/"
            className="group flex items-center gap-2 transition-transform duration-200 hover:scale-[1.02]"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <span className="text-lg font-bold">V</span>
            </div>
            <h1 className="bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-xl font-bold tracking-tight text-transparent">
              Vault Vogue
            </h1>
          </Link>
        </div>

        <nav className="hidden flex-1 justify-center px-8 md:flex">
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
                          ? "bg-muted/10 text-primary"
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

        <div className="flex items-center gap-2 lg:gap-4">
          <div className="relative hidden max-w-60 group lg:flex">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <Input
              placeholder="Search..."
              className="h-9 w-full rounded-full border-transparent bg-muted/50 pl-9 pr-4 text-sm transition-all focus:bg-background focus:ring-2 focus:ring-primary/20 group-hover:bg-muted"
            />
          </div>

          <div className="flex items-center gap-1">
            <ModeToggle />

            <Button
              variant="ghost"
              size="icon"
              className="group relative text-muted-foreground hover:bg-muted hover:text-foreground"
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
                  className="group text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <User className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="mt-2 w-50">
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
                    <DropdownMenuItem
                      className="cursor-pointer text-destructive focus:text-destructive"
                      onClick={handleLogout}
                    >
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
