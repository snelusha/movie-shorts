import React from "react";

import MoviesList from "@/components/movies-list";

import prisma from "@/lib/db";

export default async function Page() {
    const movies = await prisma.movie.findMany({
        include: {
            director: true,
        },
    });
    return (
      <div className="flex flex-col py-10">
        <MoviesList movies={movies} />
      </div>
    );
}
