"use client";

import {
  CreateRoomFormData,
  createRoomSchema,
} from "@/schemas/create-room-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { SubmitButton } from "../submit-button";
import { useMutation } from "@tanstack/react-query";
import { createRoom } from "@/app/actions";
import { redirect } from "next/navigation";

export function CreateRoomForm() {
  const form = useForm<CreateRoomFormData>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      name: "",
    },
  });

  const { mutateAsync } = useMutation({
    mutationFn: createRoom,
    onSuccess: (data) => {
      redirect(`/room/${data}`);
    },
    onError: (error) => {
      console.error(error.message);
    },
  });

  const onSubmit = (data: CreateRoomFormData) => {
    mutateAsync(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 flex flex-row gap-2 w-full"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="sr-only">Name</FormLabel>
              <FormControl>
                <Input placeholder="A cool name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <SubmitButton pendingText="Creating...">Create</SubmitButton>
      </form>
    </Form>
  );
}
