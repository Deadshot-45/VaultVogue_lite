import * as React from "react"
import {
  IconBrandTabler,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconShoppingBag,
} from "@tabler/icons-react"
import Link from "next/link"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Vault Vogue",
    email: "Curated fashion drops",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: IconDashboard,
    },
    {
      title: "Men",
      url: "/men",
      icon: IconListDetails,
    },
    {
      title: "Women",
      url: "/women",
      icon: IconChartBar,
    },
    {
      title: "Kids",
      url: "/kids",
      icon: IconFolder,
    },
    {
      title: "Cart",
      url: "/carts",
      icon: IconShoppingBag,
    },
  ],
  navSecondary: [
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
  ],
  documents: [
    {
      name: "New Arrivals",
      url: "#",
      icon: IconDatabase,
    },
    {
      name: "Best Sellers",
      url: "#",
      icon: IconReport,
    },
    {
      name: "Sale Edit",
      url: "#",
      icon: IconFileWord,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="offcanvas"
      className="border-r border-sidebar-border/60 bg-gradient-to-b from-sidebar via-sidebar to-sidebar/90"
      {...props}
    >
      <SidebarHeader className="gap-3 border-b border-sidebar-border/60 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="h-auto rounded-2xl border border-sidebar-border/60 bg-sidebar-accent/40 p-3 shadow-sm hover:bg-sidebar-accent/60"
            >
              <Link href="/">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                  <IconBrandTabler className="size-5" />
                </div>
                <div className="flex flex-col items-start text-left">
                  <span className="text-base font-semibold leading-none">
                    Vault Vogue
                  </span>
                  <span className="text-xs text-sidebar-foreground/70">
                    Curated fashion store
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <div className="rounded-xl border border-sidebar-border/60 bg-sidebar-accent/30 px-3 py-2">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-sidebar-foreground/60">
            Season drop
          </p>
          <p className="mt-1 text-sm text-sidebar-foreground/90">
            Fresh fits, sharp structure, fast checkout.
          </p>
        </div>
      </SidebarHeader>
      <SidebarContent className="no-scrollbar">
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
