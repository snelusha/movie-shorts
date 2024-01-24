import React from "react";

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <div className="w-full h-[100dvh] inline-flex items-center justify-center">
      {children}
    </div>
  );
}
