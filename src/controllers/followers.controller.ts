import { Request, Response } from "express";

import { FollowService } from "../services";
import { onError } from "../utils";

export class FollowersController {
  constructor(private followService: FollowService) {}

  public followUp = async (req: Request, res: Response) => {
    try {
      const authorId = req.user.id;
      const { userId } = req.body;

      await this.followService.follow({
        followerId: authorId,
        followingId: userId,
      });

      res.status(201).json({
        success: true,
        message: "Following user successfully.",
      });
    } catch (error) {
      onError(error, res);
    }
  };

  public unfollow = async (req: Request, res: Response) => {
    try {
      const authorId = req.user.id;
      const { userId } = req.body;

      await this.followService.unfollow({
        followerId: authorId,
        followingId: userId,
      });

      res.status(200).json({
        success: true,
        message: "Unfollowed user successfully.",
      });
    } catch (error) {
      onError(error, res);
    }
  };

  public getFollowers = async (req: Request, res: Response) => {
    try {
      const authorId = req.user.id;

      const result = await this.followService.listFollowings(authorId);

      const data = {
        followers: result.followers.map((f) => f.toJSON()),
        followings: result.followings.map((f) => f.toJSON()),
      };

      res.status(200).json({
        success: true,
        message: "Followers retrieved successfully.",
        data,
      });
    } catch (error) {
      onError(error, res);
    }
  };
}
