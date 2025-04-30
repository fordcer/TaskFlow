import type React from "react";
import type { Metadata } from "next";

import { UserProfile } from "@/components/user-profile";
import { ModeToggle } from "@/components/toggle-theme";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Task management dashboard",
};

const navItems = [
  {
    title: "Overview",
    href: "/dashboard/overview",
    icon: "LayoutDashboard",
  },
  {
    title: "Tasks",
    href: "/dashboard",
    icon: "ListTodo",
  },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({
  children,
}: Readonly<DashboardLayoutProps>) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-4">
          <h2 className="text-2xl font-bold tracking-tight">TaskFlow</h2>
          <div className="ml-auto flex items-center space-x-4">
            <ModeToggle />
            <UserProfile />
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="lg:w-1/5 lg:sticky lg:top-24 self-start">
            <DashboardNav items={navItems} />
          </aside>
          <div className="flex-1 lg:max-w-4xl">{children}</div>
        </div>
      </div>
    </div>
  );
}
