import { Router } from "express";
import { AuthFactory } from "../factories";
import { dataValidationMiddleware } from "../middlewares";
import { z } from "zod";

const loginSchema = z.object({
  body: z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  }),
});

export class AuthRoutes {
  public static bind(): Router {
    const router = Router();
    const controller = AuthFactory.createController();

    router.post(
      "/login",
      dataValidationMiddleware(loginSchema), 
      controller.login
    );

    return router;
  }
}