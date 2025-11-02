/*
File: src/app/events/page.tsx
*/

import { db } from "@/lib/db";
import { format } from "date-fns";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

// 1. This function fetches all APPROVED events on the server
async function getApprovedEvents() {
  const events = await db.event.findMany({
    where: {
      status: "APPROVED", // We only want approved events
      date: {
        gte: new Date(), // Only show events in the future
      },
    },
    include: {
      club: true, // Get the club's name
    },
    orderBy: {
      date: "asc", // Show the soonest events first
    },
  });
  return events;
}

// 2. This is the main page component
export default async function BrowseEventsPage() {
  const events = await getApprovedEvents();

  return (
    <div className="min-h-screen">
      {/* We'll add a simple header for navigation */}
      <header className="flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-foreground"
        >
          Utsav Events
        </Link>
        {/* The UserButton will show 'Sign In' or the user's profile */}
        <UserButton />
      </header>

      <main className="mx-auto max-w-5xl p-4 md:p-8">
        <h1 className="mb-6 text-3xl font-bold tracking-tight">
          Upcoming Events
        </h1>

        {/* 3. Check if there are any events */}
        {events.length === 0 ? (
          <p className="text-muted-foreground">
            No upcoming events. Check back soon!
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* 4. Loop over events and show them as cards */}
            {events.map((event) => (
              <Link
                href={`/events/${event.id}`}
                key={event.id}
                className="group rounded-lg border bg-card p-5 shadow-sm transition-all hover:border-blue-500"
              >
                {/* We can add the creativeUrl as a background image later */}
                <h2 className="mb-2 text-xl font-semibold group-hover:underline">
                  {event.title}
                </h2>
                <p className="mb-1 text-sm font-medium text-blue-400">
                  {event.club.name}
                </p>
                <p className="mb-4 text-sm text-muted-foreground">
                  {format(event.date, "PPP")} • {event.venue}
                </p>
                <p className="text-sm line-clamp-3">{event.description}</p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
