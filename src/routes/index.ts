import type { UserRole } from "@/types";

import { adminHome, adminNav } from "./admin.routes";
import { consumerHome, consumerNav } from "./consumer.routes";
import { operatorHome, operatorNav } from "./operator.routes";
import { providerHome, providerNav } from "./provider.routes";
import type { NavGroup } from "./types";

export function getRoleHome(role: UserRole) {
  switch (role) {
    case "CONSUMER":
      return consumerHome;
    case "PROVIDER":
      return providerHome;
    case "OPERATOR":
      return operatorHome;
    case "ADMIN":
      return adminHome;
  }
}

export function getRoleNav(role: UserRole): NavGroup[] {
  switch (role) {
    case "CONSUMER":
      return consumerNav;
    case "PROVIDER":
      return providerNav;
    case "OPERATOR":
      return operatorNav;
    case "ADMIN":
      return adminNav;
  }
}

export function getRoleLabel(role: UserRole) {
  switch (role) {
    case "CONSUMER":
      return "Consumer";
    case "PROVIDER":
      return "Provider";
    case "OPERATOR":
      return "Operator";
    case "ADMIN":
      return "Admin";
  }
}

export {
  adminHome,
  adminNav,
  consumerHome,
  consumerNav,
  operatorHome,
  operatorNav,
  providerHome,
  providerNav,
};
export type { NavGroup, NavItem } from "./types";
