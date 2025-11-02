/*
File: src/app/(student)/layout.tsx
*/

import { getCurrentUser } from "@/lib/user";
import { redirect } from "next/navigation";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Get the current user
  const user = await getCurrentUser();

  // 2. Protect this entire layout
  // We allow all roles here, but redirect to their main dashboard
  // if they aren't a student.
  if (user?.role !== "STUDENT") {
    redirect("/dashboard");
  }

  // 3. This is the shared UI for all student pages
  return (
    <div className="min-h-screen">
      <header className="flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link
            href="/dashboard/student"
            className="font-bold tracking-tight text-foreground transition-colors hover:text-foreground/80"
          >
            Utsav / Student
          </Link>
          <Link
            href="/dashboard/student"
            className="text-foreground/70 transition-colors hover:text-foreground"
          >
            My Registrations
          </Link>
          <Link
            href="/events"
            className="text-foreground/70 transition-colors hover:text-foreground"
          >
            Browse Events
          </Link>
        </nav>
        <UserButton />
      </header>

      <main className="p-4 md:p-8">{children}</main>
    </div>
  );
}
