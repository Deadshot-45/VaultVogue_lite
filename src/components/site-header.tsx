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
import { useAppDispatch } from "@/lib/store/hooks";
import { performAppLogout } from "@/lib/store/logout";
import { cn } from "@/lib/utils";
import { Menu, ShoppingBag, User, X, Heart, Search } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ModeToggle } from "./mode-toggle";
import { motion, AnimatePresence } from "framer-motion";
import { useSidebar } from "@/components/ui/sidebar";
import CartDrawer from "./CartDrawer";
import SearchBar from "./global/SearchBarComponent";
import { useState, useEffect } from "react";
import { LogoutDialog } from "./auth/LogoutDialog";
import { getAuthCookie } from "@/lib/auth";

export function SiteHeader() {
  const NAV_ITEMS = [
    { label: "Home", href: "/" },
    { label: "Men", href: "/men" },
    { label: "Women", href: "/women" },
    { label: "Kids", href: "/kids" },
  ];
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { openMobile, setOpenMobile, isMobile } = useSidebar();
  
  const [mounted, setMounted] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile search on route change
  useEffect(() => {
    setMobileSearchOpen(false);
  }, [pathname]);

  const token = getAuthCookie();
  const isUserAuthed = mounted && !!token;

  const handleLogout = async () => {
    await performAppLogout(dispatch);
    router.push("/login");
  };

  const toggleMobileMenu = () => setOpenMobile(!openMobile);

  return (
    <div className="w-full sticky top-0 z-50 flex flex-col">
      {/* ─── Premium Announcement Bar ─── */}
      <div className="w-full bg-[var(--brand-text)] py-2 text-center text-[10px] font-medium uppercase tracking-[0.25em] text-[var(--bg)]">
        Complimentary Shipping on all Orders above ₹999
      </div>

      {/* ─── Sticky Header Frame ─── */}
      <motion.header
        className="h-(--header-height) w-full border-b border-border/10 backdrop-blur-xl bg-background/60 transition-all duration-300"
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Left — Mobile Hamburg & Brand Logo */}
          <div className="flex items-center md:gap-4 gap-0">
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMobileMenu}
                className="-ml-2 relative h-9 w-9 text-muted-foreground hover:bg-muted md:hidden"
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

            {/* Serif Wordmark Logo */}
            <Link
              href="/"
              className="flex flex-col items-start transition-opacity duration-200 hover:opacity-85"
            >
              <h1 className="font-cormorant md:text-2xl text-xl font-light tracking-[0.1em] text-[var(--brand-text)] leading-none">
                Vault-Vogue
              </h1>
              {/* <span className="text-[8px] font-semibold uppercase tracking-[0.45em] text-[var(--gold)] mt-0.5 leading-none">
                Maison
              </span> */}
            </Link>
          </div>

          {/* Center — Navigation Menu */}
          <nav className="hidden flex-1 justify-center px-8 md:flex">
            <NavigationMenu>
              <NavigationMenuList className="gap-8">
                {NAV_ITEMS.map(({ label, href }) => (
                  <NavigationMenuItem key={href}>
                    <NavigationMenuLink asChild>
                      <Link
                        href={href}
                        className={cn(
                          "relative text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground transition-colors duration-200 hover:text-foreground",
                          pathname === href || pathname?.startsWith(`${href}/`)
                            ? "text-[var(--gold)] font-semibold"
                            : "",
                          // luxury animated underline on hover
                          "after:absolute after:-bottom-4 after:left-0 after:h-[1px] after:w-full after:scale-x-0 after:bg-[var(--gold)] after:transition-transform after:duration-300 hover:after:scale-x-100",
                          pathname === href || pathname?.startsWith(`${href}/`)
                            ? "after:scale-x-100"
                            : ""
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

          {/* Right — Actions Panel */}
          <div className="flex items-center gap-3 lg:gap-4">
            
            {/* Desktop Search Bar — hidden on mobile */}
            <div className="hidden md:flex relative max-w-60 group">
              <SearchBar />
            </div>

            {/* Icons */}
            <div className="flex items-center gap-1">
              <ModeToggle />

              {/* Mobile Search Toggle — visible only on small screens */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden group relative text-muted-foreground hover:text-foreground"
                onClick={() => setMobileSearchOpen((v) => !v)}
                aria-label="Toggle search"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {mobileSearchOpen ? (
                    <motion.span
                      key="close-search"
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
                      key="open-search"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <Search className="h-5 w-5" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
              
              {/* Wishlist Icon */}
              <Button
                variant="ghost"
                size="icon"
                className="group relative text-muted-foreground hover:text-foreground"
              >
                <Heart className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                <span className="sr-only">Wishlist</span>
              </Button>

              {/* Cart Drawer */}
              <CartDrawer />

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="group text-muted-foreground hover:text-foreground"
                  >
                    <User className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="mt-2 w-50 bg-background/95 backdrop-blur-xl border border-[var(--gold-faint)]"
                >
                  {isUserAuthed ? (
                    <>
                      <DropdownMenuItem
                        asChild
                        className="cursor-pointer hover:bg-muted/50 text-xs uppercase tracking-wider text-foreground"
                      >
                        <Link href="/account" className="flex items-center gap-2">
                          <User className="h-4 w-4 text-[var(--gold)]" />
                          <span>Account</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        asChild
                        className="cursor-pointer hover:bg-muted/50 text-xs uppercase tracking-wider text-foreground"
                      >
                        <Link href="/orders" className="flex items-center gap-2">
                          <ShoppingBag className="h-4 w-4 text-[var(--gold)]" />
                          <span>Orders</span>
                        </Link>
                      </DropdownMenuItem>
                      <div className="my-1 border-t border-[var(--gold-faint)]" />
                      <DropdownMenuItem
                        className="cursor-pointer text-xs uppercase tracking-wider text-destructive focus:text-destructive hover:bg-destructive/10"
                        onClick={() => setIsLogoutDialogOpen(true)}
                      >
                        Logout
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem
                        asChild
                        className="cursor-pointer hover:bg-muted/50 text-xs uppercase tracking-wider text-foreground"
                      >
                        <Link href="/login" className="flex items-center gap-2">
                          <User className="h-4 w-4 text-[var(--gold)]" />
                          <span>Login</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        asChild
                        className="cursor-pointer hover:bg-muted/50 text-xs uppercase tracking-wider text-foreground"
                      >
                        <Link href="/register" className="flex items-center gap-2">
                          <User className="h-4 w-4 text-[var(--gold)]" />
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

      {/* ─── Mobile Search Bar (slides in below header) ─── */}
      <AnimatePresence>
        {mobileSearchOpen && (
          <motion.div
            key="mobile-search"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden overflow-hidden border-b border-border/20 bg-background/95 backdrop-blur-xl"
          >
            <div className="px-4 py-3">
              <SearchBar />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
