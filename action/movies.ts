"use server";

import prisma from "@/lib/db";

import type { CastMember, Movie } from "@prisma/client";

export async function createMovie(movie: Omit<Movie, "id">) {
  return await prisma.movie.create({
    data: movie,
  });
}

export async function updateMovie(movie: Movie) {
  return await prisma.movie.update({
    where: { id: movie.id },
    data: movie,
  });
}

export async function deleteMovie(id: string) {
  return await prisma.movie.delete({
    where: { id },
  });
}

export async function createCastMembers(
  movie_id: string,
  castMembers: Omit<CastMember, "id" | "movie_id">[]
) {
  return castMembers.map(async (castMember) => {
    await prisma.castMember.create({
      data: {
        ...castMember,
        movie_id: movie_id,
      },
    });
  });
}

export async function updateCastMembers(
  movie_id: string,
  castMembers: Omit<CastMember, "movie_id">[]
) {
  return castMembers.map(async (castMember) => {
    await prisma.castMember.update({
      where: {
        id: castMember.id,
      },
      data: {
        ...castMember,
        movie_id: movie_id,
      },
    });
  });
}

export async function deleteCastMembers(movie_id: string) {
  return await prisma.castMember.deleteMany({
    where: {
      movie_id,
    },
  });
}
