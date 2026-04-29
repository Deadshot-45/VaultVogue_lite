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
import { SidebarTrigger } from "@/components/ui/sidebar";
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

  const handleLogout = async () => {
    await performAppLogout(dispatch);
    router.push("/login");
  };

  const toggleMobileMenu = () => setOpenMobile(!openMobile);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-50 h-(--header-height) w-full border-b border-white/10 sale-theme backdrop-blur-xl transition-all duration-300 ease-in-out supports-[backdrop-filter]:bg-background/60"
    >
      <div className="mx-auto flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
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
          <Link
            href="/"
            className="group flex items-center gap-2 transition-transform duration-200 hover:scale-[1.02]"
          >
            <motion.div
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <span className="text-lg font-bold">V</span>
            </motion.div>
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
            <SearchBar />
            {/* <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" /> */}
            {/* <Input
              placeholder="Search products..."
              className="h-9 w-full rounded-full border-transparent bg-muted/50 pl-9 pr-4 text-sm transition-all focus:bg-background focus:ring-2 focus:ring-primary/20 group-hover:bg-muted"
            /> */}
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
                className="mt-2 w-50 bg-background/95 backdrop-blur-xl border-white/10"
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
                    <div className="my-1 border-t border-white/10" />
                    <DropdownMenuItem
                      className="cursor-pointer text-destructive focus:text-destructive hover:bg-destructive/10"
                      onClick={handleLogout}
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
    </motion.header>
  );
}
