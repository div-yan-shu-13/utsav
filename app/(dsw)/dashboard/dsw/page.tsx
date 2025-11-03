import { getCurrentUser } from "@/lib/user";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// 1. Fetch the DSW user's data
async function getDswData() {
  const user = await getCurrentUser();
  if (!user || user.role !== "DSW_OFFICIAL") {
    notFound();
  }
  return { user };
}

export default async function DswDashboard() {
  const { user } = await getDswData();

  return (
    <div>
      {/* 2. Personalized welcome message */}
      <h1 className="mb-8 text-3xl font-bold tracking-tight">
        Welcome, {user.firstName || "DSW Official"}!
      </h1>

      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-2xl font-semibold">Quick Actions</h2>
        <p className="mb-6 text-muted-foreground">
          View and manage all pending event submissions.
        </p>
        <Button asChild size="lg">
          <Link href="/approvals">View Pending Approvals</Link>
        </Button>
      </div>
    </div>
  );
}
