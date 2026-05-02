import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod"; 
import { ZodSchema } from "zod";
import { HTTPError } from "../utils/http.error";

export const dataValidationMiddleware = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error: unknown) { // Definindo como unknown por segurança
      if (error instanceof ZodError) {
        const errorMessage = error.issues
          .map((err) => `${err.path.join(".")}: ${err.message}`)
          .join(", ");
        
        return next(new HTTPError(400, errorMessage)); // Use return next para erros assíncronos
      }
      return next(error);
    }
  };
};