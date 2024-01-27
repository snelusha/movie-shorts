import React from "react";

import { notFound } from "next/navigation";

import MovieClient from "@/components/movie-client";

import prisma from "@/lib/db";

interface PageProps {
  params: {
    movie: string;
  };
}

export default async function Page({ params: { movie } }: PageProps) {
  const directors = await prisma.director.findMany();
  const actors = await prisma.actor.findMany();

  const create = movie === "create";
  const dbMovie = await prisma.movie.findUnique({
    where: {
      id: movie,
    },
    include: {
      director: true,
      cast_members: true,
    },
  });

  if (!dbMovie && !create) return notFound();

  const formattedMovie = {
    ...dbMovie,
    director: dbMovie?.director,
    cast_members: dbMovie?.cast_members,
  };

  return (
    <div className="flex flex-col py-10">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold">
          {create ? "Add new" : "Edit"} movie
        </h1>
        <p className="text-sm text-secondary-light">
          Make changes to the movie and click save when you are done.
        </p>
      </div>
      <div className="mt-10">
        <MovieClient
          create={create}
          directors={directors}
          actors={actors}
          // @ts-ignore
          movie={!create && formattedMovie}
        />
      </div>
    </div>
  );
}
