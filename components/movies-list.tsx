"use client";

import React from "react";

import { useRouter } from "next/navigation";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/table";

import Button from "@/components/button";

import moment from "moment";

import type { Director, Movie } from "@prisma/client";

interface MovieWithDirector extends Movie {
  director?: Director;
}

interface MoviesListProps {
  movies?: MovieWithDirector[];
}

export default function MoviesList({ movies }: MoviesListProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Movies</h1>
          <p className="text-sm text-secondary-light">You can see all movies</p>
        </div>
        <Button type="secondary" icon="plus" href="/dashboard/movies/create">
          Add Movie
        </Button>
      </div>
      <div className="w-full mt-10">
        {!movies || movies.length === 0 ? (
          <p className="text-sm font-medium text-secondary-light text-center mt-10">
            No movies yet!
            <br />
            Just click plus to create a new movie!
          </p>
        ) : (
          <div className="w-full rounded-md border border-muted-dark">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-8"></TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Director</TableHead>
                  <TableHead>Runtime</TableHead>
                  <TableHead>Released</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {movies.map((movie) => (
                  <TableRow key={movie.id}>
                    <TableCell className="pl-8">
                      <div className="w-10 h-10">
                        <img
                          className="w-full h-full object-cover rounded-full"
                          src={movie.image}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-nowrap">{movie.title}</TableCell>
                    <TableCell className="text-nowrap">
                      {movie.director?.name || "Unknown"}
                    </TableCell>
                    <TableCell className="text-nowrap">
                      {`${Math.floor(movie.runtime / 60)}h ${
                        movie.runtime % 60
                      }m`}
                    </TableCell>
                    <TableCell className="text-nowrap">
                      {movie.released_year}
                    </TableCell>
                    <TableCell>
                      <Button
                        type="ghost"
                        icon="ellipsis_vertical"
                        href={`/dashboard/movies/${movie.id}`}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
