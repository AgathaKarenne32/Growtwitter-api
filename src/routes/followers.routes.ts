import { Router } from "express";
import { FollowFactory } from "../factories";
import { authMiddleware, dataValidationMiddleware } from "../middlewares"; 
import { z } from "zod";

const followSchema = z.object({
  body: z.object({
    followingId: z.string().uuid("Invalid User ID format"), 
  }),
});

const FollowersRoutes = Router();
const controller = FollowFactory.createController();

FollowersRoutes.post(
  "/",
  authMiddleware,
  dataValidationMiddleware(followSchema), 
  controller.followUp,
);

FollowersRoutes.delete(
  "/",
  authMiddleware,
  dataValidationMiddleware(followSchema),
  controller.unfollow,
);

FollowersRoutes.get("/", authMiddleware, controller.getFollowers);

export { FollowersRoutes };