/*
File: src/app/events/[id]/components/RegisterButton.tsx
*/

"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { toast } from "sonner";
import { registerForEvent } from "../actions";

interface RegisterButtonProps {
  eventId: string;
  isAlreadyRegistered: boolean; // We'll pass this from the page
}

export default function RegisterButton({
  eventId,
  isAlreadyRegistered,
}: RegisterButtonProps) {
  const [isPending, startTransition] = useTransition();
  const { userId } = useAuth(); // Get the logged-in user's ID

  // This is the function that calls our server action
  const handleRegister = async () => {
    startTransition(async () => {
      try {
        const result = await registerForEvent(eventId);
        toast.success(result.success);
      } catch (error) {
        toast.error((error as Error).message);
      }
    });
  };

  // Case 1: User is not logged in
  if (!userId) {
    return (
      <Button asChild className="w-full" size="lg">
        <Link href="/sign-in">Sign in to Register</Link>
      </Button>
    );
  }

  // Case 2: User is logged in and already registered
  if (isAlreadyRegistered) {
    return (
      <Button className="w-full" size="lg" disabled>
        You are registered!
      </Button>
    );
  }

  // Case 3: User is logged in and not registered
  return (
    <Button
      className="w-full"
      size="lg"
      onClick={handleRegister}
      disabled={isPending}
    >
      {isPending ? (
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
      ) : (
        "Register Now"
      )}
    </Button>
  );
}
