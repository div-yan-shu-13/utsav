// src/app/(club)/check-in/[eventId]/page.tsx
import CheckInClient from "./CheckInClient";

export default async function Page({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  // unwrap the params Promise on the server
  const { eventId } = await params;

  // pass eventId as a plain prop to the client component
  return <CheckInClient eventId={eventId} />;
}
