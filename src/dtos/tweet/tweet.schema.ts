import { z } from "zod";
import { TweetType } from "@prisma/client";

export const createTweetSchema = z.object({
  body: z.object({
    content: z.string().max(300).optional(), 
    type: z.nativeEnum(TweetType).default(TweetType.NORMAL),
    parentTweetId: z.string().uuid().optional(), 
  }).refine((data) => {
    if (data.type === TweetType.RETWEET && !data.parentTweetId) {
      return false;
    }
    return true;
  }, {
    message: "parentTweetId is required for retweets",
    path: ["parentTweetId"],
  }),
});