import { FollowDto } from "../dtos";
import { User } from "../models";
import { HTTPError } from "../utils";
import {
  FollowEntity,
  FollowRepository,
} from "../repositories/follow.repository";
import { UserEntity } from "../repositories/user.repository";

export class FollowService {
  constructor(private followRepository: FollowRepository) {}

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
    if (dto.followerId === dto.followingId) {
      throw new HTTPError(400, "Follower and following IDs cannot be the same");
    }

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
    const followings = await this.listFollowingsByUserId(userId);
    const followers = await this.listFollowersByUserId(userId);
    return {
      followings: followings,
      followers: followers,
    };
  }

  private async listFollowersByUserId(userId: string): Promise<User[]> {
    const followersDB = await this.followRepository.findManyFollowers(userId);

    return followersDB.map((user) => this.mapToModel(user.follower));
  }

  private async listFollowingsByUserId(userId: string): Promise<User[]> {
    const followingsDB = await this.followRepository.findManyFollowings(userId);

    return followingsDB.map((user) => this.mapToModel(user.following));
  }

  private mapToModel(entity: UserEntity): User {
    return new User(
      entity.id,
      entity.name,
      entity.imageUrl || null, 
      entity.username,
      entity.createdAt,
      entity.updatedAt,
    );
  }
}
