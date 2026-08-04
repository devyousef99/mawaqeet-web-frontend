"use client";
import {
  PieChart, Lightbulb, CalendarCheck2, Users, UserRound, BookOpen,
  Megaphone, BadgeCheck, Settings,
} from "lucide-react";
import type { NavItem, SidebarBrand } from "@mawaqeet/ui/Sidebar";

/** Provider zone navigation — owned by this app, edit freely without touching admin. */
export const providerNav: NavItem[] = [
  { href: "/provider", label: "Home", Icon: PieChart, exact: true },
  { href: "/provider/reports", label: "Reports", Icon: Lightbulb },
  { href: "/provider/appointments", label: "Appointments", Icon: CalendarCheck2 },
  { href: "/provider/employees", label: "Employees", Icon: Users },
  { href: "/provider/loyal-program", label: "Loyal Program", Icon: UserRound },
  { href: "/provider/services", label: "Services", Icon: BookOpen },
  { href: "/provider/promotions", label: "Promotions", Icon: Megaphone },
  { href: "/provider/subscriptions", label: "Subscribtions", Icon: BadgeCheck },
  { href: "/provider/settings", label: "Settings", Icon: Settings },
];

export const providerBrand: SidebarBrand = {
  title: "Branch Name",
  subtitle: <>SUBSCRIBED <span className="text-emerald-400">29</span> DAYS LEFT</>,
  showBadge: true,
};
