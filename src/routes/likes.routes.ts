import { Router } from "express";
import { LikeFactory } from "../factories";
import { authMiddleware, dataValidationMiddleware } from "../middlewares";
import { z } from "zod";

const likeSchema = z.object({
  body: z.object({
    tweetId: z.string().uuid("Invalid Tweet ID format"),
  }),
});

const LikesRoutes = Router();
const controller = LikeFactory.createController();

LikesRoutes.post(
  "/",
  authMiddleware,
  dataValidationMiddleware(likeSchema),
  controller.like
);

LikesRoutes.delete(
  "/",
  authMiddleware,
  dataValidationMiddleware(likeSchema),
  controller.dislike
);

export { LikesRoutes };