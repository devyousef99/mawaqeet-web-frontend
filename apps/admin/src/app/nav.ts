"use client";
import {
  PieChart, Lightbulb, CalendarCheck2, Users, UserRound, BookOpen,
  Megaphone, UsersRound, MessageSquareWarning, Star, Bell, BadgeCheck, Settings,
} from "lucide-react";
import type { NavItem, SidebarBrand } from "@mawaqeet/ui/Sidebar";

/** Admin zone navigation — owned by this app, edit freely without touching provider. */
export const adminNav: NavItem[] = [
  { href: "/admin", label: "Home", Icon: PieChart, exact: true },
  { href: "/admin/reports", label: "Reports", Icon: Lightbulb },
  { href: "/admin/appointments", label: "Appointments", Icon: CalendarCheck2 },
  { href: "/admin/employees", label: "Employees", Icon: Users },
  { href: "/admin/loyal-program", label: "Loyal Program", Icon: UserRound },
  { href: "/admin/services", label: "Services", Icon: BookOpen },
  { href: "/admin/promotions", label: "Promotions", Icon: Megaphone },
  { href: "/admin/users", label: "Users Management", Icon: UsersRound },
  { href: "/admin/complains", label: "Complains", Icon: MessageSquareWarning },
  { href: "/admin/ratings", label: "Ratings", Icon: Star },
  { href: "/admin/notifications", label: "Notifications", Icon: Bell },
  { href: "/admin/subscriptions", label: "Subscribtions Management", Icon: BadgeCheck },
  { href: "/admin/settings", label: "Settings", Icon: Settings },
];

export const adminBrand: SidebarBrand = { title: "SYS ADMIN USERNAME" };
