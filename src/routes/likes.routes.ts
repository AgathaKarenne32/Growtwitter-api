import express from "express";
import { LikeFactory } from "../factories";
import { authMiddleware, dataValidationMiddleware } from "../middlewares";
import { z } from "zod";

const likeSchema = z.object({
  body: z.object({
    tweetId: z.string().uuid("Invalid Tweet ID format"),
  }),
});

export class LikesRoutes {
  public static bind() {
    const router = express.Router();
    const controller = LikeFactory.createController();

    router.post(
      "/likes",
      authMiddleware,
      dataValidationMiddleware(likeSchema),
      controller.like
    );

    router.delete(
      "/likes",
      authMiddleware,
      dataValidationMiddleware(likeSchema),
      controller.dislike
    );

    return router;
  }
}