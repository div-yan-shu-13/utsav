/*
File: src/app/(club)/create-event/page.tsx
*/

import EventForm from "./components/EventForm";

export default function CreateEventPage() {
  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold tracking-tight">
        Create a New Event
      </h1>
      <p className="mb-8 text-lg text-foreground/70">
        Fill out the details below. Our AI will use this information to generate
        the official notesheet for DSW approval.
      </p>

      {/* Render the new form component */}
      <EventForm />
    </div>
  );
}
