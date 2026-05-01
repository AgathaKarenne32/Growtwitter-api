import { NextFunction, Request, Response } from "express";
import { ZodObject, ZodError } from "zod";
import { HTTPError } from "../utils/http.error";
import { AnyZodObject } from "zod/v3";

export const dataValidationMiddleware = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Valida o body, query e params conforme definido no schema
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Mapeia os erros do Zod para uma mensagem legível
        const errorMessage = error.issues
          .map((err: { path: any[]; message: any; }) => `${err.path.join(".")}: ${err.message}`)
          .join(", ");
        
        throw new HTTPError(400, errorMessage);
      }
      return next(error);
    }
  };
};