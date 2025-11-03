"use client";

import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import { LayoutDashboard, Calendar, Search, QrCode } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// This type will hold all our navigation links
export type NavLink = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

interface SidebarProps {
  links: NavLink[];
  roleName: string;
}

export default function Sidebar({ links, roleName }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="hidden h-full border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        {/* Header */}
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="text-xl font-bold font-display">
              <span className="text-primary">U</span>tsav
            </span>
            <span className="rounded-md bg-primary px-2 py-1 text-sm font-medium text-primary-foreground">
              {roleName}
            </span>
          </Link>
        </div>

        {/* Links */}
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-4 text-sm font-medium">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  pathname === link.href && "bg-muted text-primary"
                )}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Footer with User Button */}
        <div className="mt-auto border-t p-4">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
}
