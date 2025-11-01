/*
File: src/app/api/webhooks/clerk/route.ts
(This is the complete, correct file)
*/

import { Webhook } from "svix";
import { headers } from "next/headers"; // Import from 'next/headers'
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

  // --- THIS IS THE CORRECTED SECTION ---
  // 1. We must 'await' the headers() function to get the headers object.
  const headerPayload = await headers();

  // 2. The .get() method on the headers object is NOT async.
  //    We do NOT use 'await' here.
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");
  // ------------------------------------

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
  const { id, emailAddresses, firstName, lastName, imageUrl } = evt.data;
  const eventType = evt.type;

  if (eventType === "user.created") {
    console.log("✅ Webhook received: user.created");

    // We cast evt.data to 'any' to bypass the incorrect TypeScript errors
    const data = evt.data as any;

    try {
      // Now we use the snake_case properties that Clerk sends in its payload
      await db.user.create({
        data: {
          clerkId: data.id,
          email: data.email_addresses[0].email_address,
          firstName: data.first_name,
          lastName: data.last_name,
          imageUrl: data.image_url,
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

  return NextResponse.json({ message: "Webhook received" }, { status: 200 });
}
