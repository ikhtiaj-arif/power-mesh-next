import {
  Building2,
  CalendarDays,
  FileText,
  LayoutDashboard,
  Users,
} from "lucide-react";

import type { NavGroup } from "./types";

export const adminHome = "/admin";

export const adminNav: NavGroup[] = [
  {
    label: "Administration",
    items: [
      { title: "Overview", href: "/admin", icon: LayoutDashboard },
      { title: "Users", href: "/admin/users", icon: Users },
      { title: "Providers", href: "/admin/providers", icon: Building2 },
      { title: "Events", href: "/admin/events", icon: CalendarDays },
      { title: "Audit log", href: "/admin/audit", icon: FileText },
    ],
  },
];
