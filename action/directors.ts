"use server";

import prisma from "@/lib/db";

import type { Director } from "@prisma/client";

export async function createDirector(director: Omit<Director, "id">) {
  return await prisma.director.create({
    data: director,
  });
}

export async function updateDirector(director: Director) {
  return await prisma.director.update({
    where: {
      id: director.id,
    },
    data: director,
  });
}

export async function deleteDirector(id: string) {
  return await prisma.director.delete({
    where: {
      id,
    },
  });
}
