/*
File: src/app/(dsw)/approvals/[id]/page.tsx
*/

import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import ApprovalForm from "./components/ApprovalForm";
import ReactMarkdown from "react-markdown";

export default async function ReviewPanelPage({
  params,
}: {
  params: { eventId: string };
}) {
  const eventId = params.eventId; // Get the ID from the params

  const events = await db.event.findMany({
    where: { id: eventId }, // Find all events with this ID
    include: {
      club: true,
      creator: true,
      notesheet: true,
      approval: true,
    },
    take: 1, // Limit to 1 result
  });

  const event = events[0]; // Get the first (and only) event from the array

  if (!event || !event.notesheet) {
    // This will run if no event was found
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <h1 className="mb-2 text-3xl font-bold">{event.title}</h1>
      <p className="mb-6 text-lg text-muted-foreground">
        Submitted by {event.club.name}
      </p>

      {/* --- AI NOTESHEET DISPLAY (Updated) --- */}
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-2xl font-semibold">AI-Generated Notesheet</h2>
        {/* 2. USE <ReactMarkdown> AND TAILWIND 'prose' 
          This will auto-style headings, lists, etc.
        */}
        <div className="prose prose-invert max-w-none">
          <ReactMarkdown>{event.notesheet.generatedText}</ReactMarkdown>
        </div>
      </div>

      {/* Approval Form */}
      <div className="mt-8">
        <h2 className="mb-4 text-2xl font-semibold">Approval Action</h2>

        {/* 2. RENDER THE FORM */}
        <ApprovalForm eventId={event.id} />
      </div>
    </div>
  );
}
