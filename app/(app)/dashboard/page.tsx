import React from "react";

import { redirect } from "next/navigation";

import { auth } from "@clerk/nextjs";

import { getUserById } from "@/lib/users";

export default async function Page() {
  const { userId } = auth();
  if (!userId) return redirect("/sign-in");

  const user = await getUserById(userId);
  if (!user) return redirect("/sign-in");
  if (user.role !== "admin") return redirect("/");

  return null;
}
