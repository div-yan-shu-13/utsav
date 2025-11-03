import { getCurrentUser } from "@/lib/user";
import { redirect } from "next/navigation";
import Sidebar, { NavLink } from "@/components/Sidebar";
import { CalendarCheck, Search } from "lucide-react";

// 1. Define the navigation links for a Student
const studentLinks: NavLink[] = [
  {
    href: "/dashboard/student",
    label: "My Registrations",
    icon: <CalendarCheck className="h-4 w-4" />,
  },
  {
    href: "/events",
    label: "Browse Events",
    icon: <Search className="h-4 w-4" />,
  },
];

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 2. Protect the route
  const user = await getCurrentUser();
  if (user?.role !== "STUDENT") {
    redirect("/dashboard");
  }

  // 3. --- THIS IS THE FIX ---
  // Add 'h-screen overflow-hidden' to lock the layout to the viewport
  return (
    <div className="grid h-screen w-full overflow-hidden md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Sidebar (this will not scroll) */}
      <Sidebar links={studentLinks} roleName="Student" />

      {/* Main content area */}
      <div className="flex flex-col">
        {/* Add 'overflow-auto' to make this area scrollable */}
        <main className="flex-1 overflow-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
