"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { performAppLogout } from "@/lib/store/logout";
import { cn } from "@/lib/utils";
import { Menu, ShoppingBag, User, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ModeToggle } from "./mode-toggle";
import { motion, AnimatePresence } from "framer-motion";
import { useSidebar } from "@/components/ui/sidebar";
import CartDrawer from "./CartDrawer";
import SearchBar from "./global/SearchBarComponent";
import { useState } from "react";
import { LogoutDialog } from "./auth/LogoutDialog";

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
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const { openMobile, setOpenMobile, isMobile } = useSidebar();

  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const handleLogout = async () => {
    await performAppLogout(dispatch);
    router.push("/login");
  };

  const toggleMobileMenu = () => setOpenMobile(!openMobile);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 h-(--header-height) w-full border-b sale-theme backdrop-blur-xl transition-all duration-300 supports-[backdrop-filter]:bg-background/60"
      style={{ borderColor: "var(--gold-faint)" }}
    >
      <div className="mx-auto flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left — Hamburger + Brand */}
        <div className="flex items-center gap-4">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className="-ml-2 relative h-9 w-9 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
              aria-label="Toggle mobile menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {openMobile ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <X className="h-5 w-5" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="open"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Menu className="h-5 w-5" />
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          )}

          {/* Gold serif wordmark */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 transition-opacity duration-200 hover:opacity-80"
          >
            <span
              className="font-cormorant text-2xl font-semibold italic tracking-tight"
              style={{ color: "var(--gold)" }}
            >
              V
            </span>
            <h1 className="font-cormorant text-xl font-medium tracking-wide text-foreground">
              Vault Vogue
            </h1>
          </Link>
        </div>

        {/* Center — Nav */}
        <nav className="hidden flex-1 justify-center px-8 md:flex">
          <NavigationMenu>
            <NavigationMenuList className="gap-8">
              {NAV_ITEMS.map(({ label, href, destructive }) => (
                <NavigationMenuItem key={href}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={href}
                      className={cn(
                        "relative text-sm font-medium transition-colors duration-200",
                        destructive
                          ? "text-destructive"
                          : "text-muted-foreground hover:text-foreground",
                        pathname === href || pathname?.startsWith(`${href}/`)
                          ? "text-foreground"
                          : "",
                        // Gold underline on hover
                        "after:absolute after:-bottom-5 after:left-0 after:h-px after:w-full after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100",
                        pathname === href || pathname?.startsWith(`${href}/`)
                          ? "after:scale-x-100"
                          : "",
                      )}
                      style={{
                        // @ts-expect-error CSS custom property
                        "--tw-after-bg": "var(--gold)",
                      }}
                    >
                      {label}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        {/* Right — Actions */}
        <div className="flex items-center gap-2 lg:gap-4">
          <div className="relative hidden max-w-60 group lg:flex">
            <SearchBar />
          </div>

          <div className="flex items-center gap-1">
            <ModeToggle />
            <CartDrawer />

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
              <DropdownMenuContent
                align="end"
                className="mt-2 w-50 bg-background/95 backdrop-blur-xl"
                style={{ borderColor: "var(--gold-faint)" }}
              >
                {isAuthenticated ? (
                  <>
                    <DropdownMenuItem
                      asChild
                      className="cursor-pointer hover:bg-muted/50"
                    >
                      <Link href="/account" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>Account</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      asChild
                      className="cursor-pointer hover:bg-muted/50"
                    >
                      <Link href="/orders" className="flex items-center gap-2">
                        <ShoppingBag className="h-4 w-4" />
                        <span>Orders</span>
                      </Link>
                    </DropdownMenuItem>
                    <div
                      className="my-1 border-t"
                      style={{ borderColor: "var(--gold-faint)" }}
                    />
                    <DropdownMenuItem
                      className="cursor-pointer text-destructive focus:text-destructive hover:bg-destructive/10"
                      onClick={() => setIsLogoutDialogOpen(true)}
                    >
                      Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem
                      asChild
                      className="cursor-pointer hover:bg-muted/50"
                    >
                      <Link href="/login" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>Login</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      asChild
                      className="cursor-pointer hover:bg-muted/50"
                    >
                      <Link
                        href="/register"
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
      <LogoutDialog
        isOpen={isLogoutDialogOpen}
        onClose={() => setIsLogoutDialogOpen(false)}
        onConfirm={handleLogout}
      />
    </motion.header>
  );
}
