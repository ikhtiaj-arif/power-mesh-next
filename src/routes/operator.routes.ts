import {
  Building2,
  CalendarDays,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  Scale,
} from "lucide-react";

import type { NavGroup } from "./types";

export const operatorHome = "/operator";

export const operatorNav: NavGroup[] = [
  {
    label: "Operations",
    items: [
      { title: "Home", href: "/operator", icon: LayoutDashboard },
      { title: "Events", href: "/operator/events", icon: CalendarDays },
      { title: "Allocation", href: "/operator/allocation", icon: Scale },
      { title: "Requests", href: "/operator/requests", icon: ClipboardList },
      { title: "Payments", href: "/operator/payments", icon: CreditCard },
      { title: "Providers", href: "/operator/providers", icon: Building2 },
    ],
  },
];
