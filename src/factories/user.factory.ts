import { UsersController } from "../controllers";
import { UserRepository } from "../repositories/user.repository";
import { FollowService, LikeService, TweetService, UserService } from "../services";

export class UserFactory {
  public static createController(): UsersController {
    const userRepository = new UserRepository();
    const likeService = new LikeService();
    const tweetService = new TweetService(likeService);
    const followService = new FollowService();
    const userService = new UserService(
      userRepository,
      tweetService,
      followService,
    );

    return new UsersController(userService);
  }
}
