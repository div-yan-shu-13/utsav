/*
File: src/app/(dsw)/approvals/page.tsx
(This version has the syntax fix)
*/

import { db } from "@/lib/db";
import { format } from "date-fns";
import Link from "next/link";

async function getPendingEvents() {
  const events = await db.event.findMany({
    where: {
      status: "PENDING_APPROVAL",
    },
    include: {
      club: true,
      creator: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  return events;
}

export default async function ApprovalsPage() {
  const events = await getPendingEvents();

  return (
    <div className="max-w-4xl">
      <h1 className="mb-6 text-3xl font-bold tracking-tight">
        Pending Event Approvals
      </h1>

      {events.length === 0 ? (
        <p className="text-muted-foreground">
          There are no events pending approval.
        </p>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="rounded-lg border bg-card p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{event.title}</h2>
                <span className="rounded-full bg-yellow-900 px-3 py-1 text-xs font-medium text-yellow-200">
                  {event.status.replace("_", " ")}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Submitted by {event.creator.firstName} ({event.club.name})
              </p>
              <p className="mt-2">Event Date: {format(event.date, "PPP")}</p>
              <p className="text-sm">Venue: {event.venue}</p>

              {/* --- THIS IS THE CORRECTED LINK --- */}
              <Link
                href={`/approvals/${event.id}`} // Point back to /approvals/
                className="mt-4 inline-block text-sm font-medium text-blue-400 hover:underline"
              >
                Review Notesheet & Approve/Reject
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
