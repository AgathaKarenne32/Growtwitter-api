import { Router } from "express";
import { TweetFactory } from "../factories";
import { authMiddleware, dataValidationMiddleware } from "../middlewares";
import { createTweetSchema } from "../dtos/tweet/tweet.schema";

const TweetsRoutes = Router();
const controller = TweetFactory.createController();

TweetsRoutes.post(
  "/", 
  authMiddleware,
  dataValidationMiddleware(createTweetSchema),
  controller.createTweet
);

TweetsRoutes.delete(
  "/:id",
  authMiddleware,
  controller.deleteTweet
);

TweetsRoutes.get(
  "/", 
  controller.index 
);

export { TweetsRoutes };