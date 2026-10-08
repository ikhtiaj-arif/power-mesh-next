import {
  LayoutDashboard,
  Package,
  PlugZap,
  Truck,
} from "lucide-react";

import type { NavGroup } from "./types";

export const providerHome = "/provider";

export const providerNav: NavGroup[] = [
  {
    label: "Workspace",
    items: [
      { title: "Home", href: "/provider", icon: LayoutDashboard },
      { title: "Offers", href: "/provider/offers", icon: PlugZap },
      { title: "Reservations", href: "/provider/reservations", icon: Package },
      { title: "Delivery", href: "/provider/delivery", icon: Truck },
    ],
  },
];
