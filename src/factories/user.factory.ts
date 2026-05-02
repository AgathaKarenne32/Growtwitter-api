import { UsersController } from "../controllers";
import { FollowRepository } from "../repositories/follow.repository";
import { LikeRepository } from "../repositories/like.repository";
import { TweetRepository } from "../repositories/tweet.repository";
import { UserRepository } from "../repositories/user.repository";
import { FollowService, LikeService, TweetService, UserService } from "../services";

export class UserFactory {
  public static createController(): UsersController {
    const userRepository = new UserRepository();
    const userService = new UserService(userRepository);

    const likeRepository = new LikeRepository();
    const tweetRepository = new TweetRepository();
    const followRepository = new FollowRepository();

    const likeService = new LikeService(likeRepository, tweetRepository);
    const tweetService = new TweetService(tweetRepository, likeService);
    const followService = new FollowService(followRepository);

    return new UsersController(userService);
  }
}

