import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/user";
import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { QrCode } from "lucide-react";

// 1. This function now gets the user, their club, AND their events
async function getClubData() {
  const user = await getCurrentUser();
  if (!user || user.role !== "CLUB_MANAGER") {
    notFound();
  }

  // 2. Fetch the club this manager is in charge of
  const club = await db.club.findUnique({
    where: { managerId: user.clerkId },
  });

  // 3. Fetch the events created by this manager
  const events = await db.event.findMany({
    where: {
      creatorId: user.clerkId,
    },
    orderBy: {
      date: "desc",
    },
  });

  // 4. Return all the data
  return { events, user, club };
}

// 5. The main page component
export default async function ClubDashboard() {
  const { events, user, club } = await getClubData();

  return (
    <div>
      <div className="mb-8">
        {/* 6. Personalized welcome message */}
        <h1 className="mb-2 text-3xl font-bold tracking-tight">
          Welcome, {user.firstName || "Manager"}!
        </h1>
        {/* 7. Club name display */}
        {club ? (
          <p className="text-xl text-muted-foreground">
            Managing:{" "}
            <span className="font-semibold text-primary">{club.name}</span>
          </p>
        ) : (
          <p className="text-xl text-yellow-500">
            You are not assigned to a club. Please contact DSW.
          </p>
        )}
      </div>

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">My Events</h2>
        <Button asChild>
          <Link href="/create-event">Create New Event</Link>
        </Button>
      </div>

      {events.length === 0 ? (
        <p className="text-muted-foreground">
          You have not created any events.
        </p>
      ) : (
        <div className="space-y-4">
          {/* 8. Loop over the events (this code is the same) */}
          {events.map((event) => (
            <div
              key={event.id}
              className="flex flex-col items-start gap-4 rounded-lg border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold">{event.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {format(event.date, "PPP")} • {event.venue}
                </p>
                <span
                  className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium ${
                    event.status === "APPROVED"
                      ? "bg-green-200 text-green-900"
                      : event.status === "REJECTED"
                      ? "bg-red-200 text-red-900"
                      : "bg-yellow-200 text-yellow-900"
                  }`}
                >
                  {event.status.replace("_", " ")}
                </span>
              </div>

              {event.status === "APPROVED" && event.date > new Date() && (
                <Button asChild variant="outline">
                  <Link href={`/check-in/${event.id}`}>
                    <QrCode className="mr-2 h-4 w-4" />
                    Open Check-in
                  </Link>
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
