import { db } from "@/lib/db";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import ApprovalForm from "./components/ApprovalForm";
import ReactMarkdown from "react-markdown";

async function getEventDetails(eventId: string) {
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

  return event;
}

export default async function ReviewEventPage({
  params,
}: {
  params: { id: string };
}) {
  const event = await getEventDetails(params.id);

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
        {/* This is the formatting fix:
          - prose-invert: Makes text white (for light mode)
          - prose-hr:hidden: Hides the '---' lines
          - prose-p:my-2: Tightens up paragraphs
          - prose-headings:mb-2: Tightens up headings
        */}
        <div className="prose prose-p:my-2 prose-headings:mb-2 prose-hr:hidden max-w-none">
          <ReactMarkdown>{event.notesheet!.generatedText}</ReactMarkdown>
        </div>
      </div>

      {/* Approval Form */}
      <div className="mt-8">
        <h2 className="mb-4 text-2xl font-semibold">Approval Action</h2>
        <ApprovalForm eventId={event.id} />
      </div>
    </div>
  );
}
