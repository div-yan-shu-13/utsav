/*
File: src/app/events/[id]/page.tsx
(This file has both fixes applied)
*/

import { db } from "@/lib/db";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import { UserButton } from "@clerk/nextjs"; // This is a client component, this import is correct
import { auth } from "@clerk/nextjs/server"; // This is a server function, this import is correct
import Link from "next/link";
// 1. THE FIX: Use a relative import
import RegisterButton from "./components/RegisterButton";

// This function fetches the event data
async function getEventDetails(eventId: string) {
  const events = await db.event.findMany({
    where: {
      id: eventId,
      status: "APPROVED",
    },
    include: {
      club: true,
    },
    take: 1, // Using findMany/take:1 to avoid cache issues
  });

  const event = events[0];

  if (!event) {
    notFound();
  }
  return event;
}

// This function checks registration status
async function getRegistrationStatus(eventId: string) {
  // 2. THE FIX: Add 'await' to the auth() call
  const { userId } = await auth();
  if (!userId) {
    return false;
  }

  const registration = await db.registration.findFirst({
    where: {
      eventId: eventId,
      studentId: userId,
    },
  });

  return !!registration;
}

// This is the page component
export default async function EventDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const event = await getEventDetails(params.id);
  const isAlreadyRegistered = await getRegistrationStatus(params.id);

  return (
    <div className="min-h-screen">
      {/* Simple header */}
      <header className="flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
        <Link
          href="/events"
          className="text-lg font-bold tracking-tight text-foreground"
        >
          Utsav Events
        </Link>
        <UserButton />
      </header>

      {/* Page Content */}
      <main className="mx-auto max-w-3xl p-4 py-8 md:p-8">
        <h1 className="mb-4 text-4xl font-bold tracking-tight">
          {event.title}
        </h1>
        <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-lg text-muted-foreground">
          <span>{event.club.name}</span>
          <span>•</span>
          <span>{format(event.date, "PPP")}</span>
          <span>•</span>
          <span>{event.venue}</span>
        </div>
        <p className="mb-8 text-lg leading-relaxed">{event.description}</p>

        {/* Registration Button */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">
            Register for this Event
          </h2>
          <p className="mb-6 text-muted-foreground">
            Secure your spot! Registration is free.
          </p>

          <RegisterButton
            eventId={event.id}
            isAlreadyRegistered={isAlreadyRegistered}
          />
        </div>
      </main>
    </div>
  );
}
