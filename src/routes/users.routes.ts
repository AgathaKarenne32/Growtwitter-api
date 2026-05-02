import { Router } from "express";
import { UserFactory } from "../factories";
import { authMiddleware, dataValidationMiddleware } from "../middlewares";
import { z } from "zod";

const userIdParamSchema = z.object({
  params: z.object({
    userId: z.string().uuid(),
  }),
});

const UsersRoutes = Router();
const controller = UserFactory.createController();

UsersRoutes.post("/", controller.create);

UsersRoutes.get(
  "/:userId", 
  authMiddleware,
  dataValidationMiddleware(userIdParamSchema as any), 
  controller.getById
);

export { UsersRoutes };