/*
File: src/app/events/page.tsx
*/

import { db } from "@/lib/db";
import { format } from "date-fns";
import Link from "next/link";
import Navbar from "@/components/Navbar"; // 1. Import the new Navbar
import Footer from "@/components/Footer"; // 2. IMPORT THE FOOTER

// This function fetches all APPROVED events on the server
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

// This is the main page component
export default async function BrowseEventsPage() {
  const events = await getApprovedEvents();

  return (
    // 3. Make the main div a flex column
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* 4. Add 'w-full' to ensure the main element spans the width */}
      <main className="mx-auto max-w-5xl flex-1 w-full p-4 pt-16 md:p-8 md:pt-24">
        <h1 className="mb-6 text-3xl font-bold tracking-tight">
          Upcoming Events
        </h1>

        {/* Check if there are any events */}
        {events.length === 0 ? (
          <p className="text-muted-foreground">
            No upcoming events. Check back soon!
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Loop over events and show them as cards */}
            {events.map((event) => (
              <Link
                href={`/events/${event.id}`}
                key={event.id}
                className="group rounded-lg border bg-card p-5 shadow-sm transition-all duration-300 ease-in-out hover:scale-105 hover:border-primary"
              >
                {/* We can add the creativeUrl as a background image later */}
                <h2 className="mb-2 text-xl font-semibold group-hover:text-primary">
                  {event.title}
                </h2>
                <p className="mb-1 text-sm font-medium text-primary">
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

      {/* 5. ADD THE FOOTER */}
      <Footer />
    </div>
  );
}
