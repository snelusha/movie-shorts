import React from "react";

import { UserButton, auth } from "@clerk/nextjs";

import Icon from "@/components/icon";
import Link from "@/components/link";
import Button from "@/components/button";

import prisma from "@/lib/db";

export default async function Layout({ children }: React.PropsWithChildren) {
  const { userId } = auth();
  const user = await prisma.user.findUnique({
    where: {
      id: userId || "",
    },
  });

  return (
    <main className="relative max-w-5xl w-full px-8 mx-auto">
      <nav className="absolute inset-x-0 top-0 z-50 h-20 flex items-center justify-between px-8">
        <Link href="/">
          <div className="inline-flex items-center">
            <Icon
              className="w-5 h-5 text-secondary-dark"
              name="clapper_board"
            />
            <span className="text-sm tracking-widest font-medium uppercase text-secondary-dark ml-2">
              Shorts
            </span>
          </div>
        </Link>
        {user ? (
          <div className="flex items-center space-x-4">
            {user.role === "admin" && (
              <Button href="/dashboard/movies" type="secondary">
                Dashboard
              </Button>
            )}
            <UserButton />
          </div>
        ) : (
          <Link href="/sign-in" className="text-sm text-secondary-dark ml-2">
            Sign in
          </Link>
        )}
      </nav>
      <div className="pt-20">{children}</div>
    </main>
  );
}
