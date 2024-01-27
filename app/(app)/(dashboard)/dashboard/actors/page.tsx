import React from "react";

import ActorsList from "@/components/actors-list";

import prisma from "@/lib/db";

export default async function Page() {
  const actors = await prisma.actor.findMany();
  return (
    <div className="flex flex-col py-10">
      <ActorsList actors={actors} />
    </div>
  )
}
