/*
File: src/app/components/Footer.tsx
*/

import Link from "next/link";
import { Twitter, Linkedin } from "lucide-react"; // Icons for social links

export default function Footer() {
  return (
    <footer className="w-full border-t bg-muted">
      <div className="container mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row">
        <p className="text-sm text-muted-foreground">
          © 2025 Utsav. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="#" // Add your X link here
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Twitter"
          >
            <Twitter className="h-5 w-5" />
          </Link>
          <Link
            href="#" // Add your LinkedIn link here
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="LinkedIn"
          >
            <Linkedin className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
