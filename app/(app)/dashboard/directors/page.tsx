import React from "react";

import Button from "@/components/button";
import DirectorsList from "@/components/directors-list";

import prisma from "@/lib/db";

export default async function Page() {
  const directors = await prisma.director.findMany();
  return (
    <div className="flex flex-col pt-10">
      <DirectorsList directors={directors} />
    </div>
  );
}
