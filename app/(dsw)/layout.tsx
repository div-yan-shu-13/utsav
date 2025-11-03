import { getCurrentUser } from "@/lib/user";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import Sidebar, { NavLink } from "@/components/Sidebar";
import { LayoutDashboard, CheckSquare } from "lucide-react";

// 1. Define the links for the DSW sidebar
const dswLinks: NavLink[] = [
  {
    href: "/dashboard/dsw",
    label: "Dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    href: "/approvals",
    label: "Pending Approvals",
    icon: <CheckSquare className="h-4 w-4" />,
  },
];

export default async function DswLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 2. Protect this layout
  const user = await getCurrentUser();
  if (user?.role !== "DSW_OFFICIAL") {
    redirect("/dashboard");
  }

  return (
    // 3. --- THIS IS THE SCROLLING FIX ---
    // We lock the layout to the screen height
    <div className="flex h-screen overflow-hidden">
      <Sidebar links={dswLinks} roleName="Utsav / DSW" />

      {/* 4. This 'div' becomes the only scrollable area */}
      <div className="flex-1 overflow-auto">
        <main className="p-4 pt-8 md:p-8">{children}</main>
      </div>
    </div>
  );
}
