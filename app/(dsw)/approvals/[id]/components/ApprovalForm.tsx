/*
File: src/app/(dsw)/approvals/[id]/components/ApprovalForm.tsx
(This file fixes the button spinner and the redirect error)
*/

"use client";

import { useState, useTransition } from "react";
import { approveEvent, rejectEvent } from "../actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ApprovalFormProps {
  eventId: string;
}

export default function ApprovalForm({ eventId }: ApprovalFormProps) {
  const [isPending, startTransition] = useTransition();
  const [comments, setComments] = useState("");
  // 1. NEW STATE: Track which action is pending
  const [pendingAction, setPendingAction] = useState<
    "approve" | "reject" | null
  >(null);

  // Handler for the "Approve" button
  const handleApprove = async () => {
    setPendingAction("approve"); // 2. SET THE ACTION
    startTransition(async () => {
      try {
        await approveEvent(eventId);
        toast.success("Event approved successfully.");
      } catch (error) {
        // 3. THE FIX: Ignore redirect errors
        if ((error as Error)?.message?.includes("NEXT_REDIRECT")) {
          return;
        }
        toast.error("Failed to approve event", {
          description: (error as Error).message,
        });
      } finally {
        setPendingAction(null);
      }
    });
  };

  // Handler for the "Reject" button
  const handleReject = async () => {
    if (!comments) {
      toast.error("Comments are required to reject.");
      return;
    }

    setPendingAction("reject"); // 2. SET THE ACTION
    startTransition(async () => {
      try {
        await rejectEvent(eventId, comments);
        toast.success("Event rejected successfully.");
      } catch (error) {
        // 3. THE FIX: Ignore redirect errors
        if ((error as Error)?.message?.includes("NEXT_REDIRECT")) {
          return;
        }
        toast.error("Failed to reject event", {
          description: (error as Error).message,
        });
      } finally {
        setPendingAction(null);
      }
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="comments" className="text-base">
          Comments (Required for rejection)
        </Label>
        <Textarea
          id="comments"
          placeholder="Provide a reason for rejection..."
          className="mt-2"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          disabled={isPending}
        />
      </div>
      <div className="flex gap-4">
        {/* --- REJECT BUTTON (Updated) --- */}
        <Button
          variant="destructive"
          onClick={handleReject}
          disabled={isPending || !comments} // Still disabled if no comments
        >
          {/* 4. Only show spinner if 'reject' is pending */}
          {isPending && pendingAction === "reject" ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Reject
        </Button>
        {/* --- APPROVE BUTTON (Updated) --- */}
        <Button
          variant="default"
          className="bg-green-600 hover:bg-green-700"
          onClick={handleApprove}
          disabled={isPending}
        >
          {/* 4. Only show spinner if 'approve' is pending */}
          {isPending && pendingAction === "approve" ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Approve
        </Button>
      </div>
    </div>
  );
}
