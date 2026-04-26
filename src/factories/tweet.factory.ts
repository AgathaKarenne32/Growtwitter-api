import { TweetsController } from "../controllers";
import { LikeRepository } from "../repositories/like.repository";
import { TweetRepository } from "../repositories/tweet.repository";
import { LikeService, TweetService } from "../services";

export class TweetFactory {
  public static createController(): TweetsController {
    const likeRepository = new LikeRepository();
    const tweetRepository = new TweetRepository();
    const likeService = new LikeService(likeRepository, tweetRepository);
    const tweetService = new TweetService(tweetRepository, likeService);

    return new TweetsController(tweetService);
  }
}
