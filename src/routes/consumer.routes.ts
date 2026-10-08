import {
  CalendarDays,
  CreditCard,
  LayoutDashboard,
  ListChecks,
  Package,
} from "lucide-react";

import type { NavGroup } from "./types";

export const consumerHome = "/consumer";

export const consumerNav: NavGroup[] = [
  {
    label: "Workspace",
    items: [
      { title: "Home", href: "/consumer", icon: LayoutDashboard },
      { title: "Events", href: "/consumer/events", icon: CalendarDays },
      { title: "Requests", href: "/consumer/requests", icon: ListChecks },
      { title: "Reservations", href: "/consumer/reservations", icon: Package },
      { title: "Payments", href: "/consumer/payments", icon: CreditCard },
    ],
  },
];
