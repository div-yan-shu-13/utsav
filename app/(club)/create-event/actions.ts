/*
File: src/app/(club)/create-event/actions.ts
*/

"use server"; // This defines the file as a Server Action file

import { z } from "zod";
import { Groq } from "groq-sdk";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/user";
import { eventFormSchema, EventFormValues } from "@/lib/schemas";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { format } from "date-fns";

// Initialize the Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * A helper function to build the AI prompt
 */
function buildNotesheetPrompt(data: EventFormValues): string {
  // Simple string template. You can make this as complex as you want.
  // This is where you'd match your "sample notesheet"
  return `
    Please generate an official notesheet for a university event.
    Use the following details and format it clearly with headings.

    IMPORTANT: Do NOT use Markdown tables, horizontal rules (---), or any placeholder signature lines (like '||---||' or '____').
    Just use clean, readable text.

    EVENT DETAILS:
    - Event Title: ${data.title}
    - Description: ${data.description}
    - Date: ${format(data.date, "PPP")}
    - Venue: ${data.venue}
    - Objectives: ${data.objectives}
    - Beneficiaries: ${data.beneficiaries}
    - Event Schedule: ${data.schedule}
    - Requirements: ${data.requirements || "None specified"}

    Generated Notesheet:
  `;
}

/**
 * The main Server Action to create the event
 */
export async function createEvent(values: EventFormValues) {
  // 1. Get the current user
  const user = await getCurrentUser();
  if (!user || user.role !== "CLUB_MANAGER") {
    throw new Error("Unauthorized");
  }

  // 2. Find which club this manager is in charge of
  const club = await db.club.findUnique({
    where: { managerId: user.clerkId },
  });

  if (!club) {
    throw new Error("You are not assigned to a club. Please contact DSW.");
  }

  // 3. (Optional but good) Re-validate data on the server
  const validatedFields = eventFormSchema.safeParse(values);
  if (!validatedFields.success) {
    throw new Error("Invalid form data.");
  }

  // Get the validated data
  const data = validatedFields.data;

  try {
    // 4. --- CALL THE AI ---
    const prompt = buildNotesheetPrompt(data);
    const aiResponse = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "openai/gpt-oss-120b", // A powerful model available on Groq
    });

    const notesheetText =
      aiResponse.choices[0]?.message?.content ||
      "Error: AI could not generate notesheet.";

    // 5. --- SAVE EVERYTHING TO DATABASE ---
    // We use a $transaction to ensure all or nothing is created.
    await db.$transaction(async (prisma) => {
      // a. Create the Event
      const newEvent = await prisma.event.create({
        data: {
          title: data.title,
          description: data.description,
          date: data.date,
          venue: data.venue,
          objectives: data.objectives,
          beneficiaries: data.beneficiaries,
          schedule: data.schedule,
          requirements: data.requirements,
          creativeUrl: data.creativeUrl,
          status: "PENDING_APPROVAL", // Set status to pending
          creatorId: user.clerkId, // Link to the user
          clubId: club.id, // Link to their club
        },
      });

      // b. Create the AI-generated Notesheet
      await prisma.notesheet.create({
        data: {
          generatedText: notesheetText,
          formDataJson: data, // Save the original form data
          eventId: newEvent.id, // Link to the new event
        },
      });

      // c. Create the initial "Pending" approval record
      await prisma.eventApproval.create({
        data: {
          status: "PENDING",
          eventId: newEvent.id, // Link to the new event
        },
      });
    });
  } catch (error) {
    console.error("Error creating event:", error);
    // In a real app, you'd return a specific error message
    throw new Error("Failed to create event. Please try again.");
  }

  // 6. --- SUCCESS ---
  // Clear the cache for the club dashboard so it shows the new event
  revalidatePath("/dashboard/club");
  // Send the user to their dashboard
  redirect("/dashboard/club");
}
