import { User as UserEntity } from "@prisma/client";

import { FollowService, TweetService } from ".";
import { CreateUserDto } from "../dtos/user.dto";
import { User } from "../models";
import { UserRepository } from "../repositories/user.repository";
import { HTTPError } from "../utils";

export class UserService {
  constructor(
    private userRepository: UserRepository,
    private tweetService: TweetService,
    private followService: FollowService,
  ) {}

  public async findByUsername(username: string): Promise<User | null> {
    const user = await this.userRepository.findByUsername(username);

    if (!user) return null;

    return this.mapToModel(user).withPassword(user.password);
  }

  public async create(dto: CreateUserDto): Promise<User> {
    const newUser = await this.userRepository.create(dto);

    return this.mapToModel(newUser);
  }

  public async getById(userId: string): Promise<User> {
    const userDB = await this.userRepository.getById(userId);

    if (!userDB) {
      throw new HTTPError(404, "User not found");
    }

    const user = this.mapToModel(userDB);

    const tweetsOfUser = await this.tweetService.listTweetsByUserId(userId);
    user.withTweets(tweetsOfUser);

    const follows = await this.followService.listFollowings(userId);
    user.withFollowing(follows.followings);
    user.withFollowers(follows.followers);

    return user;
  }

  public async listAll(): Promise<User[]> {
    const users = await this.userRepository.listAll();

    return users.map((user) => this.mapToModel(user));
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
