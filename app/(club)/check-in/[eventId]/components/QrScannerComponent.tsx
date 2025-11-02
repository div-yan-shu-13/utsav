/*
File: src/app/(club)/check-in/[eventId]/components/QrScannerComponent.tsx
(This version fixes the QrDimensions type error)
*/
"use client";

import { useEffect } from "react";
// 1. We have removed 'QrDimensions' from the import
import { Html5QrcodeScanner } from "html5-qrcode";

interface QrScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanFailure: (errorMessage: string) => void;
}

const qrcodeRegionId = "html5qr-code-full-region";

export default function QrScannerComponent({
  onScanSuccess,
  onScanFailure,
}: QrScannerProps) {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const html5QrcodeScanner = new Html5QrcodeScanner(
      qrcodeRegionId,
      {
        fps: 10,
        // 2. We have added the explicit types for the parameters and return value
        qrbox: (
          viewfinderWidth: number,
          viewfinderHeight: number
        ): { width: number; height: number } => {
          const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
          const qrboxSize = Math.floor(minEdge * 0.7);
          return {
            width: qrboxSize,
            height: qrboxSize,
          };
        },
        supportedScanTypes: [],
      },
      /* verbose= */ false
    );

    html5QrcodeScanner.render(onScanSuccess, onScanFailure);

    return () => {
      html5QrcodeScanner.clear().catch((error) => {
        console.error("Failed to clear html5QrcodeScanner.", error);
      });
    };
  }, [onScanSuccess, onScanFailure]);

  return <div id={qrcodeRegionId} className="w-full" />;
}
