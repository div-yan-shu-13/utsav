/*
File: src/app/(dsw)/layout.tsx
*/

import { getCurrentUser } from "@/lib/user";
import { redirect } from "next/navigation";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export default async function DswLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Get the current user
  const user = await getCurrentUser();

  // 2. Protect this entire layout
  if (user?.role !== "DSW_OFFICIAL") {
    // If not a DSW official, kick them back to their own dashboard
    redirect("/dashboard");
  }

  // 3. This is the shared UI for all DSW pages
  return (
    <div className="min-h-screen">
      <header className="flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link
            href="/dashboard/dsw"
            className="font-bold tracking-tight text-foreground transition-colors hover:text-foreground/80"
          >
            Utsav / DSW
          </Link>
          <Link
            href="/approvals"
            className="text-foreground/70 transition-colors hover:text-foreground"
          >
            Pending Approvals
          </Link>
        </nav>
        <UserButton />
      </header>

      <main className="p-4 md:p-8">{children}</main>
    </div>
  );
}
