"use client";

import React from "react";

import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/dialog";

import Button from "@/components/button";
import Input from "@/components/input";

import moment from "moment";

import type { Actor } from "@prisma/client";

import { createActor, deleteActor, updateActor } from "@/action/actors";

interface ActorsListProps {
  actors?: Actor[];
}

type Inputs = {
  name: string;
  country: string;
  image: string;
};

export default function ActorsList({ actors }: ActorsListProps) {
  const router = useRouter();

  const [open, setOpen] = React.useState(false);
  const [selectedActor, setSelectedActor] = React.useState<Actor | null>(null);

  const { register, handleSubmit, reset, setValue } = useForm<Inputs>();

  const openModal = (actor?: Actor) => {
    if (actor) {
      setSelectedActor(actor);
    } else {
      setSelectedActor(null);
    }
    setOpen(true);
  };

  const closeModal = () => {
    setSelectedActor(null);
    setOpen(false);
  };

  const onSubmit = async (data: Inputs) => {
    console.log("submit");
    if (selectedActor) {
      await updateActor({
        id: selectedActor.id,
        name: data.name,
        country: data.country,
        image: data.image,
        created_at: new Date(),
      });
    } else {
      await createActor({
        name: data.name,
        country: data.country,
        image: data.image,
        created_at: new Date(),
      });
    }
    closeModal();
    reset();
    router.refresh();
  };

  const handleDelete = async () => {
    if (!selectedActor) return;
    await deleteActor(selectedActor.id);
    closeModal();
    router.refresh();
  };

  React.useEffect(() => {
    if (selectedActor) {
      setValue("name", selectedActor.name);
      setValue("country", selectedActor.country);
      setValue("image", selectedActor.image);
    }
  }, [selectedActor]);

  return (
    <>
      <div className="flex flex-col">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">Actors</h1>
            <p className="text-sm text-secondary-light">
              You can see all actors
            </p>
          </div>
          <Button type="secondary" icon="plus" onClick={() => openModal()}>
            Add Actor
          </Button>
        </div>
        <div className="w-full mt-10">
          {!actors || actors.length === 0 ? (
            <p className="text-sm font-medium text-secondary-light text-center mt-10">
              No actors yet!
              <br />
              Just click plus to create a new actor!
            </p>
          ) : (
            <div className="w-full rounded-md border border-muted-dark">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-8"></TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {actors.map((actor) => (
                    <TableRow key={actor.id}>
                      <TableCell className="pl-8">
                        <div className="w-10 h-10">
                          <img
                            className="w-full h-full object-cover rounded-full"
                            src={actor.image}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-nowrap">
                        {actor.name}
                      </TableCell>
                      <TableCell className="text-nowrap">
                        {actor.country}
                      </TableCell>
                      <TableCell className="text-nowrap">
                        {moment(new Date(actor.created_at!)).format("LLL")}
                      </TableCell>
                      <TableCell>
                        <Button
                          type="ghost"
                          icon="ellipsis_vertical"
                          onClick={() => openModal(actor)}
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

      <Dialog
        open={open}
        onOpenChange={(open) => {
          if (!open) closeModal();
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {!selectedActor ? "Add new actor" : "Edit actor"}
            </DialogTitle>
            <DialogDescription className="text-xs text-secondary-light">
              Make changes to the actor and click save when you are done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col space-y-4 mt-6">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-secondary-light">
                  Name
                </label>
                <Input
                  className="max-w-[300px] w-full rounded-md border border-muted-dark p-2 ml-6"
                  placeholder="Ranjan Ramanayake"
                  {...register("name", { required: true })}
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-secondary-light">
                  Country
                </label>
                <Input
                  className="max-w-[300px] w-full rounded-md border border-muted-dark p-2 ml-6"
                  placeholder="Sri Lanka"
                  {...register("country", { required: true })}
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-secondary-light">
                  Image
                </label>
                <Input
                  className="max-w-[300px] w-full rounded-md border border-muted-dark p-2 ml-6"
                  placeholder="https://some.thing/image.png"
                  {...register("image", { required: true })}
                />
              </div>
            </div>
            <DialogFooter className="mt-6">
              {selectedActor && (
                <Button type="secondary" onClick={handleDelete}>
                  Delete
                </Button>
              )}
              <Button type="primary" onClick={handleSubmit(onSubmit)}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
