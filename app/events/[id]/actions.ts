/*
File: src/app/events/[id]/actions.ts
*/

"use server";

import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/user";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";

// This is the main server action for registration
export async function registerForEvent(eventId: string) {
  const user = await getCurrentUser();

  // 1. Check if user is logged in
  if (!user) {
    throw new Error("You must be signed in to register.");
  }

  // 2. We only want students to register
  if (user.role !== "STUDENT") {
    throw new Error("Only students can register for events.");
  }

  // 3. Check if they are already registered
  const existingRegistration = await db.registration.findFirst({
    where: {
      studentId: user.clerkId,
      eventId: eventId,
    },
  });

  if (existingRegistration) {
    throw new Error("You are already registered for this event.");
  }

  // 4. Generate a unique QR code
  // We'll combine the user and event ID with a random string
  // This makes it secure and unique.
  const qrCodeData = `utsav:${user.clerkId}:${eventId}:${nanoid(10)}`;

  // 5. Create the registration in the database
  try {
    await db.registration.create({
      data: {
        qrCode: qrCodeData,
        studentId: user.clerkId,
        eventId: eventId,
      },
    });
  } catch (error) {
    console.error("Failed to create registration:", error);
    throw new Error("Failed to register. Please try again.");
  }

  // 6. Revalidate the page to show new UI
  revalidatePath(`/events/${eventId}`);

  return { success: "Registered successfully!" };
}
