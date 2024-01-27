"use server";

import prisma from "@/lib/db";

import type { Actor } from "@prisma/client";

export async function getActors() {
  return await prisma.actor.findMany();
}

export async function createActor(actor: Omit<Actor, "id">) {
  return await prisma.actor.create({
    data: actor,
  });
}

export async function updateActor(actor: Actor) {
  return await prisma.actor.update({
    where: {
      id: actor.id,
    },
    data: actor,
  });
}

export async function deleteActor(id: string) {
  return await prisma.actor.delete({
    where: {
      id,
    },
  });
}
