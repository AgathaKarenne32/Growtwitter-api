import { Request, Response } from "express";
import { UserService } from "../services/user.service";

export class UsersController {
  constructor(private userService: UserService) {}

  public getAll = async (req: Request, res: Response) => {
    const users = await this.userService.getAll();
    res.status(200).json({
      success: true,
      data: users.map(u => u.toJSON())
    });
  };

  public getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await this.userService.getById(id);
    res.status(200).json({
      success: true,
      data: user.toJSON()
    });
  };
}