/*
File: src/lib/user.ts
*/

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { User } from "@prisma/client";

/**
 * Gets the current user from your Prisma database.
 * This is different from Clerk's 'currentUser()' which just gets auth info.
 * This function gets your *database* record, including the role.
 */
export const getCurrentUser = async (): Promise<User | null> => {
  // 1. Get the Clerk user ID
  const { userId } = await auth();

  if (!userId) {
    // Not logged in
    return null;
  }

  // 2. Find the user in your Prisma database using the clerkId
  const user = await db.user.findUnique({
    where: {
      clerkId: userId,
    },
  });

  return user;
};
