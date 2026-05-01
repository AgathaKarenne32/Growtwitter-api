import express from "express";
import { UserFactory } from "../factories";
import { authMiddleware, dataValidationMiddleware } from "../middlewares";
import { z } from "zod";

const userIdParamSchema = z.object({
  params: z.object({
    userId: z.string().uuid("Invalid User ID format"),
  }),
});

export class UsersRoutes {
  public static bind() {
    const router = express.Router();
    const controller = UserFactory.createController();

    router.get("/users", controller.index);

    router.get(
      "/users/:userId",
      authMiddleware,
      dataValidationMiddleware(userIdParamSchema), 
      controller.getById,
    );

    return router;
  }
}