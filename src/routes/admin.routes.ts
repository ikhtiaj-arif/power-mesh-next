import {
  Building2,
  CalendarDays,
  FileText,
  LayoutDashboard,
  Scale,
  Users,
} from "lucide-react";

import type { NavGroup } from "./types";

export const adminHome = "/admin";

export const adminNav: NavGroup[] = [
  {
    label: "Administration",
    items: [
      { title: "Home", href: "/admin", icon: LayoutDashboard },
      { title: "Users", href: "/admin/users", icon: Users },
      { title: "Providers", href: "/admin/providers", icon: Building2 },
      { title: "Events", href: "/admin/events", icon: CalendarDays },
      { title: "Allocation", href: "/admin/allocation", icon: Scale },
      { title: "Audit log", href: "/admin/audit", icon: FileText },
    ],
  },
];
