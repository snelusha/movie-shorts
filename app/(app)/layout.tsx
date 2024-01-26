import React from "react";

import { UserButton, auth } from "@clerk/nextjs";

import Icon from "@/components/icon";
import Link from "@/components/link";

export default function Layout({ children }: React.PropsWithChildren) {
  const { userId } = auth();
  return (
    <main className="relative max-w-5xl w-full mx-auto">
      {/* <nav className="absolute inset-x-0 top-0 z-50 h-24 flex items-center justify-between border-b border-red-500">
        <div className="inline-flex items-center">
          <Icon className="w-5 h-5 text-secondary-dark" name="clapper_board" />
          <span className="text-sm tracking-widest font-medium uppercase text-secondary-dark ml-2">
            Shorts
          </span>
        </div>
        {userId ? (
          <UserButton />
        ) : (
          <Link href="/sign-in" className="text-sm text-secondary-dark ml-2">
            Sign in
          </Link>
        )}
      </nav> */}
      <div className="pt-24- px-8">{children}</div>
    </main>
  );
}
