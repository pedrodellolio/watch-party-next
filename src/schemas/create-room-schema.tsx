import { z } from "zod";

export const createRoomSchema = z.object({
  name: z.string().min(2, {
    message: "Room's name must be at least 2 characters.",
  }),
});

export type CreateRoomFormData = z.infer<typeof createRoomSchema>;
