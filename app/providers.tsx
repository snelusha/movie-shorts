import React from "react";

import { ClerkProvider } from "@clerk/nextjs";

export default function Providers({ children }: React.PropsWithChildren) {
  return <ClerkProvider>{children}</ClerkProvider>;
}
