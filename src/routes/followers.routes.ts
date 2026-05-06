import { Router } from "express";
import { FollowFactory } from "../factories";
import { authMiddleware, dataValidationMiddleware } from "../middlewares"; 
import { z } from "zod";

// Schema de validação usando followingId para consistência com o Controller
const followSchema = z.object({
  body: z.object({
    followingId: z.string().uuid("Invalid User ID format"), 
  }),
});

const FollowersRoutes = Router();
const controller = FollowFactory.createController();

// Rota para seguir um usuário
FollowersRoutes.post(
  "/",
  authMiddleware,
  dataValidationMiddleware(followSchema), 
  controller.followUp,
);

// Rota para parar de seguir um usuário
FollowersRoutes.delete(
  "/",
  authMiddleware,
  dataValidationMiddleware(followSchema),
  controller.unfollow,
);

// Rota para listar seguidores e quem o usuário segue
FollowersRoutes.get("/", authMiddleware, controller.getFollowers);

export { FollowersRoutes };