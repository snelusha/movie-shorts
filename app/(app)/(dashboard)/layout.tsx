import React from "react";

import { redirect } from "next/navigation";

import { auth } from "@clerk/nextjs";

import Button from "@/components/button";

import { isAdmin } from "@/lib/users";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();
  if (!userId) return redirect("/sign-in");

  const admin = await isAdmin(userId);
  if (!admin) return redirect("/");

  return (
    <div className="flex flex-col">
      <div className="flex items-center space-x-4">
        <Button type="secondary" href="/dashboard/movies">
          Movies
        </Button>
        <Button type="secondary" href="/dashboard/directors">
          Directors
        </Button>
        <Button type="secondary" href="/dashboard/actors">
          Actors
        </Button>
      </div>
      {children}
    </div>
  );
}
