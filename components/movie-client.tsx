"use client";

import React from "react";

import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";

import Button from "@/components/button";
import Input from "@/components/input";
import TextArea from "@/components/text-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/command";

import type { Actor, CastMember, Director, Movie } from "@prisma/client";
import {
  createMovie,
  createCastMembers,
  updateMovie,
  deleteCastMembers,
  deleteMovie,
} from "@/action/movies";

interface MovieClientProps {
  create: boolean;
  directors: Director[];
  actors: Actor[];
  movie?: Movie & {
    director?: Director;
    cast_members: CastMember[];
  };
}

type Inputs = {
  title: string;
  released: string;
  runtime: string;
  director: Director;
  image: string;
  cover: string;
  description: string;
  summary: string;
  cast_members: {
    id?: string;
    actor_id: string | null;
    character: string | null;
    movie_id?: string;
  }[];
};

export default function MovieClient({
  create,
  directors,
  actors,
  movie,
}: MovieClientProps) {
  const router = useRouter();
  const { register, handleSubmit, reset, setValue, watch, control } =
    useForm<Inputs>();
  const {
    fields: cast_members,
    append,
    update,
    remove,
  } = useFieldArray({
    control,
    name: "cast_members",
  });

  const director = watch("director");

  const onSubmit = async (data: Inputs) => {
    if (create) {
      const movie = await createMovie({
        title: data.title,
        released_year: parseInt(data.released),
        runtime: parseInt(data.runtime),
        director_id: data.director.id,
        image: data.image,
        cover_image: data.cover,
        description: data.description,
        summary: data.summary,
        created_at: new Date(),
      });
      // @ts-ignore
      await createCastMembers(movie.id, data.cast_members);
    } else {
      if (!movie) return;
      await updateMovie({
        id: movie.id,
        title: data.title,
        released_year: parseInt(data.released),
        runtime: parseInt(data.runtime),
        director_id: data.director.id,
        image: data.image,
        cover_image: data.cover,
        description: data.description,
        summary: data.summary,
        created_at: null,
      });
      await deleteCastMembers(movie.id);
      if (!movie) return;
      // @ts-ignore
      await createCastMembers(movie.id, data.cast_members);
    }
    reset();
    router.replace("/dashboard/movies");
    router.refresh();
  };

  const handleDelete = async () => {
    if (!movie) return;
    await deleteMovie(movie.id);
    reset();
    router.replace("/dashboard/movies");
    router.refresh();
  };

  React.useEffect(() => {
    if (movie) {
      setValue("title", movie.title);
      setValue("released", String(movie.released_year));
      setValue("runtime", String(movie.runtime));
      setValue("director", directors.find((d) => d.id === movie.director_id)!);
      setValue("image", movie.image);
      setValue("cover", movie.cover_image);
      setValue("description", movie.description);
      setValue("summary", movie.summary);

      setValue("cast_members", movie.cast_members);
    }
  }, [movie]);

  return (
    <form className="flex flex-col" onSubmit={(e) => e.preventDefault()}>
      <div className="flex flex-col">
        <p className="text-base font-medium">General information</p>
        <div className="w-full grid grid-flow-row grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
          <div className="flex flex-col space-y-8">
            <div className="flex flex-col space-y-2">
              <label className="text-xs font-medium text-secondary-light">
                Title
              </label>
              <Input
                placeholder="Prawegaya"
                {...register("title", { required: true })}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-xs font-medium text-secondary-light">
                Released year
              </label>
              <Input
                placeholder="2024"
                {...register("released", { required: true })}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-xs font-medium text-secondary-light">
                Runtime (minutes)
              </label>
              <Input
                placeholder="150"
                {...register("runtime", { required: true })}
              />
            </div>
          </div>
          <div className="flex flex-col space-y-8">
            <div className="flex flex-col space-y-2">
              <label className="text-xs font-medium text-secondary-light">
                Director
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    className="justify-between"
                    type="outline"
                    role="combobox"
                    icon="chevron_down"
                    reverse
                  >
                    {director?.name || "Select director"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command className="w-[300px]">
                    <CommandInput placeholder="Search director" />
                    <CommandEmpty>No director found!</CommandEmpty>
                    <CommandGroup>
                      {directors.map((director) => (
                        <CommandItem
                          key={director.id}
                          onSelect={() => setValue("director", director)}
                        >
                          {director.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-xs font-medium text-secondary-light">
                Image
              </label>
              <Input
                placeholder="https://some.thing/image.png"
                {...register("image", { required: true })}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-xs font-medium text-secondary-light">
                Cover image
              </label>
              <Input
                placeholder="https://some.thing/image.png"
                {...register("cover", { required: true })}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col mt-8 space-y-8">
          <div className="flex flex-col space-y-2">
            <label className="text-xs font-medium text-secondary-light">
              Description
            </label>
            <Input
              placeholder="Describe about the movie"
              {...register("description", { required: true })}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-xs font-medium text-secondary-light">
              Summary
            </label>
            <TextArea
              placeholder="Just summarize the movie!"
              {...register("summary", { required: true })}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col mt-10">
        <div className="flex items-center justify-between">
          <p className="text-base font-medium">Cast members</p>
          <Button
            type="secondary"
            icon="plus"
            onClick={() =>
              append({
                actor_id: null,
                character: null,
              })
            }
          >
            Add member
          </Button>
        </div>
        <div className="space-y-8 mt-10">
          {cast_members &&
            cast_members.map((cast_member, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between sm:space-x-8 space-y-4 sm:space-y-0"
              >
                <div className="w-full flex flex-col space-y-2">
                  <label className="text-xs font-medium text-secondary-light">
                    Actor
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        className="w-full justify-between"
                        type="outline"
                        role="combobox"
                        icon="chevron_down"
                        reverse
                      >
                        {actors.find(
                          (actor) => actor.id === cast_member.actor_id
                        )?.name || "Select actor"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command className="w-[300px]">
                        <CommandInput placeholder="Search actor" />
                        <CommandEmpty>No actor found!</CommandEmpty>
                        <CommandGroup>
                          {actors.map((actor) => (
                            <CommandItem
                              key={actor.id}
                              onSelect={() =>
                                update(index, {
                                  actor_id: actor.id,
                                  character: cast_member.character,
                                })
                              }
                            >
                              {actor.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="w-full flex flex-col space-y-2">
                  <label className="text-xs font-medium text-secondary-light">
                    Character
                  </label>
                  <Input
                    placeholder="Ranjan Ramanayake"
                    {...register(`cast_members.${index}.character`, {
                      required: true,
                    })}
                  />
                </div>
                <Button
                  className="flex-shrink-0 self-end"
                  type="ghost"
                  icon="trash"
                  onClick={() => remove(index)}
                />
              </div>
            ))}
        </div>
      </div>
      <div className="flex justify-end mt-10 space-x-2">
        {!create && (
          <Button type="secondary" onClick={() => handleDelete()}>
            Delete
          </Button>
        )}
        <Button type="primary" onClick={handleSubmit(onSubmit)}>
          Save
        </Button>
      </div>
    </form>
  );
}
