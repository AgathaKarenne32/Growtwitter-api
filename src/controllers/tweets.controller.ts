import { Request, Response } from "express";

import { TweetService } from "../services";
import { onError } from "../utils";

export class TweetsController {
  constructor(private tweetService: TweetService) {}

  public createTweet = async (req: Request, res: Response) => {
    try {
      const authorId = req.user.id;
      const { content } = req.body;

      const result = await this.tweetService.createTweet({
        authorId,
        content,
      });

      res.status(201).json({
        success: true,
        message: "Tweet created successfully.",
        data: result.toJSON(),
      });
    } catch (error) {
      onError(error, res);
    }
  };

  public createReply = async (req: Request, res: Response) => {
    try {
      const authorId = req.user.id;
      const { content, replyTo } = req.body;

      const result = await this.tweetService.createReply({
        authorId,
        content,
        replyTo,
      });

      res.status(201).json({
        success: true,
        message: "Reply published successfully.",
        data: result.toJSON(),
      });
    } catch (error) {
      onError(error, res);
    }
  };

  public findTweet = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const result = await this.tweetService.findTweet({
        tweetId: id as string,
      });

      res.status(200).json({
        success: true,
        message: "Record found successfully.",
        data: result.toJSON(),
      });
    } catch (error) {
      onError(error, res);
    }
  };

  public updateTweet = async (req: Request, res: Response) => {
    try {
      const authorId = req.user.id;
      const { id } = req.params;
      const { content } = req.body;

      const result = await this.tweetService.updateTweet({
        authorId,
        tweetId: id as string,
        content,
      });

      res.status(200).json({
        success: true,
        message: "Record updated successfully.",
        data: result.toJSON(),
      });
    } catch (error) {
      onError(error, res);
    }
  };

  public deleteTweet = async (req: Request, res: Response) => {
    try {
      const authorId = req.user.id;
      const { id } = req.params;

      const result = await this.tweetService.deleteTweet({
        authorId,
        tweetId: id as string,
      });

      res.status(200).json({
        success: true,
        message: "Record deleted successfully.",
        data: result.toJSON(),
      });
    } catch (error) {
      onError(error, res);
    }
  };

  public listTweetsByUserId = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;

      const result = await this.tweetService.listTweetsByUserId(userId as string);

      res.status(200).json({
        success: true,
        message: "Records listed successfully.",
        data: result.map((t) => t.toJSON()),
      });
    } catch (error) {
      onError(error, res);
    }
  };

  public feed = async (req: Request, res: Response) => {
    try {
      const { id } = req.user;

      const result = await this.tweetService.feed(id);

      res.status(200).json({
        success: true,
        message: "Records listed successfully.",
        data: result.map((t) => t.toJSON()),
      });
    } catch (error) {
      onError(error, res);
    }
  };
}
