import { NextFunction, Request, Response } from "express";
import { JsonWebTokenError } from "jsonwebtoken";

import { HTTPError } from "../utils/http.error";

export function errorHandler(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (error instanceof HTTPError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      details: error.details,
    });
    return;
  }

  if (error instanceof JsonWebTokenError) {
    res.status(401).json({
      success: false,
      mensagem: "Token inválido ou expirado",
    });
    return;
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
    details: [
      {
        type: "system",
        field: "unknown",
        description: (error as Error).toString(),
        location: (error as Error).name,
      },
    ],
  });
}
