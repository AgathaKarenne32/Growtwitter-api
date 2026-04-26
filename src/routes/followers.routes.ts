import express from "express";
import { body } from "express-validator";

import { FollowFactory } from "../factories";
import { authMiddleware, dataValidation } from "../middlewares";

export class FollowersRoutes {
  public static bind() {
    const router = express.Router();
    const controller = FollowFactory.createController();

    router.post(
      "/followers",
      authMiddleware,
      dataValidation([body("userId").isString().isUUID()]),
      controller.followUp,
    );

    router.delete(
      "/followers",
      authMiddleware,
      dataValidation([body("userId").isString().isUUID()]),
      controller.unfollow,
    );

    router.get("/followers", authMiddleware, controller.getFollowers);

    return router;
  }
}
