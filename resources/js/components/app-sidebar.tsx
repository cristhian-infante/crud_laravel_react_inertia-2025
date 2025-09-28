"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
  LayoutGrid, User, Warehouse, List, Plus, MapPin 
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
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
import { Link } from '@inertiajs/react';
import { dashboard } from '@/routes';
import AppLogo from './app-logo';
import { type NavItem } from '@/types';
import category from '@/routes/category';
//Menú

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
        icon: LayoutGrid,
    }   
];
const Categorias: NavItem[] =[
    {
        title: 'Categorias',
        href: category.index().url,
        icon: List,
    } ]
const MenuDesplegable: NavItem[] = [
    {
      title: "Models",
      href: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          href: "#",
        },
        {
          title: "Explorer",
          href: "#",
        },
        {
          title: "Quantum",
          href: "#",
        },
      ],
    }
]


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={mainNavItems} groupLabel="Dashboard" />
        <NavMain items={Categorias} groupLabel="Categorias" />
        <NavMain items={MenuDesplegable} groupLabel="Menu Desplegable" />
       
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
