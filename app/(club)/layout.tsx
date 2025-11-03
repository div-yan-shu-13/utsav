import { getCurrentUser } from "@/lib/user";
import { redirect } from "next/navigation";
import Sidebar, { NavLink } from "@/components/Sidebar";
import { LayoutDashboard, PlusCircle } from "lucide-react";

// 1. Define the navigation links for a Club Manager
const clubLinks: NavLink[] = [
  {
    href: "/dashboard/club",
    label: "My Events",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    href: "/create-event",
    label: "Create Event",
    icon: <PlusCircle className="h-4 w-4" />,
  },
];

export default async function ClubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 2. Protect the route
  const user = await getCurrentUser();
  if (user?.role !== "CLUB_MANAGER") {
    redirect("/dashboard");
  }

  // 3. --- THIS IS THE FIX ---
  // Add 'h-screen overflow-hidden' to lock the layout to the viewport
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar links={clubLinks} roleName="Club Manager" />

      {/* 4. This 'div' becomes the only scrollable area */}
      <div className="flex-1 overflow-auto">
        <main className="p-4 pt-8 md:p-8">{children}</main>
      </div>
    </div>
  );
}
