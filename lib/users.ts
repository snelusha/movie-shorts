"use server";

import prisma from "@/lib/db";

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id: id },
  });
}

export async function isAdmin(id: string) {
  const user = await getUserById(id);
  return user?.role === "admin";
}
