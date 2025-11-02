/*
File: src/app/(student)/dashboard/page.tsx
*/

import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/user";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import QRCode from "react-qr-code";
import Link from "next/link";

// 1. This function fetches the logged-in student's registrations
async function getMyRegistrations() {
  const user = await getCurrentUser();
  if (!user) {
    // This shouldn't happen because of the layout, but it's good practice
    notFound();
  }

  const registrations = await db.registration.findMany({
    where: {
      studentId: user.clerkId,
    },
    include: {
      event: {
        // Get the event details for each registration
        include: {
          club: true,
        },
      },
    },
    orderBy: {
      event: {
        date: "asc",
      },
    },
  });
  return registrations;
}

// 2. This is the main page component
export default async function StudentDashboard() {
  const registrations = await getMyRegistrations();

  return (
    <div className="max-w-4xl">
      <h1 className="mb-6 text-3xl font-bold tracking-tight">
        My Registrations
      </h1>

      {registrations.length === 0 ? (
        <p className="text-muted-foreground">
          You are not registered for any upcoming events.{" "}
          <Link href="/events" className="text-blue-400 hover:underline">
            Browse events
          </Link>
        </p>
      ) : (
        <div className="space-y-6">
          {/* 3. Loop over the registrations and show them */}
          {registrations.map((reg) => (
            <div
              key={reg.id}
              className="flex flex-col gap-6 rounded-lg border bg-card p-6 shadow-sm md:flex-row"
            >
              {/* Event Details */}
              <div className="flex-1">
                <h2 className="mb-2 text-2xl font-semibold">
                  {reg.event.title}
                </h2>
                <p className="mb-1 text-sm font-medium text-blue-400">
                  {reg.event.club.name}
                </p>
                <p className="mb-4 text-sm text-muted-foreground">
                  {format(reg.event.date, "PPP")} • {reg.event.venue}
                </p>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    reg.checkedIn
                      ? "bg-green-900 text-green-200"
                      : "bg-gray-700 text-gray-200"
                  }`}
                >
                  {reg.checkedIn ? "Checked In" : "Not Checked In"}
                </span>
              </div>

              {/* QR Code Ticket */}
              <div className="flex flex-col items-center justify-center rounded-lg bg-white p-4">
                <QRCode
                  value={reg.qrCode}
                  size={160} // 160x160 pixels
                  className="h-auto max-w-full"
                />
                <p className="mt-2 text-xs font-medium text-black">
                  Show this at the event
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
