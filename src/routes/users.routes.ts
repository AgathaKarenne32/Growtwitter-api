import express from "express";
import { UserFactory } from "../factories";
import { authMiddleware, dataValidationMiddleware } from "../middlewares";
import { z } from "zod";

// Schema para validar o UUID do usuário nos parâmetros da URL
const userIdParamSchema = z.object({
  params: z.object({
    userId: z.string().uuid("Invalid User ID format"),
  }),
});

export class UsersRoutes {
  public static bind() {
    const router = express.Router();
    const controller = UserFactory.createController();

    // Rota pública para listar usuários (ou protegida, se você preferir)
    router.get("/users", controller.index);

    router.get(
      "/users/:userId",
      authMiddleware,
      dataValidationMiddleware(userIdParamSchema), // Usando o novo middleware com Zod
      controller.getById,
    );

    return router;
  }
}