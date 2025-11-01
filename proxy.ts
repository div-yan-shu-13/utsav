import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// This function matches routes that should be PUBLIC (not require auth)
const isPublicRoute = createRouteMatcher([
  "/", // The homepage
  "/sign-in(.*)", // The sign-in page
  "/sign-up(.*)", // The sign-up page
  "/api/webhooks/clerk", // Clerk webhooks
]);

export default clerkMiddleware((auth, req) => {
  // Check if the current route is NOT public
  if (!isPublicRoute(req)) {
    // If it's not a public route, protect it.
    // This will redirect unauthenticated users to the sign-in page.
    auth.protect();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
