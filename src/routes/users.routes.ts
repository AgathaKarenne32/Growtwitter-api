import express from "express";
import { UserFactory } from "../factories";
import { authMiddleware, dataValidationMiddleware } from "../middlewares";
import { z } from "zod";

const userIdParamSchema = z.object({
  params: z.object({
    userId: z.string().uuid(),
  }),
});

export class UsersRoutes {
  public static bind() {
    const router = express.Router();
    const controller = UserFactory.createController();

    router.post("/users", controller.create);
    
    router.get(
      "/users/:userId", 
      authMiddleware,
      dataValidationMiddleware(userIdParamSchema as any), 
      controller.getById
    );

    return router;
  }
}