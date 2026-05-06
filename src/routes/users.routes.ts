import { Router } from "express";
import { AuthFactory, UserFactory } from "../factories";
import { authMiddleware, dataValidationMiddleware } from "../middlewares";
import { z } from "zod";


const userIdParamSchema = z.object({
  params: z.object({
    userId: z.string().uuid(),
  }),
});

const UsersRoutes = Router();
const userController = UserFactory.createController();
const authController = AuthFactory.createController();

UsersRoutes.post("/", authController.register);

UsersRoutes.get(
  "/:userId",
  authMiddleware,
  userController.getById
);

export { UsersRoutes };