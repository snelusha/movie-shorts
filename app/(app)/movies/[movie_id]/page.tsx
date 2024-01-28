import React from "react";

import { notFound } from "next/navigation";

import { auth } from "@clerk/nextjs";

import prisma from "@/lib/db";
import NewComment from "@/components/new-comment";
import Button from "@/components/button";

interface PageProps {
  params: {
    movie_id: string;
  };
}

export default async function Page({ params }: PageProps) {
  const movie = await prisma.movie.findUnique({
    where: {
      id: params.movie_id,
    },
    include: {
      director: true,
      cast_members: {
        include: {
          actor: true,
        },
      },
      comments: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!movie) return notFound();
  const { userId } = auth();

  return (
    <div className="relative flex flex-col pt-2 pb-10">
      <div>
        <Button type="secondary" href="/" icon="chevron_left">
          All movies
        </Button>
      </div>
      <div className="relative rounded-md mt-10">
        <img
          className="w-full h-[400px] object-cover rounded-md"
          src={movie.cover_image}
        />
        <div className="absolute inset-0 bg-black/70 rounded-md" />
      </div>
      <div className="relative flex -mt-[390px] ml-3 justify-center sm:justify-start">
        <img
          className="w-[240px] h-[380px] object-cover rounded"
          src={movie.image}
        />
      </div>
      <h1 className="text-4xl font-bold mt-8">{movie.title}</h1>
      <p className="text-sm text-secondary-light mt-2">
        {movie.released_year} • {movie.runtime}m
      </p>
      <p className="text-sm text-secondary-light mt-2">
        {movie.categories.split(",").map((category, index) => (
          <span key={category}>
            {category}
            {index !== movie.categories.split(",").length - 1 && (
              <span className="mx-2">•</span>
            )}
          </span>
        ))}
      </p>
      <div className="flex items-center mt-4">
        <div className="flex items-center mt-2">
          <div className="w-12 h-12">
            <img
              className="w-full h-full object-cover rounded-full"
              src={movie.director.image}
            />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium">{movie.director.name}</p>
            <p className="text-xs text-secondary-light">Director</p>
          </div>
        </div>
      </div>
      <p className="text-sm text-secondary-light italic mt-4">
        {movie.description}
      </p>
      <div className="flex flex-col mt-10">
        <h2 className="text-base font-semibold text-secondary-dark">
          Cast Members
        </h2>
        <div className="flex items-center flex-wrap gap-4 mt-2">
          {movie.cast_members.map((member) => (
            <div
              key={member.id}
              className="max-w-xs w-full flex items-center mt-4"
            >
              <div className="w-10 h-10">
                <img
                  className="w-full h-full object-cover rounded-full"
                  src={member.actor.image}
                />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium">{member.actor.name}</p>
                <p className="text-xs text-secondary-light">
                  {member.character}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col mt-10">
        <h2 className="text-base font-semibold text-secondary-dark">Summary</h2>
        <p className="text-sm text-secondary-light text-justify mt-2">
          {movie.summary}
        </p>
      </div>
      <div className="flex flex-col mt-10">
        <h2 className="text-base font-semibold text-secondary-dark">
          Comments
        </h2>
        <div className="mt-10">
          {movie.comments.length === 0 ? (
            <p className="text-xs font-medium text-secondary-light text-center mt-6">
              No comments yet!
              <br />
              Be the first one to comment!
            </p>
          ) : (
            <div className="flex flex-col space-y-6">
              {movie.comments.map((comment) => (
                <div key={comment.id} className="flex items-center space-x-4">
                  <div className="w-10 h-10">
                    <img
                      className="w-full h-full object-cover rounded-full"
                      src={comment.user.image!}
                    />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-xs text-secondary-light">
                      {comment.user.name}
                    </p>
                    <p className="text-xs text-secondary">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-8">
            {userId ? (
              <NewComment user_id={userId} movie_id={movie.id} />
            ) : (
              <p className="text-xs font-medium text-secondary-light text-center">
                You need to be logged in to comment!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
