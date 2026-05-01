import { z } from "zod";

export const createTweetSchema = z.object({
  body: z.object({
    content: z.string().min(1, "Content cannot be empty").max(280),
  }),
});

export const tweetIdSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid Tweet ID"),
  }),
});