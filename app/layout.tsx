import "@/styles/globals.css";

import React from "react";

import Providers from "@/app/providers";

import { cn } from "@/lib/utils";
import { geistSans } from "@/styles/fonts";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Movie Shorts",
  description: "Every movie in 100 words or less.",
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "font-sans text-secondary-dark bg-primary antialiased",
          geistSans.variable
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
