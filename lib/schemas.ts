import { z } from "zod";

// This is the Zod schema for your event form
export const eventFormSchema = z
  .object({
    title: z.string().min(5, {
      message: "Title must be at least 5 characters.",
    }),
    description: z.string().min(20, {
      message: "Description must be at least 20 characters.",
    }),
    // --- THIS IS THE FIX ---
    // 1. We allow the type to be Date or undefined
    date: z.date().optional(),
    // -----------------------
    venue: z.string().min(3, {
      message: "Venue must be at least 3 characters.",
    }),

    // These fields are for the AI notesheet
    objectives: z.string().min(10, {
      message: "Please list at least one objective.",
    }),
    beneficiaries: z.string().min(3, {
      message: "Please list the beneficiaries (e.g., 'All students').",
    }),
    schedule: z.string().min(10, {
      message: "Please provide a basic schedule.",
    }),
    requirements: z.string().optional(),
    creativeUrl: z
      .string()
      .url({
        message: "Please provide a valid URL for the creative/poster.",
      })
      .optional(),
  })
  // 2. We use .refine() to make the optional date *required* on submission
  .refine((data) => !!data.date, {
    message: "An event date is required.",
    path: ["date"], // Tell Zod which field this error belongs to
  });
// -----------------------

// This type is now correctly inferred as `{ date?: Date | undefined, ... }`
export type EventFormValues = z.infer<typeof eventFormSchema>;
