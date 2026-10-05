import {
  Building2,
  CalendarDays,
  LayoutDashboard,
  Scale,
} from "lucide-react";

import type { NavGroup } from "./types";

export const operatorHome = "/operator";

export const operatorNav: NavGroup[] = [
  {
    label: "Operations",
    items: [
      { title: "Overview", href: "/operator", icon: LayoutDashboard },
      { title: "Events", href: "/operator/events", icon: CalendarDays },
      { title: "Allocation", href: "/operator/allocation", icon: Scale },
      { title: "Providers", href: "/operator/providers", icon: Building2 },
    ],
  },
];
