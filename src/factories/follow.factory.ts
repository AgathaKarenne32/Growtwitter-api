import { FollowersController } from "../controllers";
import { FollowRepository } from "../repositories/follow.repository";
import { FollowService } from "../services";

export class FollowFactory {
  public static createController(): FollowersController {
    const followRepository = new FollowRepository();
    const followService = new FollowService(followRepository);

    return new FollowersController(followService);
  }
}
