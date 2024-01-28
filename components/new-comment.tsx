"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import Input from "@/components/input";
import Button from "@/components/button";


import { createComment } from "@/action/comments";

type Input = {
  content: string;
};

interface NewCommentProps {
  user_id: string;
  movie_id: string;
}

export default function NewComment({ user_id, movie_id }: NewCommentProps) {
  const router = useRouter();
  const { register, reset, handleSubmit } = useForm<Input>();

  async function onSubmit(data: Input) {
    await createComment({
      content: data.content,
      created_by: user_id,
      movie_id: movie_id,
      created_at: new Date(),
    });
    reset();
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex items-center gap-4">
        <Input
          {...register("content", { required: true })}
          placeholder="Comment"
        />
        <Button type="primary" className="" icon="paper_airplane" />
      </div>
    </form>
  );
}
