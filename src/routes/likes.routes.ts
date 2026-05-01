import express from "express";
import { LikeFactory } from "../factories";
import { authMiddleware, dataValidationMiddleware } from "../middlewares";
import { z } from "zod";

const tweetIdBodySchema = z.object({
  body: z.object({
    tweetId: z.string().uuid(),
  }),
});

export class LikesRoutes {
  public static bind() {
    const router = express.Router();
    const controller = LikeFactory.createController();

    router.post(
      "/likes",
      authMiddleware,
      dataValidationMiddleware(tweetIdBodySchema),
      controller.like,
    );

    router.delete(
      "/likes",
      authMiddleware,
      dataValidationMiddleware(tweetIdBodySchema),
      controller.dislike,
    );

    return router;
  }
}