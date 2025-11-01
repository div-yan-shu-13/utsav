/*
File: src/app/(club)/create-event/components/EventForm.tsx
*/

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventFormSchema, EventFormValues } from "@/lib/schemas";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { createEvent } from "../actions";
import { toast } from "sonner";

// Import all our shadcn/ui components
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export default function EventForm() {
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      /* ... (same as before) ... */
    },
  });

  const { isSubmitting } = form.formState;

  // --- THIS IS THE UPDATED SUBMIT HANDLER ---
  async function onSubmit(values: EventFormValues) {
    try {
      await createEvent(values);
      // We don't even need a success toast, the redirect is enough
      // toast.success("Event created!");
    } catch (error) {
      // --- THIS IS THE FIX ---
      // Check if the error is the special NEXT_REDIRECT error
      if ((error as Error)?.message?.includes("NEXT_REDIRECT")) {
        // If it is, it's a successful redirect, so just stop.
        return;
      }

      // Otherwise, it's a REAL error
      toast.error("Oh no! Something went wrong.", {
        description: (error as Error).message || "Failed to create event.",
      });
    }
  }

  // The rest of the form is identical
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-2xl space-y-8"
      >
        {/* --- Event Title --- */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 'Momentum 2025'" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* --- Event Description --- */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about your event..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* --- Event Date --- */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Event Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-60 pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* --- Event Venue --- */}
        <FormField
          control={form.control}
          name="venue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Venue</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 'TMA Pai Hall'" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* --- AI NOTESHEET FIELDS --- */}
        <h2 className="pt-4 text-2xl font-semibold tracking-tight">
          AI Notesheet Details
        </h2>
        <p className="text-sm text-muted-foreground">
          This information will be used by the AI to generate the official
          notesheet.
        </p>

        {/* --- Objectives --- */}
        <FormField
          control={form.control}
          name="objectives"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Objectives</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="What are the goals of this event?"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* --- Beneficiaries --- */}
        <FormField
          control={form.control}
          name="beneficiaries"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Beneficiaries</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 'All MUJ students'" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* --- Schedule --- */}
        <FormField
          control={form.control}
          name="schedule"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Schedule</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., '10:00 AM: Inauguration...'"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* --- Requirements (Optional) --- */}
        <FormField
          control={form.control}
          name="requirements"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Requirements (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., 'AV setup, 2 mics, podium'"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* --- Creative URL (Optional) --- */}
        <FormField
          control={form.control}
          name="creativeUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Creative/Poster URL (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://..." />
              </FormControl>
              <FormDescription>
                Link to your event poster (e.g., Google Drive, Imgur).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* --- THIS IS THE UPDATED BUTTON --- */}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Create Event & Generate Notesheet"
          )}
        </Button>
      </form>
    </Form>
  );
}
