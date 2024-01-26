"use client";

import React from "react";

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

import type { Director } from "@prisma/client";
import {
  createDirector,
  deleteDirector,
  updateDirector,
} from "@/action/directors";
import { useRouter } from "next/navigation";

interface DirectorListProps {
  directors?: Director[];
}

export default function DirectorList({ directors }: DirectorListProps) {
  const router = useRouter();

  const [open, setOpen] = React.useState(false);
  const [selectedDirector, setSelectedDirector] =
    React.useState<Director | null>(null);

  const [name, setName] = React.useState("");
  const [country, setCountry] = React.useState("");
  const [image, setImage] = React.useState("");

  const openModal = (director?: Director) => {
    if (director) setSelectedDirector(director);
    setOpen(true);
  };

  const closeModal = () => {
    setSelectedDirector(null);
    setOpen(false);
  };

  const handleSave = async () => {
    // TODO: validate before saving
    if (selectedDirector) {
      await updateDirector({
        id: selectedDirector.id,
        name: name,
        country: country,
        image: image,
        created_at: new Date(),
      });
    } else {
      await createDirector({
        name: name,
        country: country,
        image: image,
        created_at: new Date(),
      });
    }
    router.refresh();
    closeModal();
  };

  const handleDelete = async () => {
    if (!selectedDirector) return;
    await deleteDirector(selectedDirector.id);
    router.refresh();
    closeModal();
  };

  React.useEffect(() => {
    if (selectedDirector) {
      setName(selectedDirector.name);
      setCountry(selectedDirector.country);
      setImage(selectedDirector.image);
    } else {
      setName("");
      setCountry("");
      setImage("");
    }
  }, [selectedDirector]);

  return (
    <>
      <div className="flex flex-col">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">Directors</h1>
            <p className="text-sm text-secondary-light">
              You can see all directors
            </p>
          </div>
          <Button type="secondary" icon="plus" onClick={() => openModal()}>
            Add Director
          </Button>
        </div>
        <div className="w-full mt-10">
          {!directors || directors.length === 0 ? (
            <p className="text-sm font-medium text-secondary-light text-center mt-10">
              No directors yet!
              <br />
              Just click plus to create a new director!
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
                  {directors.map((director) => (
                    <TableRow key={director.id}>
                      <TableCell className="pl-8">
                        <div className="w-10 h-10">
                          <img
                            className="w-full h-full object-cover rounded-full"
                            src={director.image}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-nowrap">
                        {director.name}
                      </TableCell>
                      <TableCell className="text-nowrap">
                        {director.country}
                      </TableCell>
                      <TableCell className="text-nowrap">
                        {moment(new Date(director.created_at)).format("LLL")}
                      </TableCell>
                      <TableCell>
                        <Button
                          type="ghost"
                          icon="ellipsis_vertical"
                          onClick={() => openModal(director)}
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
              {!selectedDirector ? "Add new director" : "Edit director"}
            </DialogTitle>
            <DialogDescription className="text-xs text-secondary-light">
              Make changes to the director and click save when you are done.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-secondary-light">
                Name
              </label>
              <Input
                className="max-w-[300px] w-full rounded-md border border-muted-dark p-2 ml-6"
                placeholder="Ranjan Ramanayake"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-secondary-light">
                Country
              </label>
              <Input
                className="max-w-[300px] w-full rounded-md border border-muted-dark p-2 ml-6"
                placeholder="Sri Lanka"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-secondary-light">
                Image
              </label>
              <Input
                className="max-w-[300px] w-full rounded-md border border-muted-dark p-2 ml-6"
                placeholder="https://some.thing/image.png"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            {selectedDirector && (
              <Button type="secondary" onClick={() => handleDelete()}>
                Delete
              </Button>
            )}
            <Button type="primary" onClick={() => handleSave()}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
