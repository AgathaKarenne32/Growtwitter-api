import { FollowersController } from "../controllers";
import { User } from "../models";
import { FollowRepository } from "../repositories/follow.repository";
import { UserEntity } from "../repositories/user.repository";
import { FollowService } from "../services";

export class FollowFactory {
  public static createController(): FollowersController {
    const followRepository = new FollowRepository();
    const followService = new FollowService(followRepository);

    return new FollowersController(followService);
  }

  private mapToModel(entity: UserEntity): User {
    return new User(
      entity.id,
      entity.name,
      entity.imageUrl || null,
      entity.email,
      entity.username,
      entity.createdAt,
      entity.updatedAt,
    );
  }
}
