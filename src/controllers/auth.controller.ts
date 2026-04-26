import { Request, Response } from "express";

import { AuthService } from "../services";
import { onError } from "../utils";

export class AuthController {
  constructor(private authService: AuthService) { }

  public register = async (req: Request, res: Response) => {
    try {
      const { name, username, password, imageUrl } = req.body;

      const result = await this.authService.register({
        name,
        username,
        password,
        imageUrl,
      });

      res.status(201).json({
        success: true,
        message: "Registration completed successfully.",
        data: result.toJSON(),
      });
    } catch (error) {
      onError(error, res);
    }
  };

  public login = async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;

      const result = await this.authService.login({ username, password });

      res.status(200).json({
        success: true,
        message: "Login successful.",
        data: result,
      });
    } catch (error) {
      onError(error, res);
    }
  };
}
