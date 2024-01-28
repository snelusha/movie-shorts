import React from "react";

import Icon from "@/components/icon";
import Link from "@/components/link";

import prisma from "@/lib/db";

export default async function Page() {
  const movies = await prisma.movie.findMany({
    orderBy: {
      created_at: "asc",
    },
  });
  return (
    <main>
      <div className="relative flex flex-col py-10">
        <h1 className="text-2xl font-bold">Movies</h1>
        <p className="text-sm text-secondary-light">
          You can see all movies listed below!
        </p>
      </div>
      <div className="w-full flex flex-wrap justify-center gap-6 mt-10">
        {movies.map((movie) => (
          <Link key={movie.id} href={`/movies/${movie.id}`}>
            <div className="max-w-[220px] w-full flex flex-col">
              <div className="relative">
                <img
                  className="w-full h-[360px] object-cover"
                  src={movie.image}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 opacity-0 hover:opacity-100 transition-opacity duration-300 px-4">
                  <h1 className="text-lg font-semibold text-white">
                    {movie.title}
                  </h1>
                  <p className="text-sm font-medium text-white">
                    {movie.released_year}
                  </p>
                  <p className="text-sm font-medium text-white  mt-8">
                    {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
