import { Request, Response } from "express";
import { LikeService } from "../services";

export class LikesController {
  constructor(private likeService: LikeService) { }

  public like = async (req: Request, res: Response) => {
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
  };

  public dislike = async (req: Request, res: Response) => {
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
  };
}