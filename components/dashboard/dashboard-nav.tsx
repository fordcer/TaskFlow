"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { LayoutDashboard, ListTodo } from "lucide-react";

const iconMap = {
  LayoutDashboard: LayoutDashboard,
  ListTodo: ListTodo,
};

interface DashboardNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
    icon: string;
  }[];
}

export function DashboardNav({
  className,
  items,
  ...props
}: Readonly<DashboardNavProps>) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
        className
      )}
      {...props}
    >
      {items.map((item) => {
        const IconComponent = iconMap[item.icon as keyof typeof iconMap];

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              pathname === item.href
                ? "bg-gray-100 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-800"
                : "hover:bg-transparent hover:underline",
              "justify-start"
            )}
          >
            {IconComponent && <IconComponent className="mr-2 h-4 w-4" />}
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
