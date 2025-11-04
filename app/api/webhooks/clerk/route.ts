/*
File: src/app/api/webhooks/clerk/route.ts
(This is the final, type-safe version)
*/

import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env"
    );
  }

  // 1. We must 'await' the headers() function
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing svix headers", {
      status: 400,
    });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error: Invalid signature", {
      status: 400,
    });
  }

  // --- HANDLE THE EVENT ---
  const eventType = evt.type;

  if (eventType === "user.created") {
    console.log("✅ Webhook received: user.created");

    // We destructure INSIDE the 'if' block.
    // TypeScript now knows 'evt.data' is of type 'UserJSON'.
    // --- THIS IS THE FIX: Using snake_case ---
    const {
      id,
      email_addresses,
      first_name,
      last_name,
      image_url,
      primary_email_address_id,
    } = evt.data;

    if (!id) {
      return new Response("Error: Missing Clerk ID", { status: 400 });
    }

    // Find the primary email
    // --- THIS IS THE FIX: Using snake_case ---
    const email = email_addresses.find(
      (e) => e.id === primary_email_address_id
    )?.email_address;

    if (!email) {
      return new Response("Error: Missing primary email", { status: 400 });
    }

    try {
      // We now use the correct, type-safe variables
      // --- THIS IS THE FIX: Using snake_case ---
      await db.user.create({
        data: {
          clerkId: id,
          email: email,
          firstName: first_name,
          lastName: last_name,
          imageUrl: image_url,
          role: "STUDENT",
        },
      });

      console.log("✅ User created in database");
      return NextResponse.json({ message: "User created" }, { status: 201 });
    } catch (err) {
      console.error("Error creating user in database:", err);
      return NextResponse.json(
        { message: "Error creating user", error: err },
        { status: 500 }
      );
    }
  }

  // Handle other event types (e.g., user.updated, user.deleted) if needed
  // For example, you might want to update or delete your user record.

  if (eventType === "user.updated") {
    console.log("✅ Webhook received: user.updated");
    // You could add logic here to update the user's name/image in your DB
  }

  if (eventType === "user.deleted") {
    console.log("✅ Webhook received: user.deleted");
    // You could add logic here to delete the user from your DB
  }

  return NextResponse.json({ message: "Webhook received" }, { status: 200 });
}
