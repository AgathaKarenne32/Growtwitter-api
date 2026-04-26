import express from "express";
import { body } from "express-validator";

import { LikeFactory } from "../factories";
import { authMiddleware, dataValidation } from "../middlewares";

export class LikesRoutes {
  public static bind() {
    const router = express.Router();
    const controller = LikeFactory.createController();

    router.post(
      "/likes",
      authMiddleware,
      dataValidation([body("tweetId").isString().isUUID()]),
      controller.like,
    );

    router.delete(
      "/likes",
      authMiddleware,
      dataValidation([body("tweetId").isString().isUUID()]),
      controller.dislike,
    );

    return router;
  }
}
