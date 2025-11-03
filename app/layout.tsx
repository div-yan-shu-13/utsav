import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
// 1. Import the new 'Righteous' font
import { Righteous } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark as clerkLightTheme } from "@clerk/themes";
import { Toaster } from "@/components/ui/sonner";

// 2. Configure the new font
const righteous = Righteous({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-righteous", // Create a CSS variable
});

export const metadata: Metadata = {
  title: "Utsav - MUJ Events",
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
        baseTheme: clerkLightTheme,
      }}
    >
      <html
        lang="en"
        // 3. Add the font variable to the <html> tag
        className={`${GeistSans.variable} ${GeistMono.variable} ${righteous.variable}`}
        suppressHydrationWarning
      >
        <body>
          {children}
          <Toaster richColors theme="light" />
        </body>
      </html>
    </ClerkProvider>
  );
}
