import { BcryptAdapter } from "../adapters";
import { AuthController } from "../controllers";
import { UserRepository } from "../repositories/user.repository";
import {
  AuthService,
  FollowService,
  LikeService,
  TweetService,
  UserService,
} from "../services";

export class AuthFactory {
  public static createController(): AuthController {
    const userRepository = new UserRepository();
    const likeService = new LikeService();
    const tweetService = new TweetService(likeService);
    const followService = new FollowService();
    const userService = new UserService(
      userRepository,
      tweetService,
      followService,
    );
    const bcryptAdapter = new BcryptAdapter();
    const authService = new AuthService(userService, bcryptAdapter);

    return new AuthController(authService);
  }
}
