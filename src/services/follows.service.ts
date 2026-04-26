import { FollowDto } from "../dtos";
import { User } from "../models";
import { HTTPError } from "../utils";
import { FollowRepository } from "../repositories/follow.repository";
import { UserEntity } from "../repositories/user.repository";

export class FollowService {
  constructor(private followRepository: FollowRepository) { }

  public async follow(dto: FollowDto): Promise<void> {
    if (dto.followerId === dto.followingId) {
      throw new HTTPError(400, "You cannot follow yourself");
    }

    const existingFollow = await this.followRepository.findUnique(
      dto.followerId,
      dto.followingId,
    );

    if (existingFollow) {
      throw new HTTPError(409, "You are already following this user");
    }

    await this.followRepository.create(dto.followerId, dto.followingId);
  }

  public async unfollow(dto: FollowDto): Promise<void> {
    const existingFollow = await this.followRepository.findUnique(
      dto.followerId,
      dto.followingId,
    );

    if (!existingFollow) {
      throw new HTTPError(404, "You are not following this user");
    }

    await this.followRepository.delete(dto.followerId, dto.followingId);
  }

  public async listFollowings(
    userId: string,
  ): Promise<{ followings: User[]; followers: User[] }> {
    const [followingsDB, followersDB] = await Promise.all([
      this.followRepository.findManyFollowings(userId),
      this.followRepository.findManyFollowers(userId),
    ]);

    return {
      followings: followingsDB.map((f) => this.mapToModel(f.following)),
      followers: followersDB.map((f) => this.mapToModel(f.follower)),
    };
  }

  private mapToModel(entity: UserEntity): User {
    return new User(
      entity.id,
      entity.name,
      entity.imageUrl,
      entity.username,
      entity.createdAt,
      entity.updatedAt,
    );
  }
}