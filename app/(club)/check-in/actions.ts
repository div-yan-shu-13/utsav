/*
File: src/app/(club)/actions.ts
*/

"use server";

import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/user";
import { revalidatePath } from "next/cache";

/**
 * This action is called when a QR code is successfully scanned.
 * It marks a student as checked in.
 */
export async function checkInUser(qrCodeData: string) {
  const user = await getCurrentUser();

  // 1. Verify this user is a Club Manager
  if (!user || user.role !== "CLUB_MANAGER") {
    throw new Error("Unauthorized");
  }

  // 2. Find the registration associated with this QR code
  const registration = await db.registration.findUnique({
    where: {
      qrCode: qrCodeData,
    },
    include: {
      student: true, // Get the student's info
      event: true, // Get the event's info
    },
  });

  // 3. Handle errors
  if (!registration) {
    throw new Error("Invalid QR Code. No registration found.");
  }

  // 4. Check if the manager scanning this belongs to the club
  //    that is running the event.
  const club = await db.club.findUnique({
    where: { managerId: user.clerkId },
  });

  if (registration.event.clubId !== club?.id) {
    throw new Error("This is not your event. Scan unauthorized.");
  }

  // 5. Check if already checked in
  if (registration.checkedIn) {
    throw new Error(
      `Student (${registration.student.firstName}) is already checked in.`
    );
  }

  // 6. --- SUCCESS: Mark as checked in ---
  await db.registration.update({
    where: {
      id: registration.id,
    },
    data: {
      checkedIn: true,
    },
  });

  // 7. Revalidate the student's dashboard so their QR code updates
  revalidatePath("/dashboard/student");

  // 8. Return a success message with the student's name
  return {
    success: `Successfully checked in ${registration.student.firstName} ${registration.student.lastName}!`,
  };
}
