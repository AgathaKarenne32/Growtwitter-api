import express from "express";
import { z } from "zod"; // Importamos o Zod
import { FollowFactory } from "../factories";
import { authMiddleware, dataValidationMiddleware } from "../middlewares"; 

const followSchema = z.object({
  body: z.object({
    userId: z.string().uuid("Invalid User ID format"), 
  }),
});

export class FollowersRoutes {
  public static bind() {
    const router = express.Router();
    const controller = FollowFactory.createController();

    router.post(
      "/followers",
      authMiddleware,
      dataValidationMiddleware(followSchema), 
      controller.followUp,
    );

    router.delete(
      "/followers",
      authMiddleware,
      dataValidationMiddleware(followSchema),
      controller.unfollow,
    );

    router.get("/followers", authMiddleware, controller.getFollowers);

    return router;
  }
}