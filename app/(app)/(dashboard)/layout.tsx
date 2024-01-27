import React from "react";

import { redirect } from "next/navigation";

import { auth } from "@clerk/nextjs";

import { isAdmin } from "@/lib/users";

export default async function Layout({
  children,
}: {
  children: React.PropsWithChildren;
}) {
  const { userId } = auth();
  if (!userId) return redirect("/sign-in");

  const admin = await isAdmin(userId);
  if (!admin) return redirect("/");
  
  return children;
}
