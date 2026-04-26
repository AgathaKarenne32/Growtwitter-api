import { LikesController } from "../controllers";
import { LikeRepository } from "../repositories/like.repository";
import { TweetRepository } from "../repositories/tweet.repository";
import { LikeService } from "../services";

export class LikeFactory {
  public static createController(): LikesController {
    const likeRepository = new LikeRepository();
    const tweetRepository = new TweetRepository();
    const likeService = new LikeService(likeRepository, tweetRepository);

    return new LikesController(likeService);
  }
}
