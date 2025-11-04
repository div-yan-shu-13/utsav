import { z } from "zod";

// This is the Zod schema for your event form
export const eventFormSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  description: z.string().min(20, {
    message: "Description must be at least 20 characters.",
  }),
  // --- THIS IS THE FIX ---
  // We coerce to a date, then check that it's a valid date
  // by ensuring it's after a minimum value.
  date: z.coerce.date().min(new Date("1900-01-01"), {
    message: "An event date is required.",
  }),
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
  requirements: z.string().optional(), // e.g., "AV, mics, podium"
  creativeUrl: z
    .string()
    .url({
      message: "Please provide a valid URL for the creative/poster.",
    })
    .optional(),
});

// We also export the TypeScript 'type' of this schema
// This lets us use it in our components for type-safety
export type EventFormValues = z.infer<typeof eventFormSchema>;
