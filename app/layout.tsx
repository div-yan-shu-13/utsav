/*
File: src/app/layout.tsx
(This is the complete, correct file)
*/

import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark as clerkDarkTheme } from "@clerk/themes";
import { Toaster } from "@/components/ui/sonner"; // <-- 1. IMPORT FROM 'sonner'

export const metadata: Metadata = {
  title: "Utsav MVP - MUJ Events",
  description: "Streamlining club events, approvals, and registration at MUJ.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: clerkDarkTheme,
      }}
    >
      <html
        lang="en"
        className={`dark ${GeistSans.variable} ${GeistMono.variable}`}
        suppressHydrationWarning
      >
        <body>
          {children}
          {/* 2. ADD THE NEW TOASTER (it's 'richColors' and 'theme') */}
          <Toaster richColors theme="dark" />
        </body>
      </html>
    </ClerkProvider>
  );
}
