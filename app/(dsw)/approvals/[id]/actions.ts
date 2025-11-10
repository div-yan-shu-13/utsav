/*
File: src/app/(dsw)/approvals/[id]/actions.ts
*/

"use server";

import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/user";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// --- APPROVE ACTION ---
export async function approveEvent(eventId: string) {
  const user = await getCurrentUser();

  // 1. Check for DSW role
  if (!user || user.role !== "DSW_OFFICIAL") {
    throw new Error("Unauthorized");
  }

  // 2. Find the approval record for this event
  const approval = await db.eventApproval.findFirst({
    where: { eventId },
  });

  if (!approval) {
    throw new Error("Approval record not found.");
  }

  // 3. Update both the Event and its Approval in a transaction
  try {
    await db.$transaction([
      // a. Update the Event status
      db.event.update({
        where: { id: eventId },
        data: { status: "APPROVED" },
      }),
      // b. Update the EventApproval record
      db.eventApproval.update({
        where: { id: approval.id },
        data: {
          status: "APPROVED",
          reviewerId: user.clerkId, // Mark who approved it
        },
      }),
    ]);
  } catch (error) {
    console.error("Failed to approve event:", error);
    throw new Error("Database transaction failed.");
  }

  // 4. Clear the cache for the approvals page
  revalidatePath("/approvals");
  // 5. Redirect back to the list
  redirect("/approvals");
}

// --- REJECT ACTION ---
export async function rejectEvent(eventId: string, comments: string) {
  const user = await getCurrentUser();

  // 1. Check for DSW role
  if (!user || user.role !== "DSW_OFFICIAL") {
    throw new Error("Unauthorized");
  }

  // 2. Check for comments
  if (!comments) {
    throw new Error("Comments are required to reject an event.");
  }

  // 3. Find the approval record
  const approval = await db.eventApproval.findUnique({
    where: { eventId },
  });

  if (!approval) {
    throw new Error("Approval record not found.");
  }

  // 4. Update both records
  try {
    await db.$transaction([
      // a. Update the Event status
      db.event.update({
        where: { id: eventId },
        data: { status: "REJECTED" },
      }),
      // b. Update the EventApproval record
      db.eventApproval.update({
        where: { id: approval.id },
        data: {
          status: "REJECTED",
          reviewerId: user.clerkId,
          comments: comments, // Add the rejection reason
        },
      }),
    ]);
  } catch (error) {
    console.error("Failed to reject event:", error);
    throw new Error("Database transaction failed.");
  }

  // 5. Clear cache and redirect
  revalidatePath("/approvals");
  redirect("/approvals");
}
