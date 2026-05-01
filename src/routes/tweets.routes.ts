import express from "express";
import { TweetFactory } from "../factories";
import { authMiddleware, dataValidationMiddleware } from "../middlewares"; // Importando o novo
import { createTweetSchema, tweetIdSchema } from "../dtos/tweet/tweet.schema";

export class TweetsRoutes {
  public static bind() {
    const router = express.Router();
    const controller = TweetFactory.createController();

    router.post(
      "/tweets",
      authMiddleware,
      dataValidationMiddleware(createTweetSchema), // Usando Zod
      controller.createTweet,
    );

    router.get(
      "/tweets/:id",
      authMiddleware,
      dataValidationMiddleware(tweetIdSchema), // Usando Zod
      controller.findTweet,
    );

    // ... Repita para as outras rotas usando os schemas correspondentes
    return router;
  }
}