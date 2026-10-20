import { z } from "zod";

export const NewChannelSchema = z
  .object({
    name: z.string().min(1, "Channel name is required"),
  })
  .required();
