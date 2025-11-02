/*
File: src/app/page.tsx
(This is the final, polished landing page)
*/

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { EventCarousel } from "../components/EventCarousel";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer"; // 1. Import the Footer
import { SignedIn, SignedOut } from "@clerk/nextjs";

// --- Data Fetching & Icons (for "life") ---
import { db } from "@/lib/db";
import { format } from "date-fns";
import {
  FileText,
  CheckSquare,
  LayoutDashboard,
  Search,
  QrCode,
  Sparkles,
} from "lucide-react";

// The data for the features section (from before)
const features = [
  {
    icon: <FileText className="h-8 w-8 text-primary" />,
    title: "AI Powered Event Notesheet",
    description:
      "Club managers create events, and our AI instantly generates an official notesheet draft following MUJ's standard headings for seamless approvals.",
  },
  {
    icon: <CheckSquare className="h-8 w-8 text-primary" />,
    title: "Streamlined Event Approval",
    description:
      "DSW officials can easily review pending events, approve or reject with comments, and track all event statuses. Automated notifications keep managers updated.",
  },
  {
    icon: <LayoutDashboard className="h-8 w-8 text-primary" />,
    title: "Role-Based Dashboards",
    description:
      "Personalized dashboards for students, club managers, and DSW officials provide quick access to registrations, approvals, and actionable insights.",
  },
  {
    icon: <Search className="h-8 w-8 text-primary" />,
    title: "Event Discovery & Registration",
    description:
      "Students can browse upcoming events, filter by type or date, view details, and register with a single click. QR-based tickets make participation smooth.",
  },
  {
    icon: <QrCode className="h-8 w-8 text-primary" />,
    title: "QR Check-In & Attendance",
    description:
      "Club managers can scan QR codes at the venue to mark attendance in real-time, keeping participation data accurate and effortlessly organized.",
  },
  {
    icon: <Sparkles className="h-8 w-8 text-primary" />,
    title: "AI Feedback & Insights",
    description:
      "After events, AI analyzes feedback and suggests improvements. Managers can also generate polished event descriptions and summaries with a click.",
  },
];

// 2. This function adds "life" by fetching REAL data
async function getFeaturedEvents() {
  const events = await db.event.findMany({
    where: {
      status: "APPROVED",
      date: { gte: new Date() }, // Only approved, future events
    },
    orderBy: {
      date: "asc", // Show the soonest ones
    },
    take: 3, // Get the top 3
    include: {
      club: true,
    },
  });
  return events;
}

export default async function Home() {
  // 3. Fetch the data when the page loads
  const featuredEvents = await getFeaturedEvents();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex flex-1 flex-col items-center pt-16">
        {/* --- 1. HERO SECTION --- */}
        <section className="relative flex h-[calc(100vh-4rem)] w-full items-center justify-center">
          <div
            className="absolute inset-0 bg-[url('/img/muj-campus.jpg')] bg-cover bg-center"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-black/50" aria-hidden="true" />
          <div className="relative z-10 container px-4 text-center text-white drop-shadow-md">
            <h1 className="text-6xl font-bold tracking-tight md:text-8xl">
              <span className="text-primary">U</span>tsav
            </h1>
            <p className="mt-4 text-lg text-gray-200 md:text-xl">
              MUJ's One Stop Event Management Platform
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <SignedOut>
                <Button asChild size="lg">
                  <Link href="/sign-up">Get Started</Link>
                </Button>
              </SignedOut>
              <SignedIn>
                <Button asChild size="lg">
                  <Link href="/dashboard">View Your Dashboard</Link>
                </Button>
              </SignedIn>
              <Button asChild size="lg" variant="secondary">
                <Link href="/events">Browse Events</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* --- 2. CAROUSEL SECTION --- */}
        <section className="w-full px-4 py-16 md:py-24">
          <h2 className="mb-8 text-center text-3xl font-bold">
            Glimpses of MUJ Events
          </h2>
          <div className="flex justify-center">
            <EventCarousel />
          </div>
        </section>

        {/* --- 3. NEW FEATURED EVENTS SECTION --- */}
        {featuredEvents.length > 0 && (
          <section className="w-full bg-muted py-16 md:py-24">
            <div className="container mx-auto max-w-5xl px-4">
              <h2 className="mb-12 text-center text-3xl font-bold">
                Upcoming Events
              </h2>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {featuredEvents.map((event) => (
                  <Link
                    href={`/events/${event.id}`}
                    key={event.id}
                    className="group rounded-lg border bg-card p-6 shadow-sm transition-transform duration-300 ease-in-out hover:scale-105"
                  >
                    <h3 className="mb-2 text-xl font-semibold group-hover:text-primary">
                      {event.title}
                    </h3>
                    <p className="mb-3 text-sm font-medium text-primary">
                      {event.club.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(event.date, "PPP")}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* --- 4. FEATURES SECTION --- */}
        <section id="features" className="w-full py-16 md:py-24">
          <div className="container mx-auto max-w-5xl px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">
              A Platform Built for MUJ
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-lg border bg-card p-6 shadow-sm transition-transform duration-300 ease-in-out hover:scale-105"
                >
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="mb-2 text-xl font-semibold">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* --- 5. NEW FOOTER --- */}
      <Footer />
    </div>
  );
}
