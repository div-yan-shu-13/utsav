/*
File: src/app/page.tsx
*/

import { UserButton } from "@clerk/nextjs"; // Import the UserButton

export default function Home() {
  return (
    <>
      {/* This header will put the button in the top-right corner */}
      <header className="absolute right-4 top-4">
        <UserButton />
      </header>

      {/* This is our minimal homepage content from before */}
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-bold tracking-tight">Utsav MVP</h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            The future of event management at Manipal University Jaipur.
          </p>
        </div>
      </main>
    </>
  );
}
