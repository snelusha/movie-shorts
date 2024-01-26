"use server";

import prisma from "@/lib/db";

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id: id },
  });
}
