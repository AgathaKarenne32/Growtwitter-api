import express from "express";
import { LikeFactory } from "../factories";
<<<<<<< feature/data-validation-zod
import { authMiddleware } from "../middlewares";
=======
import { authMiddleware, dataValidationMiddleware } from "../middlewares";
import { z } from "zod";

const tweetIdBodySchema = z.object({
  body: z.object({
    tweetId: z.string().uuid(),
  }),
});
>>>>>>> main

export class LikesRoutes {
  public static bind() {
    const router = express.Router();
    const controller = LikeFactory.createController();

    router.post(
      "/likes",
      authMiddleware,
<<<<<<< feature/data-validation-zod
      body("tweetId").isString().isUUID(),
=======
      dataValidationMiddleware(tweetIdBodySchema),
>>>>>>> main
      controller.like,
    );

    router.delete(
      "/likes",
      authMiddleware,
<<<<<<< feature/data-validation-zod
      body("tweetId").isString().isUUID(),
=======
      dataValidationMiddleware(tweetIdBodySchema),
>>>>>>> main
      controller.dislike,
    );

    return router;
  }
}