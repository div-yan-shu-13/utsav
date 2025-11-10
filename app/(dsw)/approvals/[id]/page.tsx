import { db } from "@/lib/db";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import ApprovalForm from "./components/ApprovalForm";
import ReactMarkdown from "react-markdown";

// Fetch a single event by id. Validate the id before querying so Prisma
// never receives `undefined`.
async function getEventDetails(eventId: string) {
  if (!eventId) {
    notFound();
  }

  const event = await db.event.findUnique({
    where: { id: eventId },
    include: {
      club: true,
      creator: true,
      notesheet: true,
      approval: true,
    },
  });

  if (!event || !event.notesheet) {
    notFound();
  }

  return event;
}

// Note: in this Next.js/Turbopack setup `params` can be a Promise.
// Await it to unwrap and safely read `id`.
export default async function ReviewEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  const event = await getEventDetails(id);

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
