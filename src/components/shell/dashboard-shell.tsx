"use client";

import { googleLogout } from "@react-oauth/google";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { toast } from "@/components/ui/toast";
import { AuthGuard } from "@/components/shell/auth-guard";
import { useGetMe, useLogout } from "@/hooks";
import { getRoleHome, getRoleLabel, getRoleNav } from "@/routes";
import { useUiPrefsStore } from "@/stores/ui-prefs.store";
import type { UserRole } from "@/types";

function initials(firstName: string, lastName: string) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

function profileHref(role: UserRole) {
  return `${getRoleHome(role)}/profile`;
}

function DashboardFrame({
  role,
  children,
}: {
  role: UserRole;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data } = useGetMe();
  const logout = useLogout();
  const user = data?.data;
  const nav = getRoleNav(role);
  const sidebarOpen = useUiPrefsStore((state) => state.sidebarOpen);
  const setSidebarOpen = useUiPrefsStore((state) => state.setSidebarOpen);

  function handleLogout() {
    logout.mutate(undefined, {
      onSuccess: () => {
        googleLogout();
        toast.add({
          title: "Signed out",
          description: "You have been logged out.",
          type: "success",
        });
        router.push("/");
      },
      onError: () => {
        toast.add({
          title: "Could not sign out",
          description: "Something went wrong. Try again.",
          type: "error",
        });
      },
    });
  }

  return (
    <SidebarProvider
      open={sidebarOpen}
      onOpenChange={setSidebarOpen}
    >
      <Sidebar collapsible="icon" variant="inset">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" render={<Link href={getRoleHome(role)} />}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-semibold">
                  PM
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">PowerMesh</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {getRoleLabel(role)} desk
                  </span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          {nav.map((group) => (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => {
                    const active =
                      pathname === item.href ||
                      (item.href !== `/${role.toLowerCase()}` &&
                        pathname.startsWith(item.href));
                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          isActive={active}
                          tooltip={item.title}
                          render={<Link href={item.href} />}
                        >
                          <item.icon />
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
        <SidebarFooter>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex w-full items-center gap-2 rounded-lg p-2 text-left hover:bg-sidebar-accent">
              <Avatar size="sm">
                <AvatarFallback>
                  {user ? initials(user.firstName, user.lastName) : "PM"}
                </AvatarFallback>
              </Avatar>
              <div className="grid min-w-0 flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-medium">
                  {user ? `${user.firstName} ${user.lastName}` : "Account"}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {user?.email}
                </span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Signed in</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  router.push(profileHref(role));
                }}
              >
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-1 h-4" />
          <p className="mr-auto text-sm font-medium">
            {getRoleLabel(role)} dashboard
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={logout.isPending}
            onClick={handleLogout}
          >
            {logout.isPending ? "Signing out…" : "Log out"}
          </Button>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export function DashboardShell({
  role,
  children,
}: {
  role: UserRole;
  children: React.ReactNode;
}) {
  return (
    <AuthGuard allow={[role]}>
      <DashboardFrame role={role}>{children}</DashboardFrame>
    </AuthGuard>
  );
}
