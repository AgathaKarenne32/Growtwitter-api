import { Request, Response } from "express";

import { LikeService } from "../services";
import { onError } from "../utils";

export class LikesController {
  constructor(private likeService: LikeService) {}

  public like = async (req: Request, res: Response) => {
    try {
      const authorId = req.user.id;
      const { tweetId } = req.body;

      await this.likeService.createLike({
        authorId,
        tweetId,
      });

      res.status(201).json({
        success: true,
        message: "Tweet has liked.",
      });
    } catch (error) {
      onError(error, res);
    }
  };

  public dislike = async (req: Request, res: Response) => {
    try {
      const authorId = req.user.id;
      const { tweetId } = req.body;

      await this.likeService.removeLike({
        authorId,
        tweetId,
      });

      res.status(200).json({
        success: true,
        message: "Like in tweet has removed.",
      });
    } catch (error) {
      onError(error, res);
    }
  };
}
