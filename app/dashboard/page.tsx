/*
File: src/app/dashboard/page.tsx
*/

import { getCurrentUser } from "@/lib/user";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  // This shouldn't happen if our proxy.ts is working,
  // but it's a good safeguard.
  if (!user) {
    return redirect("/sign-in");
  }

  // This is the core logic:
  // Redirect the user based on their role in our database
  switch (user.role) {
    case "STUDENT":
      return redirect("/dashboard/student");
    case "CLUB_MANAGER":
      return redirect("/dashboard/club");
    case "DSW_OFFICIAL":
      return redirect("/dashboard/dsw");
    default:
      // A fallback in case the user has no role
      return redirect("/");
  }

  // This page will never render any UI
  return null;
}
