/*
File: src/lib/db.ts
*/

import { PrismaClient } from "@prisma/client";

// This prevents Next.js from creating multiple
// PrismaClients during hot-reloads in development
declare global {
  var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}
