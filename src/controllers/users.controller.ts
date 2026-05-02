import { Request, Response, NextFunction } from "express";
import { UserService } from "../services";
import { onError } from "../utils";

export class UsersController {
  constructor(private userService: UserService) {}

  public create = async (req: Request, res: Response) => {
    try {
      const result = await this.userService.create(req.body);

      return res.status(201).json({
        success: true,
        message: "User created successfully.",
        data: result.toJSON(),
      });
    } catch (error) {
      onError(error, res);
    }
  };

  public index = async (_: Request, res: Response) => {
    try {
      const result = await this.userService.listAll();

      return res.status(200).json({
        success: true,
        message: "Records listed successfully.",
        data: result.map((u) => u.toJSON()),
      });
    } catch (error) {
      onError(error, res);
    }
  };

  public getById = async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId as string;
      const result = await this.userService.getById(userId);

      return res.status(200).json({
        success: true,
        message: "Record found successfully.",
        data: result ? result.toJSON() : null,
      });
    } catch (error) {
      onError(error, res);
    }
  };
}