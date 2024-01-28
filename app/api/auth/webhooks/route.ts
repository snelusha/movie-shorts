import { headers } from "next/headers";

import prisma from "@/lib/db";

import { Webhook } from "svix";

import type {
  DeletedObjectJSON,
  UserJSON,
  WebhookEvent,
} from "@clerk/nextjs/server";

export async function POST(request: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    return new Response("No webhook secret", { status: 500 });
  }

  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing headers", { status: 400 });
  }

  const payload = await request.json();
  const body = JSON.stringify(payload);

  const webhook = new Webhook(WEBHOOK_SECRET);

  try {
    const event = webhook.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
    switch (event.type) {
      case "user.created":
        const createdUser = event.data as UserJSON;
        await prisma.user.create({
          data: {
            id: createdUser.id,
            email: createdUser.email_addresses[0].email_address,
            name: `${createdUser.first_name} ${createdUser.last_name}`.trim(),
            role: "user",
            image:
              createdUser.image_url ||
              "https://vercel.com/api/www/avatar/VvXRSBw39vBtBZXUAGxD4rA9?&s=64",
            created_at: new Date(createdUser.created_at),
            updated_at: new Date(createdUser.updated_at),
          },
        });
        break;
      case "user.updated":
        const updatedUser = event.data as UserJSON;
        await prisma.user.update({
          where: {
            id: updatedUser.id,
          },
          data: {
            email: updatedUser.email_addresses[0].email_address,
            name: `${updatedUser.first_name} ${updatedUser.last_name}`.trim(),
            image:
              updatedUser.image_url ||
              "https://vercel.com/api/www/avatar/VvXRSBw39vBtBZXUAGxD4rA9?&s=64",
            updated_at: new Date(updatedUser.updated_at),
          },
        });
        break;
      case "user.deleted":
        const deletedUser = event.data as DeletedObjectJSON;
        await prisma.user.delete({
          where: {
            id: deletedUser.id,
          },
        });
        break;
    }
    return new Response(null, { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Invalid webhook signature", { status: 400 });
  }
}
