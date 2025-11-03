/*
File: src/app/events/[id]/page.tsx
*/

import { db } from "@/lib/db";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import RegisterButton from "./components/RegisterButton";
import Navbar from "@/components/Navbar"; // 1. Import the new Navbar
import Footer from "@/components/Footer"; // <-- 1. IMPORT THE FOOTER

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
    take: 1,
  });

  const event = events[0];

  if (!event) {
    notFound();
  }
  return event;
}

// This function checks registration status
async function getRegistrationStatus(eventId: string) {
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
  const param = await Promise.resolve(params);
  const event = await getEventDetails(param.id);
  const isAlreadyRegistered = await getRegistrationStatus(param.id);

  return (
    <div className="flex min-h-screen flex-col">
      {/* 2. Replace the old <header> with <Navbar /> */}
      <Navbar />

      {/* 3. Add 'pt-16' to offset the fixed navbar */}
      <main className="mx-auto max-w-3xl flex-1 p-4 py-8 pt-16 md:p-8 md:pt-24">
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

      {/* 4. ADD THE FOOTER */}
      <Footer />
    </div>
  );
}
