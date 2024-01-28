"use server";

import prisma from "@/lib/db";

import type { Comment } from "@prisma/client";

export async function createComment(comment: Omit<Comment, "id">) {
  return await prisma.comment.create({
    data: comment,
  });
}
