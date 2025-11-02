/*
File: src/app/components/Navbar.tsx
(This version fixes the layout)
*/

import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      {/* 1. We remove 'justify-between' from this div */}
      <div className="container mx-auto flex h-16 max-w-5xl items-center px-4">
        {/* 2. Logo - We add 'mr-auto' to push all other items to the right */}
        <Link
          href="/"
          className="mr-auto text-2xl font-bold tracking-tight text-foreground"
        >
          Utsav
        </Link>

        {/* 3. Middle Links */}
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link
            href="/#features"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Features
          </Link>
          <Link
            href="/events"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Browse Events
          </Link>
          <Link
            href="/dashboard"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            For Clubs
          </Link>
          <Link
            href="/dashboard"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            For DSW
          </Link>
          <Link
            href="/about"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            About
          </Link>
          <Link
            href="/team"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Team
          </Link>
        </nav>

        {/* 4. Auth Buttons - We add 'ml-6' to give it space from the nav links */}
        <div className="ml-6 flex items-center gap-4">
          <SignedOut>
            <Button variant="ghost" asChild>
              <Link href="/sign-in">Log In</Link>
            </Button>
            <Button asChild>
              <Link href="/sign-up">Register</Link>
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
