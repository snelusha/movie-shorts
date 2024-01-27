import React from "react";

import DirectorsList from "@/components/directors-list";

import prisma from "@/lib/db";

export default async function Page() {
  const directors = await prisma.director.findMany();
  return (
    <div className="flex flex-col py-10">
      <DirectorsList directors={directors} />
    </div>
  );
}
