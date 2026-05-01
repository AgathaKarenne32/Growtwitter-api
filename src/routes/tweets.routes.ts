import express from "express";
import { TweetFactory } from "../factories";
import { authMiddleware, dataValidationMiddleware } from "../middlewares";
import { createTweetSchema, tweetIdSchema } from "../dtos/tweet/tweet.schema"; // Importe os schemas criados

export class TweetsRoutes {
  public static bind() {
    const router = express.Router();
    const controller = TweetFactory.createController();

    router.post(
      "/tweets",
      authMiddleware,
      dataValidationMiddleware(createTweetSchema),
      controller.createTweet,
    );

    router.delete(
      "/tweets/:id",
      authMiddleware,
      dataValidationMiddleware(tweetIdSchema),
      controller.deleteTweet,
    );

    return router;
  }
}