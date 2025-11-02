// src/app/(club)/check-in/[eventId]/CheckInPageClient.tsx
"use client";

import { useState, useTransition } from "react";
import { checkInUser } from "../actions"; // server action (unchanged)
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import QrScannerComponent from "./components/QrScannerComponent";

export default function CheckInPageClient({ eventId }: { eventId: string }) {
  const [isPending, startTransition] = useTransition();
  const [lastResult, setLastResult] = useState<string | null>(null);

  // Called on successful scan
  const handleScan = (decodedText: string) => {
    // Prevent duplicates
    if (decodedText && decodedText !== lastResult) {
      setLastResult(decodedText);

      startTransition(async () => {
        try {
          // Extract eventId from the QR payload (same as before)
          const qrEventId = decodedText.split(":")[2];

          if (qrEventId !== eventId) {
            toast.error("Invalid QR Code", {
              description: "This ticket is for a different event.",
            });
            return;
          }

          // Call the server action
          const result = await checkInUser(decodedText);

          toast.success("Check-in Successful!", {
            description: result.success,
          });
        } catch (error) {
          toast.error("Check-in Failed", {
            description: (error as Error).message,
          });
        } finally {
          // allow another scan after 2s
          setTimeout(() => setLastResult(null), 2000);
        }
      });
    }
  };

  const handleError = (errorMessage: string) => {
    if (errorMessage.includes("Permission denied")) {
      toast.error("Camera permission denied", {
        description: "Please allow camera access in your browser settings.",
      });
    }
    // ignore non-critical scanner errors
  };

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-4 text-3xl font-bold">Event Check-in</h1>
      <p className="mb-6 text-muted-foreground">
        Point the camera at a student's QR code to check them in.
      </p>

      <div className="overflow-hidden rounded-lg border">
        <QrScannerComponent
          onScanSuccess={handleScan}
          onScanFailure={handleError}
        />
      </div>

      <div className="mt-6 flex h-16 items-center justify-center rounded-lg bg-card text-center">
        {isPending ? (
          <div className="flex items-center">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Verifying ticket...
          </div>
        ) : (
          <p className="text-muted-foreground">Waiting for QR code...</p>
        )}
      </div>
    </div>
  );
}
